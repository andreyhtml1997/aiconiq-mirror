"use client";

import { useEffect, useMemo, useState } from "react";
import { DataPacket_Kind, Participant, Room, RoomEvent
  // ,setLogLevel 
} from "livekit-client";
import { motion } from "motion/react";
import {
  RoomAudioRenderer,
  RoomContext,
  StartAudio,
} from "@livekit/components-react";
import { toastAlert } from "@/components/voice-agent/alert-toast";
import { CalendlyInline } from "@/components/voice-agent/calendly-inline";
import { ConversationTimer } from "@/components/voice-agent/conversation-timer";
import { SessionView } from "@/components/voice-agent/session-view";
import { Toaster } from "@/components/voice-agent/ui/sonner";
import { Welcome } from "@/components/voice-agent/welcome";
import useConnectionDetails from "@/hooks/voice-agent/useConnectionDetails";
import type { AppConfig } from "@/lib/voice-agent/types";
import { useMixpanelTracking } from "@/hooks/analytics/useMixpanelTracking";
  


const MotionWelcome = motion.create(Welcome);
const MotionSessionView = motion.create(SessionView);

interface AppProps {
  appConfig: AppConfig;
  autoStart?: boolean;
  onStartCallRef?: React.MutableRefObject<(() => void) | null>;
  onCallEnd?: () => void;
}

export function App({
  appConfig,
  autoStart = false,
  onStartCallRef,
  onCallEnd,
}: AppProps) {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [avatarConnectionFailed, setAvatarConnectionFailed] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [hasNoAvatarParam, setHasNoAvatarParam] = useState(false);
  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } =
    useConnectionDetails(appConfig);
  const { trackVoiceAgentConnectionFailed } = useMixpanelTracking();

  useEffect(() => {
    // setLogLevel("silent");
    // const userChoices = {
    //   videoEnabled: true,
    //   audioEnabled: true,
    //   videoDeviceId: "default",
    //   audioDeviceId: "default",
    // };
    // localStorage.setItem("lk-user-choices", JSON.stringify(userChoices));

    const onDisconnected = () => {
      setSessionStarted(false);
      setAvatarConnectionFailed(false);
      setShowCalendly(false);
      refreshConnectionDetails();
      onCallEnd?.();
    };
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: "Encountered an error with your media devices",
        description: `${error.name}: ${error.message}`,
      });
    };

    const onDataReceived = (
      payload: Uint8Array,
      participant?: Participant,
      kind?: DataPacket_Kind
    ) => {
      const decoder = new TextDecoder();
      const strData = decoder.decode(payload);
      console.log("strData", strData);
      const data = JSON.parse(strData);
      if (data.type === "avatarState") {
        setAvatarConnectionFailed(true);
        toastAlert({
          title: "Error",
          description: `Avatar connection is failed, please try later.`,
        });
        trackVoiceAgentConnectionFailed({
          source: 'setAvatarConnectionFailed_avatarState_in_app',
          error_name: 'Error',
          error_message: 'Avatar connection is failed, please try later.'
        });
      } else if (data.type === "create_appointment") {
        console.log("Opening Calendly for appointment creation");
        setShowCalendly(true);
      }
    };
    room.on(RoomEvent.DataReceived, onDataReceived);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
      room.off(RoomEvent.DataReceived, onDataReceived);
    };
  }, [room, refreshConnectionDetails, onCallEnd, trackVoiceAgentConnectionFailed]);
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const hasNoAvatarParam = currentUrl.searchParams.has("no_avatar");
    setHasNoAvatarParam(hasNoAvatarParam);
  }, []);
  // Reset avatar connection failed state when starting a new session
  useEffect(() => {
    if (sessionStarted) {
      if (hasNoAvatarParam) {
        setAvatarConnectionFailed(true);
        trackVoiceAgentConnectionFailed({
          source: 'setAvatarConnectionFailed_hasNoAvatarParam_in_app',
          error_name: 'Error',
          error_message: 'Avatar connection is failed, please try later.'
        });
      } else {
        setAvatarConnectionFailed(false);
      }
    }
  }, [sessionStarted, hasNoAvatarParam, trackVoiceAgentConnectionFailed]);

  // Disable microphone when Calendly is shown, enable when hidden
  useEffect(() => {
    if (sessionStarted && room.localParticipant) {
      room.localParticipant.setMicrophoneEnabled(!showCalendly);
    }
  }, [showCalendly, sessionStarted, room]);

  useEffect(() => {
    let aborted = false;
    if (sessionStarted && room.state === "disconnected") {
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: appConfig.isPreConnectBufferEnabled,
        }),
        existingOrRefreshConnectionDetails().then((connectionDetails) =>
          room.connect(
            connectionDetails.serverUrl,
            connectionDetails.participantToken
          )
        ),
      ]).catch((error) => {
        // Track connection failure
        trackVoiceAgentConnectionFailed({
          source: 'existingOrRefreshConnectionDetails_in_app',
          error_name: error.name || 'UnknownError',
          error_message: (error.message || 'Connection failed') + (aborted ? ' -- aborted' : ''),
          error_code: error.code
        });

        if (aborted) {
          // Once the effect has cleaned up after itself, drop any errors
          //
          // These errors are likely caused by this effect rerunning rapidly,
          // resulting in a previous run `disconnect` running in parallel with
          // a current run `connect`
          return;
        }

        toastAlert({
          title: "There was an error connecting to the agent",
          description: `${error.name}: ${error.message}`,
        });
      });
    }
    return () => {
      aborted = true;
        room.disconnect();
        trackVoiceAgentConnectionFailed({
          source: 'room_disconnect_in_app',
          error_name: 'Room disconnected',
          error_message: 'Room disconnected on useEffect cleanup'
        });
    };
  }, [
    room,
    sessionStarted,
    appConfig.isPreConnectBufferEnabled,
    existingOrRefreshConnectionDetails,
    trackVoiceAgentConnectionFailed,
  ]);
  const { startButtonText } = appConfig;

  // Expose startCall function via ref for parent components
  const handleStartCall = () => setSessionStarted(true);

  useEffect(() => {
    if (onStartCallRef) {
      onStartCallRef.current = handleStartCall;
    }
  }, [onStartCallRef]);

  return (
    <>
      <main className="pt-[140px]">
        {/* <MotionWelcome
          key="welcome"
          startButtonText={startButtonText}
          onStartCall={handleStartCall}
          disabled={sessionStarted}
          initial={{ opacity: 1 }}
          animate={{ opacity: sessionStarted ? 0 : 1 }}
          transition={{
            duration: 0.5,
            ease: "linear",
            delay: sessionStarted ? 0 : 0.5,
          }}
        /> */}

        <RoomContext.Provider value={room}>
          <RoomAudioRenderer />
          <StartAudio label="Start Audio" />
          {/* --- */}
          <MotionSessionView
            key="session-view"
            appConfig={appConfig}
            disabled={!sessionStarted}
            sessionStarted={sessionStarted}
            avatarConnectionFailed={avatarConnectionFailed}
            showCalendly={showCalendly}
            initial={{ opacity: 0 }}
            animate={{ opacity: sessionStarted ? 1 : 0 }}
            transition={{
              duration: 0.5,
              ease: "linear",
              delay: sessionStarted ? 0.5 : 0,
            }}
          />
          {sessionStarted && <ConversationTimer />}
        </RoomContext.Provider>

        <Toaster />

        {/* Calendly Modal */}
        <CalendlyInline
          isOpen={showCalendly}
          onClose={() => setShowCalendly(false)}
          calendlyUrl={
            process.env.NEXT_PUBLIC_CALENDLY_URL ||
            "https://calendly.com/pg-aiconiq/30min"
          }
          onEventScheduled={(eventData) => {
            console.log("Встреча успешно забронирована!", eventData);

            // Отправляем RPC событие на сервер
            if (room.localParticipant && room.state === "connected") {
              const rpcEvent = {
                topic: "created_appointment",
                metadata: eventData,
              };

              const encoder = new TextEncoder();
              const data = encoder.encode(JSON.stringify(rpcEvent));
              room.localParticipant.publishData(data);

              console.log("RPC событие отправлено:", rpcEvent);
            }

            toastAlert({
              title: "Termin gebucht!",
              description:
                "Ihr Termin wurde erfolgreich gebucht. Die Details wurden per E-Mail gesendet.",
            });
            // Закрываем модалку после успешного бронирования
            setShowCalendly(false);
          }}
        />
      </main>
    </>
  );
}

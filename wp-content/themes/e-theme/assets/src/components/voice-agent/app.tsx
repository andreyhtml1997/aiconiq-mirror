"use client";

import { useEffect, useMemo, useState } from "react";
import { DataPacket_Kind, Participant, Room, RoomEvent } from "livekit-client";
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

const MotionWelcome = motion.create(Welcome);
const MotionSessionView = motion.create(SessionView);

interface AppProps {
  appConfig: AppConfig;
  autoStart?: boolean;
}

export function App({ appConfig, autoStart = false }: AppProps) {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(autoStart);
  const [avatarConnectionFailed, setAvatarConnectionFailed] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [hasNoAvatarParam, setHasNoAvatarParam] = useState(false);
  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } =
    useConnectionDetails(appConfig);

  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      setAvatarConnectionFailed(false);
      setShowCalendly(false);
      refreshConnectionDetails();
    };
    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: "Encountered an error with your media devices",
        description: `${error.name}: ${error.message}`,
      });
    };

    const onDataReceived = (
      payload: Uint8Array,
      _participant?: Participant,
      _kind?: DataPacket_Kind
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
  }, [room, refreshConnectionDetails]);
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
      } else {
        setAvatarConnectionFailed(false);
      }
    }
  }, [sessionStarted, hasNoAvatarParam]);

  // Disable microphone when Calendly is shown, enable when hidden
  useEffect(() => {
    if (sessionStarted && room.localParticipant) {
      room.localParticipant.setMicrophoneEnabled(!showCalendly);
    }
  }, [showCalendly, sessionStarted, room]);

  useEffect(() => {
    let aborted = false;

    if (sessionStarted && room.state === "disconnected") {
      console.log("Connecting to room...");
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
        if (aborted) {
          toastAlert({
            title: "There was an error connecting to the agent",
            description: `${error.name}: ${error.message}`,
          });
          return;
        }
      });
    }
    return () => {
      aborted = true;
      room.disconnect();
    };
  }, [
    room,
    sessionStarted,
    appConfig.isPreConnectBufferEnabled,
    existingOrRefreshConnectionDetails,
  ]);
  const { startButtonText } = appConfig;
  console.log("sessionStarted", sessionStarted);

  return (
    <>
      <main className="pt-[140px]">
        {/* <MotionWelcome
          key="welcome"
          startButtonText={startButtonText}
          onStartCall={() => setSessionStarted(true)}
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
            "https://calendly.com/your-calendly-url"
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

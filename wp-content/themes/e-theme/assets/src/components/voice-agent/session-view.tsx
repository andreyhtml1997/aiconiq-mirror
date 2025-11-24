'use client';

import React, { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '@/components/voice-agent/alert-toast';
import { AgentControlBar } from '@/components/voice-agent/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/voice-agent/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/voice-agent/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/voice-agent/livekit/media-tiles';
import useChatAndTranscription from '@/hooks/voice-agent/useChatAndTranscription';
import { useDebugMode } from '@/hooks/voice-agent/useDebug';
import type { AppConfig } from '@/lib/voice-agent/types';
import { cn } from '@/lib/voice-agent/utils';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

interface SessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
  avatarConnectionFailed: boolean;
  showCalendly?: boolean;
}

export const SessionView = ({
  appConfig,
  disabled,
  sessionStarted,
  avatarConnectionFailed,
  showCalendly = false,
  ref,
}: React.ComponentProps<'div'> & SessionViewProps) => {
  const { state: agentState, videoTrack: agentVideoTrack } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [userControlledMicrophone, setUserControlledMicrophone] = useState(false);
  const [microphoneAutoConfigured, setMicrophoneAutoConfigured] = useState(false);
  const [hasNoAvatarParam, setHasNoAvatarParam] = useState(false);
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const { messages, send } = useChatAndTranscription();
  const room = useRoomContext();
  const cameraTracks = useTracks([Track.Source.Camera]);

  useDebugMode({
    enabled: process.env.NODE_END !== 'production',
  });

  async function handleSendMessage(message: string) {
    await send(message);
  }

  // Load AI tips from JSON file
  useEffect(() => {
    const loadAiTips = async () => {
      try {
        const response = await fetch('/ai-tips.json');
        if (!response.ok) {
          throw new Error('Failed to load AI tips');
        }
        const data = await response.json();
        setAiTips(data.tips || []);
      } catch (error) {
        console.error('Error loading AI tips:', error);
        // Fallback tips in case of error
        setAiTips([
          'Ich bin hier, um Ihnen zu helfen. Stellen Sie mir gerne Ihre Fragen.',
          'Als Ihr AI-Assistent stehe ich Ihnen bei verschiedenen Aufgaben zur Verfügung.',
        ]);
      } finally {
        setTipsLoading(false);
      }
    };

    loadAiTips();
  }, []);

  // Timer for rotating AI tips
  useEffect(() => {
    if (aiTips.length === 0) return;

    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % aiTips.length);
    }, 10000); // 10 seconds

    return () => clearInterval(tipInterval);
  }, [aiTips.length]);

  // Handle height preservation during animation
  const handleAnimationStart = () => {
    if (textRef.current) {
      const currentHeight = textRef.current.scrollHeight;
      setContainerHeight(currentHeight);
    }
  };

  const handleAnimationComplete = () => {
    // Allow container to adjust to new content after animation
    setContainerHeight('auto');
  };

  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room. '
              : 'Agent connected but did not complete initializing. ';

          toastAlert({
            title: 'Session ended',
            description: <p className="w-full">{reason}.</p>,
          });
          room.disconnect();
        }
      }, 30_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const hasNoAvatarParam = currentUrl.searchParams.has('no_avatar');
    setHasNoAvatarParam(hasNoAvatarParam);
  }, []);

  // Control microphone based on avatar state - only for initial configuration
  useEffect(() => {
    if (
      !sessionStarted ||
      !room.localParticipant ||
      showCalendly ||
      userControlledMicrophone ||
      microphoneAutoConfigured
    ) {
      // Don't interfere when:
      // - session not started, no participant, or Calendly is open
      // - user has manually controlled microphone
      // - microphone was already auto-configured
      return;
    }
    const avatarDisabledInConfig = appConfig.avatarEnabled === false;

    // Detect Tavus avatar video track
    const tavusParticipantName =
      process.env.NEXT_PUBLIC_TAVUS_PARTICIPANT_NAME ?? 'tavus-avatar-agent';
    const tavusVideoTrack = cameraTracks.find(
      (t) => !t.participant.isLocal && t.participant.identity === tavusParticipantName
    );

    const isAvatar = agentVideoTrack !== undefined || tavusVideoTrack !== undefined;
    let shouldEnableMic: boolean | null = null;
    let shouldSetConfigured = false;

    console.log('Auto-configuring microphone - isAvatar:', !!isAvatar, 'agentState:', agentState);

    if (agentState === 'connecting') {
      // Avatar hasn't appeared yet - disable microphone and wait
      shouldEnableMic = false;
      console.log('Avatar loading - disabling microphone');
    } else if (avatarConnectionFailed) {
      // Avatar failed - enable microphone
      shouldEnableMic = true;
      shouldSetConfigured = true;
      console.log('Avatar failed - enabling microphone');
    } else if (isAgentAvailable(agentState) && !isAvatar) {
      // Agent is available but no avatar - decide based on configuration
      if (!hasNoAvatarParam && !avatarDisabledInConfig) {
        // Avatar expected but not present - disable microphone
        shouldEnableMic = false;
        console.log('No avatar detected (avatar expected) - disabling microphone');
      } else {
        // No avatar mode or avatar disabled - enable microphone
        shouldEnableMic = true;
        shouldSetConfigured = true;
        console.log('No avatar mode - enabling microphone');
      }
    } else if (isAvatar) {
      // Avatar is present - enable microphone
      shouldEnableMic = true;
      shouldSetConfigured = true;
      console.log('Avatar detected - enabling microphone');
    }

    if (shouldEnableMic !== null) {
      room.localParticipant.setMicrophoneEnabled(shouldEnableMic);
      if (shouldSetConfigured) {
        setMicrophoneAutoConfigured(true);
      }
    }
  }, [
    sessionStarted,
    room,
    showCalendly,
    agentState,
    avatarConnectionFailed,
    agentVideoTrack,
    cameraTracks,
    appConfig,
    userControlledMicrophone,
    microphoneAutoConfigured,
    hasNoAvatarParam,
  ]);

  console.log('agentState', agentState);
  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare,
  };

  // Detect Tavus avatar video track (same logic as in MediaTiles)
  const tavusParticipantName =
    process.env.NEXT_PUBLIC_TAVUS_PARTICIPANT_NAME ?? 'tavus-avatar-agent';
  const tavusVideoTrack = cameraTracks.find(
    (t) => !t.participant.isLocal && t.participant.identity === tavusParticipantName
  );

  const isAvatarConnected = !avatarConnectionFailed && isAgentAvailable(agentState);
  const isTavusAvatarVisible = tavusVideoTrack !== undefined;
  console.log(
    'isAvatarConnected',
    isAvatarConnected,
    isTavusAvatarVisible,
    hasNoAvatarParam,
    isAgentAvailable(agentState)
  );
  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        'opacity-0',
        // prevent page scrollbar
        // when !chatOpen due to 'translate-y-20'
        !chatOpen && 'max-h-svh overflow-hidden'
      )}
    >
      <ChatMessageView
        className={cn(
          'mx-auto min-h-svh w-full max-w-2xl px-3 pt-32 pb-40 transition-[opacity,translate] duration-300 ease-out md:px-0 md:pt-36 md:pb-48',
          chatOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-20 opacity-0'
        )}
      >
        <div className="space-y-3 whitespace-pre-wrap">
          <AnimatePresence>
            {messages.map((message: ReceivedChatMessage) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 1, height: 'auto', translateY: 0.001 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <ChatEntry hideName key={message.id} entry={message} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ChatMessageView>

      <MediaTiles chatOpen={chatOpen} avatarConnectionFailed={avatarConnectionFailed} />

      {(((!isAvatarConnected || !isTavusAvatarVisible) && !hasNoAvatarParam) ||
        (hasNoAvatarParam && !isAgentAvailable(agentState))) && (
        <div
          className={cn(
            'ai-tips-container fixed bottom-[120px] left-1/2 z-50 -translate-x-1/2',
            sessionStarted && messages.length === 0 && 'pointer-events-none'
          )}
        >
          <div className="bg-background/95 border-border max-w-[600px] min-w-[300px] rounded-xl border px-6 py-4 shadow-lg backdrop-blur-md">
            <div
              className="relative overflow-hidden transition-all duration-500 ease-in-out"
              style={{ height: containerHeight }}
            >
              <AnimatePresence mode="wait" onExitComplete={handleAnimationStart}>
                <motion.p
                  ref={textRef}
                  key={currentTipIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onAnimationComplete={handleAnimationComplete}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                  className="text-foreground/90 text-center text-sm leading-relaxed font-medium"
                >
                  {tipsLoading ? 'Laden...' : aiTips[currentTipIndex] || 'Willkommen!'}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
      <div className="fixed right-0 bottom-0 left-0 z-50 px-3 pt-2 pb-3 md:px-12 md:pb-12">
        <motion.div
          key="control-bar"
          initial={{ opacity: 0, translateY: '100%' }}
          animate={{
            opacity: sessionStarted ? 1 : 0,
            translateY: sessionStarted ? '0%' : '100%',
          }}
          transition={{ duration: 0.3, delay: sessionStarted ? 0.5 : 0, ease: 'easeOut' }}
        >
          <div className="relative z-10 mx-auto w-full max-w-2xl">
            <AgentControlBar
              capabilities={capabilities}
              onChatOpenChange={setChatOpen}
              onSendMessage={handleSendMessage}
              onMicrophoneToggle={() => setUserControlledMicrophone(true)}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

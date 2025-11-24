import React, { useMemo } from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import {
  type TrackReference,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { cn } from '@/lib/voice-agent/utils';
import { AgentTile } from './agent-tile';
import { AvatarTile } from './avatar-tile';
import { VideoTile } from './video-tile';

const MotionVideoTile = motion.create(VideoTile);
const MotionAgentTile = motion.create(AgentTile);
const MotionAvatarTile = motion.create(AvatarTile);

const animationProps = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
  transition: {
    type: 'spring',
    stiffness: 675,
    damping: 75,
    mass: 1,
  },
} as const;

const classNames = {
  // GRID
  // 2 Columns x 3 Rows
  grid: [
    'h-full w-full',
    'grid gap-x-2 place-content-center',
    'grid-cols-[1fr_1fr] grid-rows-[90px_1fr_90px]',
  ],
  // Agent
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 1 / Row 1
  // align: x-end y-center
  agentChatOpenWithSecondTile: ['col-start-1 row-start-1', 'self-center justify-self-end'],
  // Agent
  // chatOpen: true,
  // hasSecondTile: false
  // layout: Column 1 / Row 1 / Column-Span 2
  // align: x-center y-center
  agentChatOpenWithoutSecondTile: ['col-start-1 row-start-1', 'col-span-2', 'place-content-center'],
  // Agent
  // chatOpen: false
  // layout: Column 1 / Row 1 / Column-Span 2 / Row-Span 3
  // align: x-center y-center
  agentChatClosed: ['col-start-1 row-start-1', 'col-span-2 row-span-3', 'place-content-center'],
  // Second tile
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 2 / Row 1
  // align: x-start y-center
  secondTileChatOpen: ['col-start-2 row-start-1', 'self-center justify-self-start'],
  // Second tile
  // chatOpen: false,
  // hasSecondTile: false
  // layout: Column 2 / Row 2
  // align: x-end y-end
  secondTileChatClosed: ['col-start-2 row-start-3', 'place-content-end'],
};

export function useLocalTrackRef(source: Track.Source) {
  const { localParticipant } = useLocalParticipant();
  const publication = localParticipant.getTrackPublication(source);
  const trackRef = useMemo<TrackReference | undefined>(
    () => (publication ? { source, participant: localParticipant, publication } : undefined),
    [source, publication, localParticipant]
  );
  return trackRef;
}

interface MediaTilesProps {
  chatOpen: boolean;
  avatarConnectionFailed: boolean;
}

export function MediaTiles({ chatOpen, avatarConnectionFailed }: MediaTilesProps) {
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant();
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);
  const cameraTracks = useTracks([Track.Source.Camera]);
  const cameraTrack: TrackReference | undefined = useLocalTrackRef(Track.Source.Camera);

  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareEnabled = screenShareTrack && !screenShareTrack.publication.isMuted;
  const hasSecondTile = isCameraEnabled || isScreenShareEnabled;

  const transition = {
    ...animationProps.transition,
    delay: chatOpen ? 0 : 0.15, // delay on close
  };
  const agentAnimate = {
    ...animationProps.animate,
    scale: chatOpen ? 1 : 3,
    transition,
  } as const;
  const avatarAnimate = {
    ...animationProps.animate,
    transition,
  } as const;
  const agentLayoutTransition = transition;
  const avatarLayoutTransition = transition;

  // Prefer Tavus avatar participant video if present (join name configurable)
  const tavusParticipantName =
    process.env.NEXT_PUBLIC_TAVUS_PARTICIPANT_NAME ?? 'tavus-avatar-agent';
  const tavusVideoTrack = cameraTracks.find(
    (t) => !t.participant.isLocal && t.participant.identity === tavusParticipantName
  );

  const isAvatar = agentVideoTrack !== undefined || tavusVideoTrack !== undefined;

  // Show background video when no avatar is available and chat is closed
  const showBackgroundVideo = !isAvatar && !chatOpen;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-8 bottom-32 z-50 md:top-12 md:bottom-40">
      {/* Fullscreen background video */}
      {showBackgroundVideo && (
        <div className="fixed inset-0 -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            className={cn(
              'h-full w-full object-cover transition-all duration-500',
              avatarConnectionFailed && 'grayscale'
            )}
            ref={(video) => {
              if (video) {
                if (avatarConnectionFailed) {
                  video.pause();
                } else {
                  video.play();
                }
              }
            }}
          >
            <source src="/f570a274.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      <div className="relative mx-auto h-full max-w-2xl px-4 md:px-0">
        <div className={cn(classNames.grid)}>
          {/* agent */}
          <div
            className={cn([
              'grid',
              // 'bg-[hotpink]', // for debugging
              !chatOpen && classNames.agentChatClosed,
              chatOpen && hasSecondTile && classNames.agentChatOpenWithSecondTile,
              chatOpen && !hasSecondTile && classNames.agentChatOpenWithoutSecondTile,
            ])}
          >
            <AnimatePresence mode="popLayout">
              {!isAvatar && (
                // audio-only agent with enhanced visibility when background video is shown
                <MotionAgentTile
                  key="agent"
                  layoutId="agent"
                  {...animationProps}
                  animate={agentAnimate}
                  transition={agentLayoutTransition}
                  state={agentState}
                  audioTrack={agentAudioTrack}
                  className={cn(
                    chatOpen ? 'h-[90px]' : 'h-auto w-full',
                    // Better visibility when background video is shown, but preserve state behavior
                    showBackgroundVideo && [
                      // Base state - semi-transparent white
                      '[&_span]:!bg-white/60',
                      // Highlighted state (audio activity detected) - full white
                      '[&_span[data-lk-highlighted=true]]:!bg-white',
                      // Muted state (microphone off) - very transparent
                      '[&_span[data-lk-muted=true]]:!bg-white/20',
                    ]
                  )}
                />
              )}
              {tavusVideoTrack && (
                // show Tavus avatar video when present
                <MotionAvatarTile
                  key="tavus-avatar"
                  layoutId="tavus-avatar"
                  {...animationProps}
                  animate={avatarAnimate}
                  transition={avatarLayoutTransition}
                  videoTrack={tavusVideoTrack}
                  avatarConnectionFailed={avatarConnectionFailed}
                />
              )}
              {!tavusVideoTrack && agentVideoTrack && (
                // fallback to agent-provided avatar video
                <MotionAvatarTile
                  key="agent-avatar"
                  layoutId="agent-avatar"
                  {...animationProps}
                  animate={avatarAnimate}
                  transition={avatarLayoutTransition}
                  videoTrack={agentVideoTrack}
                  avatarConnectionFailed={avatarConnectionFailed}
                />
              )}
            </AnimatePresence>
          </div>

          <div
            className={cn([
              'grid',
              chatOpen && classNames.secondTileChatOpen,
              !chatOpen && classNames.secondTileChatClosed,
            ])}
          >
            {/* camera */}
            <AnimatePresence>
              {cameraTrack && isCameraEnabled && (
                <MotionVideoTile
                  key="camera"
                  layout="position"
                  layoutId="camera"
                  {...animationProps}
                  trackRef={cameraTrack}
                  transition={{
                    ...animationProps.transition,
                    delay: chatOpen ? 0 : 0.15,
                  }}
                  className="h-[90px]"
                />
              )}
              {/* screen */}
              {isScreenShareEnabled && (
                <MotionVideoTile
                  key="screen"
                  layout="position"
                  layoutId="screen"
                  {...animationProps}
                  trackRef={screenShareTrack}
                  transition={{
                    ...animationProps.transition,
                    delay: chatOpen ? 0 : 0.15,
                  }}
                  className="h-[90px]"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

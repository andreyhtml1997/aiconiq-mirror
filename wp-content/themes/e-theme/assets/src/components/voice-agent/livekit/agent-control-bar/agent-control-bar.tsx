'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { Track } from 'livekit-client';
import { BarVisualizer, useRemoteParticipants } from '@livekit/components-react';
import { ChatTextIcon, PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
import { ChatInput } from '@/components/voice-agent/livekit/chat/chat-input';
import { Button } from '@/components/voice-agent/ui/button';
import { Toggle } from '@/components/voice-agent/ui/toggle';
import { AppConfig } from '@/lib/voice-agent/types';
import { cn } from '@/lib/voice-agent/utils';
import { DeviceSelect } from '../device-select';
import { TrackToggle } from '../track-toggle';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

export interface AgentControlBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAgentControlBarProps {
  capabilities: Pick<AppConfig, 'supportsChatInput' | 'supportsVideoInput' | 'supportsScreenShare'>;
  onChatOpenChange?: (open: boolean) => void;
  onSendMessage?: (message: string) => Promise<void>;
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
  onMicrophoneToggle?: () => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  capabilities,
  className,
  onSendMessage,
  onChatOpenChange,
  onDisconnect,
  onDeviceError,
  onMicrophoneToggle,
  ...props
}: AgentControlBarProps) {
  const participants = useRemoteParticipants();
  const [chatOpen, setChatOpen] = React.useState(false);
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);

  const isAgentAvailable = participants.some((p) => p.isAgent);
  const isInputDisabled = !chatOpen || !isAgentAvailable || isSendingMessage;

  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const {
    micTrackRef,
    visibleControls,
    microphoneToggle,
    handleAudioDeviceChange,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleVideoDeviceChange, // Used in DeviceSelect component below
    handleDisconnect,
  } = useAgentControlBar({
    controls,
    saveUserChoices,
    onMicrophoneToggle,
  });

  const handleSendMessage = async (message: string) => {
    setIsSendingMessage(true);
    try {
      await onSendMessage?.(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const onLeave = async () => {
    setIsDisconnecting(true);
    await handleDisconnect();
    setIsDisconnecting(false);
    onDisconnect?.();
  };

  React.useEffect(() => {
    onChatOpenChange?.(chatOpen);
  }, [chatOpen, onChatOpenChange]);

  const onMicrophoneDeviceSelectError = useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Microphone, error });
    },
    [onDeviceError]
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCameraDeviceSelectError = useCallback(
    // Used in DeviceSelect component below
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Camera, error });
    },
    [onDeviceError]
  );

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn('flex flex-col rounded-[31px] p-3 drop-shadow-md/3', className)}
      style={{ alignItems: 'center' }}
      {...props}
    >
      {capabilities.supportsChatInput && (
        <div
          inert={!chatOpen}
          className={cn(
            'overflow-hidden transition-[height] duration-300 ease-out',
            chatOpen ? 'h-[57px]' : 'h-0'
          )}
        >
          <div className="flex h-8 w-full">
            <ChatInput onSend={handleSendMessage} disabled={isInputDisabled} className="w-full" />
          </div>
          <hr className="my-3 border-[#f3f3f1]" />
        </div>
      )}

      <div className="flex flex-row justify-between gap-1">
        <div className="flex gap-1">
          {visibleControls.microphone && (
            <div className="flex items-center gap-0 bg-[#fff]" style={{borderRadius:'20px'}}>
              <TrackToggle
                variant="primary"
                source={Track.Source.Microphone}
                pressed={microphoneToggle.enabled}
                disabled={microphoneToggle.pending}
                onPressedChange={microphoneToggle.toggle}
                className="peer/track group/track relative w-auto pr-3 pl-3 md:rounded-r-none md:border-r-0 md:pr-2"
              >
                <BarVisualizer
                  barCount={3}
                  trackRef={micTrackRef}
                  options={{ minHeight: 5 }}
                  className="flex h-full w-auto items-center justify-center gap-0.5"
                >
                  <span
                    className={cn([
                      'h-full w-0.5 origin-center rounded-2xl',
                      'group-data-[state=on]/track:bg-[#3b3b3b] group-data-[state=off]/track:bg-white',
                      'data-lk-muted:bg-[#f3f3f1]',
                    ])}
                  ></span>
                </BarVisualizer>
              </TrackToggle>
              <hr className="relative z-10 -mr-px hidden h-4 w-px bg-[#dbdbd8] peer-data-[state=off]/track:bg-[#ffcdc7] md:block" />
              <DeviceSelect
                size="sm"
                kind="audioinput"
                onMediaDeviceError={onMicrophoneDeviceSelectError}
                onActiveDeviceChange={handleAudioDeviceChange}
                className={cn([
                  'pl-2',
                  'peer-data-[state=off]/track:text-white',
                  'hover:text-[#3b3b3b] focus:text-[#3b3b3b]',
                  'hover:peer-data-[state=off]/track:text-white focus:peer-data-[state=off]/track:text-white',
                  'hidden rounded-l-none md:block',
                ])}
              />
            </div>
          )}

          {/* {capabilities.supportsVideoInput && visibleControls.camera && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="primary"
                source={Track.Source.Camera}
                pressed={cameraToggle.enabled}
                pending={cameraToggle.pending}
                disabled={cameraToggle.pending}
                onPressedChange={cameraToggle.toggle}
                className="peer/track relative w-auto rounded-r-none pr-3 pl-3 disabled:opacity-100 md:border-r-0 md:pr-2"
              />
              <hr className="relative z-10 -mr-px hidden h-4 w-px bg-[#dbdbd8] peer-data-[state=off]/track:bg-[#ffcdc7] md:block" />
              <DeviceSelect
                size="sm"
                kind="videoinput"
                onMediaDeviceError={onCameraDeviceSelectError}
                onActiveDeviceChange={handleVideoDeviceChange}
                className={cn([
                  'pl-2',
                  'peer-data-[state=off]/track:text-white',
                  'hover:text-[#3b3b3b] focus:text-[#3b3b3b]',
                  'hover:peer-data-[state=off]/track:text-white focus:peer-data-[state=off]/track:text-white',
                  'rounded-l-none',
                ])}
              />
            </div>
          )} */}

          {/* {capabilities.supportsScreenShare && visibleControls.screenShare && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="secondary"
                source={Track.Source.ScreenShare}
                pressed={screenShareToggle.enabled}
                disabled={screenShareToggle.pending}
                onPressedChange={screenShareToggle.toggle}
                className="relative w-auto"
              />
            </div>
          )} */}

          {/* {visibleControls.chat && (
            <Toggle
              variant="secondary"
              aria-label="Toggle chat"
              pressed={chatOpen}
              onPressedChange={setChatOpen}
              disabled={!isAgentAvailable}
              className="aspect-square h-full"
            >
              <ChatTextIcon weight="bold" />
            </Toggle>
          )} */}
          {visibleControls.leave && (
            <Button
              variant="destructive"
              onClick={onLeave}
              disabled={isDisconnecting}
              className="font-mono"
            >
              <PhoneDisconnectIcon weight="bold" />
              <span className="hidden md:inline">END CALL</span>
              <span className="inline md:hidden">END</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

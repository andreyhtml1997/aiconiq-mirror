import { type TrackReference, VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/voice-agent/utils';

interface AgentAudioTileProps {
  videoTrack: TrackReference;
  className?: string;
  avatarConnectionFailed?: boolean;
}

export const AvatarTile = ({
  videoTrack,
  className,
  avatarConnectionFailed = false,
  ref,
}: React.ComponentProps<'div'> & AgentAudioTileProps) => {
  return (
    <div ref={ref} className={cn('fixed inset-0 overflow-hidden', className)}>
      <VideoTrack
        trackRef={videoTrack}
        width={videoTrack?.publication.dimensions?.width ?? 0}
        height={videoTrack?.publication.dimensions?.height ?? 0}
        className={cn(
          'h-full w-full object-cover transition-all duration-500',
          avatarConnectionFailed && 'grayscale'
        )}
      />
    </div>
  );
};

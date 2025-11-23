import { useState } from "react";

interface MediaControlsProps {
  onPlayPause?: (isPlaying: boolean) => void;
  onVolumeToggle?: (isMuted: boolean) => void;
  className?: string;
}

const MediaControls = ({
  onPlayPause,
  onVolumeToggle,
  className = "",
}: MediaControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    onPlayPause?.(newPlayingState);
  };

  const handleVolumeToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    onVolumeToggle?.(newMutedState);
  };

  return (
    <div
      className={`
        bg-[rgba(247,247,249,0.06)] border border-[rgba(255,255,255,0.04)]
        rounded-[500px] p-[10px]
        inline-flex gap-[6px] items-center
        ${className}
      `}
    >
      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className="
          bg-gradient-to-b from-[#28292e] to-[#201f1b]
          border border-black rounded-[70px]
          w-[44px] h-[44px]
          flex items-center justify-center
          transition-all duration-200
          hover:from-[#32333a] hover:to-[#2a2926]
          active:scale-95
        "
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg
            width="17"
            height="20"
            viewBox="0 0 17 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="6" height="20" rx="1" fill="white" />
            <rect x="11" y="0" width="6" height="20" rx="1" fill="white" />
          </svg>
        ) : (
          <svg
            width="17"
            height="20"
            viewBox="0 0 17 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-[2px]"
          >
            <path
              d="M16.5 10L0.75 19.5263L0.75 0.473721L16.5 10Z"
              fill="white"
            />
          </svg>
        )}
      </button>

      {/* Volume Button */}
      <button
        onClick={handleVolumeToggle}
        className="
          bg-gradient-to-b from-[#28292e] to-[#201f1b]
          border border-black rounded-[70px]
          w-[44px] h-[44px]
          flex items-center justify-center
          transition-all duration-200
          hover:from-[#32333a] hover:to-[#2a2926]
          active:scale-95
        "
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="23"
              y1="9"
              x2="17"
              y2="15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="17"
              y1="9"
              x2="23"
              y2="15"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MediaControls;

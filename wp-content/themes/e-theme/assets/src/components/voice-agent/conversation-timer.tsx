'use client';

import { ClockIcon } from '@phosphor-icons/react/dist/ssr';
import useConversationTimer from '@/hooks/voice-agent/useConversationTimer';
import { cn } from '@/lib/voice-agent/utils';

interface ConversationTimerProps {
  className?: string;
}

export function ConversationTimer({ className }: ConversationTimerProps) {
  const { timerData, formatTime, isActive } = useConversationTimer();

  if (!isActive || !timerData) {
    return null;
  }

  const progressPercentage =
    ((timerData.totalTime - timerData.remainingTime) / timerData.totalTime) * 100;

  return (
    <div
      className={cn(
        'bg-background/80 fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm',
        className
      )}
    >
      <ClockIcon className="text-muted-foreground h-4 w-4" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-foreground">{formatTime(timerData.remainingTime)}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{formatTime(timerData.totalTime)}</span>
        </div>
        <div className="bg-muted mt-1 h-1 w-20 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

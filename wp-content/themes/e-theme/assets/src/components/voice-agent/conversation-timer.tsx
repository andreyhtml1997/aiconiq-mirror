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
        'fixed top-4 right-4 z-50 flex items-center gap-2 rounded-[10px] border border-[#dbdbd8] bg-white/80 px-3 py-2 shadow-lg backdrop-blur-sm',
        className
      )}
    >
      <ClockIcon className="h-4 w-4 text-[#707070]" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-[#000000]">{formatTime(timerData.remainingTime)}</span>
          <span className="text-[#707070]">/</span>
          <span className="text-[#707070]">{formatTime(timerData.totalTime)}</span>
        </div>
        <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-[#f3f3f1]">
          <div
            className="h-full bg-[#d8008d] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

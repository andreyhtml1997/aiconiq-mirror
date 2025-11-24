import React from "react";
import { Button } from "@/components/voice-agent/ui/button";
import { cn } from "@/lib/voice-agent/utils";

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = ({
  disabled,
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<"div"> & WelcomeProps) => {
  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        "fixed inset-0 mx-auto flex h-svh flex-col items-center justify-center text-center",
        disabled ? "z-10" : "z-20"
      )}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        <source src="/assets/hero/f570a274.mp4" type="video/mp4" />
      </video>
    </section>
  );
};

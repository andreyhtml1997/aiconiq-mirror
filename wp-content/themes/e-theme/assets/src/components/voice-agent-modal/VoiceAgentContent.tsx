"use client";

import { useEffect, useRef } from "react";
import { App } from "@/components/voice-agent/app";
import type { AppConfig } from "@/lib/voice-agent/types";
import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";

// Voice Agent configuration
const appConfig: AppConfig = {
  pageTitle: "AICONIQ Voice Agent",
  pageDescription: "Talk with our AI assistant",
  companyName: "AICONIQ",

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: "/assets/logo.svg",
  startButtonText: "Start Conversation",
  avatarEnabled: true,
};

export const VoiceAgentContent = () => {
  const startButtonRef = useRef<(() => void) | null>(null);
  const closeModal = useVoiceAgentModalStore((state) => state.closeModal);

  // Auto-trigger the start when modal opens
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (startButtonRef.current) {
        startButtonRef.current();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full ">
      <App appConfig={appConfig} onStartCallRef={startButtonRef} onCallEnd={closeModal} />
    </div>
  );
};

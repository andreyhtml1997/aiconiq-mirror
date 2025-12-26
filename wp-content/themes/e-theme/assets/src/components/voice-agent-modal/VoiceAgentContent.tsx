"use client";

import { useEffect, useRef } from "react";
import { App } from "@/components/voice-agent/app";
import type { AppConfig } from "@/lib/voice-agent/types";
import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";
import { useMixpanelTracking } from '@/hooks/analytics/useMixpanelTracking';

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
  const { trackVoiceAgentConnectionFailed } = useMixpanelTracking();

  // Auto-trigger the start when modal opens
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (startButtonRef.current) {
        startButtonRef.current();
      } else {
        trackVoiceAgentConnectionFailed({
          source: 'startButtonRef_in_VoiceAgentContent',
          error_name: 'Error',
          error_message: 'startButtonRef is null'
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [trackVoiceAgentConnectionFailed]);

  return (
    <div className="h-full w-full ">
      <App appConfig={appConfig} onStartCallRef={startButtonRef} onCallEnd={closeModal} />
    </div>
  );
};

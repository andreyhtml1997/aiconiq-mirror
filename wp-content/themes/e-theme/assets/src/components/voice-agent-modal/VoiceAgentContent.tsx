"use client";

import { App } from "@/components/voice-agent/app";
import type { AppConfig } from "@/lib/voice-agent/types";

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
  return (
    <div className="h-full w-full ">
      <App appConfig={appConfig} autoStart={true} />
    </div>
  );
};

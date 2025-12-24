"use client";

/**
 * useMixpanelTracking Hook
 *
 * Custom React hook for tracking Mixpanel events.
 * Provides memoized, type-safe tracking functions.
 */

import { useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  trackVoiceAgentButtonClicked as _trackVoiceAgentButtonClicked,
  trackVoiceAgentConnected as _trackVoiceAgentConnected,
  trackVoiceAgentConnectionFailed as _trackVoiceAgentConnectionFailed,
  trackVoiceAgentDisconnected as _trackVoiceAgentDisconnected,
} from "@/lib/analytics/mixpanel";
import type {
  VoiceAgentButtonClickedProperties,
  VoiceAgentConnectedProperties,
  VoiceAgentConnectionFailedProperties,
  VoiceAgentDisconnectedProperties,
} from "@/lib/analytics/types";

export function useMixpanelTracking() {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.lang as string | undefined;

  /**
   * Track Voice Agent button click
   */
  const trackVoiceAgentButtonClicked = useCallback(
    (properties: Omit<VoiceAgentButtonClickedProperties, "locale">) => {
      _trackVoiceAgentButtonClicked({
        ...properties,
        locale,
      });
    },
    [locale]
  );

  /**
   * Track Voice Agent connection success
   */
  const trackVoiceAgentConnected = useCallback(
    (properties: VoiceAgentConnectedProperties) => {
      _trackVoiceAgentConnected(properties);
    },
    []
  );

  /**
   * Track Voice Agent connection failure
   */
  const trackVoiceAgentConnectionFailed = useCallback(
    (properties: VoiceAgentConnectionFailedProperties) => {
      _trackVoiceAgentConnectionFailed(properties);
    },
    []
  );

  /**
   * Track Voice Agent connection failure
   */
  const trackVoiceAgentDisconnected = useCallback(
    (properties: VoiceAgentDisconnectedProperties) => {
      _trackVoiceAgentDisconnected(properties);
    },
    []
  );

  return {
    trackVoiceAgentButtonClicked,
    trackVoiceAgentConnected,
    trackVoiceAgentConnectionFailed,
    trackVoiceAgentDisconnected,
    /** Current pathname for convenience */
    pathname,
    /** Current locale for convenience */
    locale,
  };
}

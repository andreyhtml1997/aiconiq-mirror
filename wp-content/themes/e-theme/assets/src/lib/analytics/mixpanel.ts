/**
 * Mixpanel Analytics Service
 *
 * Core service for initializing and tracking events with Mixpanel.
 * Provides type-safe wrapper functions for all analytics events.
 */

import mixpanel from "mixpanel-browser";
import type {
  AnalyticsEvent,
  AnalyticsEventProperties,
  VoiceAgentButtonClickedProperties,
  VoiceAgentConnectedProperties,
  VoiceAgentConnectionFailedProperties,
  VoiceAgentDisconnectedProperties,
} from "./types";

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== "undefined";

/**
 * Check if Mixpanel token is configured
 */
const isConfigured = () => {
  return isBrowser && !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
};

export function initMixpanel(): void {
  if (!isBrowser) {
    console.warn("[Mixpanel] Cannot initialize on server side");
    return;
  }

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  if (!token) {
    console.warn("[Mixpanel] Token not configured. Analytics disabled.");
    return;
  }

  try {
    mixpanel.init(token, {
      // Enable debug mode for development (logs to console)
      debug: process.env.NODE_ENV === "development",

      api_host: 'https://api-eu.mixpanel.com',

      // Track page views automatically
      // track_pageview: true,

      // Enable persistence (stores user data in cookies/localStorage)
      // persistence: "localStorage",

      // Automatically capture certain properties
      // property_blacklist: [],

      // Ignore Do Not Track browser setting (set to true to respect DNT)
      // ignore_dnt: true,

      // Load script securely
      secure_cookie: true,

      // Enable IP geolocation lookup
      ip: true,

      // Cross-subdomain cookie (useful for multi-domain tracking)
      // cross_subdomain_cookie: false,

      // Batch requests for better performance
      batch_requests: true,
    });

    console.log("[Mixpanel] Initialized successfully");
  } catch (error) {
    console.error("[Mixpanel] Initialization failed:", error);
  }
}

/**
 * Track a generic event with properties
 * @param eventName - The name of the event
 * @param properties - Event-specific properties
 */
function trackEvent<T extends AnalyticsEvent>(
  eventName: T,
  properties?: AnalyticsEventProperties[T]
): void {
  if (!isConfigured()) {
    console.warn(`[Mixpanel] Not configured. Skipping event: ${eventName}`);
    return;
  }

  try {
    // Enrich properties with additional context
    const enrichedProperties = {
      ...properties,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    };

    mixpanel.track(eventName, enrichedProperties);

    if (process.env.NODE_ENV === "development") {
      console.log(`[Mixpanel] Event tracked:`, eventName, enrichedProperties);
    }
  } catch (error) {
    // Fail gracefully - don't let analytics errors break the app
    console.error(`[Mixpanel] Error tracking event ${eventName}:`, error);
  }
}

/**
 * Track when user clicks the Voice Agent button
 */
export function trackVoiceAgentButtonClicked(
  properties: VoiceAgentButtonClickedProperties
): void {
  trackEvent("voice_agent_button_clicked", properties);
}

/**
 * Track when Voice Agent successfully connects
 */
export function trackVoiceAgentConnected(
  properties: VoiceAgentConnectedProperties
): void {
  trackEvent("voice_agent_connected", properties);
}

/**
 * Track when Voice Agent connection fails
 */
export function trackVoiceAgentConnectionFailed(
  properties: VoiceAgentConnectionFailedProperties
): void {
  trackEvent("voice_agent_connection_failed", properties);
}

/**
 * Track when Voice Agent disconnects
 */
export function trackVoiceAgentDisconnected(
  properties: VoiceAgentDisconnectedProperties
): void {
  trackEvent("voice_agent_disconnected", properties);
}

/**
 * Identify a user (optional - for future use)
 * @param userId - Unique user identifier
 * @param traits - User properties
 */
export function identifyUser(
  userId: string,
  traits?: Record<string, any>
): void {
  if (!isConfigured()) {
    return;
  }

  try {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  } catch (error) {
    console.error("[Mixpanel] Error identifying user:", error);
  }
}

/**
 * Reset user identity (e.g., on logout)
 */
export function resetUser(): void {
  if (!isConfigured()) {
    return;
  }

  try {
    mixpanel.reset();
  } catch (error) {
    console.error("[Mixpanel] Error resetting user:", error);
  }
}

/**
 * Set super properties (properties sent with every event)
 */
export function setSuperProperties(properties: Record<string, any>): void {
  if (!isConfigured()) {
    return;
  }

  try {
    mixpanel.register(properties);
  } catch (error) {
    console.error("[Mixpanel] Error setting super properties:", error);
  }
}

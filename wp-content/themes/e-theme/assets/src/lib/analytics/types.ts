/**
 * Mixpanel Event Types and Properties
 *
 * This file defines TypeScript interfaces for all analytics events
 * to ensure type safety when tracking events.
 */

/**
 * Event: Voice Agent Button Clicked
 * Triggered when user clicks any "Talk to Me" button
 */
export interface VoiceAgentButtonClickedProperties {
  /** The section/component where the button was clicked */
  source:
    | "hero_section"
    | "hero_headline"
    | "auto_vs_teamwork"
    | "problem_solution";
  /** Current page path */
  page_path: string;
  /** Referrer URL (where user came from) */
  referrer: string;
  /** User's locale/language */
  locale?: string;
}

/**
 * Event: Voice Agent Connected
 * Triggered when LiveKit successfully connects
 */
export interface VoiceAgentConnectedProperties {}

/**
 * Event: Voice Agent Connection Failed
 * Triggered when LiveKit connection fails
 */
export interface VoiceAgentConnectionFailedProperties {
  /** Error name/type */
  error_name: string;
  /** Error message */
  error_message: string;
  /** Error code if available */
  error_code?: string | number;
}

/**
 * Event: Voice Agent Disconnected
 * Triggered when Voice Agent disconnects
 */
export interface VoiceAgentDisconnectedProperties {
  /** The section/component where the button was clicked */
  source:
    | "voice_agent_modal_end_call"
    | "voice_agent_modal_esc_key"
    | "voice_agent_modal_close_button";
}

/**
 * All possible analytics events
 */
export type AnalyticsEvent =
  | "voice_agent_button_clicked"
  | "voice_agent_connected"
  | "voice_agent_connection_failed"
  | "voice_agent_disconnected";

/**
 * Map of event names to their property types
 */
export interface AnalyticsEventProperties {
  voice_agent_button_clicked: VoiceAgentButtonClickedProperties;
  voice_agent_connected: VoiceAgentConnectedProperties;
  voice_agent_connection_failed: VoiceAgentConnectionFailedProperties;
  voice_agent_disconnected: VoiceAgentDisconnectedProperties;
}

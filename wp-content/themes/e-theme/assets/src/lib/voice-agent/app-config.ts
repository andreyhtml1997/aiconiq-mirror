import type { AppConfig } from './types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'AICONIQ',
  pageTitle: 'AICONIQ Voice Agent',
  pageDescription: 'A voice agent built with AICONIQ',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '/aiconiq-symbol-logotype-h-rgb.svg',
  accent: '#d8008d',
  logoDark: '/aiconiq-symbol-logotype-h-rgb.svg',
  accentDark: '#d8008d',
  startButtonText: 'Sprich mit mir',

  agentName: 'aiconiq-agent',
  avatarEnabled: true, // По умолчанию аватар включен
};

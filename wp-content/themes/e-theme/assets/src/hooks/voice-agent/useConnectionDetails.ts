import { useCallback, useEffect, useState } from 'react';
import { decodeJwt } from 'jose';
import { ConnectionDetails } from '@/app/api/connection-details/route';
import { AppConfig } from '@/lib/voice-agent/types';
import { useMixpanelTracking } from '@/hooks/analytics/useMixpanelTracking';

const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;

export default function useConnectionDetails(appConfig: AppConfig) {
  // Generate room connection details, including:
  //   - A random Room name
  //   - A random Participant name
  //   - An Access Token to permit the participant to join the room
  //   - The URL of the LiveKit server to connect to
  //
  // In real-world application, you would likely allow the user to specify their
  // own participant name, and possibly to choose from existing rooms to join.

  const { trackVoiceAgentConnectionFailed } = useMixpanelTracking();

  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);

  const fetchConnectionDetails = useCallback(async () => {
    setConnectionDetails(null);
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details',
      window.location.origin
    );

    // Check if no_avatar parameter is present in the current page URL or disabled in config
    const currentUrl = new URL(window.location.href);
    const hasNoAvatarParam = currentUrl.searchParams.has('no_avatar');
    const avatarDisabledInConfig = appConfig.avatarEnabled === false;

    if (hasNoAvatarParam || avatarDisabledInConfig) {
      url.searchParams.set('no_avatar', '');
    }

    let data: ConnectionDetails;
    try {
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sandbox-Id': appConfig.sandboxId ?? '',
        },
        body: JSON.stringify({
          room_config: appConfig.agentName
            ? {
                agents: [{ agent_name: appConfig.agentName }],
              }
            : undefined,
        }),
      });
      data = await res.json();
    } catch (error) {
      // Event error fetching connection details
      const errorName = error instanceof Error ? error.name : 'UnknownError';
      const errorMessage = error instanceof Error ? error.message : 'Error fetching connection details';
      const errorCode = error && typeof error === 'object' && 'code' in error 
        ? (error as { code?: string }).code 
        : undefined;
      
      trackVoiceAgentConnectionFailed({
        source: 'fetch_connection_details',
        error_name: errorName,
        error_message: errorMessage,
        error_code: errorCode
      });
      console.error('Error fetching connection details:', error);
      throw new Error('Error fetching connection details!');
    }

    setConnectionDetails(data);
    return data;
  }, [appConfig, trackVoiceAgentConnectionFailed]);

  useEffect(() => {
    fetchConnectionDetails();
  }, [fetchConnectionDetails]);

  const isConnectionDetailsExpired = useCallback(() => {
    const token = connectionDetails?.participantToken;
    if (!token) {
      return true;
    }

    const jwtPayload = decodeJwt(token);
    if (!jwtPayload.exp) {
      return true;
    }
    const expiresAt = new Date((jwtPayload.exp * 1000) - ONE_MINUTE_IN_MILLISECONDS);

    const now = new Date();
    return now >= expiresAt;
  }, [connectionDetails?.participantToken]);

  const existingOrRefreshConnectionDetails = useCallback(async () => {
    if (isConnectionDetailsExpired() || !connectionDetails) {
      return fetchConnectionDetails();
    } else {
      return connectionDetails;
    }
  }, [connectionDetails, fetchConnectionDetails, isConnectionDetailsExpired]);

  return {
    connectionDetails,
    refreshConnectionDetails: fetchConnectionDetails,
    existingOrRefreshConnectionDetails,
  };
}

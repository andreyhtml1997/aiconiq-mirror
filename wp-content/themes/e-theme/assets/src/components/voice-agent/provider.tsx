'use client';

import React from 'react';
import { Room } from 'livekit-client';
import { RoomContext } from '@livekit/components-react';
import { toastAlert } from '@/components/voice-agent/alert-toast';
import useConnectionDetails from '@/hooks/voice-agent/useConnectionDetails';
import { AppConfig } from '@/lib/voice-agent/types';
import { useMixpanelTracking } from '@/hooks/analytics/useMixpanelTracking';

export function Provider({
  appConfig,
  children,
}: {
  appConfig: AppConfig;
  children: React.ReactNode;
}) {
  const { connectionDetails } = useConnectionDetails(appConfig);
  const room = React.useMemo(() => new Room(), []);
  const { trackVoiceAgentConnectionFailed } = useMixpanelTracking();

  React.useEffect(() => {
    if (room.state === 'disconnected' && connectionDetails) {
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: true,
        }),
        room.connect(connectionDetails.serverUrl, connectionDetails.participantToken),
      ]).catch((error) => {
        // Event error connecting to the agent
        trackVoiceAgentConnectionFailed({
          source: 'room_connect_in_provider',
          error_name: error.name || 'UnknownError',
          error_message: error.message || 'Error connecting to the agent',
          error_code: error.code
        });
        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      });
    }
    return () => {
      room.disconnect();
    };
  }, [room, connectionDetails, trackVoiceAgentConnectionFailed]);

  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
}

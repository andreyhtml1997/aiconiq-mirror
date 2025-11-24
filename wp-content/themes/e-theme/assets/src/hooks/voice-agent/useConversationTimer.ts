import { useEffect, useState } from 'react';
import { DataPacket_Kind, type Participant, RoomEvent } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';

export interface ConversationTimerData {
  remainingTime: number;
  totalTime: number;
  elapsedTime: number;
}

export default function useConversationTimer() {
  const [timerData, setTimerData] = useState<ConversationTimerData | null>(null);
  const room = useRoomContext();

  useEffect(() => {
    const onDataReceived = (
      payload: Uint8Array,
      participant?: Participant,
      kind?: DataPacket_Kind
    ) => {
      try {
        const decoder = new TextDecoder();
        const strData = decoder.decode(payload);
        const data = JSON.parse(strData);

        // Filter for conversationTimer messages
        if (data.type === 'conversationTimer' && data.payload) {
          setTimerData({
            remainingTime: data.payload.remainingTime,
            totalTime: data.payload.totalTime,
            elapsedTime: data.payload.elapsedTime,
          });
        }
      } catch (error) {
        console.error('Error parsing conversation timer data:', error);
      }
    };

    room.on(RoomEvent.DataReceived, onDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, onDataReceived);
    };
  }, [room]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timerData,
    formatTime,
    isActive: timerData !== null,
  };
}

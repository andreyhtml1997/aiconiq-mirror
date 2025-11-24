'use client';

import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { motion } from 'motion/react';
import { X } from '@phosphor-icons/react';

interface CalendlyEvent {
  uri: string;
}

interface Invitee {
  uri: string;
}

interface CalendlyInlineProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl?: string;
  onEventScheduled?: (payload: { event: CalendlyEvent; invitee: Invitee }) => void; // Callback для успешного создания встречи
}

export function CalendlyInline({
  isOpen,
  onClose,
  calendlyUrl = 'https://calendly.com/your-calendly-url',
  onEventScheduled,
}: CalendlyInlineProps) {
  // Слушаем события Calendly
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      console.log('Встреча успешно создана!', e.data.payload);
      onEventScheduled?.(e.data.payload);
      // Можно автоматически закрыть модалку после успешного создания встречи
      // onClose();
    },
    onDateAndTimeSelected: (e) => {
      console.log('Дата и время выбраны', e);
    },
    onEventTypeViewed: (e) => {
      console.log('Тип события просмотрен', e.data.payload);
    },
  });

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Клик по overlay закрывает модалку
    >
      <motion.div
        className="relative mx-4 h-[100vh] w-full max-w-4xl overflow-hidden rounded-lg shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на контент
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
        >
          <X size={20} fill="black" />
        </button>

        {/* Calendly Widget */}

        <InlineWidget
          url={calendlyUrl}
          styles={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
          pageSettings={{
            backgroundColor: 'ffffff',
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            primaryColor: '00a2ff',
            textColor: '4d5055',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceAgentModalStore } from "@/stores/useVoiceAgentModalStore";
import { VoiceAgentContent } from "./VoiceAgentContent";

export const VoiceAgentModal = () => {
  const isOpen = useVoiceAgentModalStore((state) => state.isOpen);
  const closeModal = useVoiceAgentModalStore((state) => state.closeModal);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeModal]);

  // Handle click on modal backdrop to trigger start
  const handleModalClick = (e: React.MouseEvent) => {
    // Only trigger if clicking the modal content area, not the close button
    if (e.target === e.currentTarget) {
      return;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          onClick={handleModalClick}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 h-full w-full"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="fixed right-4 top-20 z-[10000] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:scale-110"
              aria-label="Close modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Voice Agent Content */}
            <VoiceAgentContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

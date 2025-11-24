import { create } from 'zustand'

interface VoiceAgentModalStore {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useVoiceAgentModalStore = create<VoiceAgentModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))

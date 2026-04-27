'use client'

/**
 * Carries the WP `primary` menu items down through the tree so client
 * components (Hero embedded nav, etc.) don't have to re-fetch them.
 *
 * The async server Layout fetches the menu once and wraps children with
 * <PrimaryMenuProvider value={items}>...</PrimaryMenuProvider>.
 */

import { createContext, useContext, ReactNode } from 'react'
import type { MenuItem } from '@/lib/wp'

const PrimaryMenuContext = createContext<MenuItem[]>([])

export const usePrimaryMenu = (): MenuItem[] => useContext(PrimaryMenuContext)

interface ProviderProps {
  value: MenuItem[]
  children: ReactNode
}

export const PrimaryMenuProvider = ({ value, children }: ProviderProps) => (
  <PrimaryMenuContext.Provider value={value}>{children}</PrimaryMenuContext.Provider>
)

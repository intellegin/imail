import React, { createContext, useContext } from 'react'

export type NavigationNotificationCounts = {
  inbox: number
  drafts: number
  sent: number
  junk: number
  trash: number
  archive: number
  social: number
  updates: number
  forums: number
  shopping: number
  promotions: number
}

const defaultCounts: NavigationNotificationCounts = {
  inbox: 128,
  drafts: 9,
  sent: 0,
  junk: 23,
  trash: 0,
  archive: 0,
  social: 972,
  updates: 342,
  forums: 128,
  shopping: 8,
  promotions: 21,
}

const NavigationNotificationCountContext =
  createContext<NavigationNotificationCounts>(defaultCounts)

export const NavigationNotificationCountProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <NavigationNotificationCountContext.Provider value={defaultCounts}>
    {children}
  </NavigationNotificationCountContext.Provider>
)

export const useNavigationNotificationCount = () =>
  useContext(NavigationNotificationCountContext)

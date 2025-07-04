import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Clears all browser storage (localStorage, sessionStorage, cookies)
 * Call this function during logout to ensure complete data cleanup
 */
export const clearStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })

  if ('indexedDB' in window) {
    indexedDB.databases().then(databases => {
      databases.forEach(db => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name)
        }
      })
    })
  }
}

export const nullsToUndefined = <T extends object>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v])
  ) as T
}
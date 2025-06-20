import { useState, useEffect } from 'react'

/**
 * A custom hook to determine if a media query matches the current screen size.
 * @param query - The media query string (e.g., '(min-width: 768px)').
 * @returns `true` if the query matches, otherwise `false`.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Ensure window is defined (for server-side rendering safety)
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)

    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

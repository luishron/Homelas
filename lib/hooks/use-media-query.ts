'use client';

import * as React from 'react';

/**
 * Custom hook for responsive media queries
 *
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns boolean - true if media query matches
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 768px)")
 *
 * if (isDesktop) {
 *   return <Dialog>...</Dialog>
 * }
 * return <Drawer>...</Drawer>
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean>(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (modern browsers)
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

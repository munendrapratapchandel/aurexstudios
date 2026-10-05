'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if not in admin
    if (pathname.startsWith('/admin')) return;

    const track = async () => {
      try {
        await fetch('/api/visitors/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname }),
        });
      } catch {
        // silent fail
      }
    };

    track();

    // Heartbeat every 2 minutes
    const interval = setInterval(track, 120000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

'use client';

import { useUserTracking } from '@/hooks/useUserTracking';

interface UserTrackingProps {
  enabled?: boolean;
  debug?: boolean;
}

export function UserTracking({ enabled = true, debug = false }: UserTrackingProps) {
  // This hook will automatically track the user when the component mounts
  useUserTracking({ enabled, debug });

  // This component doesn't render anything visible
  return null;
}

"use client";

/**
 * MixpanelProvider Component
 *
 * Initializes Mixpanel analytics on the client side.
 * Wrap your app with this provider to enable analytics tracking.
 */

import { useEffect } from "react";
import { initMixpanel, setSuperProperties } from "@/lib/analytics/mixpanel";
import { useParams, usePathname } from "next/navigation";

interface MixpanelProviderProps {
  children: React.ReactNode;
}

export function MixpanelProvider({ children }: MixpanelProviderProps) {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.lang as string | undefined;

  useEffect(() => {
    // Initialize Mixpanel once when the app starts
    initMixpanel();

    // Set super properties that will be sent with every event
    const superProperties: Record<string, any> = {
      app_name: "AICONIQ",
    //   app_version: "1.0.0",
    };

    // Add locale if available
    if (locale) {
      superProperties.locale = locale;
    }

    setSuperProperties(superProperties);
  }, []);

  // Track page changes
  useEffect(() => {
    if (pathname) {
      setSuperProperties({
        current_page: pathname,
      });
    }
  }, [pathname]);

  return <>{children}</>;
}

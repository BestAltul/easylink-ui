import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { trackEvent } from "@/services/amplitude";

export default function OfferViewAnalytics() {
  const location = useLocation();
  const { id: offerId } = useParams();

  useEffect(() => {
    trackEvent("Offer Viewed", {
      offerId,
      origin: location.state?.origin || "direct",
      ownerVibeId: location.state?.ownerVibeId || null,
      viewerVibeId: location.state?.viewerVibeId || null,
      path: location.pathname,
      ts: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerId]);

  // time on page (accounting for tab visibility)
  const acc = useRef(0);
  const last = useRef(performance.now());
  const paused = useRef(false);

  useEffect(() => {
    const onVis = () => {
      const now = performance.now();
      if (document.hidden && !paused.current) {
        acc.current += now - last.current;
        paused.current = true;
      } else if (!document.hidden && paused.current) {
        last.current = now;
        paused.current = false;
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      const now = performance.now();
      if (!paused.current) acc.current += now - last.current;

      trackEvent("Offer View Duration", {
        offerId,
        origin: location.state?.origin || "direct",
        ownerVibeId: location.state?.ownerVibeId || null,
        viewerVibeId: location.state?.viewerVibeId || null,
        durationMs: Math.round(acc.current),
        path: location.pathname,
        ts: Date.now(),
      });

      document.removeEventListener("visibilitychange", onVis);
    };
  }, [offerId, location.state, location.pathname]);

  return null;
}

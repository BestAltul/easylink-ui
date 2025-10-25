import { useEffect, useRef, useState } from "react";

export default function useCountUp(target = 100, durationMs = 1200, shouldRun = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!shouldRun) return;
    const start = performance.now();
    startRef.current = start;

    const tick = (now) => {
      const p = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, durationMs, shouldRun]);

  return value;
}

import { useMemo } from "react";

export default function useTiltOnHover({ maxDeg = 2, liftPx = 2 } = {}) {
  return useMemo(() => ({
    onMouseMove: (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `translateY(-${liftPx}px) rotateX(${(-y * maxDeg).toFixed(2)}deg) rotateY(${(x * maxDeg).toFixed(2)}deg)`;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    },
  }), [maxDeg, liftPx]);
}

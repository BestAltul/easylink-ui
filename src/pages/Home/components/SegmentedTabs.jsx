import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SegmentedTabs({
  value,
  onChange,
  labels, 
  tabKeys,
  ariaLabel = "Vibe types"
}) {
  const keys = useMemo(
    () => (Array.isArray(tabKeys) && tabKeys.length ? tabKeys : ["business", "personal", "other"]),
    [tabKeys]
  );
  const selectedIndex = Math.max(0, keys.indexOf(value));
  const [focusedIndex, setFocusedIndex] = useState(selectedIndex);
  const btnRefs = useRef([]);
  useEffect(() => {
    setFocusedIndex(selectedIndex);
  }, [selectedIndex, value, keys]);

  const moveFocus = (i) => {
    setFocusedIndex(i);
    onChange(keys[i]);
    btnRefs.current[i]?.focus();
  };

  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        moveFocus((focusedIndex + 1) % keys.length);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        moveFocus((focusedIndex - 1 + keys.length) % keys.length);
        break;
      }
      case "Home": {
        e.preventDefault();
        moveFocus(0);
        break;
      }
      case "End": {
        e.preventDefault();
        moveFocus(keys.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        onChange(keys[focusedIndex]);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      className="segmented"
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {keys.map((k, i) => {
        const selected = value === k || (value == null && i === 0);
        return (
          <button
            key={k}
            ref={(el) => (btnRefs.current[i] = el)}
            role="tab"
            id={`tab-${k}`}
            aria-controls={`panel-${k}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={"segmented__btn" + (selected ? " is-active" : "")}
            onClick={() => onChange(k)}
          >
            {labels?.[k] ?? k}
          </button>
        );
      })}

      <motion.span
        layoutId="segmented-thumb"
        className="segmented__thumb"
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      />
    </div>
  );
}

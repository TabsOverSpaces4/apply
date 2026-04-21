import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

/**
 * Animates a numeric value from 0 → `to`. Returns the live value each frame.
 * Uses framer-motion's `animate()` for native rAF scheduling and a polished
 * easing curve.
 */
export function useCountUp(
  to: number,
  { duration = 1.1, delay = 0 }: { duration?: number; delay?: number } = {},
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [to, duration, delay]);

  return value;
}

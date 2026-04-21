import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoadingPaneProps {
  /** Messages cycled through while waiting. First message shown immediately. */
  messages: string[];
  /** Seconds per message. */
  interval?: number;
}

/**
 * "Thinking" indicator: three dots pulsing in sequence with a rotating
 * message. More deliberate than a spinner, signals real work is happening.
 */
export function LoadingPane({ messages, interval = 2.2 }: LoadingPaneProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % messages.length);
    }, interval * 1000);
    return () => clearInterval(id);
  }, [messages.length, interval]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6 py-28"
    >
      <div className="relative flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-ink-900"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.35, 1, 0.35],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.18,
            }}
          />
        ))}
      </div>

      <div className="h-5 overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messages[idx]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-sm text-ink-500"
          >
            {messages[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

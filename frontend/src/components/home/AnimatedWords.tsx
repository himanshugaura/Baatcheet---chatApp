'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const words = ["Talk", "Share", "Enjoy"];

export default function AnimatedWords() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      key={words[currentWordIndex] + currentWordIndex} // Ensure re-animation on each word
      className="inline-block text-amber-600 font-bold"
      initial={{ y: 40, scale: 0.9, opacity: 0 }}
      animate={{ 
        y: 0, 
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 14
        }
      }}
    >
      {words[currentWordIndex]}
    </motion.span>
  );
}

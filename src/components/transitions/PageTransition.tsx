import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, provide gentle fade
  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full min-h-[calc(100vh-5rem)] ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  // 3D Perspective Depth Transition
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.94,
      y: 20,
      rotateX: 4,
      transformPerspective: 1200,
      filter: 'blur(3px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transformPerspective: 1200,
      filter: 'blur(0px)',
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        when: 'beforeChildren',
        staggerChildren: 0.08
      }
    },
    exit: {
      opacity: 0,
      scale: 1.04,
      y: -15,
      rotateX: -3,
      transformPerspective: 1200,
      filter: 'blur(4px)',
      transition: {
        duration: 0.4,
        ease: [0.7, 0, 0.84, 0] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-[calc(100vh-5rem)] preserve-3d will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

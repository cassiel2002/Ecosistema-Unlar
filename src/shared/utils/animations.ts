// Smooth page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as any }
};

// Stagger children
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as any } }
};

// Card hover
export const cardHover = {
  whileHover: { y: -4, scale: 1.01, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

// Smooth reveal from bottom
export const revealUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any }
};

// Fade in with scale
export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: 'easeOut' as any }
};

// Slide in from left
export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as any }
};

// Smooth spring for interactive elements
export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
};

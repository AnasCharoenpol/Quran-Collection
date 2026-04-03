export const ANIMATION_CONFIG = {
  initial: {
    scaleY: 1.15,
  },
  hover: {
    scaleY: 1.3,
  },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10,
    mass: 0.8,
  },
} as const;
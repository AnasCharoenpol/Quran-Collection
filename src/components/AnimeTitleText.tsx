import { motion } from "framer-motion";
import { ANIMATION_CONFIG } from "../lib/constant";
import type { AnimeId, AnimeTitle } from "../lib/types";

type AnimeTitleTextProps = {
  title: AnimeTitle;
  onHover: (id: AnimeId) => void;
  onHoverEnd: () => void;
};

export const AnimeTitleText = ({
  title,
  onHover,
  onHoverEnd,
}: AnimeTitleTextProps) => {
  const handleActivate = () => onHover(title.id);

  return (
    <motion.span
      role="button"
      tabIndex={0}
      className="transition-colors duration-300 hover:text-zinc-500 focus-visible:text-zinc-500 focus-visible:outline-none"
      animate={ANIMATION_CONFIG.initial}
      whileHover={ANIMATION_CONFIG.hover}
      whileFocus={ANIMATION_CONFIG.hover}
      transition={ANIMATION_CONFIG.transition}
      onMouseEnter={handleActivate}
      onMouseMove={handleActivate}
      onMouseLeave={onHoverEnd}
      onFocus={handleActivate}
      onBlur={onHoverEnd}
    >
      {title.displayName}
    </motion.span>
  );
};

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ANIMATION_CONFIG } from "../lib/constant";
import type { Category } from "../lib/types";

type CategoryTitleProps = {
  category: Category;
  onHover: (id: string) => void;
  onHoverEnd: () => void;
};

export const CategoryTitle = ({
  category,
  onHover,
  onHoverEnd,
}: CategoryTitleProps) => {
  const handleActivate = () => onHover(category.id);

  return (
    <Link to={`/category/${category.id}`}>
      <motion.span
        role="button"
        tabIndex={0}
        className="block transition-colors duration-300 hover:text-zinc-500 focus-visible:text-zinc-500 focus-visible:outline-none cursor-pointer"
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
        {category.name}
      </motion.span>
    </Link>
  );
};

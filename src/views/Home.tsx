import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import type { Category } from "../lib/types";

export const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("categories").select("*").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  const handleHover = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  // Pre-calculate fixed offsets for an explosive pop-out effect
  const categoryPlacements = useMemo(() => {
    return categories.map((cat, i) => {
      const angle = i * 137.5 * (Math.PI / 180); 
      // Push them further out so they don't overlap with the big text,
      // and space them appropriately.
      const radius = 300 + (i % 3) * 60; 
      return {
        id: cat.id,
        name: cat.name,
        offsetX: Math.cos(angle) * radius,
        offsetY: Math.sin(angle) * radius,
        delay: i * 0.04,
      };
    });
  }, [categories]);

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden min-h-screen">
      <motion.h1
        className="text-center text-6xl font-black uppercase tracking-widest text-zinc-300 md:text-8xl cursor-pointer transition-colors duration-500 hover:text-white z-20"
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverEnd}
        onClick={() => navigate("/categories")}
        layoutId="app-title"
      >
        Quran
        <br />
        Collection
      </motion.h1>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <AnimatePresence>
          {isHovered &&
            categoryPlacements.map((item) => (
              <motion.div
                key={item.id}
                className="absolute flex items-center justify-center px-8 py-4 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl"
                initial={{
                  scale: 0,
                  opacity: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: item.offsetX,
                  y: item.offsetY,
                }}
                exit={{ 
                  scale: 0, 
                  opacity: 0, 
                  x: 0, 
                  y: 0,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                  delay: item.delay,
                }}
              >
                {/* Independent gentle floating animation for each bubble */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-3xl font-bold tracking-wide text-white whitespace-nowrap drop-shadow-xl">
                    {item.name}
                  </span>
                </motion.div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

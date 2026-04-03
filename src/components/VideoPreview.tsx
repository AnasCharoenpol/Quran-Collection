import { motion } from "framer-motion";
import type { MousePosition, SceneEntry } from "../lib/types";

type VideoPreviewProps = {
  altText: string;
  item: SceneEntry;
  index: number;
  mousePosition: MousePosition;
};

export const VideoPreview = ({
  altText,
  item,
  index,
  mousePosition,
}: VideoPreviewProps) => (
  <motion.div
    className="absolute flex aspect-[9/16] w-48 sm:w-64 items-center justify-center overflow-hidden rounded-xl shadow-xl bg-zinc-900 pointer-events-none"
    initial={{
      scale: 0,
      opacity: 0,
      x: item.offsetX,
      y: item.offsetY,
      rotate: item.rotate,
    }}
    animate={{
      scale: 1,
      opacity: 1,
      x: item.offsetX + (index === 1 ? mousePosition.x / 2 : mousePosition.x),
      y: item.offsetY + mousePosition.y,
      rotate: item.rotate,
    }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 10,
      mass: 0.6,
    }}
  >
    {item.src.includes(".mp4") || item.src.includes(".webm") || item.src.endsWith(".mov") || item.src.startsWith("blob:") ? (
      <video
        src={item.src}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    ) : (
      <img
        src={item.src}
        alt={`Scene from ${altText}`}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    )}
  </motion.div>
);

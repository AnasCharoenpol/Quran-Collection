import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AnimePreview } from "./components/AnimePreview";
import { AnimeTitleText } from "./components/AnimeTitleText";
import { useMobileWarning } from "./hooks/useMobileWarning";
import { useMousePosition } from "./hooks/useMousePosition";
import { ANIME_TITLES } from "./lib/constant";
import { data } from "./lib/data";
import type { AnimeId } from "./lib/types";
import { Toaster } from "sonner";

const App = () => {
  const [hoveredText, setHoveredText] = useState<AnimeId | null>(null);
  const mousePosition = useMousePosition();
  useMobileWarning();

  const clearHover = useCallback(() => setHoveredText(null), []);

  const scenes = hoveredText ? data[hoveredText] : null;

  return (
    <main className="relative flex w-screen flex-col items-center justify-center">
      <h1 className="sr-only">Anime Scene Gallery</h1>
      <Toaster />
      <div className="flex flex-col items-center justify-center gap-4 text-nowrap text-5xl font-black uppercase text-zinc-300 *:cursor-default md:text-7xl">
        {ANIME_TITLES.map((title) => (
          <AnimeTitleText
            key={title.id}
            title={title}
            onHover={setHoveredText}
            onHoverEnd={clearHover}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        {hoveredText
          ? `Showing scenes from ${ANIME_TITLES.find((t) => t.id === hoveredText)?.displayName}`
          : ""}
      </span>

      <AnimatePresence>
        {scenes?.map((item, index) => (
          <AnimePreview
            key={item.src}
            altText={
              ANIME_TITLES.find((t) => t.id === hoveredText)?.displayName ?? ""
            }
            item={item}
            index={index}
            mousePosition={mousePosition}
          />
        ))}
      </AnimatePresence>
    </main>
  );
};

export default App;

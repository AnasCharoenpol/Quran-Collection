import { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft } from "lucide-react";
import { CategoryTitle } from "../components/CategoryTitle";
import { VideoPreview } from "../components/VideoPreview";
import { UploadModal } from "../components/UploadModal";
import { useMousePosition } from "../hooks/useMousePosition";
import { useMobileWarning } from "../hooks/useMobileWarning";
import { supabase } from "../lib/supabase";
import type { Category, Video, SceneEntry } from "../lib/types";

// Mock scenes as fallback for categories with no videos yet
const fallbackScenes: SceneEntry[] = [
  { src: "https://www.w3schools.com/html/mov_bbb.mp4", offsetX: -460, offsetY: -190, rotate: -8 },
  { src: "https://www.w3schools.com/html/mov_bbb.mp4", offsetX: -10, offsetY: -300, rotate: 2 },
  { src: "https://www.w3schools.com/html/mov_bbb.mp4", offsetX: 430, offsetY: -100, rotate: -4 },
];

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryVideos, setCategoryVideos] = useState<Record<string, Video[]>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const mousePosition = useMousePosition();
  useMobileWarning();

  const loadData = async () => {
    try {
      const { data: cats, error: catError } = await supabase.from("categories").select("*").order("name");
      if (catError) throw catError;
      setCategories(cats || []);

      const { data: vids, error: vidError } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
      if (vidError) throw vidError;

      // Group videos by category_id
      const vidsByCat: Record<string, Video[]> = {};
      vids?.forEach((v) => {
        if (!vidsByCat[v.category_id]) vidsByCat[v.category_id] = [];
        vidsByCat[v.category_id].push(v);
      });
      setCategoryVideos(vidsByCat);
    } catch (e) {
      console.error("Error loading categories", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const clearHover = useCallback(() => setHoveredCategory(null), []);

  const getHoverScenes = (catId: string): SceneEntry[] => {
    const vids = categoryVideos[catId];
    if (!vids || vids.length === 0) return fallbackScenes;

    // Use up to 3 videos for the parallax hover effect
    return vids.slice(0, 3).map((v, i) => {
      // Re-use offsets from original data for the visual spread 
      const offsets = [
        { offsetX: -460, offsetY: -190, rotate: -8 },
        { offsetX: -10, offsetY: -300, rotate: 2 },
        { offsetX: 430, offsetY: -100, rotate: -4 },
      ];
      return {
        src: v.video_url,
        offsetX: offsets[i % 3].offsetX,
        offsetY: offsets[i % 3].offsetY,
        rotate: offsets[i % 3].rotate,
      };
    });
  };

  const scenes = hoveredCategory ? getHoverScenes(hoveredCategory) : null;
  const hoveredCategoryName = categories.find(c => c.id === hoveredCategory)?.name ?? "";

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center min-h-screen">
      
      {/* Top Header Navigation */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <Link to="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 font-medium">
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-full transition-all backdrop-blur-md"
        >
          <Plus size={18} />
          <span className="font-semibold text-sm">Add Video</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-zinc-500 text-xl font-medium animate-pulse flex flex-col items-center gap-4">
          <span className="text-center">No categories yet.</span>
          <button onClick={() => setIsModalOpen(true)} className="text-white hover:text-zinc-300 transition-colors text-sm underline underline-offset-4">
            Upload the first video!
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 text-nowrap text-5xl font-black uppercase text-zinc-300 *:cursor-default md:text-7xl z-10">
          {categories.map((cat) => (
            <CategoryTitle
              key={cat.id}
              category={cat}
              onHover={setHoveredCategory}
              onHoverEnd={clearHover}
            />
          ))}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {hoveredCategory ? `Showing scenes from ${hoveredCategoryName}` : ""}
      </span>

      <AnimatePresence>
        {scenes?.map((item, index) => (
          <VideoPreview
            key={item.src + index}
            altText={hoveredCategoryName}
            item={item}
            index={index}
            mousePosition={mousePosition}
          />
        ))}
      </AnimatePresence>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadData}
      />
    </div>
  );
};

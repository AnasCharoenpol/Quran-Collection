import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import type { Category, Video } from "../lib/types";

export const CategoryVideos = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCategoryData(id);
    }
  }, [id]);

  const loadCategoryData = async (categoryId: string) => {
    setLoading(true);
    try {
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();
      
      if (catError) throw catError;
      setCategory(catData);

      const { data: vidData, error: vidError } = await supabase
        .from("videos")
        .select("*")
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });

      if (vidError) throw vidError;
      setVideos(vidData || []);
    } catch (e) {
      console.error("Failed to fetch category videos", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, videoId: string, videoUrl: string) => {
    e.stopPropagation(); // Prevention so it doesn't open the video player
    
    if (!window.confirm("Are you sure you want to permanently delete this video?")) {
      return;
    }

    setIsDeleting(videoId);

    try {
      // Extract the file path out of the public URL string
      // URL format: https://[domain]/storage/v1/object/public/videos/[path]
      const pathParts = videoUrl.split("/videos/");
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        
        // 1. Delete the actual file from Supabase Storage
        const { error: storageError } = await supabase.storage
          .from("videos")
          .remove([filePath]);
          
        if (storageError) throw storageError;
      }

      // 2. Delete the record from the database
      const { error: dbError } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      if (dbError) throw dbError;

      // Update UI state
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      toast.success("Video deleted successfully");
    } catch (error: any) {
      console.error("Error deleting video:", error);
      toast.error(error.message || "Failed to delete video");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-white" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <Link to="/categories" className="text-zinc-400 hover:text-white underline">Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative pt-24 px-6 md:px-12 pb-12">
      <div className="absolute top-0 left-0 w-full p-6 z-10 flex items-center">
        <Link to="/categories" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 font-medium">
          <ArrowLeft size={20} />
          <span>Categories</span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-2 text-white">
          {category.name}
        </h1>
        <p className="text-zinc-500 mb-12 font-medium">
          {videos.length} {videos.length === 1 ? "video" : "videos"} available
        </p>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Play size={48} className="mb-4 opacity-20" />
            <p>No videos in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-colors cursor-pointer ${isDeleting === video.id ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => setPlayingVideoId(video.id)}
              >
                <div className="aspect-[9/16] relative bg-black">
                  <video 
                    src={video.video_url} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => { e.currentTarget.play() }}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 text-white">
                      <Play fill="white" size={24} />
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, video.id, video.video_url)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-black/50 text-zinc-300 hover:text-red-400 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Video"
                  >
                    {isDeleting === video.id ? (
                      <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate text-white" title={video.title}>
                    {video.title}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-xl"
            onClick={() => setPlayingVideoId(null)}
          >
            <div className="w-full h-full max-w-5xl max-h-screen relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute -top-12 right-0 text-white/50 hover:text-white mb-4"
                onClick={() => setPlayingVideoId(null)}
              >
                Close (Esc)
              </button>
              <video 
                src={videos.find(v => v.id === playingVideoId)?.video_url}
                className="w-full h-full max-h-[85vh] rounded-2xl shadow-2xl bg-black outline outline-1 outline-white/10"
                controls
                autoPlay
                playsInline
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

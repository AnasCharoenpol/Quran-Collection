import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import type { Category } from "../lib/types";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const UploadModal = ({ isOpen, onClose, onSuccess }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      if (data) setCategories(data);
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a video file");
    if (!title) return toast.error("Please enter a title");
    if (!categoryId && !newCategoryName) return toast.error("Please select or create a category");
    
    // 20MB file size limit to keep hover animations performant
    if (file.size > 20 * 1024 * 1024) {
      return toast.error("File is too large. Please upload an edited short video under 20MB.");
    }

    setIsUploading(true);

    try {
      let finalCategoryId = categoryId;

      // 1. Create new category if needed
      if (!categoryId && newCategoryName) {
        const { data: newCatData, error: catError } = await supabase
          .from("categories")
          .insert([{ name: newCategoryName }])
          .select()
          .single();

        if (catError) throw catError;
        finalCategoryId = newCatData.id;
      }

      // 2. Upload video file to Supabase storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${finalCategoryId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      // 3. Insert video metadata
      const { error: dbError } = await supabase.from("videos").insert([{
        title,
        category_id: finalCategoryId,
        video_url: publicUrlData.publicUrl,
      }]);

      if (dbError) throw dbError;

      toast.success("Video uploaded successfully!");
      onSuccess();
      onClose();
      // reset form
      setFile(null);
      setTitle("");
      setCategoryId("");
      setNewCategoryName("");
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong during upload");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700/50 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Add Video</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-zinc-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-zinc-800 file:text-zinc-300
                hover:file:bg-zinc-700 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Beautiful Quran Recitation"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                if (e.target.value) setNewCategoryName("");
              }}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 text-white focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 mb-2"
            >
              <option value="">-- Create New Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {!categoryId && (
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                placeholder="New Category Name (e.g. Surah Yaseen)"
                required={!categoryId}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black font-semibold py-3 px-4 mt-6 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-r-transparent" />
            ) : (
              <>
                <Upload size={18} />
                Upload Video
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

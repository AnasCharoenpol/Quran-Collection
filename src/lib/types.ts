export type MousePosition = {
  x: number;
  y: number;
};

export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Video = {
  id: string;
  title: string;
  category_id: string;
  video_url: string;
  created_at: string;
};

// UI Types
export type SceneEntry = {
  src: string;
  offsetX: number;
  offsetY: number;
  rotate: number;
};
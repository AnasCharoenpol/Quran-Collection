# 📖 Quran Collection

An open, global dashboard dedicated to showcasing curated, beautifully edited short Quran videos. Built with a heavy focus on seamless micro-interactions and immersive, physics-based UI, anyone can explore categories or easily upload their own cinematic edits for the world to see!

## 🚀 Technologies Used
- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM (v6)
- **Backend/Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage Buckets
- **Icons**: Lucide React

## ✨ Features
- **Immersive Animations**: Uses advanced `framer-motion` properties to deliver high-performance, physics-based floating text nodes that bloom out smoothly.
- **Hover Previews**: Effortlessly preview videos by hovering over content cards via seamlessly muted HTML5 `<video>` implementations.
- **Open Global Uploading**: A dedicated upload modal integrated directly with Supabase Storage allows seamless video addition and dynamic category creation on the fly.
- **Smart Validation**: File size limits and strict structure handling ensure the database stays highly performant.
- **Full View Playback**: Categorized grid layouts providing clean playback environments with darkened cinematic backdrops.

## 🎞️ Video Preview
*Screenshot or video demonstration coming soon! (Upload a screen recording to a service like YouTube or an Imgur GIF to embed here).*

![Quran Collection Preview Placeholder](https://via.placeholder.com/800x450.png?text=Quran+Collection+Preview)

## 🛠️ The Process
This project initially started as a visual experiment by modifying a static UI codebase (an Anime Scene Gallery clone). 
The goal was to harness the stunning original micro-interactions and transform them into a scalable, dynamic video platform. I replaced the static JSON data files with a full-fledged Supabase integration, refactored the physics animations to prevent rendering bottlenecks, swapped out legacy GIFs for highly optimized MP4 video preview tags, and wired up a custom storage-bucket uploader from scratch.

## 🧠 What I Learned
- **Performance Optimization**: Understanding the cost of mapping React state directly to `framer-motion` events, and refactoring it to use independent CSS-like floating springs to completely eliminate page lag.
- **Supabase Integration**: Mastering Row Level Security (RLS) policies within Supabase to effectively allow safe, public bucket `INSERT` rights without needing complex authentication flows.
- **Dynamic File Handling**: Creating unique identifiers for file uploads on the client side and piping large blobs to a remote bucket effectively.
- **Video Optimization**: Learning why modern MP4 containers out-perform standard GIFs on the web for hover animations.

## 🌱 Overall Growth
Building this application heavily reinforced my ability to quickly adapt existing codebases into fundamentally entirely new products. Connecting a previously isolated frontend securely into a live, cloud-native PostgreSQL architecture significantly sharpened my full-stack web development workflow.

## 🔮 How It Can Be Improved
- **User Authentication**: Integrating GitHub/Google OAuth so users can have profiles, likes, and save their favorite content.
- **Edge Function Formatting**: Automatically compressing videos or deriving static image thumbnails on the remote edge when a user uploads a video to drastically reduce bandwidth costs.
- **Pagination**: Implementing infinite scrolling on the category video grids for when the database inevitably scales to thousands of uploads.

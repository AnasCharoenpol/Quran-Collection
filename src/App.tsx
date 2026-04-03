import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "./views/Home";
import { Categories } from "./views/Categories";
import { CategoryVideos } from "./views/CategoryVideos";

const App = () => {
  return (
    <Router>
      <main className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-black text-white selection:bg-zinc-800">
        <Toaster theme="dark" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:id" element={<CategoryVideos />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

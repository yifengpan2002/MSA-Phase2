import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Forum } from "./pages/Forum";
import { WritePost } from "./pages/WritePost";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Profile } from "./pages/Profile";
import { PostDetail } from "./pages/PostDetail";
import { Daily } from "./pages/DailyReward";
import { Store } from "./pages/Store";
import { Galaxy } from "./pages/Galaxy";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/write" element={<WritePost />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/store" element={<Store />} />
          <Route path="/galaxy" element={<Galaxy />} />
        </Route>
        <Route path="/forum/:id" element={<PostDetail />} />
        <Route path="/users/:username" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

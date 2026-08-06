import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Forum } from "./pages/Forum";
import { WritePost } from "./pages/WritePost";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Profile } from "./pages/Profile";
import { PostDetail } from "./pages/PostDetail";

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
        </Route>
        <Route path="/forum/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Routes, Route } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import LoginPage from "./pages/LoginPage";
import ForumsPage from "./pages/ForumsPage";
import HomePage from "./pages/HomePage";
import CreateAccount from "./pages/CreateAccountPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forums" element={<ForumsPage />} />
      <Route path="/home_page" element={<HomePage />} />
      <Route path="/create_account" element={<CreateAccount />} />
    </Routes>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import LoginPage from "./pages/LoginPage";
import ForumsPage from "./pages/ForumsPage";
import HomePage from "./pages/HomePage";
import CreateAccount from "./pages/CreateAccountPage"
import Account from "./pages/AccountPage";
import { AuthProvider } from "./AuthContext";
import {ForumThreadInfo} from "./ForumThreadContext"

function App() {
  return (
    <AuthProvider>
      <ForumThreadInfo>
        <Routes>
          <Route path="/" element={<PostsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forums" element={<ForumsPage />} />
          <Route path="/home_page" element={<HomePage />} />
          <Route path="/create_account" element={<CreateAccount />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </ForumThreadInfo>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reels from "./pages/Reels";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import MyUploads from "./pages/MyUploads";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Reels" element={<Reels />} />
          <Route path="/reel/:reelId" element={<Reels />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-uploads"
            element={
              <ProtectedRoute>
                <MyUploads />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
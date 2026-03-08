import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import VideoMeet from "./pages/VideoMeet";
import Home from "./pages/home"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            
            {/* The Home page is restricted to logged-in users */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />

            {/* Meeting rooms are namespaced to prevent routing conflicts */}
            {/* Left unprotected so external guests can join via link */}
            <Route path='/room/:url' element={<VideoMeet />} />
            
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
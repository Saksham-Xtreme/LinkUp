import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Check the URL for a token parameter
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // 2. Save it to localStorage (just like your standard login does)
      localStorage.setItem("token", token);

      // 3. Remove the token from the URL for security and a cleaner look
      navigate("/home", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/* Your home page content goes here */}
    </div>
  );
}
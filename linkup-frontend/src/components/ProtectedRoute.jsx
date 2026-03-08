import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if the user has a token saved from logging in
  const token = localStorage.getItem("token");

  // If no token is found, redirect them to the auth page
  if (!token) {
    // 'replace' prevents them from hitting the back button to return to the protected route
    return <Navigate to="/auth" replace />;
  }

  // If they have a token, render the requested page
  return children;
}
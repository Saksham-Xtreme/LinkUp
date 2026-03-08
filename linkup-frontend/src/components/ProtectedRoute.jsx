import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // 1. Check if they already have a saved token
  const localToken = localStorage.getItem("token");

  // 2. Check if Google just sent them back with a token in the URL
  const params = new URLSearchParams(location.search);
  const urlToken = params.get("token");

  // If they have NEITHER, kick them to the login screen
  if (!localToken && !urlToken) {
    return <Navigate to="/auth" replace />;
  }

  // Otherwise, let them through (Home.jsx will handle saving the urlToken)
  return children;
}
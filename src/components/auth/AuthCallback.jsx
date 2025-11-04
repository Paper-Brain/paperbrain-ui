import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from '../../api/authApi.js'; // Import the RTK Query hook
import Loader from "../../util/Loader.jsx";

const AuthCallback = () => {
  const navigate = useNavigate();
  
  // 1. Use the RTK Query hook to check authentication status
  const { 
    data: user, 
    isLoading, 
    isSuccess, 
    isError 
  } = useGetMeQuery();

  useEffect(() => {
    // 2. Navigation logic based on RTK Query state
    if (isSuccess && user) {
      // Authentication successful, user data is available
      navigate("/org-dashboard"); 
    } else if (isError) {
      // Authentication failed (e.g., cookie expired, 401 response)
      console.error("Authentication failed: User data could not be fetched.");
      navigate("/login");
    }
    // We don't navigate when isLoading is true
  }, [isSuccess, isError, user, navigate]);

  if (isLoading) {
    return (
      <div className="text-white h-screen flex items-center justify-center">
       <Loader/> Verifying authentication...
      </div>
    );
  }

  // If loading is done, and we're navigating away, just render null momentarily
  return null;
};

export default AuthCallback;

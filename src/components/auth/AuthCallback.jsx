// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthCallback = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const checkUserAuth = async () => {
//       try {
//         // Make a request to the /users/me endpoint
//         const response = await fetch("https://localhost:8000/api/v1/users/me", {
//           method: "GET",
//           credentials: "include", // important for cookies
//         });

//         if (response.ok) {
//           // If the user is authenticated, navigate to dashboard
//           navigate("/project-dashboard");  // Or use whatever route should go after login
//         } else {
//           // If not authenticated, navigate to login
//           setError("Authentication failed");
//           navigate("/login");
//         }
//       } catch (err) {
//         console.error("Error verifying auth:", err);
//         setError("An error occurred");
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUserAuth();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="text-white h-screen flex items-center justify-center">
//         Verifying authentication...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-white h-screen flex items-center justify-center">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return null;
// };

// export default AuthCallback;

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
      navigate("/project-dashboard"); 
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

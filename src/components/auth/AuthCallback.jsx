import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../api/authApi.js"; 
import Loader from "../../util/Loader.jsx";
import useUserHasOrganization from "../../hooks/useUserHasOrganization.js";

const AuthCallback = () => {
  const navigate = useNavigate();

  // 1. Use the RTK Query hook to check authentication status
  const { data: user, isLoading, isSuccess, isError } = useGetMeQuery();

  const currentUserId = user?.id;
  const hasOrg = useUserHasOrganization(currentUserId);

  useEffect(() => {
    if (isError) {
      console.error("Authentication failed: User data could not be fetched.");
      navigate("/login");
      return;
    }

    // Wait until we know whether user has org (undefined means still loading)
    if (hasOrg === undefined) return;

    if (isSuccess && user && hasOrg) {
      navigate("/organizations");
    } else if (isSuccess && user && !hasOrg) {
      navigate("/create-org");
    } else {
      navigate("/login");
    }
  }, [isSuccess, isError, user, navigate, hasOrg]);

  if (isLoading) {
    return (
      <div className="text-white h-screen flex items-center justify-center">
        <Loader /> Verifying authentication...
      </div>
    );
  }

  // If loading is done, and we're navigating away, just render null momentarily
  return null;
};

export default AuthCallback;

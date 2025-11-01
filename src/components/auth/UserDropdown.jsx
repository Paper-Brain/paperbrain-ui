import { Settings, Moon, Users, LogOut } from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from '../../api/authApi.js';
import Loader from "../../util/Loader.jsx";
import UserAvatar from "../auth/Avatar.jsx";

const UserDropdown = () => {
  // 1. Fetch user data and state from the RTK Query cache
  const { data: user, isLoading, isSuccess } = useGetMeQuery();
  
  // 2. Get the logout mutation function
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // 🗑️ Removed: The getInitials function is no longer needed here.
  // 🗑️ Removed: The initials variable calculation is no longer needed here.

  // Do not render the dropdown if the user is not loaded or not authenticated
  if (isLoading || !isSuccess || !user) {
    return null; 
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // On successful logout, force a redirect to the login page to clear the session
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: If logout request fails (e.g., server down), still redirect the user
      window.location.href = '/login';
    }
  };

  return (
    <div className="absolute -right-6 mt-80 w-80 bg-[#0A0A0A] rounded-lg border border-white/10 backdrop-blur-md py-1 z-10">
      <div className="flex flex-row px-4 py-2 border-b border-white/10">
        
        {/* 🚀 Replaced: Use the dedicated UserAvatar component */}
        <UserAvatar 
          user={user} 
          // Match the original look (w-20 h-20) and add rounded-lg for aesthetics
          sizeClass="w-20 h-20 rounded-lg" 
        />
        
        {/* User Details */}
        <div className="flex flex-col p-4">
          <div className="font-thin tracking-wide text-xl text-white">
            {user.name}
          </div>
          <div className="text-sm text-gray-400 font-extralight">
            {user.email}
          </div>
        </div>
      </div>
      
      <button
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors duration-300 font-extralight"
      >
        <Settings size={18} className="text-violet-400" />
        Account settings
      </button>
      
      <button
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors duration-300 font-extralight"
      >
        <Moon size={18} className="text-violet-400" />
        Theme
      </button>
      
      <div className="border-t border-white/10">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors duration-300 font-extralight"
        >
          <Users size={18} className="text-violet-400" />
          Switch account
        </button>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors duration-300 font-extralight disabled:opacity-50"
        >
          <LogOut size={18} className="text-violet-400" />
          {isLoggingOut ? <Loader /> : 'Log out'}
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;

import { Settings, Moon, Users, LogOut } from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from '../../api/authApi.js';
import Loader from "../../util/Loader.jsx";
import UserAvatar from "../auth/Avatar.jsx";
import logger from "../../util/logger.js";

/**
 * Small presentational component for user information.
 * Keeps UserDropdown focused on state handling.
 */
const UserInfo = ({ user }) => (
  <div className="flex flex-row px-4 py-2 border-b border-white/10">
    <UserAvatar user={user} sizeClass="w-20 h-20 rounded-lg" />
    <div className="flex flex-col p-4">
      <div className="font-thin tracking-wide text-xl text-white">{user.name}</div>
      <div className="text-sm text-gray-400 font-extralight">{user.email}</div>
    </div>
  </div>
);

/**
 * Reusable button component with consistent styling.
 * Accepts optional `disabled` and `onClick` props.
 */
const DropdownButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors duration-300 font-extralight ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {children}
  </button>
);

/**
 * Handles logout safely, ensuring any failure still redirects the user.
 */
const useHandleLogout = () => {
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      // Log the error without exposing sensitive details.
      logger.error("Logout failed", { code: error?.code });
    } finally {
      // Use replace to avoid adding an entry to the browser history.
      window.location.replace("/login");
    }
  };

  return { handleLogout, isLoggingOut };
};

/**
 * Main dropdown component – now thin and focused on composition.
 */
const UserDropdown = () => {
  const { data: user, isLoading, isSuccess } = useGetMeQuery();
  const { handleLogout, isLoggingOut } = useHandleLogout();

  // Do not render the dropdown if the user is not loaded or not authenticated
  if (isLoading || !isSuccess || !user) {
    return null;
  }

  return (
    <div className="absolute -right-6 mt-80 w-80 bg-[#0A0A0A] rounded-lg border border-white/10 backdrop-blur-md py-1 z-10">
      <UserInfo user={user} />

      <DropdownButton>
        <Settings size={18} className="text-violet-400" />
        Account settings
      </DropdownButton>

      <DropdownButton>
        <Moon size={18} className="text-violet-400" />
        Theme
      </DropdownButton>

      <div className="border-t border-white/10">
        <DropdownButton>
          <Users size={18} className="text-violet-400" />
          Switch account
        </DropdownButton>

        <DropdownButton onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut size={18} className="text-violet-400" />
          {isLoggingOut ? <Loader /> : "Log out"}
        </DropdownButton>
      </div>
    </div>
  );
};

export default UserDropdown;

import { Settings, Moon, Users, LogOut } from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from '../../api/authApi.js';
import Loader from "../../util/Loader.jsx";
import UserAvatar from "../auth/Avatar.jsx";

const baseButtonClassName = (
  "flex items-center gap-3 w-full px-4 py-3 text-sm "
  "text-gray-400 hover:bg-white/5 transition-colors duration-300 font-extralight"
);

const UserDropdown = () => {
  const { data: user, isLoading, isSuccess } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  if (isLoading || !isSuccess || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <div className="absolute -right-6 mt-80 w-80 bg-[#0A0A0A] rounded-lg border border-white/10 backdrop-blur-md py-1 z-10">
      <UserHeader user={user} />
      <MenuButton icon={<Settings size={18} className="text-violet-400" />}>
        Account settings
      </MenuButton>
      <MenuButton icon={<Moon size={18} className="text-violet-400" />}>
        Theme
      </MenuButton>
      <div className="border-t border-white/10">
        <MenuButton icon={<Users size={18} className="text-violet-400" />}>
          Switch account
        </MenuButton>
        <MenuButton
          icon={<LogOut size={18} className="text-violet-400" />}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? <Loader /> : 'Log out'}
        </MenuButton>
      </div>
    </div>
  );
};

const UserHeader = ({ user }) => (
  <div className="flex flex-row px-4 py-2 border-b border-white/10">
    <UserAvatar user={user} sizeClass="w-20 h-20 rounded-lg" />
    <div className="flex flex-col p-4">
      <div className="font-thin tracking-wide text-xl text-white">
        {user.name}
      </div>
      <div className="text-sm text-gray-400 font-extralight">
        {user.email}
      </div>
    </div>
  </div>
);

const MenuButton = ({ icon, children, onClick, disabled, className = baseButtonClassName }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${className} ${disabled ? 'disabled:opacity-50' : ''}`}
  >
    {icon}
    {children}
  </button>
);

export default UserDropdown;
>

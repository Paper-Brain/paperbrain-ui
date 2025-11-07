import React from "react";
import { AlignLeft, X, Moon } from "lucide-react";
import UserAvatar from "../../../auth/Avatar.jsx";
import UserDropdown from "../../../auth/UserDropdown.jsx";

/**
 * Header
 * Props:
 *  - onToggleSidebar()  (toggles mobile sidebar)
 *  - isMobileMenuOpen (boolean)
 *  - selectedOrgName (string)
 *  - user (object)
 */
const Header = ({ onToggleSidebar, isMobileMenuOpen, selectedOrgName, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="p-4 border-b border-white/10 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* toggle only shown on mobile */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-white/5 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-violet-400" />
          ) : (
            <AlignLeft className="w-6 h-6 text-violet-400" />
          )}
        </button>

        <h2 className="text-lg font-semibold text-violet-300">{selectedOrgName}</h2>
      </div>

      <div className="flex gap-2">
        <button className="p-2 border border-white/10 hover:bg-white/5 transition-colors">
          <Moon className="w-5 h-5 text-violet-400" />
        </button>
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <UserAvatar user={user} sizeClass="w-10 h-10 cursor-pointer " />
          {isDropdownOpen && <UserDropdown />}
        </div>
      </div>
    </header>
  );
};

export default Header;

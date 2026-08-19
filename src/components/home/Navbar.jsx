import { useState, useEffect } from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from '../../api/authApi.js';
import UserDropdown from '../auth/UserDropdown.jsx';
import UserAvatar from '../auth/Avatar.jsx';

// Extracted constants for better maintainability
const NAV_ITEMS = ["FEATURES", "SOLUTIONS", "ENTERPRISE", "PRICING"];

const NAV_LINK_CLASSES =
  "text-sm font-extralight tracking-widest hover:text-violet-400 " +
  "transition-colors duration-300 relative group";

const NAV_UNDERLINE_CLASSES =
  "absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r " +
  "from-purple-400 to-yellow-300 transition-all duration-300 group-hover:w-full";

const GET_ACCESS_LABEL_CLASSES =
  "relative z-10 text-sm tracking-widest font-extralight " +
  "transition-colors duration-300 group-hover:text-black";

const GET_ACCESS_HOVER_CLASSES =
  "absolute inset-0 bg-gradient-to-r from-purple-400 to-yellow-300 " +
  "text-blue-800 translate-y-full transition-transform duration-300 " +
  "group-hover:translate-y-0";

// Sub-components for better separation of concerns
const NavLink = ({ item }) => (
  <a
    key={item}
    href={item.toLowerCase()}
    className={NAV_LINK_CLASSES}
  >
    {item}
    <span className={NAV_UNDERLINE_CLASSES} />
  </a>
);

const MobileNavLink = ({ item, onClick }) => (
  <a
    key={item}
    onClick={onClick}
    href={item.toLowerCase()}
    className="block text-sm tracking-widest font-extralight " +
      "hover:text-violet-400 transition-colors duration-300"
  >
    {item}
  </a>
);

const GetAccessButton = ({ onClick, fullWidth = false }) => (
  <button
    onClick={onClick}
    className={`relative px-8 py-3 overflow-hidden group bg-transparent ${
      fullWidth ? "w-full text-left mt-4" : ""
    }`}
  >
    <span className={GET_ACCESS_LABEL_CLASSES}>GET ACCESS</span>
    <span className={GET_ACCESS_HOVER_CLASSES} />
  </button>
);

const UserSection = ({ user, isDropdownOpen, setIsDropdownOpen }) => (
  <div
    className="relative flex items-center justify-center"
    onMouseEnter={() => setIsDropdownOpen(true)}
    onMouseLeave={() => setIsDropdownOpen(false)}
  >
    <UserAvatar
      user={user}
      sizeClass="w-10 h-10 cursor-pointer"
    />
    {isDropdownOpen && <UserDropdown />}
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { data: user, isSuccess } = useGetMeQuery();
  const isAuthenticated = isSuccess && !!user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetAccess = () => {
    navigate("/login");
  };

  const handleMobileMenuClose = () => {
    setIsMenuOpen(false);
  };

  const navClasses = scrolled
    ? "bg-black/80 backdrop-blur-md"
    : "bg-transparent";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/">
              <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent">
                PaperBrain<span className="text-violet-400">°</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation & Auth Check */}
          <div className="hidden md:flex items-center space-x-12">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item} item={item} />
            ))}

            {isAuthenticated ? (
              <UserSection
                user={user}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
              />
            ) : (
              <GetAccessButton onClick={handleGetAccess} />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <EllipsisVertical className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden min-h-screen bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="px-6 py-8 space-y-6">
            {NAV_ITEMS.map((item) => (
              <MobileNavLink
                key={item}
                item={item}
                onClick={handleMobileMenuClose}
              />
            ))}
            {!isAuthenticated && (
              <GetAccessButton
                onClick={() => {
                  handleGetAccess();
                  setIsMenuOpen(false);
                }}
                fullWidth
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

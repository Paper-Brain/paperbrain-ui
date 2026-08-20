import { useState, useEffect, useCallback } from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../api/authApi.js";
import UserDropdown from "../auth/UserDropdown.jsx";
import UserAvatar from "../auth/Avatar.jsx";

// ============================================
// CONSTANTS
// ============================================
const NAV_ITEMS = ["FEATURES", "SOLUTIONS", "ENTERPRISE", "PRICING"];
const SCROLL_THRESHOLD = 20;

const CLASSES = {
  navLink: "text-sm font-extralight tracking-widest hover:text-violet-400 transition-colors duration-300 relative group",
  navUnderline: "absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-yellow-300 transition-all duration-300 group-hover:w-full",
  getAccessLabel: "relative z-10 text-sm tracking-widest font-extralight transition-colors duration-300 group-hover:text-black",
    getAccessHover: [
      "absolute inset-0",
      "bg-gradient-to-r from-purple-400 to-yellow-300",
      "text-blue-800",
      "translate-y-full transition-transform duration-300",
      "group-hover:translate-y-0"
    ].join(" "),
  mobileNavLink: "block text-sm tracking-widest font-extralight hover:text-violet-400 transition-colors duration-300",
  navScrolled: "bg-black/80 backdrop-blur-md",
  navTransparent: "bg-transparent",
};

// ============================================
// PURE FUNCTIONAL COMPONENTS
// ============================================
const Logo = () => (
  <a href="/">
    <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent">
      PaperBrain<span className="text-violet-400">°</span>
    </span>
  </a>
);

const NavLinkItem = ({ item }) => (
  <a href={item.toLowerCase()} className={CLASSES.navLink}>
    {item}
    <span className={CLASSES.navUnderline} />
  </a>
);

const MobileNavLinkItem = ({ item, onClick }) => (
  <a href={item.toLowerCase()} onClick={onClick} className={CLASSES.mobileNavLink}>
    {item}
  </a>
);

const GetAccessButton = ({ onClick, fullWidth = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative px-8 py-3 overflow-hidden group bg-transparent ${fullWidth ? "w-full text-left mt-4" : ""}`}
  >
    <span className={CLASSES.getAccessLabel}>GET ACCESS</span>
    <span className={CLASSES.getAccessHover} />
  </button>
);

const UserSection = ({ user, setIsDropdownOpen }) => (
  <div
    className="relative flex items-center justify-center"
    onMouseEnter={() => setIsDropdownOpen(true)}
    onMouseLeave={() => setIsDropdownOpen(false)}
  >
    <UserAvatar user={user} sizeClass="w-10 h-10 cursor-pointer" />
  </div>
);

const MobileMenuToggle = ({ isOpen, onToggle }) => (
  <div className="md:hidden">
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        <EllipsisVertical className="w-6 h-6 text-white" />
      )}
    </button>
  </div>
);

const DesktopNav = ({ navItems, isAuthenticated, user, isDropdownOpen, setIsDropdownOpen, onGetAccess }) => (
  <div className="hidden md:flex items-center space-x-12">
    {navItems.map((item) => (
      <NavLinkItem key={item} item={item} />
    ))}

    {isAuthenticated ? (
      <UserSection user={user} setIsDropdownOpen={setIsDropdownOpen} />
    ) : (
      <GetAccessButton onClick={onGetAccess} />
    )}
  </div>
);

const MobileMenuContent = ({ isOpen, navItems, isAuthenticated, onGetAccess, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden min-h-screen bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="px-6 py-8 space-y-6">
        {navItems.map((item) => (
          <MobileNavLinkItem key={item} item={item} onClick={onClose} />
        ))}
        {!isAuthenticated && (
          <GetAccessButton onClick={onGetAccess} fullWidth />
        )}
      </div>
    </div>
  );
};

// ============================================
// CUSTOM HOOKS
// ============================================
const useScrollState = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
};

// ============================================
// MAIN COMPONENT
// ============================================
const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrolled = useScrollState();

  const { data: user, isSuccess } = useGetMeQuery();
  const isAuthenticated = isSuccess && !!user;

  const handleGetAccess = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const navContainerClasses = scrolled ? CLASSES.navScrolled : CLASSES.navTransparent;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${navContainerClasses}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center">
            <Logo />
          </div>

          <DesktopNav
            navItems={NAV_ITEMS}
            isAuthenticated={isAuthenticated}
            user={user}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            onGetAccess={handleGetAccess}
          />

          <MobileMenuToggle isOpen={isMenuOpen} onToggle={handleMobileMenuToggle} />
        </div>
      </div>

      <MobileMenuContent
        isOpen={isMenuOpen}
        navItems={NAV_ITEMS}
        isAuthenticated={isAuthenticated}
        onGetAccess={() => {
          handleGetAccess();
          setIsMenuOpen(false);
        }}
        onClose={handleMobileMenuClose}
      />
    </nav>
  );
};

export default Navbar;
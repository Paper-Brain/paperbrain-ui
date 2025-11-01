import { useState, useEffect } from "react";
import { EllipsisVertical, Loader, X } from "lucide-react";
// import Loader from "../../util/Loader.jsx";
import { useGetMeQuery } from '../../api/authApi.js'; 
import UserDropdown from '../auth/UserDropdown.jsx'; 
import UserAvatar from '../auth/Avatar.jsx'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  // 3. Fetch user data from the global RTK cache
  const { data: user, isSuccess, isLoading } = useGetMeQuery();
  const isAuthenticated = isSuccess && !!user; 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // The mouse move listener is not directly used for the navbar functionality
    // but is kept for consistency with your original code.
    const handleMouseMove = (e) => {
      // Original logic for mouse position, kept for continuity
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleGetAccess = () => {
    navigate("/login");
  };

  // Skip rendering the user section if data is still loading
  if (isLoading) {
    // <Loader />; 
  }

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
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
              {["FEATURES", "SOLUTIONS", "ENTERPRISE", "PRICING"].map(
                (item) => (
                  <a
                    key={item}
                    href={`${item.toLowerCase()}`}
                    className="text-sm font-extralight tracking-widest hover:text-violet-400 transition-colors duration-300 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-yellow-300 transition-all duration-300 group-hover:w-full" />
                  </a>
                )
              )}
              
              {/* 4. Conditional Rendering: Avatar or Get Access */}
              {isAuthenticated ? (
                // If authenticated: Show Avatar with Dropdown on hover
                <div 
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <UserAvatar 
                    user={user} 
                    sizeClass="w-10 h-10 cursor-pointer " 
                  />
                  {isDropdownOpen && <UserDropdown/>}
                </div>
              ) : (
                // If NOT authenticated: Show GET ACCESS button
                <button
                  onClick={handleGetAccess}
                  className="relative px-8 py-3 overflow-hidden group bg-transparent"
                >
                  <span className="relative z-10 text-sm tracking-widest font-extralight transition-colors duration-300 group-hover:text-black">
                    GET ACCESS
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-yellow-300 text-blue-800 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" /> // Changed to X icon for better UX
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
              {["FEATURES", "SOLUTIONS", "ENTERPRISE", "PRICING"].map(
                (item) => (
                  <a
                    key={item}
                    onClick={() => setIsMenuOpen(false)} // Close menu on click
                    href={`${item.toLowerCase()}`}
                    className="block text-sm tracking-widest font-extralight hover:text-violet-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                )
              )}
              {/* 5. Conditional Rendering: Show GET ACCESS in mobile menu if not authenticated */}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    handleGetAccess();
                    setIsMenuOpen(false);
                  }}
                  className="w-full relative px-8 py-3 mt-4 overflow-hidden group bg-transparent text-left"
                >
                   <span className="relative z-10 text-sm tracking-widest font-extralight transition-colors duration-300 group-hover:text-black">
                    GET ACCESS
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-yellow-300 text-blue-800 transition-transform duration-300 translate-y-full group-hover:translate-y-0" />
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

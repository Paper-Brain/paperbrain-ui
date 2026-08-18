import { useState, useEffect } from "react";
import {
  ChevronRight,
  Plus,
  Layout,
  FileText,
  LayoutDashboard,
  Book,
  Trello,
  GitFork,
  Building2,
  Building,
  Package,
  Settings,
  Search,
  Bell, 
  Settings as SettingsIcon, 
  AlignLeft,  
  X,
} from "lucide-react";
import { useGetMeQuery } from '../../../api/authApi.js';
import UserDropdown from '../../auth/UserDropdown.jsx';
import UserAvatar from '../../auth/Avatar.jsx'; 
import Sidebar from './Sidebar.jsx';
import TopNavigation from './TopNavigation.jsx';
import MainContent from './MainContent.jsx';

const ProjectDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: user, isSuccess } = useGetMeQuery();
  const isAuthenticated = isSuccess && !!user;

  useEffect(() => {
    const handleScroll = () => {
      // setScrolled(window.scrollY > 20); // Removed unused setScrolled
    };

    const handleMouseMove = () => {
      // Original logic for mouse position, kept for continuity
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 w-full">
        <TopNavigation
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={toggleMobileMenu}
          isDropdownOpen={isDropdownOpen}
          onDropdownChange={setIsDropdownOpen}
          user={user}
        />
        <MainContent currentPage={currentPage} />
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectDashboard;
>
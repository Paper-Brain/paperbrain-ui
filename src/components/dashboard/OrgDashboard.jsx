import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AlignLeft, X, Moon } from "lucide-react";
import UserAvatar from "../auth/Avatar";
import UserDropdown from "../auth/UserDropdown.jsx";
import { useGetMeQuery } from "../../api/authApi.js";
import SprintWidget from "../dashboard/Widgets/SprintWidget.jsx";
import BurnChartWidget from "../dashboard/Widgets/BurnChartWidget.jsx";
import RecentUpdatesWidget from "../dashboard/Widgets/RecentUpdatesWidget.jsx";

const initialWidgets = [
  { id: 1, type: "sprint", title: "Sprint Progress", content: { progress: 65 } },
  { id: 2, type: "burn", title: "Burn Down Chart" },
  { id: 3, type: "updates", title: "Recent Updates", content: { items: 65 } },
];


const DraggableWidget = ({ id, children, onMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: "widget",
    hover(item) {
      if (item.id !== id) {
        onMove(item.id, id);
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-[#0A0A0A] rounded-lg p-4 border border-white/10 backdrop-blur-md ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
};

const OrgDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [widgets, setWidgets] = useState(initialWidgets);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: user, isSuccess } = useGetMeQuery();
  const isAuthenticated = isSuccess && !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMove = (fromId, toId) => {
    const fromIndex = widgets.findIndex((w) => w.id === fromId);
    const toIndex = widgets.findIndex((w) => w.id === toId);
    const newWidgets = [...widgets];
    newWidgets.splice(toIndex, 0, newWidgets.splice(fromIndex, 1)[0]);
    setWidgets(newWidgets);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] border-r border-white/10 z-40
          transform transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-0`}
      >
        <div className="p-4">
          <div className="flex items-center">
            <a href="/">
              <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent">
                PaperBrain<span className="text-violet-400">°</span>
              </span>
            </a>
          </div>
          {/* Add menu items here */}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 ">
        {/* Header */}
        <header className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Show toggle only on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-violet-400" />
              ) : (
                <AlignLeft className="w-6 h-6 text-violet-400" />
              )}
            </button>            
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

        {/* Widgets */}
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {widgets.map((widget) => (
              <DraggableWidget key={widget.id} id={widget.id} onMove={handleMove}>
                <div className="h-64">
                  <h3 className="text-lg font-thin mb-4 border-b border-white/10 pb-2">
                    {widget.title}
                  </h3>

                  {widget.type === "sprint" && (
                    <SprintWidget progress={widget.content.progress} />
                  )}

                  {widget.type === "burn" && <BurnChartWidget />}

                  {widget.type === "updates" && <RecentUpdatesWidget />}
                </div>
              </DraggableWidget>
            ))}
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default OrgDashboard;

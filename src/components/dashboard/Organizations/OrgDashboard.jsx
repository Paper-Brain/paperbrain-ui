import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../Organizations/Layout/Sidebar.jsx";
import Header from "../Organizations/Layout/Header";
import WidgetsGrid from "../Organizations/Layout/WidgetsGrid";
import OrganizationSettingsModal from "../Organizations/Modals/OrganizationSettingsModal";
import SprintWidget from "../../dashboard/Widgets/SprintWidget.jsx";
import BurnChartWidget from "../../dashboard/Widgets/BurnChartWidget.jsx";
import RecentUpdatesWidget from "../../dashboard/Widgets/RecentUpdatesWidget.jsx";

import { useGetMeQuery } from "../../../api/authApi.js";
import { useGetOrganizationsByUserIdQuery } from "../../../api/orgApi.js";
import CreateOrganizationModal from "./Modals/CreateOrganizationModal.jsx";

const initialWidgets = [
  { id: 1, type: "sprint", title: "Sprint Progress", content: { progress: 65 } },
  { id: 2, type: "burn", title: "Burn Down Chart" },
  { id: 3, type: "updates", title: "Recent Updates", content: { items: 65 } },
];

/**
 * Renders a single widget based on its type.
 * Extracted to reduce cyclomatic complexity in the main component.
 */
const renderWidget = useCallback((widget) => {
  switch (widget.type) {
    case "sprint":
      return <SprintWidget key={widget.id} progress={widget.content?.progress ?? 0} />;
    case "burn":
      return <BurnChartWidget key={widget.id} />;
    case "updates":
      return <RecentUpdatesWidget key={widget.id} />;
    default:
      return null;
  }
}, []);

/**
 * Handles widget reordering via drag-and-drop.
 * Pure function for testability and separation of concerns.
 */
const moveWidget = useCallback((widgets, fromId, toId) => {
  const fromIndex = widgets.findIndex((w) => w.id === fromId);
  const toIndex = widgets.findIndex((w) => w.id === toId);
  
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return widgets;
  }
  
  const newWidgets = [...widgets];
  const [removed] = newWidgets.splice(fromIndex, 1);
  newWidgets.splice(toIndex, 0, removed);
  return newWidgets;
}, []);

/**
 * Error state component for failed organization loading.
 * Separated for single responsibility and cleaner main render.
 */
const OrganizationsError = () => (
  <div className="min-h-screen flex items-center justify-center text-red-500" role="alert">
    Failed to load organizations. Please try again later.
  </div>
);

/**
 * Main dashboard content area (header + widget grid).
 * Extracted to reduce nesting and improve readability.
 */
const DashboardContent = ({ 
  user, 
  selectedOrg, 
  widgets, 
  onMove, 
  isMobileMenuOpen, 
  onToggleSidebar 
}) => (
  <div className="flex-1">
    <Header
      onToggleSidebar={onToggleSidebar}
      isMobileMenuOpen={isMobileMenuOpen}
      selectedOrgName={selectedOrg?.name || "No Organization"}
      user={user}
    />
    <WidgetsGrid widgets={widgets} onMove={onMove} renderWidget={renderWidget} />
  </div>
);

/**
 * Mobile sidebar overlay component.
 * Extracted for separation of concerns.
 */
const MobileOverlay = ({ isOpen, onClose }) => (
  isOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-30 md:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  )
);

/**
 * Custom hook encapsulating all stateful logic for OrgDashboard.
 * Improves readability, testability and adheres to the Single Responsibility Principle.
 */
const useOrgDashboard = () => {
  // 1. Authenticated user
  const { data: user } = useGetMeQuery();
  const currentUserId = user?.id;

  // 2. Fetch organizations for that user
  const {
    data: organizations = [],
    isLoading: isOrgsLoading,
    isError: isOrgsError,
  } = useGetOrganizationsByUserIdQuery(currentUserId, { skip: !currentUserId });

  // 3. UI states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [widgets, setWidgets] = useState(initialWidgets);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  // 4. Automatically select the first organization once data is loaded
  useEffect(() => {
    if (!isOrgsLoading && organizations.length > 0 && !selectedOrg) {
      setSelectedOrg(organizations[0]);
    }
  }, [organizations, isOrgsLoading, selectedOrg]);

  // 5. Handle drag movement - wrapped in useCallback for stable reference
  const handleMove = useCallback((fromId, toId) => {
    setWidgets((current) => moveWidget(current, fromId, toId));
  }, []);

  // Memoize sidebar props to prevent unnecessary re-renders
  const sidebarProps = useMemo(() => ({
    organizations,
    selectedOrg,
    onSelectOrg: setSelectedOrg,
    onCreateOrg: () => setIsCreateOrgOpen(true),
    onOpenSettings: () => setIsSettingsOpen(true),
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  }), [organizations, selectedOrg, isMobileMenuOpen]);

  // Memoize content props
  const contentProps = useMemo(() => ({
    user,
    selectedOrg,
    widgets,
    onMove: handleMove,
    isMobileMenuOpen,
    onToggleSidebar: () => setIsMobileMenuOpen((prev) => !prev),
  }), [user, selectedOrg, widgets, handleMove, isMobileMenuOpen]);

  return {
    isOrgsError,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    sidebarProps,
    contentProps,
    isSettingsOpen,
    setIsSettingsOpen,
    isCreateOrgOpen,
    setIsCreateOrgOpen,
    selectedOrg,
  };
};

/**
 * Thin wrapper component that delegates all logic to useOrgDashboard.
 * This keeps the render layer simple and focused solely on UI composition.
 */
const OrgDashboard = () => {
  const {
    isOrgsError,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    sidebarProps,
    contentProps,
    isSettingsOpen,
    setIsSettingsOpen,
    isCreateOrgOpen,
    setIsCreateOrgOpen,
    selectedOrg,
  } = useOrgDashboard();

  // Early return for error state
  if (isOrgsError) {
    return <OrganizationsError />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <Sidebar {...sidebarProps} />

      {/* Overlay (mobile) */}
      <MobileOverlay isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main content */}
      <DashboardContent {...contentProps} />

      {/* Settings Modal */}
      <OrganizationSettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedOrg={selectedOrg}
      />

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={isCreateOrgOpen}
        onClose={() => setIsCreateOrgOpen(false)}
      />
    </div>
  );
};

export default OrgDashboard;

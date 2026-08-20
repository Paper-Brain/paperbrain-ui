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
 * Fetches and returns authenticated user data.
 * Single responsibility: user authentication state.
 */
const useUserData = () => {
  const { data: user } = useGetMeQuery();
  return { user, currentUserId: user?.id };
};

/**
 * Fetches organizations for a given user ID.
 * Single responsibility: organization data retrieval.
 */
const useOrganizationData = (currentUserId) => {
  const {
    data: organizations = [],
    isLoading: isOrgsLoading,
    isError: isOrgsError,
  } = useGetOrganizationsByUserIdQuery(currentUserId, { skip: !currentUserId });

  return { organizations, isOrgsLoading, isOrgsError };
};

/**
 * Manages organization selection logic.
 * Automatically selects the first org when data loads.
 * Single responsibility: organization selection state.
 */
const useOrgsSelection = (organizations, isOrgsLoading) => {
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    if (!isOrgsLoading && organizations.length > 0 && !selectedOrg) {
      setSelectedOrg(organizations[0]);
    }
  }, [organizations, isOrgsLoading, selectedOrg]);

  return { selectedOrg, setSelectedOrg };
};

/**
 * Manages widget drag-and-drop state.
 * Single responsibility: widget reordering logic.
 */
const useWidgetDragHandler = (widgets, setWidgets) => {
  const handleMove = useCallback((fromId, toId) => {
    setWidgets((current) => moveWidget(current, fromId, toId));
  }, [setWidgets]);

  return { handleMove };
};

/**
 * Main dashboard hook - orchestrates all sub-hooks and UI state.
 * Returns organized props for child components.
 */
const useOrgDashboard = () => {
  // 1. User data
  const { user, currentUserId } = useUserData();

  // 2. Organization data
  const { organizations, isOrgsLoading, isOrgsError } = useOrganizationData(currentUserId);

  // 3. UI states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [widgets, setWidgets] = useState(initialWidgets);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  // 4. Selection and drag handlers (extracted for single responsibility)
  const { selectedOrg, setSelectedOrg } = useOrgsSelection(organizations, isOrgsLoading);
  const { handleMove } = useWidgetDragHandler(widgets, setWidgets);

  // 5. Memoized props (computed after all state is defined)
  const sidebarProps = useMemo(() => ({
    organizations,
    selectedOrg,
    onSelectOrg: setSelectedOrg,
    onCreateOrg: () => setIsCreateOrgOpen(true),
    onOpenSettings: () => setIsSettingsOpen(true),
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  }), [organizations, selectedOrg, isMobileMenuOpen]);

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
 * Smart container component that orchestrates data fetching and state management
 * via the `useOrgDashboard` hook. It delegates UI rendering to the `OrgDashboardUI`
 * presentation component, adhering to the Single Responsibility Principle and
 * keeping the render layer focused solely on UI composition.
 */
const OrgDashboard = () => {
  const dashboardState = useOrgDashboard();
  return <OrgDashboardUI {...dashboardState} />;
};


/**
 * Presentation component focused solely on UI composition.
 * Receives a single props object containing all dashboard state.
 *
 * @param {object} props - Pre‑computed dashboard state.
 * @param {boolean} props.isOrgsError
 * @param {boolean} props.isMobileMenuOpen
 * @param {function} props.setIsMobileMenuOpen
 * @param {object} props.sidebarProps
 * @param {object} props.contentProps
 * @param {boolean} props.isSettingsOpen
 * @param {function} props.setIsSettingsOpen
 * @param {boolean} props.isCreateOrgOpen
 * @param {function} props.setIsCreateOrgOpen
 * @param {object} props.selectedOrg
 */
const OrgDashboardUI = (props) => {
  // Render error state if organizations fail to load
  if (props.isOrgsError) {
    return <OrganizationsError />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <Sidebar {...props.sidebarProps} />

      {/* Overlay (mobile) */}
      <MobileOverlay isOpen={props.isMobileMenuOpen} onClose={() => props.setIsMobileMenuOpen(false)} />

      {/* Main content */}
      <DashboardContent {...props.contentProps} />

      {/* Settings Modal */}
      <OrganizationSettingsModal
        open={props.isSettingsOpen}
        onClose={() => props.setIsSettingsOpen(false)}
        selectedOrg={props.selectedOrg}
      />

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={props.isCreateOrgOpen}
        onClose={() => props.setIsCreateOrgOpen(false)}
      />
    </div>
  );
};

export default OrgDashboard;

import { useState, useEffect } from "react";
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

const OrgDashboard = () => {
  // 1. Authenticated user
  const { data: user, } = useGetMeQuery();
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
  }, [organizations, isOrgsLoading]);

  // 5. Handle drag movement
  const handleMove = (fromId, toId) => {
    const fromIndex = widgets.findIndex((w) => w.id === fromId);
    const toIndex = widgets.findIndex((w) => w.id === toId);
    const newWidgets = [...widgets];
    newWidgets.splice(toIndex, 0, newWidgets.splice(fromIndex, 1)[0]);
    setWidgets(newWidgets);
  };

 
  if (isOrgsError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load organizations.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <Sidebar
        organizations={organizations}
        selectedOrg={selectedOrg}
        onSelectOrg={(org) => setSelectedOrg(org)}
        onCreateOrg={() => setIsCreateOrgOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Overlay (mobile) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1">
        <Header
          onToggleSidebar={() => setIsMobileMenuOpen((s) => !s)}
          isMobileMenuOpen={isMobileMenuOpen}
          selectedOrgName={selectedOrg?.name || "No Organization"}
          user={user}
        />

        <WidgetsGrid widgets={widgets} onMove={handleMove}>
          {(widget) => {
            if (widget.type === "sprint")
              return <SprintWidget progress={widget.content.progress} />;
            if (widget.type === "burn") return <BurnChartWidget />;
            if (widget.type === "updates") return <RecentUpdatesWidget />;
            return null;
          }}
        </WidgetsGrid>
      </div>

      {/* Settings Modal */}
      <OrganizationSettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedOrg={selectedOrg}
      />
      {/* New Organizationmodal Modal */}
<CreateOrganizationModal
className="mt-16"
open={isCreateOrgOpen}
onClose={() => setIsCreateOrgOpen(false)}
/>
    </div>
  );
};

export default OrgDashboard;

import { Plus, Settings } from "lucide-react";
import { memo, useCallback } from "react";

/**
 * Sidebar
 * Props:
 *  - organizations: array of {id, name}
 *  - selectedOrg
 *  - onSelectOrg(org)
 *  - onCreateOrg()
 *  - onOpenSettings()
 *  - isMobileMenuOpen, setIsMobileMenuOpen (optional)
 */
const Sidebar = ({
  organizations = [],
  selectedOrg,
  onSelectOrg = () => {},
  onCreateOrg = () => {},
  onOpenSettings = () => {},
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
}) => {
  const closeMobileMenu = useCallback(() => {
    if (typeof setIsMobileMenuOpen === "function") {
      setIsMobileMenuOpen(false);
    }
  }, [setIsMobileMenuOpen]);

  const handleSelectOrg = useCallback(
    (org) => {
      onSelectOrg(org);
      closeMobileMenu();
    },
    [onSelectOrg, closeMobileMenu]
  );

  const handleCreateOrg = useCallback(() => {
    onCreateOrg();
    closeMobileMenu();
  }, [onCreateOrg, closeMobileMenu]);

  const handleOpenSettings = useCallback(() => {
    onOpenSettings();
    closeMobileMenu();
  }, [onOpenSettings, closeMobileMenu]);

  const getOrgItemClassName = (org) => {
    const baseClasses = "w-full text-left px-3 py-2 rounded-none text-sm transition-colors";
    const isSelected = selectedOrg?.id === org.id;
    return isSelected
      ? `${baseClasses} bg-violet-500/20 text-violet-300`
      : `${baseClasses} hover:bg-white/5 text-gray-300`;
  };

  const sidebarClassName = `fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] border-r border-white/10 z-40
    transform transition-transform duration-300
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:z-0 flex flex-col justify-between`;

  return (
    <div className={sidebarClassName}>
      <SidebarHeader />
      <OrganizationList
        organizations={organizations}
        selectedOrg={selectedOrg}
        onSelectOrg={handleSelectOrg}
        onCreateOrg={handleCreateOrg}
        getOrgItemClassName={getOrgItemClassName}
      />
      <SidebarFooter onOpenSettings={handleOpenSettings} />
    </div>
  );
};

const SidebarHeader = memo(() => (
  <div className="p-4 space-y-6">
    <div className="flex items-center justify-between">
      <a href="/" rel="noopener noreferrer">
        <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent">
          PaperBrain<span className="text-violet-400">°</span>
        </span>
      </a>
    </div>
  </div>
));

const OrganizationList = memo(({ organizations, selectedOrg, onSelectOrg, onCreateOrg, getOrgItemClassName }) => (
  <div className="px-4 space-y-2 pb-4">
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
      Organizations
    </h3>

    {organizations.map((org) => (
      <button
        key={org.id}
        onClick={() => onSelectOrg(org)}
        className={getOrgItemClassName(org)}
      >
        {org.name}
      </button>
    ))}

    <button
      onClick={onCreateOrg}
      className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-sm text-violet-400 hover:text-violet-300 hover:bg-white/5 rounded-lg transition"
    >
      <Plus className="w-4 h-4" aria-hidden="true" /> New Organization
    </button>
  </div>
));

const SidebarFooter = memo(({ onOpenSettings }) => (
  <div className="p-4 border-t border-white/10">
    <button
      onClick={onOpenSettings}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-violet-300 transition"
    >
      <Settings className="w-4 h-4" aria-hidden="true" /> Organization Settings
    </button>
  </div>
));

export default memo(Sidebar);

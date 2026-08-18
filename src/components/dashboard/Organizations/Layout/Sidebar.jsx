import { Plus, Settings } from "lucide-react";

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
  // Helper to execute callback and close mobile menu
  const handleAction = (callback) => {
    callback();
    if (typeof setIsMobileMenuOpen === "function") {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] border-r border-white/10 z-40
        transform transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-0 flex flex-col justify-between`}
    >
      <SidebarHeader />
      <OrganizationList
        organizations={organizations}
        selectedOrg={selectedOrg}
        onSelectOrg={(org) => handleAction(() => onSelectOrg(org))}
        onCreateOrg={() => handleAction(onCreateOrg)}
      />
      <SidebarFooter onOpenSettings={() => handleAction(onOpenSettings)} />
    </div>
  );
};

/** Logo / brand header */
const SidebarHeader = () => (
  <div className="p-4">
    <a href="/">
      <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent">
        PaperBrain<span className="text-violet-400">°</span>
      </span>
    </a>
  </div>
);

/** Organization list with create button */
const OrganizationList = ({ organizations, selectedOrg, onSelectOrg, onCreateOrg }) => (
  <div className="px-4 space-y-6 pb-4">
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        Organizations
      </h3>

      {organizations.map((org) => (
        <button
          key={org.id}
          onClick={() => onSelectOrg(org)}
          className={`w-full text-left px-3 py-2 rounded-none text-sm transition-colors ${
            selectedOrg?.id === org.id
              ? "bg-violet-500/20 text-violet-300"
              : "hover:bg-white/5 text-gray-300"
          }`}
        >
          {org.name}
        </button>
      ))}

      <button
        onClick={onCreateOrg}
        className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-sm text-violet-400 hover:text-violet-300 hover:bg-white/5 rounded-lg transition"
      >
        <Plus className="w-4 h-4" /> New Organization
      </button>
    </div>
  </div>
);

/** Bottom settings button */
const SidebarFooter = ({ onOpenSettings }) => (
  <div className="p-4 border-t border-white/10">
    <button
      onClick={onOpenSettings}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-violet-300 transition"
    >
      <Settings className="w-4 h-4" /> Organization Settings
    </button>
  </div>
);

export default Sidebar;
>

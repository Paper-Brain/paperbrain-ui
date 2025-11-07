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
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] border-r border-white/10 z-40
        transform transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-0 flex flex-col justify-between`}
    >
      <div className="p-4 space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <a href="/">
            <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent">
              PaperBrain<span className="text-violet-400">°</span>
            </span>
          </a>
        </div>

        {/* Organization List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Organizations
          </h3>

          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                onSelectOrg(org);
                // close mobile drawer after selecting
                if (typeof setIsMobileMenuOpen === "function") setIsMobileMenuOpen(false);
              }}
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
            onClick={() => {
              onCreateOrg();
              if (typeof setIsMobileMenuOpen === "function") setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 mt-2 text-sm text-violet-400 hover:text-violet-300 hover:bg-white/5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" /> New Organization
          </button>
        </div>
      </div>

      {/* Bottom Settings Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            onOpenSettings();
            if (typeof setIsMobileMenuOpen === "function") setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-violet-300 transition"
        >
          <Settings className="w-4 h-4" /> Organization Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

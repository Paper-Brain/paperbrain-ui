import { useState } from "react";
import { X } from "lucide-react";

/**
 * OrganizationSettingsModal
 * Props:
 *  - open (boolean)
 *  - onClose()
 *  - selectedOrg (object)
 */
const OrganizationSettingsModal = ({ open, onClose = () => {}, selectedOrg }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#121212] border border-white/10 rounded-xl w-[90%] max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-violet-300 mb-4">
          Organization Settings - {selectedOrg?.name || "—"}
        </h2>

        <div className="flex gap-4 border-b border-white/10 pb-2 mb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-1 ${activeTab === "overview" ? "text-violet-400 border-b-2 border-violet-400" : "text-gray-400"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-1 ${activeTab === "projects" ? "text-violet-400 border-b-2 border-violet-400" : "text-gray-400"}`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-1 ${activeTab === "users" ? "text-violet-400 border-b-2 border-violet-400" : "text-gray-400"}`}
          >
            Users
          </button>
          
        </div>

        <div className="text-gray-300">
          {activeTab === "overview" && <p>Organization settings content (placeholder).</p>}
          {activeTab === "users" && <p>Manage organization users here (placeholder).</p>}
          {activeTab === "projects" && <p>projects settings (placeholder).</p>}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettingsModal;

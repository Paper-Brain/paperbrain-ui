import React, { useState, useCallback, useMemo } from "react";
import { Users, Mail, ChevronDown } from "lucide-react";

const INPUT_BASE_CLASSES =
  "px-6 py-4 bg-transparent border border-white/10 rounded-none " +
  "focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm text-white";

const SELECT_BASE_CLASSES =
  INPUT_BASE_CLASSES + " appearance-none w-full";

const BUTTON_CLASSES =
  "px-4 py-4 sm:py-0 bg-gradient-to-r from-purple-400 to-yellow-300 " +
  "text-blue-800 hover:opacity-90 transition-opacity";

const MEMBER_ITEM_CLASSES =
  "flex flex-col sm:flex-row sm:items-center gap-2 " +
  "border border-white/10 p-3 text-gray-300 font-light";

function useInviteMembers() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [invitedMembers, setInvitedMembers] = useState([]);

  const addMember = useCallback((email, project) => {
    setInvitedMembers((prev) => [...prev, { email, project }]);
    setInviteEmail("");
  }, []);

  const resetForm = useCallback(() => {
    setInviteEmail("");
    setSelectedProject("");
  }, []);

  return {
    inviteEmail,
    setInviteEmail,
    selectedProject,
    setSelectedProject,
    invitedMembers,
    addMember,
    resetForm,
  };
}

function EmailInput({ value, onChange, onSubmit }) {
  return (
    <div>
      <label className="block text-sm font-thin text-gray-300 mb-1">
        Email Address
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={value}
          onChange={onChange}
          placeholder="Enter email address"
          className={INPUT_BASE_CLASSES + " flex-1"}
          required
          autoComplete="email"
        />
        <button type="submit" className={BUTTON_CLASSES}>
          Invite Member
        </button>
      </div>
    </div>
  );
}

function ProjectSelect({ value, onChange, projects }) {
  return (
    <div>
      <label className="block text-sm font-thin text-gray-300 mb-1">
        Select Project
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={SELECT_BASE_CLASSES}
          required
        >
          <option value="" className="bg-[#0A0A0A]">
            Select a project
          </option>
          {projects.map((project) => (
            <option
              key={project.id}
              value={project.name}
              className="bg-[#0A0A0A]"
            >
              {project.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function InvitedMembersList({ members }) {
  if (members.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-thin text-gray-300 mb-2">
        Invited Members
      </h3>
      <div className="space-y-2">
        {members.map((member, index) => (
          <div key={index} className={MEMBER_ITEM_CLASSES}>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-violet-400" />
              <span className="text-sm">{member.email}</span>
            </div>
            <div className="ml-0 sm:ml-auto text-xs text-violet-400">
              {member.project}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_PROJECTS = useMemo(
  () => [
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
    { id: 3, name: "Project Gamma" },
  ],
  []
);

function InviteMembers({ projects = DEFAULT_PROJECTS }) {
  const {
    inviteEmail,
    setInviteEmail,
    selectedProject,
    setSelectedProject,
    invitedMembers,
    addMember,
  } = useInviteMembers();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (inviteEmail.trim() && selectedProject) {
        addMember(inviteEmail.trim(), selectedProject);
      }
    },
    [inviteEmail, selectedProject, addMember]
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full px-4 mx-auto space-y-8">
        <div className="border border-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 space-y-4 mt-20">
          <div className="space-y-1">
            <h2 className="text-violet-400 flex items-center gap-2 text-xl font-thin">
              <Users className="w-5 h-5" />
              Invite Members
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Add team members to your organization
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailInput
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onSubmit={handleSubmit}
            />
            <ProjectSelect
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              projects={projects}
            />
            <InvitedMembersList members={invitedMembers} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default InviteMembers;

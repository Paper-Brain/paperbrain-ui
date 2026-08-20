import React, { useState, useCallback, memo } from "react";
import { Users, Mail, ChevronDown } from "lucide-react";

const PROJECTS = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
  { id: 3, name: "Project Gamma" },
] as const;

const INPUT_CLASS_NAME = [
  "flex-1 px-6 py-4 bg-transparent border border-white/10 rounded-none",
  "focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm text-white",
].join(" ");

const SELECT_CLASS_NAME = [
  "w-full px-6 py-4 bg-transparent border border-white/10 rounded-none",
  "focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm text-white appearance-none",
].join(" ");

interface InvitedMember {
  email: string;
  project: string;
}

interface InvitedMembersListProps {
  members: readonly InvitedMember[];
}

const InvitedMembersList = memo(function InvitedMembersList({ members }: InvitedMembersListProps) {
  if (members.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-thin text-gray-300 mb-2">Invited Members</h3>
      <div className="space-y-2">
        {members.map((member, index) => (
          <div
            key={`${member.email}-${member.project}-${index}`}
            className="flex flex-col sm:flex-row sm:items-center gap-2 border border-white/10 p-3 text-gray-300 font-light"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-violet-400" aria-hidden="true" />
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
});

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

const EmailInput = memo(function EmailInput({ value, onChange, onSubmit, disabled }: EmailInputProps) {
  return (
    <div>
      <label htmlFor="invite-email" className="block text-sm font-thin text-gray-300 mb-1">
        Email Address
      </label>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          id="invite-email"
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter email address"
          className={INPUT_CLASS_NAME}
          required
          disabled={disabled}
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={disabled || !value}
           className={`
             px-4 py-4 sm:py-0
             bg-gradient-to-r from-purple-400 to-yellow-300
             text-blue-800
             hover:opacity-90 transition-opacity
             disabled:opacity-50 disabled:cursor-not-allowed
           `}
        >
          Invite Member
        </button>
      </form>
    </div>
  );
});

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ProjectSelect = memo(function ProjectSelect({ value, onChange, disabled }: ProjectSelectProps) {
  return (
    <div>
      <label htmlFor="project-select" className="block text-sm font-thin text-gray-300 mb-1">
        Select Project
      </label>
      <div className="relative">
        <select
          id="project-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={SELECT_CLASS_NAME}
          required
          disabled={disabled}
        >
          <option value="" className="bg-[#0A0A0A]">
            Select a project
          </option>
          {PROJECTS.map((project) => (
            <option key={project.id} value={project.name} className="bg-[#0A0A0A]">
              {project.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
});

interface HeaderProps {
  onInvite: (e: React.FormEvent) => void;
  inviteEmail: string;
  selectedProject: string;
  onEmailChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  isSubmitting: boolean;
}

const InviteForm = memo(function InviteForm({
  onInvite,
  inviteEmail,
  selectedProject,
  onEmailChange,
  onProjectChange,
  isSubmitting,
}: HeaderProps) {
  return (
    <form onSubmit={onInvite} className="space-y-4">
      <EmailInput
        value={inviteEmail}
        onChange={onEmailChange}
        onSubmit={onInvite}
        disabled={isSubmitting}
      />
      <ProjectSelect
        value={selectedProject}
        onChange={onProjectChange}
        disabled={isSubmitting}
      />
    </form>
  );
});

function InviteMembers() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [invitedMembers, setInvitedMembers] = useState<readonly InvitedMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviteMember = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedProject) return;

    setIsSubmitting(true);
    setInvitedMembers((prev) => [
      ...prev,
      { email: inviteEmail.trim(), project: selectedProject },
    ]);
    setInviteEmail("");
    setIsSubmitting(false);
  }, [inviteEmail, selectedProject]);

  const handleEmailChange = useCallback((value: string) => {
    setInviteEmail(value);
  }, []);

  const handleProjectChange = useCallback((value: string) => {
    setSelectedProject(value);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full px-4 mx-auto space-y-8">
        <div className="border border-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 space-y-4 mt-20">
          <div className="space-y-1">
            <h2 className="text-violet-400 flex items-center gap-2 text-xl font-thin">
              <Users className="w-5 h-5" aria-hidden="true" />
              Invite Members
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Add team members to your organization
            </p>
          </div>

          <InviteForm
            onInvite={handleInviteMember}
            inviteEmail={inviteEmail}
            selectedProject={selectedProject}
            onEmailChange={handleEmailChange}
            onProjectChange={handleProjectChange}
            isSubmitting={isSubmitting}
          />

          <InvitedMembersList members={invitedMembers} />
        </div>
      </div>
    </div>
  );
}

export default InviteMembers;
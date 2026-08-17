import React from "react";
import { useInviteMembers } from "../../hooks/useInviteMembers";
import { projects } from "../../constants/projects";
import { InviteHeader } from "./InviteHeader";
import { EmailInput } from "./EmailInput";
import { ProjectDropdown } from "./ProjectDropdown";
import { InvitedMembersList } from "./InvitedMembersList";

function InviteMembers() {
  const {
    inviteEmail,
    setInviteEmail,
    selectedProject,
    setSelectedProject,
    invitedMembers,
    handleInviteMember,
  } = useInviteMembers();

  const renderHeader = () => <InviteHeader />;
  const renderForm = () => (
    <form onSubmit={handleInviteMember} className="space-y-4">
      <EmailInput
        value={inviteEmail}
        onChange={setInviteEmail}
      />
      <ProjectDropdown
        value={selectedProject}
        onChange={setSelectedProject}
        projects={projects}
      />
      <InvitedMembersList members={invitedMembers} />
    </form>
  );
  const renderContainer = () => (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full px-4 mx-auto space-y-8">
        <div className="border border-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 space-y-4 mt-20">
          {renderHeader()}
          {renderForm()}
        </div>
      </div>
    </div>
  );

  return renderContainer();
}

export default InviteMembers;

import React, { useState, useEffect } from "react"; // Added useEffect
import { Building2, Plus, ArrowUpRight } from "lucide-react";
import { SLUG_IRL } from '../../util/constants';
/**
 * A utility function to convert a string into a URL-safe slug.
 * "My New Org" -> "my-new-org"
 */
function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const CreateOrg = () => {
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState(""); // State for the URL slug
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false); // Track manual slug edits
  const [createdOrgs, setCreatedOrgs] = useState([]); // Changed to handle objects {name, slug}

  // Effect to auto-generate slug from orgName
  useEffect(() => {
    if (!isSlugManuallyEdited) {
      setOrgSlug(slugify(orgName));
    }
  }, [orgName, isSlugManuallyEdited]);

  const handleNameChange = (e) => {
    setOrgName(e.target.value);
    // If user changes name, and they haven't manually edited slug,
    // the useEffect will handle the update.
    // If they *have* manually edited, we could reset it, but
    // this behavior is simpler: once manual, stays manual until submit.
  };

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true); // User is now in control of the slug
    setOrgSlug(slugify(e.target.value)); // Still slugify to keep it URL-safe
  };

  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (orgName && orgSlug) {
      setCreatedOrgs([...createdOrgs, { name: orgName, slug: orgSlug }]);
      setOrgName("");
      setOrgSlug("");
      setIsSlugManuallyEdited(false); // Reset for the next org
    }
  };

  const baseUrl = SLUG_IRL; // As requested

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-12">
          <div>
            {/* Logo */}
            <div className="flex items-center mb-10">
              <a href="/">
                <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent">
                  PaperBrain<span className="text-violet-400">°</span>
                </span>
              </a>
            </div>
            <h1 className="text-3xl font-thin tracking-wide text-white">
              Create new Organization
            </h1>
            <p className="text-gray-400 mt-1 font-light">
              Create and manage your organization
            </p>
          </div>
          <button className="group px-6 py-2 bg-gradient-to-r from-purple-400 to-yellow-300 text-blue-800 text-sm tracking-wider transition-all duration-300">
            <Plus className="w-4 h-4 inline-block mr-2" />
            New Organization
            <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Organization Card */}
          <div className="border border-white/10 backdrop-blur-md rounded-lg p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-violet-400 flex items-center gap-2 text-xl font-thin">
                <Building2 className="w-5 h-5" />
                Create Organization
              </h2>
              <p className="text-gray-400 text-sm font-light">
                Set up a new organization and start collaborating
              </p>
            </div>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              {/* Organization Name Input */}
              

              {/* Organization URL (Slug) Input */}
              <div>
                <label
                  htmlFor="orgSlug"
                  className="block text-sm font-thin text-gray-300 mb-1"
                >
                  Name your PaperBrain organization
                </label>
                <div className="flex items-center w-full border border-white/10 rounded-none focus-within:ring-1 focus-within:ring-violet-400">
                  <span className="flex-shrink-0 px-6 py-4 text-sm text-gray-500 bg-white/5">
                    {baseUrl}
                  </span>
                  <input
                    id="orgSlug"
                    type="text"
                    value={orgSlug}
                    onChange={handleSlugChange}
                    placeholder="my-cool-org"
                    className="w-full px-6 py-4 bg-transparent border-none focus:outline-none text-sm text-violet-400"
                  />
                </div>
              </div>
<div>
                <label
                  htmlFor="orgName"
                  className="block text-sm font-thin text-gray-300 mb-1"
                >
                  Description
                </label>
                <input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={handleNameChange}
                  placeholder="Enter organization description"
                  className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm text-white"
                />
              </div>
              <button
                type="submit"
                className="group w-full px-12 py-4 bg-gradient-to-r from-purple-400 to-yellow-300 text-blue-800 text-sm tracking-wider transition-all duration-300"
              >
                Create Organization
                <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </form>          
            
          </div>

          {/* Invite Members Card (Unchanged) */}
        </div>
      </div>
    </div>
  );
};

export default CreateOrg;
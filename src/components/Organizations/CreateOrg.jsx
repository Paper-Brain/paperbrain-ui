import { useState, useEffect } from "react";
import { Building2, ArrowUpRight } from "lucide-react";
import { SLUG_IRL } from "../../util/constants";
import { useGetMeQuery } from "../../api/authApi.js";
import {
  useCreateOrganizationMutation,
  useLazyCheckOrganizationNameAvailabilityQuery,
} from "../../api/orgApi";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const CreateOrg = () => {
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);

  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();
  const currentUserId = user?.id;

  const [checkNameAvailability] = useLazyCheckOrganizationNameAvailabilityQuery();
  const [createOrganization, { isLoading: isCreating }] =
    useCreateOrganizationMutation();

  const baseUrl = SLUG_IRL + orgSlug;

  // Auto-generate slug when org name changes
  useEffect(() => {
    setOrgSlug(slugify(orgName));
  }, [orgName]);

  // ✅ Debounced check for organization availability
  useEffect(() => {
    if (!orgName) {
      setIsAvailable(null);
      return;
    }

    const debouncedCheck = debounce(async () => {
      try {
        const res = await checkNameAvailability(orgName).unwrap();
        setIsAvailable(res?.available);
      } catch (err) {
        console.error("Error checking org name:", err);
        setIsAvailable(null);
      }
    }, 500);

    debouncedCheck();
    return () => debouncedCheck.cancel();
  }, [orgName, checkNameAvailability]);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgName || !orgSlug || !isAvailable || !currentUserId) return;

    const payload = {
      name: orgName,
      description,
      slug: baseUrl,
      owner_user_id: currentUserId,
    };

    try {
      await createOrganization(payload).unwrap();
      setOrgName("");
      setOrgSlug("");
      setDescription("");
      navigate(`/organizations/${orgName}`);
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  const isButtonDisabled =
    !orgName ||
    !orgSlug ||
    !description ||
    isAvailable === false ||
    isCreating ||
    !currentUserId;

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
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
        </div>

        {/* Form */}
        <div className="flex items-center justify-center bg-[#0A0A0A] sm:p-6 lg:p-8">
          <div className="w-full max-w-lg border border-white/10 backdrop-blur-md rounded-lg p-6 space-y-4">
            <div className="space-y-1 text-center">
              <h2 className="text-violet-400 flex justify-center items-center gap-2 text-xl font-thin">
                <Building2 className="w-5 h-5" />
                Create Organization
              </h2>
              <p className="text-gray-400 text-sm font-light">
                Set up a new organization and start collaborating
              </p>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="orgName"
                  className="block text-sm font-thin text-gray-300 mb-1"
                >
                  Organization Name
                </label>
                <div className="flex items-center w-full border border-white/10 rounded-none focus-within:ring-1 focus-within:ring-violet-400">
                  <span className="flex-shrink-0 px-6 py-4 text-sm text-gray-500 bg-white/5">
                    {SLUG_IRL}
                  </span>
                  <input
                    id="orgName"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="my-cool-org"
                    className="w-full px-6 py-4 bg-transparent border-none focus:outline-none text-sm text-violet-400"
                  />
                </div>

                {orgName && isAvailable === false && (
                  <p className="text-red-400 text-sm mt-1">
                    Organization name already taken.
                  </p>
                )}
                {orgName && isAvailable && (
                  <p className="text-green-400 text-sm mt-1">
                    Organization name is available.
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-thin text-gray-300 mb-1"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter organization description"
                  className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm text-white"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`group w-full px-12 py-4 text-blue-800 text-sm tracking-wider transition-all duration-300 ${
                  isButtonDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-400 to-yellow-300"
                }`}
              >
                {isCreating ? "Creating..." : "Create Organization"}
                <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrg;

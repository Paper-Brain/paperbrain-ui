import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Building2 } from "lucide-react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../api/authApi.js";
import {
  useCreateOrganizationMutation,
  useLazyCheckOrganizationNameAvailabilityQuery,
} from "../../api/orgApi";
import { SLUG_IRL } from "../../util/constants";

const slugify = (text) => {
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
};

const logError = (context, error) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[${context}] Error occurred:`, error?.message || error);
  }
};

const useOrganizationForm = () => {
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();
  const [checkNameAvailability] =
    useLazyCheckOrganizationNameAvailabilityQuery();
  const [createOrganization, { isLoading: isCreating }] =
    useCreateOrganizationMutation();

  const currentUserId = user?.id;
  const baseUrl = useMemo(() => `${SLUG_IRL}${orgSlug}`, [orgSlug]);

  useEffect(() => {
    setOrgSlug(slugify(orgName));
  }, [orgName]);

  const checkAvailability = useMemo(
    () =>
      debounce(async (name) => {
        if (!name) {
          setIsAvailable(null);
          setIsChecking(false);
          return;
        }

        setIsChecking(true);

        try {
          const response = await checkNameAvailability(name).unwrap();
          setIsAvailable(response?.available ?? false);
        } catch (error) {
          logError("CheckAvailability", error);
          setIsAvailable(null);
        } finally {
          setIsChecking(false);
        }
      }, 500),
    [checkNameAvailability]
  );

  useEffect(() => {
    checkAvailability(orgName);

    return () => checkAvailability.cancel();
  }, [checkAvailability, orgName]);

  const handleCreateOrg = useCallback(
    async (event) => {
      event.preventDefault();

      if (!orgName || !orgSlug || !isAvailable || !currentUserId) return;

      try {
        await createOrganization({
          name: orgName,
          description,
          slug: baseUrl,
          owner_user_id: currentUserId,
        }).unwrap();

        const organizationName = orgName;
        setOrgName("");
        setOrgSlug("");
        setDescription("");
        setIsAvailable(null);
        navigate(`/organizations/${encodeURIComponent(organizationName)}`);
      } catch (error) {
        logError("CreateOrganization", error);
      }
    },
    [
      baseUrl,
      createOrganization,
      currentUserId,
      description,
      isAvailable,
      navigate,
      orgName,
      orgSlug,
    ]
  );

  const isButtonDisabled =
    !orgName ||
    !orgSlug ||
    !description ||
    isAvailable !== true ||
    isChecking ||
    isCreating ||
    !currentUserId;

  return {
    description,
    handleCreateOrg,
    isAvailable,
    isButtonDisabled,
    isChecking,
    isCreating,
    orgName,
    setDescription,
    setOrgName,
  };
};

const CreateOrgForm = () => {
  const {
    description,
    handleCreateOrg,
    isAvailable,
    isButtonDisabled,
    isChecking,
    isCreating,
    orgName,
    setDescription,
    setOrgName,
  } = useOrganizationForm();

  return (
    <form onSubmit={handleCreateOrg} className="space-y-4">
      <div>
        <label
          htmlFor="orgName"
          className="mb-1 block text-sm font-thin text-gray-300"
        >
          Organization Name
        </label>
        <div className="flex w-full items-center rounded-none border border-white/10 focus-within:ring-1 focus-within:ring-violet-400">
          <span className="flex-shrink-0 bg-white/5 px-6 py-4 text-sm text-gray-500">
            {SLUG_IRL}
          </span>
          <input
            id="orgName"
            type="text"
            value={orgName}
            onChange={(event) => setOrgName(event.target.value)}
            placeholder="my-cool-org"
            className="w-full border-none bg-transparent px-6 py-4 text-sm text-violet-400 focus:outline-none"
          />
        </div>

        {orgName && isAvailable === false && (
          <p className="mt-1 text-sm text-red-400">
            Organization name already taken.
          </p>
        )}
        {orgName && isAvailable === true && (
          <p className="mt-1 text-sm text-green-400">
            Organization name is available.
          </p>
        )}
        {isChecking && (
          <p className="mt-1 text-sm text-gray-400">Checking availability...</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-thin text-gray-300"
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter organization description"
          className="w-full rounded-none border border-white/10 bg-transparent px-6 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-400"
        />
      </div>

      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`group w-full px-12 py-4 text-sm tracking-wider text-blue-800 transition-all duration-300 ${
          isButtonDisabled
            ? "cursor-not-allowed bg-gray-500"
            : "bg-gradient-to-r from-purple-400 to-yellow-300"
        }`}
      >
        {isCreating ? "Creating..." : "Create Organization"}
        <ArrowUpRight className="ml-2 inline-block h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
      </button>
    </form>
  );
};

const CreateOrg = () => (
  <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <div className="mb-10 flex items-center">
          <a href="/">
            <span className="bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-2xl font-semibold tracking-widest text-transparent">
              PaperBrain<span className="text-violet-400">°</span>
            </span>
          </a>
        </div>
        <h1 className="text-3xl font-thin tracking-wide text-white">
          Create new Organization
        </h1>
        <p className="mt-1 font-light text-gray-400">
          Create and manage your organization
        </p>
      </header>

      <main className="flex items-center justify-center bg-[#0A0A0A] sm:p-6 lg:p-8">
        <div className="w-full max-w-lg space-y-4 rounded-lg border border-white/10 p-6 backdrop-blur-md">
          <div className="space-y-1 text-center">
            <h2 className="flex items-center justify-center gap-2 text-xl font-thin text-violet-400">
              <Building2 className="h-5 w-5" />
              Create Organization
            </h2>
            <p className="text-sm font-light text-gray-400">
              Set up a new organization and start collaborating
            </p>
          </div>

          <CreateOrgForm />
        </div>
      </main>
    </div>
  </div>
);

export default CreateOrg;

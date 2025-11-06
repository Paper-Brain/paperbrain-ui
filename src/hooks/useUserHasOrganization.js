import { useGetOrganizationsByUserIdQuery } from '../api/orgApi';

/**
 * Custom hook to check if a user belongs to any organization.
 * @param {string} userId - The UUID of the user to check.
 * @returns {boolean|undefined} - Returns true if user has org(s), false if not, undefined while loading/error.
 */
const useUserHasOrganization = (userId) => {
  const {
    data: organizations,
    isLoading,
    isFetching,
    isError
  } = useGetOrganizationsByUserIdQuery(userId, { skip: !userId });

  if (!userId || isLoading || isFetching || isError) return undefined;

  const hasOrganizations = Array.isArray(organizations) && organizations.length > 0;
  return hasOrganizations;
};

export default useUserHasOrganization;

import { ref, Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { userService } from '../services/api';
import { userKeys } from './useUsers';

/**
 * Hook for fetching a single user by ID
 * @param {number|string} userId - The ID of the user to fetch
 */
export function useUser(userId: number | string) {
  const error: Ref<string | null> = ref(null);

  // Validate user ID
  const isValidId = !isNaN(parseInt(userId as string));

  // Fetch user query
  const {
    data: user,
    isLoading,
    isError,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async () => {
      if (!isValidId) {
        throw new Error('Invalid user ID');
      }

      const response = await userService.getUser(userId);
      return response.data;
    },
    enabled: isValidId, // Only run query if ID is valid
  });

  // Set custom error message if needed
  if (queryError.value) {
    error.value = queryError.value.message || `Failed to fetch user with ID ${userId}`;
  }

  // Dismiss error message
  const dismissError = (): void => {
    error.value = null;
  };

  return {
    user,
    isLoading,
    isError,
    error,
    refetch,
    dismissError
  };
}

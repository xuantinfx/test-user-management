import { computed, ComputedRef, reactive } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { userService } from '../services/api';
import { User, UserFilters, SortCriteria, Pagination } from '@/types';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...userKeys.details(), id] as const,
};

// Create a shared state that will be used across all components
// This ensures that all components use the same state
const sharedState = {
  // Filter state
  filters: reactive<UserFilters>({
    name: '',
    email: '',
    company: ''
  }),

  // Sorting state
  sortBy: reactive<SortCriteria>({
    field: 'id',
    direction: 'asc'
  }),

  // Pagination state
  pagination: reactive<Pagination>({
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0
  }),

  // Query instance (will be set in the hook)
  queryInstance: null as any,

  // Flag to track if the hook has been initialized
  initialized: false
};

/**
 * Hook for fetching and filtering users with pagination support
 * Implemented as a singleton to ensure state is shared across components
 */
export function useUsers() {
  // Only initialize the query once
  if (!sharedState.initialized) {
    // Fetch users query
    const query = useQuery({
      queryKey: userKeys.lists(),
      queryFn: async () => {
        const response = await userService.getUsers();
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Store the query instance in shared state
    sharedState.queryInstance = query;
    sharedState.initialized = true;
  }

  // Get the query instance from shared state
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch
  } = sharedState.queryInstance;

  // Filter users based on current filters
  const filteredUsers: ComputedRef<User[]> = computed(() => {
    if (!users.value || users.value.length === 0) return [];

    const filtered = users.value.filter((user: User) => {
      const nameMatch = user.name.toLowerCase().includes(sharedState.filters.name.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(sharedState.filters.email.toLowerCase());
      const companyMatch = user.company.name.toLowerCase().includes(sharedState.filters.company.toLowerCase());

      return nameMatch && emailMatch && companyMatch;
    });

    // Update pagination totals
    sharedState.pagination.totalItems = filtered.length;
    sharedState.pagination.totalPages = Math.ceil(filtered.length / sharedState.pagination.pageSize);

    // Reset to first page if current page is out of bounds
    if (sharedState.pagination.currentPage > sharedState.pagination.totalPages && sharedState.pagination.totalPages > 0) {
      sharedState.pagination.currentPage = 1;
    }

    return filtered;
  });

  // Sort users based on current sort criteria
  const sortedUsers: ComputedRef<User[]> = computed(() => {
    if (!filteredUsers.value || filteredUsers.value.length === 0) return [];

    return [...filteredUsers.value].sort((a, b) => {
      let fieldA: any, fieldB: any;

      // Handle nested fields like company.name
      if (sharedState.sortBy.field === 'company') {
        fieldA = a.company.name;
        fieldB = b.company.name;
      } else {
        fieldA = a[sharedState.sortBy.field as keyof User];
        fieldB = b[sharedState.sortBy.field as keyof User];
      }

      // Case insensitive string comparison
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (sharedState.sortBy.direction === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  });

  // Get paginated users
  const paginatedUsers: ComputedRef<User[]> = computed(() => {
    if (!sortedUsers.value || sortedUsers.value.length === 0) return [];

    const startIndex = (sharedState.pagination.currentPage - 1) * sharedState.pagination.pageSize;
    const endIndex = startIndex + sharedState.pagination.pageSize;

    return sortedUsers.value.slice(startIndex, endIndex);
  });

  // Check if any filters are applied
  const isFiltered: ComputedRef<boolean> = computed(() => {
    return Object.values(sharedState.filters).some(value => value !== '');
  });

  // Set filter value
  const setFilter = (filterName: keyof UserFilters, value: string): void => {
    sharedState.filters[filterName] = value;
    // Reset to first page when filtering
    sharedState.pagination.currentPage = 1;
  };

  // Clear all filters
  const clearFilters = (): void => {
    sharedState.filters.name = '';
    sharedState.filters.email = '';
    sharedState.filters.company = '';

    // Reset to first page when clearing filters
    sharedState.pagination.currentPage = 1;
  };

  // Set sort criteria
  const setSortBy = (field: string): void => {
    // If clicking the same field, toggle direction
    if (sharedState.sortBy.field === field) {
      sharedState.sortBy.direction = sharedState.sortBy.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // New field, default to ascending
      sharedState.sortBy.field = field;
      sharedState.sortBy.direction = 'asc';
    }
  };

  // Pagination methods
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= sharedState.pagination.totalPages) {
      sharedState.pagination.currentPage = page;
    }
  };

  const nextPage = (): void => {
    if (sharedState.pagination.currentPage < sharedState.pagination.totalPages) {
      sharedState.pagination.currentPage++;
    }
  };

  const prevPage = (): void => {
    if (sharedState.pagination.currentPage > 1) {
      sharedState.pagination.currentPage--;
    }
  };

  const setPageSize = (size: number): void => {
    sharedState.pagination.pageSize = size;

    // Recalculate total pages based on filtered items count
    if (filteredUsers.value) {
      sharedState.pagination.totalItems = filteredUsers.value.length;
      sharedState.pagination.totalPages = Math.ceil(filteredUsers.value.length / size);
    }

    // Reset to first page when changing page size
    sharedState.pagination.currentPage = 1;
  };

  // Refresh users data
  const refreshUsers = async (): Promise<void> => {
    await refetch();
  };

  // Create refs that point to the shared state for compatibility with components
  // This ensures that components that expect refs will still work
  const filters = computed(() => sharedState.filters);
  const sortBy = computed(() => sharedState.sortBy);
  const pagination = computed(() => sharedState.pagination);

  return {
    // Data
    users,
    filteredUsers,
    sortedUsers,
    paginatedUsers,

    // State
    filters,
    sortBy,
    pagination,
    isLoading,
    isError,
    error,
    isFiltered,

    // Actions
    setFilter,
    clearFilters,
    setSortBy,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    refreshUsers
  };
}

import { ref, computed, ComputedRef } from 'vue';
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

/**
 * Hook for fetching and filtering users with pagination support
 */
export function useUsers() {
  // Filter state
  const filters = ref<UserFilters>({
    name: '',
    email: '',
    company: ''
  });

  // Sorting state
  const sortBy = ref<SortCriteria>({
    field: 'id',
    direction: 'asc'
  });

  // Pagination state
  const pagination = ref<Pagination>({
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0
  });

  // Fetch users query
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const response = await userService.getUsers();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter users based on current filters
  const filteredUsers: ComputedRef<User[]> = computed(() => {
    if (!users.value || users.value.length === 0) return [];

    const filtered = users.value.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(filters.value.name.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(filters.value.email.toLowerCase());
      const companyMatch = user.company.name.toLowerCase().includes(filters.value.company.toLowerCase());

      return nameMatch && emailMatch && companyMatch;
    });

    // Update pagination totals
    pagination.value.totalItems = filtered.length;
    pagination.value.totalPages = Math.ceil(filtered.length / pagination.value.pageSize);

    // Reset to first page if current page is out of bounds
    if (pagination.value.currentPage > pagination.value.totalPages && pagination.value.totalPages > 0) {
      pagination.value.currentPage = 1;
    }

    return filtered;
  });

  // Sort users based on current sort criteria
  const sortedUsers: ComputedRef<User[]> = computed(() => {
    if (!filteredUsers.value || filteredUsers.value.length === 0) return [];

    return [...filteredUsers.value].sort((a, b) => {
      let fieldA: any, fieldB: any;

      // Handle nested fields like company.name
      if (sortBy.value.field === 'company') {
        fieldA = a.company.name;
        fieldB = b.company.name;
      } else {
        fieldA = a[sortBy.value.field as keyof User];
        fieldB = b[sortBy.value.field as keyof User];
      }

      // Case insensitive string comparison
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (sortBy.value.direction === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  });

  // Get paginated users
  const paginatedUsers: ComputedRef<User[]> = computed(() => {
    if (!sortedUsers.value || sortedUsers.value.length === 0) return [];

    const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const endIndex = startIndex + pagination.value.pageSize;

    return sortedUsers.value.slice(startIndex, endIndex);
  });

  // Check if any filters are applied
  const isFiltered: ComputedRef<boolean> = computed(() => {
    return Object.values(filters.value).some(value => value !== '');
  });

  // Set filter value
  const setFilter = (filterName: keyof UserFilters, value: string): void => {
    filters.value[filterName] = value;
    // Reset to first page when filtering
    pagination.value.currentPage = 1;
  };

  // Clear all filters
  const clearFilters = (): void => {
    filters.value = {
      name: '',
      email: '',
      company: ''
    };
    // Reset to first page when clearing filters
    pagination.value.currentPage = 1;
  };

  // Set sort criteria
  const setSortBy = (field: string): void => {
    // If clicking the same field, toggle direction
    if (sortBy.value.field === field) {
      sortBy.value.direction = sortBy.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // New field, default to ascending
      sortBy.value.field = field;
      sortBy.value.direction = 'asc';
    }
  };

  // Pagination methods
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.currentPage = page;
    }
  };

  const nextPage = (): void => {
    if (pagination.value.currentPage < pagination.value.totalPages) {
      pagination.value.currentPage++;
    }
  };

  const prevPage = (): void => {
    if (pagination.value.currentPage > 1) {
      pagination.value.currentPage--;
    }
  };

  const setPageSize = (size: number): void => {
    pagination.value.pageSize = size;
    pagination.value.totalPages = Math.ceil(pagination.value.totalItems / size);

    // Reset to first page when changing page size
    pagination.value.currentPage = 1;
  };

  // Refresh users data
  const refreshUsers = async (): Promise<void> => {
    await refetch();
  };

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

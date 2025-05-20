import { ref, computed, watch } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { userService } from '../services/api';

// Query keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

/**
 * Hook for fetching and filtering users with pagination support
 */
export function useUsers() {
  // Filter state
  const filters = ref({
    name: '',
    email: '',
    company: ''
  });

  // Sorting state
  const sortBy = ref({
    field: 'id',
    direction: 'asc'
  });

  // Pagination state
  const pagination = ref({
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0
  });

  // Query client for refetching
  const queryClient = useQueryClient();

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
  const filteredUsers = computed(() => {
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
  const sortedUsers = computed(() => {
    if (!filteredUsers.value || filteredUsers.value.length === 0) return [];

    return [...filteredUsers.value].sort((a, b) => {
      let fieldA, fieldB;

      // Handle nested fields like company.name
      if (sortBy.value.field === 'company') {
        fieldA = a.company.name;
        fieldB = b.company.name;
      } else {
        fieldA = a[sortBy.value.field];
        fieldB = b[sortBy.value.field];
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
  const paginatedUsers = computed(() => {
    if (!sortedUsers.value || sortedUsers.value.length === 0) return [];

    const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const endIndex = startIndex + pagination.value.pageSize;

    return sortedUsers.value.slice(startIndex, endIndex);
  });

  // Check if any filters are applied
  const isFiltered = computed(() => {
    return Object.values(filters.value).some(value => value !== '');
  });

  // Set filter value
  const setFilter = (filterName, value) => {
    filters.value[filterName] = value;
    // Reset to first page when filtering
    pagination.value.currentPage = 1;
  };

  // Clear all filters
  const clearFilters = () => {
    filters.value = {
      name: '',
      email: '',
      company: ''
    };
    // Reset to first page when clearing filters
    pagination.value.currentPage = 1;
  };

  // Set sort criteria
  const setSortBy = (field) => {
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
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.currentPage = page;
    }
  };

  const nextPage = () => {
    if (pagination.value.currentPage < pagination.value.totalPages) {
      pagination.value.currentPage++;
    }
  };

  const prevPage = () => {
    if (pagination.value.currentPage > 1) {
      pagination.value.currentPage--;
    }
  };

  const setPageSize = (size) => {
    pagination.value.pageSize = size;
    pagination.value.totalPages = Math.ceil(pagination.value.totalItems / size);

    // Reset to first page when changing page size
    pagination.value.currentPage = 1;
  };

  // Refresh users data
  const refreshUsers = async () => {
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

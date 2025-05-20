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
 * Hook for fetching and filtering users
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
    field: 'name',
    direction: 'asc'
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
  });

  // Filter users based on current filters
  const filteredUsers = computed(() => {
    if (!users.value || users.value.length === 0) return [];

    return users.value.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(filters.value.name.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(filters.value.email.toLowerCase());
      const companyMatch = user.company.name.toLowerCase().includes(filters.value.company.toLowerCase());
      
      return nameMatch && emailMatch && companyMatch;
    });
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

  // Check if any filters are applied
  const isFiltered = computed(() => {
    return Object.values(filters.value).some(value => value !== '');
  });

  // Set filter value
  const setFilter = (filterName, value) => {
    filters.value[filterName] = value;
  };

  // Clear all filters
  const clearFilters = () => {
    filters.value = {
      name: '',
      email: '',
      company: ''
    };
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

  // Refresh users data
  const refreshUsers = async () => {
    await refetch();
  };

  return {
    // Data
    users,
    filteredUsers,
    sortedUsers,
    
    // State
    filters,
    sortBy,
    isLoading,
    isError,
    error,
    isFiltered,
    
    // Actions
    setFilter,
    clearFilters,
    setSortBy,
    refreshUsers
  };
}

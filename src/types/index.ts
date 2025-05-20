// User types
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

// Filter types
export interface UserFilters {
  name: string;
  email: string;
  company: string;
}

// Sorting types
export interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

// Pagination types
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Route meta types
export interface RouteMeta {
  title: string;
}

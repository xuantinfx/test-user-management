# User Dashboard - Vue.js Application

A production-ready, responsive Vue.js application that fetches and displays user data from the JSONPlaceholder API, with interactive filtering, sorting features, and detailed user views. This project demonstrates best practices in Vue.js development, focusing on maintainability, performance, and user experience.

![User Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=User+Dashboard+Screenshot)

TODO: show all screenshots of the app, include: user management, error handling (can't fetch API, network errors, route not found, etc.), loading states, user details view, etc.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture and Design Patterns](#architecture-and-design-patterns)
- [Key Features Implementation](#key-features-implementation)
- [Performance Optimizations](#performance-optimizations)
- [Security Considerations](#security-considerations)
- [Technical Challenges and Solutions](#technical-challenges-and-solutions)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Project Structure](#project-structure)

## Features

- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices
- **Data Fetching**: Efficient data retrieval from JSONPlaceholder API with proper error handling
- **Interactive Filtering**: Real-time filtering of users by name, email, and company
- **Dynamic Sorting**: Sort users by any column (ID, name, username, email, company) with direction toggle
- **Pagination**: Efficient handling of large datasets with customizable page size and intuitive navigation
- **User Details View**: Comprehensive user profile with contact information, address with map integration, and company details
- **Error Handling**: Graceful error handling with user-friendly messages and recovery options
- **Loading States**: Visual feedback during data loading operations
- **Clean UI/UX**: Intuitive interface with consistent styling and smooth transitions
- **Theme Switching**: Dynamic light and dark theme support with the following features:
  - System preference detection using `prefers-color-scheme` media query
  - Real-time theme updates when system preferences change
  - User preference persistence in localStorage
  - Accessible theme toggle with proper ARIA attributes
  - Smooth transitions between themes
  - Comprehensive CSS variable-based theming system

## Technology Stack

- **Vue 3**: Latest version of the Vue.js framework with Composition API
- **TypeScript**: Static typing for improved developer experience, code quality, and maintainability
- **Vite**: Next-generation frontend tooling for faster development and optimized builds
- **Vue Router 4**: Official router for Vue.js with improved TypeScript support
- **TanStack Query (Vue Query)**: Data fetching and state management library
- **Axios**: Promise-based HTTP client for API requests with interceptor support

## Architecture and Design Patterns

The application follows a clean, maintainable architecture based on several design patterns:

### Component Architecture

- **Atomic Design Methodology**: Components are organized following atomic design principles:
- **UI Components**: Small, reusable components like `LoadingSpinner` and `ErrorAlert`
- **Feature Components**: Domain-specific components like `UserTable` and `UserFilter`
- **View Components**: Page-level components that compose feature components

### State Management

- **TanStack Query Pattern**: Using Vue Query for data fetching and state management:
- **Query Hooks**: Custom composable functions for data fetching
- **Query Keys**: Hierarchical structure for caching and invalidation
- **Query Client**: Centralized cache management
- **Reactive State**: Automatic synchronization of UI with query state

### Service Layer Pattern

- **API Service Abstraction**: Encapsulated API calls in service modules
- **Axios Interceptors**: Centralized request/response handling and error management

### Composition API

- **Composable Functions**: Reusable logic extracted into composable functions
- **Separation of Concerns**: Clear separation between UI rendering and business logic

### Reactive Programming

- **Reactive Data Flow**: One-way data flow with reactive state updates
- **Computed Properties**: Efficient derived state calculations

### TypeScript Integration

- **Strong Typing**: Comprehensive type definitions for all data structures and functions
- **Type Safety**: Catch errors at compile time rather than runtime
- **Interface Definitions**: Clear contracts for component props, API responses, and state
- **Type Inference**: Leveraging TypeScript's ability to infer types when possible
- **Generics**: Used for reusable, type-safe components and functions

## Key Features Implementation

### Filtering System

The filtering system allows users to filter the displayed data by multiple criteria simultaneously:

```typescript
// Filtering implementation in useUsers.ts hook
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

  return filtered;
});
```

Key aspects:

- Case-insensitive matching
- Real-time filtering as users type
- Multiple filter criteria with AND logic
- Reactive updates through Vue Query and Vue's reactivity system

### Sorting Mechanism

The sorting system allows users to sort by any column with direction toggle:

```typescript
// Sorting implementation in useUsers.ts hook
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
```

Key aspects:

- Support for nested object properties (company.name)
- Type-aware comparisons
- Direction toggle (ascending/descending)
- Visual indicators for sort field and direction

### Pagination Implementation

The pagination system efficiently handles large datasets by dividing them into manageable pages:

```typescript
// Pagination implementation in useUsers.ts hook
const paginatedUsers: ComputedRef<User[]> = computed(() => {
  if (!sortedUsers.value || sortedUsers.value.length === 0) return [];

  const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
  const endIndex = startIndex + pagination.value.pageSize;

  return sortedUsers.value.slice(startIndex, endIndex);
});
```

Key aspects:

- Client-side pagination for efficient rendering
- Customizable page size (5, 10, 20, 50, 100 items per page)
- Intuitive navigation controls with page numbers
- Automatic recalculation when filters or sorting change
- Maintains state when switching between views

### Responsive Design Implementation

The application uses a mobile-first approach with CSS Grid and Flexbox:

```css
/* Example of responsive grid in UserFilter.vue */
.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end;
}

@media (max-width: 768px) {
  .filter-form {
    grid-template-columns: 1fr;
  }
}
```

Key aspects:

- Fluid layouts with CSS Grid and Flexbox
- Responsive typography with relative units
- Breakpoints for different device sizes
- Touch-friendly UI elements for mobile

### Theme Switching Implementation

The application features a comprehensive theme switching system with light and dark modes:

```typescript
// Theme composable in useTheme.ts
export function useTheme() {
  // Create a reactive reference to store the current theme
  const theme = ref<ThemeType>('light');

  // Check if system prefers dark mode
  const systemPrefersDark = computed(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Initialize theme from localStorage or system preference
  const initializeTheme = (): void => {
    const storedTheme = localStorage.getItem('theme') as ThemeType | null;

    if (storedTheme) {
      // Use stored theme if available
      theme.value = storedTheme;
    } else {
      // Otherwise use system preference
      theme.value = systemPrefersDark.value ? 'dark' : 'light';
    }

    // Apply theme to document
    applyTheme(theme.value);
  };

  // Listen for system preference changes
  onMounted(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        // Only update if user hasn't manually set a preference
        theme.value = e.matches ? 'dark' : 'light';
      }
    });
  });
}
```

Key aspects:

- **System Preference Detection**: Automatically detects and applies the user's system theme preference using the `prefers-color-scheme` media query
- **Real-time Preference Monitoring**: Listens for changes to the system's theme preference and updates the application theme in real-time when the user hasn't explicitly set a preference
- **User Preference Persistence**: Stores the user's explicit theme choice in localStorage, which takes precedence over system preferences
- **CSS Variables for Theming**: Uses CSS custom properties to define theme-specific colors and styles
- **Smooth Theme Transitions**: Implements smooth transitions between themes for a polished user experience
- **Accessible Toggle**: Provides an accessible theme toggle with proper ARIA attributes and keyboard support
- **Semantic HTML**: Uses the `data-theme` attribute on the root element to apply theme styles

The CSS implementation uses CSS variables for theme-specific styling:

```css
/* Light theme (default) */
:root[data-theme="light"] {
  /* Primary Colors */
  --primary-color: #4f46e5;
  --primary-dark: #4338ca;
  --primary-light: #818cf8;

  /* Background Colors */
  --bg-color: #f9fafb;
  --bg-light: #ffffff;
  --bg-dark: #f3f4f6;

  /* Text Colors */
  --text-color: #1f2937;
  --text-light: #6b7280;
}

/* Dark theme */
:root[data-theme="dark"] {
  /* Primary Colors */
  --primary-color: #818cf8;
  --primary-dark: #6366f1;
  --primary-light: #a5b4fc;

  /* Background Colors */
  --bg-color: #111827;
  --bg-light: #1f2937;
  --bg-dark: #0f172a;

  /* Text Colors */
  --text-color: #f9fafb;
  --text-light: #e5e7eb;
}

/* Theme transition for smooth switching */
* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}
```

The theme toggle component is designed with accessibility in mind:

```vue
<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    aria-live="polite"
    role="switch"
    :aria-checked="isDark"
  >
    <!-- Sun/Moon icons -->
    <svg v-if="!isDark" class="icon sun-icon" viewBox="0 0 24 24">
      <!-- Sun icon paths -->
    </svg>
    <svg v-else class="icon moon-icon" viewBox="0 0 24 24">
      <!-- Moon icon paths -->
    </svg>

    <span class="sr-only">{{ isDark ? 'Dark mode active' : 'Light mode active' }}</span>
  </button>
</template>
```

## Performance Optimizations

### Efficient Rendering

- **Computed Properties**: Used for derived data to prevent unnecessary recalculations
- **Reactive Dependencies**: Careful management of reactive dependencies to prevent unnecessary re-renders
- **v-once Directive**: Applied to static content that doesn't need to be re-rendered

### State Management Optimization

- **Query Caching**: Automatic caching of query results
- **Deduplication**: Preventing duplicate requests for the same data
- **Stale-While-Revalidate**: Showing cached data while fetching fresh data in the background

### Network Optimization

- **Axios Request Interceptors**: Centralized request configuration
- **Axios Response Interceptors**: Unified error handling
- **Error Boundaries**: Preventing cascading failures from API errors

### Code Splitting

- **Component-Level Code Splitting**: Lazy loading of route components
- **Dynamic Imports**: Loading non-critical components on demand

## Security Considerations

### Data Protection

- **Input Sanitization**: Preventing XSS attacks through proper input handling
- **Content Security Policy**: Restricting resource loading to trusted sources
- **HTTPS Only**: Ensuring secure communication (when deployed)

### API Security

- **Error Handling**: Preventing exposure of sensitive information in error messages
- **Request Validation**: Validating data before sending to API
- **Response Validation**: Validating API responses before processing

### User Experience Security

- **Proper Error Messages**: User-friendly error messages without exposing system details
- **Secure Links**: External links open with proper security attributes

## Technical Challenges and Solutions

### Challenge 1: Complex Filtering and Sorting Logic

**Problem**: Implementing efficient filtering and sorting for potentially large datasets while maintaining responsive UI.

**Solution**:

- Implemented computed properties in Vue Query hooks for derived data
- Used memoization techniques to prevent recalculation when inputs haven't changed
- Applied debouncing for filter inputs to reduce computation frequency

### Challenge 2: Nested Data Handling

**Problem**: The API returns complex nested objects that need special handling for display and sorting.

**Solution**:

- Created specialized getter functions that handle nested property access
- Implemented custom comparators for sorting that understand object structures
- Used recursive component patterns for displaying nested data

### Challenge 3: Responsive Design for Complex Tables

**Problem**: Tables are notoriously difficult to make responsive across all device sizes.

**Solution**:

- Implemented horizontal scrolling for tables on small screens
- Used CSS Grid for adaptive layouts
- Created alternative card views for very small screens
- Applied strategic column hiding based on screen size

### Challenge 4: Handling Large Datasets

**Problem**: Rendering large amounts of user data efficiently without compromising performance or user experience.

**Solution**:

- Implemented client-side pagination to limit the number of DOM elements rendered at once
- Created a flexible pagination system with customizable page sizes
- Designed intuitive navigation controls with page numbers and prev/next buttons
- Optimized computed properties to only process visible data
- Added responsive design considerations for pagination controls on mobile devices

### Challenge 5: Error Handling and Recovery

**Problem**: Creating a robust error handling system that's both informative and allows for recovery.

**Solution**:

- Centralized error handling in Axios interceptors
- Created reusable error components with retry functionality
- Implemented graceful degradation when parts of the application fail

### Challenge 6: TypeScript Integration

**Problem**: Implementing TypeScript in an existing JavaScript codebase while maximizing type safety benefits.

**Solution**:

- Created comprehensive interface definitions for all data structures
- Implemented proper typing for Vue components using `defineProps` and `defineEmits`
- Used TypeScript generics for reusable components and functions
- Added explicit return types for all functions and computed properties
- Implemented type guards for conditional logic

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/xuantinfx/test-user-management.git

# Navigate to the project directory
cd test-user-management

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
# Type check the application
npm run type-check

# Build the application (includes type checking)
npm run build

# Preview the production build
npm run preview
```

## Testing

### Testing Framework

This project uses **Vitest** as the testing framework with the following supporting libraries:

- **@vue/test-utils**: For mounting and interacting with Vue components
- **happy-dom**: For providing a lightweight DOM implementation in tests
- **vitest**: For test running, assertions, and mocking capabilities

We chose Vitest for its seamless integration with our Vite-based project, excellent Vue 3 and TypeScript support, and performance benefits from native ESM support.

### Running Tests

The following npm scripts are configured for running tests:

```bash
# Run all tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Implemented Tests

We have implemented tests for two UI components and one composable function:

#### LoadingSpinner.vue Tests

The LoadingSpinner component tests (`tests/components/ui/LoadingSpinner.spec.ts`) verify:

- **Default Props**: Component renders correctly with the default "Loading..." message and without overlay class
- **Custom Message**: Component displays a custom message when the `message` prop is provided
- **Overlay Mode**: Component applies the `overlay` class when the `overlay` prop is set to true
- **Empty Message**: Message element is not rendered when an empty message string is provided

Example test:

```typescript
it('applies overlay class when overlay prop is true', () => {
  const wrapper = mount(LoadingSpinner, {
    props: {
      overlay: true
    }
  });

  expect(wrapper.classes()).toContain('overlay');
});
```

#### ErrorAlert.vue Tests

The ErrorAlert component tests (`tests/components/ui/ErrorAlert.spec.ts`) verify:

- **Conditional Rendering**: Component is not visible when the message prop is empty
- **Error Message Display**: Component correctly displays the provided error message
- **Alert Types**: Component applies the correct CSS class based on the type prop (error, warning, info)
- **Dismiss Event**: Component emits a `dismiss` event when the dismiss button is clicked
- **Conditional Dismiss Button**: Dismiss button is only shown when the `dismissible` prop is true

Example test:

```typescript
it('emits dismiss event when dismiss button is clicked', async () => {
  const wrapper = mount(ErrorAlert, {
    props: {
      message: 'Dismissible alert',
      dismissible: true
    }
  });

  await wrapper.find('.dismiss-btn').trigger('click');

  expect(wrapper.emitted()).toHaveProperty('dismiss');
  expect(wrapper.emitted('dismiss')).toHaveLength(1);
});
```

#### useTheme.ts Tests

The useTheme composable tests (`tests/hooks/useTheme.spec.ts`) verify:

- **Default Theme**: Hook initializes with the light theme by default
- **Theme Toggling**: The `toggleTheme` function correctly switches between light and dark themes
- **Theme Setting**: The `setTheme` function correctly sets a specific theme

For these tests, we mock the composable to isolate it from browser APIs (localStorage, document, etc.) and focus on testing the core functionality.

Example test:

```typescript
it('toggles theme correctly', async () => {
  const { theme, isDark, toggleTheme } = useTheme();

  // Start with light theme
  expect(theme.value).toBe('light');
  expect(isDark.value).toBe(false);

  // Toggle to dark theme
  toggleTheme();
  await nextTick();

  expect(theme.value).toBe('dark');
  expect(isDark.value).toBe(true);
});
```

### Testing Approach

Our testing approach focuses on:

1. **Component Testing**: Verifying that components render correctly with different props and emit expected events
2. **Composable Testing**: Verifying that composable functions manage state correctly and provide expected functionality
3. **Isolation**: Using mocks to isolate components and composables from external dependencies

Each test follows a consistent pattern:

- Setup the component or composable with specific props or conditions
- Perform actions when testing interactive behavior
- Assert that the expected outcome occurs

## Future Enhancements

### Short-term Improvements

- **Unit and Integration Tests**: Add comprehensive test coverage
- **Server-side Pagination**: Implement server-side pagination for very large datasets
- **Filtering Enhancements**: Add advanced filtering options (range filters, multi-select)

### Medium-term Roadmap

- **Offline Support**: Add service workers for offline functionality
- **Data Caching**: Implement client-side caching for improved performance
- **Internationalization**: Add multi-language support
- **Additional Accessibility Improvements**: Further enhance keyboard navigation and screen reader support
- **Theme Customization**: Allow users to customize theme colors beyond light/dark modes

### Long-term Vision

- **User Authentication**: Add login/registration functionality
- **User Preferences**: Allow users to customize dashboard layout and preferences
- **Data Visualization**: Add charts and graphs for data visualization
- **Real-time Updates**: Implement WebSocket for real-time data updates

## Project Structure

```plaintext
user-dashboard/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   │   ├── ErrorAlert.vue      # Error message component
│   │   │   ├── LoadingSpinner.vue  # Loading indicator component
│   │   │   └── ThemeToggle.vue     # Theme switching component
│   │   └── users/       # User-specific components
│   ├── hooks/           # Vue composables and hooks
│   │   ├── useTheme.ts  # Theme management composable
│   │   ├── useUser.ts   # Single user data hook
│   │   └── useUsers.ts  # Users list data hook
│   ├── plugins/         # Vue plugins configuration
│   ├── router/          # Vue Router configuration
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   ├── views/           # Page components
│   ├── App.vue          # Root component with theme CSS variables
│   ├── main.ts          # Application entry point with theme initialization
│   └── shims-vue.d.ts   # Vue TypeScript declarations
├── tests/               # Test files
│   ├── components/      # Component tests
│   │   └── ui/          # UI component tests
│   │       ├── ErrorAlert.spec.ts      # Tests for ErrorAlert component
│   │       └── LoadingSpinner.spec.ts  # Tests for LoadingSpinner component
│   └── hooks/           # Hook tests
│       └── useTheme.spec.ts            # Tests for useTheme composable
├── .env                 # Environment variables
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript Node configuration
├── vitest.config.ts     # Vitest configuration
└── vite.config.ts       # Vite configuration
```

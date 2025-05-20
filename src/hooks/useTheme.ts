import { ref, watch, onMounted, computed } from 'vue';

// Define theme types
export type ThemeType = 'light' | 'dark';

/**
 * Theme composable for managing application theme
 * Handles theme switching and persistence to localStorage
 */
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
    // Check if theme is stored in localStorage
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

  // Toggle between light and dark themes
  const toggleTheme = (): void => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  // Set a specific theme
  const setTheme = (newTheme: ThemeType): void => {
    theme.value = newTheme;
  };

  // Apply theme to document by setting data-theme attribute
  const applyTheme = (currentTheme: ThemeType): void => {
    if (typeof document === 'undefined') return;
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Store in localStorage for persistence
    localStorage.setItem('theme', currentTheme);
  };

  // Watch for theme changes and apply them
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  // Initialize theme on component mount
  onMounted(() => {
    initializeTheme();
    
    // Listen for system preference changes
    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          // Only update if user hasn't manually set a preference
          theme.value = e.matches ? 'dark' : 'light';
        }
      });
    }
  });

  // Computed property to check if current theme is dark
  const isDark = computed(() => theme.value === 'dark');

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  };
}

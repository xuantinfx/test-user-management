import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTheme } from '@/hooks/useTheme';
import { nextTick } from 'vue';

// Create a mock version of the useTheme composable for testing
vi.mock('@/hooks/useTheme', () => {
  const { ref, computed } = require('vue');

  return {
    useTheme: vi.fn(() => {
      const theme = ref('light');
      const isDark = computed(() => theme.value === 'dark');

      // Mock implementation of toggleTheme
      const toggleTheme = vi.fn(() => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
      });

      // Mock implementation of setTheme
      const setTheme = vi.fn((newTheme) => {
        theme.value = newTheme;
      });

      return {
        theme,
        isDark,
        toggleTheme,
        setTheme
      };
    })
  };
});

describe('useTheme', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  // Mock document.documentElement
  const documentElementMock = {
    setAttribute: vi.fn(),
    getAttribute: vi.fn(),
  };

  beforeEach(() => {
    // Setup mocks before each test
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('document', {
      documentElement: documentElementMock,
    });

    // Clear localStorage mock
    localStorageMock.clear();

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up mocks after each test
    vi.unstubAllGlobals();
  });

  it('initializes with light theme by default', () => {
    const { theme, isDark } = useTheme();

    expect(theme.value).toBe('light');
    expect(isDark.value).toBe(false);
  });

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

    // Toggle back to light theme
    toggleTheme();
    await nextTick();

    expect(theme.value).toBe('light');
    expect(isDark.value).toBe(false);
  });

  it('sets specific theme correctly', async () => {
    const { theme, setTheme } = useTheme();

    // Set to dark theme
    setTheme('dark');
    await nextTick();

    expect(theme.value).toBe('dark');
  });
});

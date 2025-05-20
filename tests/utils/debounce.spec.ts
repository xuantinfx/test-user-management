import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '@/utils/debounce';

describe('debounce utility', () => {
  beforeEach(() => {
    // Setup fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore timers
    vi.restoreAllMocks();
  });

  it('should delay function execution', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    // Call the debounced function
    debouncedFn();
    
    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled();
    
    // Advance timer by 100ms
    vi.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();
    
    // Advance timer to 300ms
    vi.advanceTimersByTime(200);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should only execute once for multiple calls within wait period', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    // Call multiple times
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    // Advance timer by 150ms
    vi.advanceTimersByTime(150);
    
    // Call again
    debouncedFn();
    
    // Advance timer to 300ms from last call
    vi.advanceTimersByTime(300);
    
    // Should only be called once
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the original function', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    // Call with arguments
    debouncedFn('test', 123);
    
    // Advance timer
    vi.advanceTimersByTime(300);
    
    // Check if arguments were passed
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });
});

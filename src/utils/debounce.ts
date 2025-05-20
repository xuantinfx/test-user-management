/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the provided function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    // Clear the previous timeout
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    
    // Set a new timeout
    timeout = window.setTimeout(() => {
      func.apply(context, args);
      timeout = undefined;
    }, wait);
  };
}

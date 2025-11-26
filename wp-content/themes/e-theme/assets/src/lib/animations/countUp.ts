/**
 * Count-up animation utility
 * Provides a reusable function to animate numeric values with configurable options
 */

export interface CountUpOptions {
  /** The target value to count up to */
  target: number;
  /** The starting value (default: 0) */
  start?: number;
  /** Duration of the animation in milliseconds (default: 2000) */
  duration?: number;
  /** Easing function for the animation (default: easeOutQuart) */
  easing?: (progress: number) => number;
  /** Whether to round the result to integers (default: true) */
  round?: boolean;
  /** Number of decimal places when not rounding (default: 2) */
  decimalPlaces?: number;
  /** Optional element to write the value to directly */
  element?: HTMLElement;
  /** Optional callback function called on each frame */
  onUpdate?: (value: number) => void;
  /** Optional callback function called when animation completes */
  onComplete?: () => void;
}

/**
 * Default easing function - easeOutQuart
 */
export const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

/**
 * Linear easing function
 */
export const linear = (t: number): number => {
  return t;
};

/**
 * EaseOutCubic easing function
 */
export const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

/**
 * Runs a count-up animation with the provided options
 * @param options - Configuration options for the animation
 * @returns A cancel function that can be called to stop the animation
 */
export const runCountUp = (options: CountUpOptions): (() => void) => {
  const {
    target,
    start = 0,
    duration = 2000,
    easing = easeOutQuart,
    round = true,
    decimalPlaces = 2,
    element,
    onUpdate,
    onComplete,
  } = options;

  // If target is less than or equal to start, no animation needed
  if (target <= start) {
    const finalValue = round ? Math.round(target) : parseFloat(target.toFixed(decimalPlaces));
    
    if (element) {
      element.textContent = finalValue.toString();
    }
    
    if (onUpdate) {
      onUpdate(finalValue);
    }
    
    if (onComplete) {
      onComplete();
    }
    
    return () => {}; // Return empty cancel function
  }

  let startTime: number | null = null;
  let animationId: number | null = null;
  let cancelled = false;

  const animate = (timestamp: number) => {
    if (cancelled) return;

    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    
    const currentValue = start + (target - start) * easedProgress;
    const displayValue = round 
      ? Math.round(currentValue) 
      : parseFloat(currentValue.toFixed(decimalPlaces));

    // Update element if provided
    if (element) {
      element.textContent = displayValue.toString();
    }

    // Call update callback if provided
    if (onUpdate) {
      onUpdate(displayValue);
    }

    // Continue animation or complete
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Animation complete
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Start the animation
  animationId = requestAnimationFrame(animate);

  // Return cancel function
  return () => {
    cancelled = true;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};
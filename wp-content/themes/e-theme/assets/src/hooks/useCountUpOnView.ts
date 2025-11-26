"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { runCountUp, easeOutQuart } from "@/lib/animations/countUp";

export interface UseCountUpOnViewOptions {
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
  /** IntersectionObserver threshold (default: 0.1) */
  threshold?: number;
  /** IntersectionObserver rootMargin (default: '0px') */
  rootMargin?: string;
  /** Whether to animate only once (default: true) */
  once?: boolean;
}

export interface UseCountUpOnViewReturn {
  /** Ref to attach to the element to be observed */
  ref: React.RefObject<HTMLElement>;
  /** Current animated value */
  value: number;
  /** Whether the animation has completed */
  hasAnimated: boolean;
}

/**
 * React hook that triggers a count-up animation when the element enters the viewport
 * @param options - Configuration options for the animation and intersection observer
 * @returns Object containing ref, current value, and animation status
 */
export const useCountUpOnView = (
  options: UseCountUpOnViewOptions
): UseCountUpOnViewReturn => {
  const {
    target,
    start = 0,
    duration = 2000,
    easing = easeOutQuart,
    round = true,
    decimalPlaces = 2,
    threshold = 0.1,
    rootMargin = "0px",
    once = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Use refs for mutable values that shouldn't trigger effect re-runs
  const hasBeenInViewRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const targetRef = useRef(target);
  const startRef = useRef(start);
  const durationRef = useRef(duration);
  const easingRef = useRef(easing);
  const roundRef = useRef(round);
  const decimalPlacesRef = useRef(decimalPlaces);
  const onceRef = useRef(once);
  
  const cancelAnimationRef = useRef<(() => void) | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Update refs when options change
  useEffect(() => {
    const targetChanged = targetRef.current !== target;
    const startChanged = startRef.current !== start;
    
    if (targetChanged || startChanged) {
      // Cancel any ongoing animation
      if (cancelAnimationRef.current) {
        cancelAnimationRef.current();
        cancelAnimationRef.current = null;
      }
      
      // Reset state
      hasBeenInViewRef.current = false;
      hasAnimatedRef.current = false;
      setValue(start);
      
      // Update refs
      targetRef.current = target;
      startRef.current = start;
      durationRef.current = duration;
      easingRef.current = easing;
      roundRef.current = round;
      decimalPlacesRef.current = decimalPlaces;
      onceRef.current = once;
      
      setHasAnimated(false);
    } else {
      // Just update refs without resetting animation state
      targetRef.current = target;
      startRef.current = start;
      durationRef.current = duration;
      easingRef.current = easing;
      roundRef.current = round;
      decimalPlacesRef.current = decimalPlaces;
      onceRef.current = once;
    }
  }, [target, start, duration, easing, round, decimalPlaces, once]);

  // Check if user prefers reduced motion
  const checkReducedMotion = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Set up intersection observer
  useEffect(() => {
    // Skip if IntersectionObserver is not available (SSR)
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      // Set final value immediately for SSR
      const finalValue = roundRef.current ? Math.round(targetRef.current) : parseFloat(targetRef.current.toFixed(decimalPlacesRef.current));
      setValue(finalValue);
      setHasAnimated(true);
      hasAnimatedRef.current = true;
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Handle intersection callback inline to avoid dependency issues
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && !hasBeenInViewRef.current) {
        hasBeenInViewRef.current = true;

        // If user prefers reduced motion, set final value immediately
        if (checkReducedMotion()) {
          const finalValue = roundRef.current ? Math.round(targetRef.current) : parseFloat(targetRef.current.toFixed(decimalPlacesRef.current));
          setValue(finalValue);
          setHasAnimated(true);
          hasAnimatedRef.current = true;
          return;
        }

        // Start the count-up animation
        cancelAnimationRef.current = runCountUp({
          target: targetRef.current,
          start: startRef.current,
          duration: durationRef.current,
          easing: easingRef.current,
          round: roundRef.current,
          decimalPlaces: decimalPlacesRef.current,
          onUpdate: (newValue) => {
            setValue(newValue);
          },
          onComplete: () => {
            setHasAnimated(true);
            hasAnimatedRef.current = true;
          },
        });
      } else if (!entry.isIntersecting && !onceRef.current && hasBeenInViewRef.current) {
        // Element left viewport and once is false, reset for next animation
        hasBeenInViewRef.current = false;
        hasAnimatedRef.current = false;
        setValue(startRef.current);
        setHasAnimated(false);
        
        // Cancel any ongoing animation
        if (cancelAnimationRef.current) {
          cancelAnimationRef.current();
          cancelAnimationRef.current = null;
        }
      }
    };

    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    // Start observing
    observerRef.current.observe(element);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      // Cancel any ongoing animation only on unmount
      if (cancelAnimationRef.current) {
        cancelAnimationRef.current();
        cancelAnimationRef.current = null;
      }
    };
  }, [threshold, rootMargin, checkReducedMotion]);

  return {
    ref,
    value,
    hasAnimated,
  };
};
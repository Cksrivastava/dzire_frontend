import { useEffect, useRef, useState } from "react";

export const useAutoScroll = (containerRef, scrollNextFn, delay = 10000, inactivityDelay = 10000) => {
  const [isPaused, setIsPaused] = useState(false);
  const isCursorInside = useRef(false);
  const isPausedRef = useRef(false);
  const inactivityTimer = useRef(null);
  const autoScrollTimer = useRef(null);
  const scrollNextRef = useRef(scrollNextFn);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Keep scrollNextRef up to date with the latest callback
  useEffect(() => {
    scrollNextRef.current = scrollNextFn;
  }, [scrollNextFn]);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    if (isCursorInside.current) {
      inactivityTimer.current = setTimeout(() => {
        if (isCursorInside.current) {
          setIsPaused(false); // Auto-resume scroll
        }
      }, inactivityDelay);
    }
  };

  const startAutoScroll = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    autoScrollTimer.current = setInterval(() => {
      if (scrollNextRef.current) scrollNextRef.current();
    }, delay);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  useEffect(() => {
    if (isPaused) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
    return () => stopAutoScroll();
  }, [isPaused, delay]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseEnter = () => {
      isCursorInside.current = true;
      setIsPaused((prev) => (!prev ? true : prev));
      resetInactivityTimer();
    };

    const handleMouseLeave = () => {
      isCursorInside.current = false;
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      setIsPaused((prev) => (prev ? false : prev));
    };

    const handleMouseMove = () => {
      if (!isCursorInside.current) return;
      if (!isPausedRef.current) {
        setIsPaused(true);
      }
      resetInactivityTimer();
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mousemove", handleMouseMove);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      stopAutoScroll();
    };
  }, [containerRef]);
};

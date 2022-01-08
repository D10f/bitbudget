import { RefObject, useEffect, useRef } from "react";

type HookProps = (
  // element: React.MutableRefObject<HTMLElement>,
  element: RefObject<HTMLElement>,
  callback: () => void
) => void;

/**
 * It detects whether the provided element reference is clicked on,
 * and invokes the callback when click event happens outside.
 * Credit: /watch?v=J-g9ZJha8FE
 */
export const useClickOutside: HookProps = (element, callback) => {
  const callbackRef = useRef<() => void>();
  callbackRef.current = callback;

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const target = e.target as Node;

      if (!element?.current?.contains(target) && callbackRef.current) {
        callback();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, element]);
};

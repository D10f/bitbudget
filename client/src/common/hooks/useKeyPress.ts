import { useEffect, useRef } from "react";

export const useKeyPress = (key: string, callback: () => void) => {
  const callbackRef = useRef<() => void>();
  callbackRef.current = callback;

  useEffect(() => {
    const _callback = (e: KeyboardEvent) => {
      if (e.key === key) {
        callbackRef.current && callbackRef.current();
      }
    };
    document.addEventListener("keydown", _callback);
    return () => {
      document.removeEventListener("keydown", _callback);
    };
  }, [key]);
};

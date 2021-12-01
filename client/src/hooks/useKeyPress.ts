import { useEffect } from "react";

export const useKeyPress = (key: string, callback: () => void) => {
  useEffect(() => {
    const _callback = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback();
      }
    }
    document.addEventListener('keydown', _callback);
    return () => {
      document.removeEventListener('keydown', _callback);
    }
  }, []);
};
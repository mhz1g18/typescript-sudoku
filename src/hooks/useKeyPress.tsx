import { useEffect } from "react";

export default function useKeypress(key: string, action: any) {
  useEffect(() => {
    function onKeyup(e: any) {
      if (e.key === key || key.includes(e.key)) action(e);
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [key, action]);
}

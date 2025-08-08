import { useCallback } from "react";

export function useToast() {
  const toast = useCallback((message: string) => {
    alert(message); 
  }, []);

  return { toast };
}

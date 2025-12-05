"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export function useFetch<T = any>(url: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data: T = await res.json();
      setState({ data, loading: false, error: null });
    } catch (error: any) {
      setState({ data: null, loading: false, error });
      toast.error(error.message || "Something went wrong");
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

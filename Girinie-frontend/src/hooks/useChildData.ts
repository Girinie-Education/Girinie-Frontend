// src/hooks/useChildData.ts
import { useState, useEffect, useCallback } from "react";
import { fetchChildUsers, ChildUser } from "@/lib/childData";

export const useChildData = () => {
  const [data, setData] = useState<ChildUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchChildUsers();
      setData(list);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
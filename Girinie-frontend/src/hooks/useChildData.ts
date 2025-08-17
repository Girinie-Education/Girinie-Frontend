import { useState, useEffect } from "react";
import { fetchChildUsers, ChildUser } from "@/lib/childData";

export const useChildData = () => {
  const [data,    setData]    = useState<ChildUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchChildUsers()
      .then((list) => setData(list))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

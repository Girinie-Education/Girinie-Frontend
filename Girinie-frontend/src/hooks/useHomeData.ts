import { useState, useEffect } from "react";
import { getHomeData, HomeChildData } from "@/api/home";
import { useAuthStore } from "@/stores/authStore";

export function useHomeData() {
  const { isLoggedIn } = useAuthStore();
  const [data, setData] = useState<HomeChildData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getHomeData();
        setData(result);
      } catch (e) {
        setError("데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  return { data, loading, error };
}
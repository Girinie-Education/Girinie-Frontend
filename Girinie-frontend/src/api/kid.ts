import axios from "axios";

/**
 * 자녀의 월별 칭찬(도장) 데이터 조회
 * @param childId 자녀 ID
 * @param year 연도 (예: "2025")
 * @param month 월 (예: "08")
 */
export async function fetchKidStamps(childId: string, year: string, month: string): Promise<any[]> {
  const response = await axios.get(`/calendar/${childId}/${year}/${month}/`);
  return response.data;
}

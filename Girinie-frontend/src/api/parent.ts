import axios from "axios";
//모든 칭찬 데이터 조회
export async function fetchAllRewards(childId: string): Promise<any[]> {
  const response = await axios.get(`/calendar/${childId}/`);
  return response.data;
}

//자녀의 특정 연월 칭찬 데이터를 조회
export async function fetchMonthlyRewards(
  childId: string,
  year: string,
  month: string
): Promise<any[]> {
  const response = await axios.get(`/calendar/${childId}/${year}/${month}/`);
  return response.data;
}

//자녀에게 칭찬(스티커)을 추가
export async function createReward(
  childId: string,
  data: { date: string; sticker_type: number; message?: string }
): Promise<any> {
  const response = await axios.post(`/calendar/${childId}/`, data);
  return response.data;
}

//자녀의 칭찬 데이터를 수정
export async function updateReward(
  childId: string,
  data: { date: string; sticker_type: number; message?: string }
): Promise<any> {
  const response = await axios.put(`/calendar/${childId}/`, data);
  return response.data;
}

//자녀의 칭찬 데이터를 삭제
export async function deleteReward(childId: string, date: string): Promise<void> {
  await axios.delete(`/calendar/${childId}/`, { data: { date } });
}

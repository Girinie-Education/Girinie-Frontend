// src/api/parent.ts
import { apiClient } from "@/api/common";

// ==== Types (Swagger aligned) ====
// GET /calendar/{child_id}/{year}/{month}/  ->  RewardCalendar[]
export interface RewardCalendar {
  id: number; // readOnly
  child: number; // readOnly
  date: string; // YYYY-MM-DD
  sticker_type: number; // enum (1..n)
  sticker_label?: string; // readOnly
  message?: string; // <= 255
  created_at?: string; // readOnly
  updated_at?: string; // readOnly
}

// ==== Helpers ====
const toList = (data: any): RewardCalendar[] => {
  // Swagger says array, but be defensive
  if (Array.isArray(data)) return data as RewardCalendar[];
  if (Array.isArray(data?.results)) return data.results as RewardCalendar[];
  return [];
};

// ==== APIs ====
/** 자녀의 특정 연/월 칭찬 데이터 조회 (Swagger: GET /calendar/{child_id}/{year}/{month}/) */
export async function fetchMonthlyRewards(
  childId: string | number,
  year: string | number,
  month: string | number
): Promise<RewardCalendar[]> {
  const id = String(childId);
  const yyyy = String(year);
  const mm = String(month).padStart(2, "0");
  const url = `/calendar/${id}/${yyyy}/${mm}/`;
  try {
    console.log("[parentApi] GET", url);
    const res = await apiClient.get(url);
    const list = toList(res.data);
    console.log("[parentApi] GET ok", url, {
      status: res.status,
      count: list.length,
      sample: list[0],
    });
    return list;
  } catch (error: any) {
    const payload = error?.response?.data ?? error?.message ?? error;
    console.error("[parentApi] GET failed", url, payload);
    throw payload;
  }
}

/** 자녀의 특정 일자 칭찬 추가 (예: POST /calendar/{child_id}/) — 필요 시 확장 */
export interface RewardUpsertPayload {
  date: string; // YYYY-MM-DD
  sticker_type: number;
  message?: string;
}

export async function createReward(
  childId: string | number,
  body: RewardUpsertPayload
): Promise<RewardCalendar> {
  const id = String(childId);
  const url = `/calendar/${id}/`;
  try {
    console.log("[parentApi] POST", url, { body });
    const res = await apiClient.post(url, body);
    console.log("[parentApi] POST ok", url, { status: res.status, data: res.data });
    return res.data as RewardCalendar;
  } catch (error: any) {
    const payload = error?.response?.data ?? error?.message ?? error;
    console.error("[parentApi] POST failed", url, payload);
    throw payload;
  }
}

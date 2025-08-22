import { apiClient } from "@/api/common";

export interface ChildUser {
  id: number;
  name: string;
  age: number;
  color: string;
  avatarUrl?: string | null;
  parent: number;
  order_level: number;
  manners_level: number;
  selfcare_level: number;
  clean_level: number;
  calm_level: number;
  kindness_level: number;
  saving_level: number;
  eating_level: number;
  average_level: number;
  created_at: string;
  updated_at: string;
}

/** 부모의 자녀 리스트 조회 (GET) */
export const fetchChildUsers = (): Promise<ChildUser[]> =>
  apiClient.get<ChildUser[]>("/child_users/").then((r) => r.data);

/** 자녀 정보 부분 수정 (PATCH) */
export const patchChildUser = (
  childId: number,
  data: Partial<ChildUser>
): Promise<ChildUser> => {
  return apiClient
    .patch<ChildUser>(`/child_users/${childId}/`, data)
    .then((r) => r.data);
};

/** 자녀 정보 전체 수정 (PUT) - JSON 사용 */
export const putChildUser = (
  childId: number,
  data: { name: string; age: number; color: string; avatarUrl: string }
): Promise<ChildUser> => {
  return apiClient
    .put<ChildUser>(`/child_users/${childId}/`, data)
    .then((r) => r.data);
};
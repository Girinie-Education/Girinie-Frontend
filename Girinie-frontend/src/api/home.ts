import { apiClient } from "./common";

export interface HomeChildData {
  // id: number;
  name: string;
  age: number;
  avatarUrl: string;
  streak: number;
  top_3_stickers: Sticker[];
  quote: string;
  conversation: string;
  color: string;
}

export interface Sticker {
  sticker_type: number;
  label: string;
  count: number;
}

export const getHomeData = async (): Promise<HomeChildData[]> => {
  const res = await apiClient.get("/home/");
  return res.data;
};
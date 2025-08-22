import { apiClient } from "@/api/common";

export interface LevelUpLog {
  id: number;
  child_name: string;
  category: string;
  category_display: string;
  level: number;
  created_at: string;
}

export async function fetchAllLevelUpLogs(): Promise<LevelUpLog[]> {
  const response = await apiClient.get("/logs/levelup/");
  return response.data;
}

export async function fetchChildLevelUpLogs(childId: number): Promise<LevelUpLog[]> {
  const response = await apiClient.get(`/logs/levelup/child/${childId}/`);
  return response.data;
}

export interface ChildUser {
  id: number;
  name: string;
  age: number;
  color: string;
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

export async function fetchChildUser(id: number): Promise<ChildUser> {
  const response = await apiClient.get(`/child_users/${id}/`);
  return response.data;
}

export function transformLogsToChartData(logs: LevelUpLog[]) {
  const categories = ["질서", "배려", "책임", "정직", "표현", "집중"];
  
  const categoryMap: { [key: string]: string } = {
    "order": "질서",
    "consideration": "배려", 
    "responsibility": "책임",
    "honesty": "정직",
    "expression": "표현",
    "concentration": "집중"
  };

  const categoryLevels: { [key: string]: number[] } = {};
  
  logs.forEach(log => {
    const koreanCategory = categoryMap[log.category] || log.category_display;
    if (!categoryLevels[koreanCategory]) {
      categoryLevels[koreanCategory] = [];
    }
    categoryLevels[koreanCategory].push(log.level);
  });

  const radarData = categories.map(category => {
    const levels = categoryLevels[category] || [];
    const avgLevel = levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
    return {
      subject: category,
      A: Math.round(avgLevel * 25)
    };
  });

  const barData = categories.map(category => {
    const levels = categoryLevels[category] || [];
    const maxLevel = levels.length > 0 ? Math.max(...levels) : 0;
    return {
      name: category,
      level: maxLevel
    };
  });

  return { radarData, barData };
}

export function transformChildUserToChartData(child: ChildUser) {
  const levelMap = {
    "질서": child.order_level,
    "예절": child.manners_level,
    "자존": child.selfcare_level,
    "청결": child.clean_level,
    "감정조절": child.calm_level,
    "존중": child.kindness_level,
    "절약": child.saving_level,
    "식습관": child.eating_level,
  };

  const radarData = Object.entries(levelMap).map(([category, level]) => ({
    subject: category,
    A: Math.round(level * 25) // 0-4 레벨을 0-100으로 변환
  }));

  const barData = Object.entries(levelMap).map(([category, level]) => ({
    name: category,
    level: level
  }));

  return { radarData, barData };
}
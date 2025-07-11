// src/api/common.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://c6160fcb58ee.ngrok-free.app/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

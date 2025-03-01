import axios from "axios";
import { type Task } from "@/types";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const createTask = async (task: Partial<Task>) => {
  const response = await api.post("/tasks", task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  // Assurez-vous que l'ID est valide
  if (!id) {
    throw new Error("Task ID is required for update");
  }

  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string) => {
  // Assurez-vous que l'ID est valide
  if (!id) {
    throw new Error("Task ID is required for deletion");
  }

  // Utilisez toujours l'ID MongoDB (_id) pour les opérations de suppression
  const taskId = id.includes("_id") ? id : id;

  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export default api;

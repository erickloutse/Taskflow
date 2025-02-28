export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Task {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignees: User[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  createdAt: string;
}

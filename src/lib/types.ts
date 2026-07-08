export type UserRole = "manager" | "assignee";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "blocked" | "completed";

export const TASK_STATUSES: TaskStatus[] = [
  "todo",
  "in-progress",
  "blocked",
  "completed",
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To-Do",
  "in-progress": "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export interface TaskComment {
  author: string;
  text: string;
  timestamp: number;
}

export interface TaskHistoryEntry {
  action: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeEmail: string;
  assigneeUid: string;
  createdBy: string;
  createdByEmail: string;
  startDate: number;
  dueDate: number;
  priority: TaskPriority;
  status: TaskStatus;
  comments: TaskComment[];
  history: TaskHistoryEntry[];
}

export type NewTaskInput = Pick<
  Task,
  | "title"
  | "description"
  | "assigneeEmail"
  | "assigneeUid"
  | "startDate"
  | "dueDate"
  | "priority"
  | "status"
>;

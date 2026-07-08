import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { NewTaskInput, Task, TaskStatus } from "./types";

function tasksCollection() {
  return collection(db!, "tasks");
}

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === "number") return value;
  return Date.now();
}

function fromSnapshot(id: string, data: Record<string, unknown>): Task {
  return {
    id,
    title: data.title as string,
    description: data.description as string,
    assigneeEmail: data.assigneeEmail as string,
    assigneeUid: data.assigneeUid as string,
    createdBy: data.createdBy as string,
    createdByEmail: data.createdByEmail as string,
    startDate: toMillis(data.startDate),
    dueDate: toMillis(data.dueDate),
    priority: data.priority as Task["priority"],
    status: data.status as TaskStatus,
    comments: (data.comments as Task["comments"]) ?? [],
    history: (data.history as Task["history"]) ?? [],
  };
}

export function subscribeToManagerTasks(
  managerUid: string,
  cb: (tasks: Task[]) => void
): Unsubscribe {
  const q = query(
    tasksCollection(),
    where("createdBy", "==", managerUid),
    orderBy("dueDate", "asc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => fromSnapshot(d.id, d.data())));
  });
}

export function subscribeToAssigneeTasks(
  assigneeUid: string,
  cb: (tasks: Task[]) => void
): Unsubscribe {
  const q = query(
    tasksCollection(),
    where("assigneeUid", "==", assigneeUid),
    orderBy("dueDate", "asc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => fromSnapshot(d.id, d.data())));
  });
}

export async function createTask(
  input: NewTaskInput,
  createdBy: string,
  createdByEmail: string
) {
  await addDoc(tasksCollection(), {
    ...input,
    createdBy,
    createdByEmail,
    comments: [],
    history: [
      {
        action: `Task created by ${createdByEmail}`,
        timestamp: Date.now(),
      },
    ],
  });
}

export async function updateTask(
  taskId: string,
  changes: Partial<NewTaskInput>,
  actorEmail: string
) {
  const historyLines = Object.entries(changes).map(
    ([key, value]) => `${actorEmail} changed ${key} to ${String(value)}`
  );
  await updateDoc(doc(db!, "tasks", taskId), {
    ...changes,
    history: arrayUnion(
      ...historyLines.map((action) => ({ action, timestamp: Date.now() }))
    ),
  });
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  actorEmail: string
) {
  await updateDoc(doc(db!, "tasks", taskId), {
    status,
    history: arrayUnion({
      action: `${actorEmail} moved task to ${status}`,
      timestamp: Date.now(),
    }),
  });
}

export async function addTaskComment(
  taskId: string,
  author: string,
  text: string
) {
  await updateDoc(doc(db!, "tasks", taskId), {
    comments: arrayUnion({ author, text, timestamp: Date.now() }),
  });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db!, "tasks", taskId));
}

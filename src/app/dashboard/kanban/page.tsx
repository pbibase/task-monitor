"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import TaskFormModal from "@/components/TaskFormModal";
import { useAuth } from "@/context/AuthContext";
import { listUsers } from "@/lib/users";
import { subscribeToAssigneeTasks, subscribeToManagerTasks, updateTaskStatus } from "@/lib/tasks";
import type { Task, TaskStatus, UserProfile } from "@/lib/types";
import { STATUS_LABELS, TASK_STATUSES } from "@/lib/types";

function KanbanContent() {
  const { profile, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const isManager = profile?.role === "manager";

  useEffect(() => {
    if (!user || !profile) return;
    const unsub = isManager
      ? subscribeToManagerTasks(user.uid, setTasks)
      : subscribeToAssigneeTasks(user.uid, setTasks);
    return unsub;
  }, [user, profile, isManager]);

  useEffect(() => {
    if (isManager) {
      listUsers().then(setUsers);
    }
  }, [isManager]);

  if (!profile || !user) return null;

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const editingTask = tasks.find((t) => t.id === editingTaskId) ?? null;

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId as TaskStatus;
    await updateTaskStatus(draggableId, newStatus, profile!.email);
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-1">
        <h1 className="text-xl font-semibold mb-4">Kanban board</h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TASK_STATUSES.map((status) => {
              const columnTasks = tasks.filter((t) => t.status === status);
              return (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-lg border border-gray-200 p-3 min-h-[300px] space-y-2 ${
                        snapshot.isDraggingOver ? "bg-gray-50" : "bg-gray-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium text-gray-700">
                          {STATUS_LABELS[status]}
                        </h2>
                        <span className="text-xs text-gray-400">
                          {columnTasks.length}
                        </span>
                      </div>

                      {columnTasks.map((task, index) => (
                        <Draggable draggableId={task.id} index={index} key={task.id}>
                          {(dragProvided) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => setSelectedTaskId(task.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </main>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onEdit={() => {
            setEditingTaskId(selectedTask.id);
            setSelectedTaskId(null);
            setFormOpen(true);
          }}
          currentUserEmail={profile.email}
          isManager={isManager}
        />
      )}

      {formOpen && (
        <TaskFormModal
          key={editingTaskId ?? "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          users={users}
          currentUserUid={user.uid}
          currentUserEmail={profile.email}
          editingTask={editingTask}
        />
      )}
    </div>
  );
}

export default function KanbanPage() {
  return (
    <ProtectedRoute>
      <KanbanContent />
    </ProtectedRoute>
  );
}

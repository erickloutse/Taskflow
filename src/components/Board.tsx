import { useDroppable } from "@dnd-kit/core";
import { type Column } from "@/types";
import TaskCard from "./TaskCard";

interface BoardProps {
  columns: Column[];
}

export default function Board({ columns }: BoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
}

function Column({ column }: { column: Column }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const columnClass =
    {
      "To Do": "column-todo",
      "In Progress": "column-in-progress",
      Done: "column-done",
    }[column.title] || "";

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl shadow-lg backdrop-blur-sm p-4 ${columnClass}`}
    >
      <h3 className="font-bold text-lg mb-4 text-center">{column.title}</h3>
      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={(updatedTask) => {
              // Handle task update
              console.log("Task updated:", updatedTask);
            }}
            onDelete={(taskId) => {
              // Handle task deletion
              console.log("Task deleted:", taskId);
            }}
          />
        ))}
      </div>
    </div>
  );
}

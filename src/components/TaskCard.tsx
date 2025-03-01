import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { type Task } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditTaskDialog from "./tasks/EditTaskDialog";
import { useToast } from "@/hooks/use-toast";
import { deleteTask, updateTask } from "@/lib/api";

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id || task._id,
      data: task,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : undefined,
      }
    : undefined;

  const priorityColors = {
    low: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const priorityIcons = {
    low: <ArrowRight className="h-4 w-4" />,
    medium: <Clock className="h-4 w-4" />,
    high: <AlertCircle className="h-4 w-4" />,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation de l'événement
    try {
      await deleteTask(task.id || task._id);
      onDelete(task.id || task._id);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation de l'événement
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (updatedTask: Task) => {
    try {
      const result = await updateTask(task.id || task._id, updatedTask);
      onUpdate(result);
      return result;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "task-card bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg cursor-move",
          "hover:shadow-xl transition-all duration-300",
          `priority-${task.priority}`,
          isDragging && "opacity-50"
        )}
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-lg">{task.title}</h4>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("ml-2", priorityColors[task.priority])}
            >
              <span className="flex items-center gap-1">
                {priorityIcons[task.priority]}
                {task.priority}
              </span>
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-indigo-600"
              onClick={handleEdit}
              type="button"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-600"
              onClick={handleDelete}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(task.dueDate), "MMM dd")}</span>
          </div>

          <div className="flex items-center -space-x-2">
            {task.assignees && task.assignees.length > 0 ? (
              task.assignees.map((assignee) => (
                <Avatar
                  key={assignee.id || assignee._id}
                  className="h-8 w-8 border-2 border-background transition-transform hover:scale-110"
                >
                  <AvatarImage src={assignee.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                No assignees
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdate}
      />
    </>
  );
}

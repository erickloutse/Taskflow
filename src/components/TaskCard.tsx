import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
  Users,
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

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => Promise<Task>;
  onDelete: (taskId: string) => Promise<void>;
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
    e.preventDefault();
    e.stopPropagation();

    const taskId = task._id || task.id;
    if (!taskId) {
      toast({
        title: "Error",
        description: "Task ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await onDelete(taskId);
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
    e.preventDefault();
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (updatedTask: Task) => {
    try {
      const result = await onUpdate(updatedTask);
      return result;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  return (
    <>
      {/* Boutons d'action positionnés au-dessus de la carte */}
      <div className="relative mb-8">
        <div className="absolute -top-3 right-2 flex gap-1 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white hover:bg-indigo-100 text-indigo-600 shadow-md"
            onClick={handleEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white hover:bg-red-100 text-red-600 shadow-md"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

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
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {task.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), "MMM dd")}</span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {task.assignees?.length || 0} assignee(s)
                </span>
              </div>
              <div className="flex items-center -space-x-2">
                {task.assignees && task.assignees.length > 0 ? (
                  task.assignees.slice(0, 3).map((assignee) => (
                    <Avatar
                      key={assignee.id || assignee._id}
                      className="h-6 w-6 border-2 border-background transition-transform hover:scale-110"
                    >
                      <AvatarImage src={assignee.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                        {assignee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No assignees
                  </span>
                )}
                {task.assignees && task.assignees.length > 3 && (
                  <Avatar className="h-6 w-6 border-2 border-background bg-gray-200">
                    <AvatarFallback className="text-xs">
                      +{task.assignees.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdate}
      />
    </>
  );
}

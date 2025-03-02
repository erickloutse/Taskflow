import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Task } from "@/types";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  title: z.string().min(1),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date(),
});

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (task: Task) => Promise<Task>;
}

export default function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
}: EditTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: new Date(task.dueDate),
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const updatedTask = await onUpdate({
        ...task,
        ...data,
      });

      onOpenChange(false);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("dueDate", date);
      setCalendarOpen(false); // Ferme le calendrier après la sélection
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Task title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message as string}
              </p>
            )}
          </div>
          <div>
            <Textarea placeholder="Description" {...register("description")} />
          </div>
          <div>
            <Select
              onValueChange={(value) => setValue("priority", value as any)}
              defaultValue={task.priority}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch("dueDate") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("dueDate") ? (
                    format(watch("dueDate"), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("dueDate")}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

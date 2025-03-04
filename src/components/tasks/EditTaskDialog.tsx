import { useState, useEffect } from "react";
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
import { CalendarIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsers } from "@/lib/api";
import { User, Task } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  title: z.string().min(1),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date(),
  assignees: z.array(z.string()).optional(),
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: new Date(task.dueDate),
      assignees: [],
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (open) {
      // Reset form with task values
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: new Date(task.dueDate),
        assignees: [],
      });

      // Set selected assignees
      if (task.assignees && task.assignees.length > 0) {
        const assigneeIds = task.assignees.map(
          (assignee) => assignee._id || (assignee.id as string)
        );
        setSelectedAssignees(assigneeIds);
      } else {
        setSelectedAssignees([]);
      }
    }
  }, [open, task, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const updatedTask = {
        ...task,
        ...data,
        assignees: selectedAssignees,
      };

      await onUpdate(updatedTask);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
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
      setCalendarOpen(false); // Close the calendar after selection
    }
  };

  const handleAssigneeToggle = (userId: string) => {
    setSelectedAssignees((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assign Team Members
            </Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id || user.id}
                    className="flex items-center space-x-2 py-2"
                  >
                    <Checkbox
                      id={`edit-user-${user._id || user.id}`}
                      checked={selectedAssignees.includes(
                        user._id || (user.id as string)
                      )}
                      onCheckedChange={() =>
                        handleAssigneeToggle(user._id || (user.id as string))
                      }
                    />
                    <Label
                      htmlFor={`edit-user-${user._id || user.id}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-indigo-500 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  No team members available
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

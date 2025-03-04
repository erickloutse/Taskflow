import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { CalendarIcon, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsers } from "@/lib/api";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const schema = z.object({
  title: z.string().min(1),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date(),
  assignees: z.array(z.string()).optional(),
});

interface CreateTaskDialogProps {
  onCreateTask: (task: any) => Promise<any>;
}

export default function CreateTaskDialog({
  onCreateTask,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

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
      priority: "medium",
      dueDate: new Date(),
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

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onCreateTask({
        ...data,
        status: "todo",
        assignees: selectedAssignees,
      });
      setOpen(false);
      reset();
      setSelectedAssignees([]);
    } catch (error) {
      console.error("Error creating task:", error);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
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
              defaultValue="medium"
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
                      id={`user-${user._id || user.id}`}
                      checked={selectedAssignees.includes(
                        user._id || (user.id as string)
                      )}
                      onCheckedChange={() =>
                        handleAssigneeToggle(user._id || (user.id as string))
                      }
                    />
                    <Label
                      htmlFor={`user-${user._id || user.id}`}
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
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

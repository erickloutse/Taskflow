import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Layers, Plus, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import Board from "@/components/Board";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import { type Task, type Column } from "@/types";
import { createTask, getTasks, updateTask, deleteTask } from "@/lib/api";

const initialColumns: Column[] = [
  {
    id: "1",
    title: "To Do",
    tasks: [],
  },
  {
    id: "2",
    title: "In Progress",
    tasks: [],
  },
  {
    id: "3",
    title: "Done",
    tasks: [],
  },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // 10px of movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay before drag starts
        tolerance: 5, // 5px of movement allowed before drag starts
      },
    })
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks();

      // Organize tasks into columns
      const updatedColumns = [...initialColumns].map((col) => ({
        ...col,
        tasks: [],
      }));

      tasks.forEach((task: Task) => {
        if (task.status === "todo") {
          updatedColumns[0].tasks.push(task);
        } else if (task.status === "in-progress") {
          updatedColumns[1].tasks.push(task);
        } else if (task.status === "done") {
          updatedColumns[2].tasks.push(task);
        }
      });

      setColumns(updatedColumns);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await createTask(taskData);
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        const todoColumn = newColumns.find((col) => col.title === "To Do");
        if (todoColumn) {
          todoColumn.tasks.push(newTask);
        }
        return newColumns;
      });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      return newTask;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const taskId = updatedTask._id || updatedTask.id;
      if (!taskId) {
        throw new Error("Task ID not found");
      }

      const result = await updateTask(taskId, updatedTask);

      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];

        // Find and remove the task from its current column
        newColumns.forEach((column) => {
          const taskIndex = column.tasks.findIndex(
            (t) => (t.id || t._id) === taskId
          );
          if (taskIndex !== -1) {
            column.tasks.splice(taskIndex, 1);
          }
        });

        // Add the updated task to the appropriate column
        const targetColumn = newColumns.find((col) => {
          if (updatedTask.status === "todo") return col.title === "To Do";
          if (updatedTask.status === "in-progress")
            return col.title === "In Progress";
          if (updatedTask.status === "done") return col.title === "Done";
          return false;
        });

        if (targetColumn) {
          targetColumn.tasks.push(result);
        }

        return newColumns;
      });

      toast({
        title: "Success",
        description: "Task updated successfully",
      });

      return result;
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setColumns((prevColumns) => {
        return prevColumns.map((column) => ({
          ...column,
          tasks: column.tasks.filter(
            (task) => (task.id || task._id) !== taskId
          ),
        }));
      });

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = active.data.current as Task;
    const overId = over.id as string;

    // Find the target column
    const targetColumn = columns.find((col) => col.id === overId);
    if (!targetColumn) return;

    // Map column title to status
    const statusMap: Record<string, Task["status"]> = {
      "To Do": "todo",
      "In Progress": "in-progress",
      Done: "done",
    };

    const newStatus = statusMap[targetColumn.title];
    if (!newStatus || activeTask.status === newStatus) return;

    try {
      // Update task status in the backend
      const taskId = activeTask._id || activeTask.id;
      if (!taskId) {
        throw new Error("Task ID not found");
      }

      const updatedTask = await updateTask(taskId, {
        ...activeTask,
        status: newStatus,
      });

      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];

        // Remove task from source column
        const sourceColumn = newColumns.find((col) =>
          col.tasks.some((task) => (task.id || task._id) === taskId)
        );
        if (sourceColumn) {
          sourceColumn.tasks = sourceColumn.tasks.filter(
            (task) => (task.id || task._id) !== taskId
          );
        }

        // Add task to target column
        const targetColumn = newColumns.find((col) => col.id === overId);
        if (targetColumn) {
          targetColumn.tasks.push(updatedTask);
        }

        return newColumns;
      });

      toast({
        title: "Task Updated",
        description: `Task moved to ${targetColumn.title}`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl">
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Task Manager
            </h1>
          </div>

          {isRegisterMode ? <RegisterForm /> : <LoginForm />}

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isRegisterMode
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-indigo-50"
          >
            <Menu className="h-6 w-6 text-indigo-600" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Task Manager
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <CreateTaskDialog onCreateTask={handleCreateTask} />
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 text-red-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <motion.div
          initial={false}
          animate={{
            width: isSidebarOpen ? "240px" : "0px",
            opacity: isSidebarOpen ? 1 : 0,
          }}
          className="border-r bg-white/80 backdrop-blur-sm"
        >
          <Sidebar />
        </motion.div>

        <main className="flex-1 overflow-auto p-6">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <Board columns={columns} />
          </DndContext>
        </main>
      </div>
    </div>
  );
}

export default App;

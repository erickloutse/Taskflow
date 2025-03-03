import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type Task } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Grouper les tâches par date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = format(new Date(task.dueDate), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            View and manage your tasks in a calendar view.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1"
          >
            <CalendarIcon className="mr-1 h-3 w-3" />
            {tasks.length} Tasks
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center border-b">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div key={day} className="py-2 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr">
            {Array.from({
              length:
                new Date(monthStart).getDay() === 0
                  ? 6
                  : new Date(monthStart).getDay() - 1,
            }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-r border-b p-2 min-h-[100px]"
              />
            ))}

            {monthDays.map((day, i) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayTasks = tasksByDate[dateKey] || [];
              const isToday = isSameDay(day, new Date());

              return (
                <motion.div
                  key={i}
                  className={cn(
                    "border-r border-b p-2 min-h-[100px]",
                    isToday && "bg-indigo-50"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                >
                  <div
                    className={cn(
                      "text-right mb-1",
                      isToday && "font-bold text-indigo-600"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.map((task) => (
                      <div
                        key={task._id || task.id}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          task.priority === "high" && "bg-red-100 text-red-800",
                          task.priority === "medium" &&
                            "bg-blue-100 text-blue-800",
                          task.priority === "low" &&
                            "bg-green-100 text-green-800"
                        )}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Upcoming Tasks</h3>
        <div className="space-y-2">
          {tasks
            .filter((task) => new Date(task.dueDate) >= new Date())
            .sort(
              (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            )
            .slice(0, 5)
            .map((task) => (
              <Card key={task._id || task.id} className="overflow-hidden">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(task.dueDate), "PPP", { locale: fr })}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      task.priority === "high" &&
                        "bg-red-100 text-red-800 hover:bg-red-200",
                      task.priority === "medium" &&
                        "bg-blue-100 text-blue-800 hover:bg-blue-200",
                      task.priority === "low" &&
                        "bg-green-100 text-green-800 hover:bg-green-200"
                    )}
                  >
                    {task.priority}
                  </Badge>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

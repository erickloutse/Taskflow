import { useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Layers, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import Board from '@/components/Board';
import { type Task, type Column } from '@/types';

const initialColumns: Column[] = [
  {
    id: '1',
    title: 'To Do',
    tasks: [],
  },
  {
    id: '2',
    title: 'In Progress',
    tasks: [],
  },
  {
    id: '3',
    title: 'Done',
    tasks: [],
  },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = active.data.current as Task;
    const overId = over.id as string;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      
      // Remove task from source column
      const sourceColumn = newColumns.find(col => 
        col.tasks.some(task => task.id === activeTask.id)
      );
      if (sourceColumn) {
        sourceColumn.tasks = sourceColumn.tasks.filter(
          task => task.id !== activeTask.id
        );
      }

      // Add task to target column
      const targetColumn = newColumns.find(col => col.id === overId);
      if (targetColumn) {
        targetColumn.tasks.push({
          ...activeTask,
          status: targetColumn.title.toLowerCase() as Task['status'],
        });

        toast({
          title: 'Task Updated',
          description: `Task moved to ${targetColumn.title}`,
        });
      }

      return newColumns;
    });
  };

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
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <motion.div
          initial={false}
          animate={{
            width: isSidebarOpen ? '240px' : '0px',
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
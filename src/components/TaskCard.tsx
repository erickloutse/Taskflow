import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Calendar, Users, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { type Task } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const priorityColors = {
    low: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const priorityIcons = {
    low: <ArrowRight className="h-4 w-4" />,
    medium: <Clock className="h-4 w-4" />,
    high: <AlertCircle className="h-4 w-4" />,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'task-card bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg cursor-move',
        'hover:shadow-xl transition-all duration-300',
        `priority-${task.priority}`
      )}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-lg">{task.title}</h4>
        <Badge variant="outline" className={cn('ml-2', priorityColors[task.priority])}>
          <span className="flex items-center gap-1">
            {priorityIcons[task.priority]}
            {task.priority}
          </span>
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
        </div>
        
        <div className="flex items-center -space-x-2">
          {task.assignees.map((assignee) => (
            <Avatar 
              key={assignee.id} 
              className="h-8 w-8 border-2 border-background transition-transform hover:scale-110"
            >
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                {assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
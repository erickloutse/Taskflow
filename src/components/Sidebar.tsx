import { motion } from "framer-motion";
import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "#dashboard",
    color: "from-indigo-500 to-purple-500",
    content: "Task Board View",
  },
  {
    icon: Users,
    label: "Team",
    href: "#team",
    color: "from-purple-500 to-green-500",
    content: "Team Members & Collaboration",
  },
  {
    icon: Calendar,
    label: "Calendar",
    href: "#calendar",
    color: "from-pink-500 to-yellow-500",
    content: "Task Calendar View",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#settings",
    color: "from-rose-500 to-orange-500",
    content: "Application Settings",
  },
];

interface SidebarProps {
  activeItem: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeItem, onViewChange }: SidebarProps) {
  const handleItemClick = (label: string, href: string) => {
    onViewChange(label);
    window.location.hash = href;
  };

  return (
    <div className="h-full p-4">
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start group relative overflow-hidden",
                "hover:bg-transparent",
                activeItem === item.label && "bg-gradient-to-r bg-opacity-10",
                activeItem === item.label && item.color
              )}
              onClick={() => handleItemClick(item.label, item.href)}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                  "bg-gradient-to-r",
                  item.color
                )}
              />
              <item.icon
                className={cn(
                  "mr-2 h-4 w-4 transition-colors",
                  activeItem === item.label ? "text-white" : "text-gray-600"
                )}
              />
              <span
                className={cn(
                  activeItem === item.label ? "text-white" : "text-gray-600"
                )}
              >
                {item.label}
              </span>
            </Button>
          </motion.div>
        ))}
      </nav>
    </div>
  );
}

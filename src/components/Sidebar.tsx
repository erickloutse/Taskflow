import { motion } from "framer-motion";
import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "#dashboard",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Users,
    label: "Team",
    href: "#team",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Calendar,
    label: "Calendar",
    href: "#calendar",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#settings",
    color: "from-rose-500 to-orange-500",
  },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");

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
              onClick={() => {
                setActiveItem(item.label);
                window.location.hash = item.href;
              }}
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

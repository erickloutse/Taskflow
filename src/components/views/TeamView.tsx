import { motion } from "framer-motion";
import { Users, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Données fictives pour les membres de l'équipe
const teamMembers = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Project Manager",
    email: "sophie.martin@example.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["Leadership", "Agile", "Communication"],
    projects: 12,
    tasks: 5,
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Frontend Developer",
    email: "thomas.dubois@example.com",
    phone: "+33 6 23 45 67 89",
    location: "Lyon, France",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    projects: 8,
    tasks: 7,
  },
  {
    id: 3,
    name: "Emma Petit",
    role: "Backend Developer",
    email: "emma.petit@example.com",
    phone: "+33 6 34 56 78 90",
    location: "Bordeaux, France",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["Node.js", "Express", "MongoDB"],
    projects: 10,
    tasks: 4,
  },
  {
    id: 4,
    name: "Lucas Bernard",
    role: "UI/UX Designer",
    email: "lucas.bernard@example.com",
    phone: "+33 6 45 67 89 01",
    location: "Marseille, France",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["Figma", "Adobe XD", "Sketch"],
    projects: 15,
    tasks: 3,
  },
  {
    id: 5,
    name: "Camille Roux",
    role: "QA Engineer",
    email: "camille.roux@example.com",
    phone: "+33 6 56 78 90 12",
    location: "Toulouse, France",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["Testing", "Automation", "Cypress"],
    projects: 7,
    tasks: 9,
  },
  {
    id: 6,
    name: "Antoine Moreau",
    role: "DevOps Engineer",
    email: "antoine.moreau@example.com",
    phone: "+33 6 67 89 01 23",
    location: "Lille, France",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    projects: 9,
    tasks: 6,
  },
];

export default function TeamView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team</h2>
          <p className="text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1"
          >
            <Users className="mr-1 h-3 w-3" />
            {teamMembers.length} Members
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-0">
                <div className="flex justify-between items-start">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                    {member.role}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{member.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  {member.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                    <span>
                      {member.projects} Projects • {member.tasks} Active Tasks
                    </span>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

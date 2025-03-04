import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";
import { User } from "@/types";

export default function TeamView() {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Formulaire pour créer/éditer un utilisateur
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
    phone: "",
    location: "",
    skills: [] as string[],
    avatar: "",
  });

  // Récupérer les membres de l'équipe
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const users = await getUsers();
      setTeamMembers(users);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les membres de l'équipe en fonction de la recherche
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gérer le changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer le changement du rôle
  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  // Gérer le changement des compétences
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills }));
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "developer",
      phone: "",
      location: "",
      skills: [],
      avatar: "",
    });
  };

  // Ouvrir le dialogue d'édition
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Ne pas remplir le mot de passe pour des raisons de sécurité
      role: user.role || "developer",
      phone: user.phone || "",
      location: user.location || "",
      skills: user.skills || [],
      avatar: user.avatar || "",
    });
    setEditDialogOpen(true);
  };

  // Ouvrir le dialogue de suppression
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Créer un nouvel utilisateur
  const handleCreateUser = async () => {
    try {
      await createUser(formData);
      toast({
        title: "Success",
        description: "Team member created successfully",
      });
      resetForm();
      setCreateDialogOpen(false);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error creating team member:", error);
      toast({
        title: "Error",
        description: "Failed to create team member",
        variant: "destructive",
      });
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    if (!selectedUser?._id && !selectedUser?.id) return;

    try {
      const userId = selectedUser._id || selectedUser.id;
      const dataToUpdate = { ...formData };

      // Ne pas envoyer le mot de passe s'il est vide
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      await updateUser(userId as string, dataToUpdate);
      toast({
        title: "Success",
        description: "Team member updated successfully",
      });
      resetForm();
      setEditDialogOpen(false);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating team member:", error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!selectedUser?._id && !selectedUser?.id) return;

    try {
      const userId = selectedUser._id || selectedUser.id;
      await deleteUser(userId as string);
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
      setDeleteDialogOpen(false);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  // Générer une URL d'avatar aléatoire
  const getRandomAvatarUrl = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setFormData((prev) => ({
      ...prev,
      avatar: `https://i.pravatar.cc/150?img=${randomId}`,
    }));
  };

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

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search team members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <Plus className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="tester">Tester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Paris, France"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getRandomAvatarUrl}
                    className="whitespace-nowrap"
                  >
                    Generate Random
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create Member</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No team members found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? "Try a different search term"
              : "Add your first team member to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member._id || member.id}
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
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-indigo-600 hover:bg-indigo-100"
                        onClick={() => handleEditClick(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-100"
                        onClick={() => handleDeleteClick(member)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="mt-4">{member.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    {member.location || "No location specified"}
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
                      <span>{member.phone || "No phone number"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                      <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                        {member.role || "Developer"}
                      </Badge>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills && member.skills.length > 0 ? (
                          member.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="bg-indigo-50 text-indigo-700 border-indigo-200"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No skills specified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialogue d'édition */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">
                Password (leave empty to keep current)
              </Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="tester">Tester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-skills">Skills (comma separated)</Label>
              <Input
                id="edit-skills"
                name="skills"
                value={formData.skills.join(", ")}
                onChange={handleSkillsChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-avatar">Avatar URL</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getRandomAvatarUrl}
                  className="whitespace-nowrap"
                >
                  Generate Random
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Update Member</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              team member and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

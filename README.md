# Taskflow

Task management application built with MERN. Drag-and-drop system (React DnD), task status management, real-time notifications (WebSockets), animated sidebar (Radix UI), and smooth UI with ShadCN/UI, Tailwind CSS, and Framer Motion.

# Task Manager Application

A modern, real-time task management application built with React, Node.js, and MongoDB.

## Features

- 🔐 User Authentication
- 📋 Task Management (CRUD operations)
- 🔄 Real-time Updates
- 🎨 Modern UI with Drag & Drop
- 📱 Responsive Design

## Technologies Used

- Frontend:

  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - DND Kit
  - Framer Motion

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Socket.IO
  - JWT Authentication

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

4. Start the development server:

   ```bash
   # Start backend server
   npm run server

   # Start frontend development server
   npm run dev
   ```

## Documentation

### Authentication

The application uses JWT-based authentication. Users can:

- Register with name, email, and password
- Login with email and password
- Logout

### Task Management

Tasks have the following properties:

- Title
- Description
- Priority (low, medium, high)
- Status (todo, in-progress, done)
- Due Date
- Assignees

CRUD Operations:

- Create: Click "Create Task" button
- Read: Tasks are displayed in their respective columns
- Update: Click the edit icon on a task
- Delete: Click the delete icon on a task

### Real-time Features

The application uses Socket.IO for real-time updates:

- Task creation
- Task updates
- Task deletion
- Status changes

### Drag & Drop

Tasks can be dragged between columns to update their status.

## Documentation en Français

### Authentification

L'application utilise l'authentification JWT. Les utilisateurs peuvent :

- S'inscrire avec nom, email et mot de passe
- Se connecter avec email et mot de passe
- Se déconnecter

### Gestion des Tâches

Les tâches ont les propriétés suivantes :

- Titre
- Description
- Priorité (faible, moyenne, élevée)
- Statut (à faire, en cours, terminé)
- Date d'échéance
- Assignés

Opérations CRUD :

- Créer : Cliquer sur le bouton "Create Task"
- Lire : Les tâches sont affichées dans leurs colonnes respectives
- Mettre à jour : Cliquer sur l'icône d'édition d'une tâche
- Supprimer : Cliquer sur l'icône de suppression d'une tâche

### Fonctionnalités en Temps Réel

L'application utilise Socket.IO pour les mises à jour en temps réel :

- Création de tâches
- Mises à jour de tâches
- Suppression de tâches
- Changements de statut

### Glisser-Déposer

Les tâches peuvent être glissées entre les colonnes pour mettre à jour leur statut.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

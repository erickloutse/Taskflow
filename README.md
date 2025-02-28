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

## User Guide

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

### Drag & Drop

Tasks can be dragged between columns to update their status:

1. Click and hold on a task card
2. Drag the task to the desired column
3. Release to drop the task in the new column
4. The task status will be automatically updated

### Navigation

The sidebar provides navigation to different sections of the application:

- Dashboard: Main task board view
- Team: Team members and collaboration
- Calendar: Calendar view of tasks
- Settings: Application settings

## Troubleshooting

### Common Issues

1. **Connection Issues**

   - Ensure MongoDB is running and accessible
   - Check that the MONGODB_URI in your .env file is correct

2. **Authentication Problems**

   - Clear browser localStorage and try logging in again
   - Ensure JWT_SECRET is properly set in your .env file

3. **Task Operations Not Working**
   - Check browser console for errors
   - Verify that you're logged in (token exists in localStorage)
   - Ensure backend server is running

## Documentation en Français

### Guide d'Utilisation

#### Authentification

L'application utilise l'authentification JWT. Les utilisateurs peuvent :

- S'inscrire avec nom, email et mot de passe
- Se connecter avec email et mot de passe
- Se déconnecter

#### Gestion des Tâches

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

#### Glisser-Déposer

Les tâches peuvent être glissées entre les colonnes pour mettre à jour leur statut :

1. Cliquer et maintenir sur une carte de tâche
2. Faire glisser la tâche vers la colonne souhaitée
3. Relâcher pour déposer la tâche dans la nouvelle colonne
4. Le statut de la tâche sera automatiquement mis à jour

#### Navigation

La barre latérale permet de naviguer vers différentes sections de l'application :

- Tableau de bord : Vue principale du tableau des tâches
- Équipe : Membres de l'équipe et collaboration
- Calendrier : Vue calendrier des tâches
- Paramètres : Paramètres de l'application

### Dépannage

#### Problèmes Courants

1. **Problèmes de Connexion**

   - Assurez-vous que MongoDB est en cours d'exécution et accessible
   - Vérifiez que l'URI MongoDB dans votre fichier .env est correct

2. **Problèmes d'Authentification**

   - Effacez le localStorage du navigateur et essayez de vous reconnecter
   - Assurez-vous que JWT_SECRET est correctement défini dans votre fichier .env

3. **Opérations sur les Tâches ne Fonctionnant Pas**
   - Vérifiez la console du navigateur pour les erreurs
   - Vérifiez que vous êtes connecté (le token existe dans localStorage)
   - Assurez-vous que le serveur backend est en cours d'exécution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


# Task Management Frontend

A React TypeScript frontend for managing Strapi tasks with authentication, approval/disapproval functionality, and summary editing.

## Features

- **Authentication**: Login with email/username and password
- **Task Management**: View all user tasks with pagination support
- **Task Actions**: 
  - Approve/Disapprove tasks
  - Edit task summaries
  - View full task text (expandable)
- **Real-time Updates**: Tasks update immediately after actions
- **Responsive Design**: Clean Material-UI interface

## Prerequisites

- Node.js (v16 or higher)
- Strapi backend running on `http://localhost:1337`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Usage

1. **Login**: Use your Strapi credentials (email/username and password)
2. **View Tasks**: See all your tasks with their current approval status
3. **Review Tasks**: 
   - Click expand to see full task text
   - Edit summaries by clicking the edit icon
   - Approve or disapprove tasks using the action buttons
4. **Logout**: Use the logout button in the top navigation

## API Integration

The app integrates with the following Strapi endpoints:

- `POST /api/auth/local` - User authentication
- `GET /api/tasks?populate=*` - Fetch user tasks
- `PUT /api/tasks/:id` - Update task (approve/disapprove/edit summary)

## Task Schema

Tasks have the following structure:
- `long_text`: The main task content (required)
- `summary`: AI-generated or user-edited summary (optional)
- `approved`: Boolean approval status (null/undefined = pending)

## Development

The project uses:
- **React 18** with TypeScript
- **Material-UI** for components and theming
- **Formik** for form handling
- **Axios** for API requests
- **Create React App** for build tooling

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.
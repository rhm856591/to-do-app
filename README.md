# Todo Application

A full-stack Todo application built with Next.js, Express, and MongoDB.

## Features

- Create, read, update, and delete todos
- Responsive design for mobile and desktop
- Pagination for todo list
- Inline editing of todos in the side panel
- Modern UI with animations

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion for animations

### Backend
- Express.js
- MongoDB with Mongoose
- RESTful API

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or a remote connection)

## Getting Started

### Setting up MongoDB

Make sure MongoDB is running on your local machine. If you don't have MongoDB installed, you can download it from [MongoDB's official website](https://www.mongodb.com/try/download/community).

Alternatively, you can use MongoDB Atlas, a cloud-based MongoDB service. Update the connection string in `backend/server.js` accordingly.

### Installing Dependencies

1. Clone the repository:

```bash
git clone <repository-url>
cd my-todo-app
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

The backend server will run on http://localhost:5000.

2. In a new terminal, start the frontend development server:

```bash
# From the root directory
npm run dev
```

The frontend application will run on http://localhost:3000.

## How to Use

1. The main page displays a list of todos on the left side.
2. Click on a todo to view and edit its details in the right panel.
3. Use the "New Todo" button to create a new todo.
4. Edit a todo by selecting it and modifying its content in the right panel.
5. Save changes using the "Save" button.
6. Delete a todo using the "Delete" button.

## API Endpoints

- `GET /todos` - Get all todos (with pagination)
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Project Structure

```
my-todo-app/
├── backend/             # Backend Express server
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── src/                 # Frontend Next.js application
│   ├── app/             # Next.js app directory
│   │   └── page.tsx     # Home page with todo list and details
│   └── components/      # React components
│       └── TodoList.tsx # Todo list component
└── package.json         # Frontend dependencies
```

## License

MIT

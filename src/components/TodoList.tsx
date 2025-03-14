'use client';

import { useState, useEffect } from 'react';

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
}

interface TodoListProps {
  onSelectTodo: (todo: Todo) => void;
}

export default function TodoList({ onSelectTodo }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/todos?page=${currentPage}&limit=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        
        const data = await response.json();
        setTodos(data.todos || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError('Failed to load todos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [currentPage]);

  if (loading) {
    return <div className="p-4 text-center theme-text-primary">Loading todos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (todos.length === 0) {
    return <div className="p-4 text-center theme-text-primary">No todos found. Create one!</div>;
  }

  const handleTodoClick = (e: React.MouseEvent, todo: Todo) => {
    e.preventDefault();
    onSelectTodo(todo);
  };

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="space-y-4 p-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          onClick={(e) => handleTodoClick(e, todo)}
          className="block theme-card shadow-md p-4 rounded-md hover:border-black border theme-border transition cursor-pointer"
        >
          <h2 className="font-semibold theme-text-primary">{todo.title}</h2>
          <p className="text-sm theme-text-secondary truncate">
            {stripHtml(todo.description)}
          </p>
          <span className="text-xs theme-text-tertiary">
            {new Date(todo.date).toLocaleDateString()}
          </span>
        </div>
      ))}
      
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded theme-card theme-border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 theme-text-primary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded theme-card theme-border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import TodoList from '@/components/TodoList';
import RichTextEditor from '@/components/RichTextEditor';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Helper function to detect reversed text
const containsReversedText = (text: string): boolean => {
  // Strip HTML tags to get plain text
  const plainText = text.replace(/<[^>]*>/g, '');
  
  // Common reversed text patterns to check
  const reversedPatterns = [
    "olleh", // hello backwards
    "hallutamahar ma i olleh", // specific case from user
    "dlrow", // world backwards
    "txet", // text backwards
    "eman" // name backwards
  ];
  
  // Check if any of the patterns are in the text
  return reversedPatterns.some(pattern => plainText.toLowerCase().includes(pattern));
};

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
}

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference for dark mode on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Toggle between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark-mode');
    
    // Apply or remove dark mode class to html element
    if (!isDarkMode) {
      document.documentElement.style.setProperty('--background', '#0a0a0a');
      document.documentElement.style.setProperty('--foreground', '#ededed');
      document.documentElement.style.setProperty('--card-background', '#1f2937');
      document.documentElement.style.setProperty('--card-border', '#374151');
      document.documentElement.style.setProperty('--primary-hover', '#60a5fa');
      document.documentElement.style.setProperty('--danger-hover', '#f87171');
      document.documentElement.style.setProperty('--text-primary', '#f9fafb');
      document.documentElement.style.setProperty('--text-secondary', '#d1d5db');
      document.documentElement.style.setProperty('--text-tertiary', '#6b7280');
      document.documentElement.style.setProperty('--border-color', '#374151');
      document.documentElement.style.setProperty('--hover-bg', '#374151');
      document.documentElement.style.setProperty('--editor-toolbar-bg', '#1f2937');
      document.documentElement.style.setProperty('--editor-border', '#374151');
      document.documentElement.style.setProperty('--editor-placeholder', '#6b7280');
    } else {
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--foreground', '#171717');
      document.documentElement.style.setProperty('--card-background', '#ffffff');
      document.documentElement.style.setProperty('--card-border', '#e5e7eb');
      document.documentElement.style.setProperty('--primary-hover', '#2563eb');
      document.documentElement.style.setProperty('--danger-hover', '#dc2626');
      document.documentElement.style.setProperty('--text-primary', '#171717');
      document.documentElement.style.setProperty('--text-secondary', '#4b5563');
      document.documentElement.style.setProperty('--text-tertiary', '#9ca3af');
      document.documentElement.style.setProperty('--border-color', '#e5e7eb');
      document.documentElement.style.setProperty('--hover-bg', '#f3f4f6');
      document.documentElement.style.setProperty('--editor-toolbar-bg', '#f9fafb');
      document.documentElement.style.setProperty('--editor-border', '#e5e7eb');
      document.documentElement.style.setProperty('--editor-placeholder', '#9ca3af');
    }
  };

  const handleCreateTodo = async () => {
    try {
      if (!newTodo.title.trim()) {
        alert('Title is required');
        return;
      }

      // Check for reversed text in description
      if (containsReversedText(newTodo.description)) {
        alert('Your description contains text in the wrong direction. Please correct it.');
        return;
      }

      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      // Reset form and close modal
      setNewTodo({ title: '', description: '' });
      setIsCreating(false);
      
      // Force a reload to refresh the todo list
      window.location.reload();
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo. Please try again.');
    }
  };

  const handleTodoSelect = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowMobileDetail(true); // Show detail view on mobile when a todo is selected
  };

  const handleSaveTodo = async () => {
    if (!selectedTodo) return;
    
    try {
      setSaving(true);
      
      if (!selectedTodo.title.trim()) {
        alert('Title is required');
        setSaving(false);
        return;
      }
      
      // Check for reversed text in description
      if (containsReversedText(selectedTodo.description)) {
        alert('Your description contains text in the wrong direction. Please correct it.');
        setSaving(false);
        return;
      }
      
      const response = await fetch(`http://localhost:5000/todos/${selectedTodo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedTodo.title,
          description: selectedTodo.description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      const updatedTodo = await response.json();
      setSelectedTodo(updatedTodo);
      alert('Todo updated successfully');
      
      // Refresh the todo list
      window.location.reload();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTodo = async () => {
    if (!selectedTodo) return;
    
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }
    
    try {
      setDeleting(true);
      
      const response = await fetch(`http://localhost:5000/todos/${selectedTodo._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      setSelectedTodo(null);
      setShowMobileDetail(false);
      
      // Refresh the todo list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
  };

  return (
    <main className="flex h-screen">
      {/* Sidebar - Hidden on mobile when detail view is shown */}
      <aside className={`${showMobileDetail ? 'hidden md:block' : 'block'} w-full md:w-1/3 lg:w-1/4 theme-card border-r theme-border overflow-y-auto`}>
        <header className="flex items-center justify-between p-4 border-b theme-border">
          <div className="flex items-center">
            <h1 className="font-bold text-lg theme-text-primary">TODO</h1>
            <button
              onClick={toggleTheme}
              className="ml-3 p-2 rounded-full theme-hover"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="theme-button-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            New Todo
          </button>
        </header>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-card theme-text-primary"
          />
        </div>

        {/* Todo List */}
        <TodoList onSelectTodo={handleTodoSelect} />
      </aside>

      {/* Detail View - Shown on mobile only when a todo is selected */}
      <section className={`${showMobileDetail ? 'block' : 'hidden md:flex'} flex-col flex-grow`} style={{ backgroundColor: 'var(--background)' }}>
        {selectedTodo ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <div className="flex justify-between items-center p-4 border-b theme-border theme-card">
              <div className="flex items-center">
                <button 
                  onClick={handleBackToList}
                  className="md:hidden mr-3 text-blue-500"
                >
                  &larr;
                </button>
                <h2 className="text-xl font-semibold theme-text-primary">Todo Details</h2>
              </div>
              <div className="space-x-2">
                <button
                  onClick={handleSaveTodo}
                  disabled={isSaving || isDeleting}
                  className={`px-4 py-2 rounded-md ${isSaving ? 'theme-button-success' : 'theme-button-primary'} text-white disabled:opacity-50`}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleDeleteTodo}
                  disabled={isDeleting || isSaving}
                  className="px-4 py-2 rounded-md theme-button-danger text-white disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedTodo.title}
                  onChange={(e) => setSelectedTodo({...selectedTodo, title: e.target.value})}
                  className="text-2xl font-bold mb-4 w-full border-b-2 theme-border outline-none focus:border-blue-500 transition-colors theme-card theme-text-primary"
                  placeholder="Enter title"
                />
                
                <RichTextEditor
                  value={selectedTodo.description}
                  onChange={(value) => setSelectedTodo({...selectedTodo, description: value})}
                  placeholder="Enter description"
                />
                
                <div className="text-sm theme-text-tertiary">
                  Created: {new Date(selectedTodo.date).toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col flex-grow justify-center items-center">
            <p className="theme-text-secondary">Select a TODO to view details</p>
          </div>
        )}
      </section>

      {/* Create Todo Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="theme-card p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 theme-text-primary">Create New Todo</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 theme-text-secondary">Title</label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full px-3 py-2 border theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-card theme-text-primary"
                placeholder="Enter title"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 theme-text-secondary">Description</label>
              <RichTextEditor
                value={newTodo.description}
                onChange={(value) => setNewTodo({ ...newTodo, description: value })}
                placeholder="Enter description"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border theme-border rounded-md theme-hover transition theme-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTodo}
                className="px-4 py-2 theme-button-primary text-white rounded-md hover:bg-blue-600 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

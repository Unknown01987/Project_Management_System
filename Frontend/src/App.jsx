import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectList from './components/Projects/ProjectList';
import ProjectDetail from './components/Projects/ProjectDetail';
import TaskList from './components/Tasks/TaskList';
import KanbanBoard from './components/Tasks/KanbanBoard';
import Loading from './components/Common/Loading';
import { STORAGE_KEYS, THEMES } from './utils/constants';
import './index.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App component without auth context (used inside AuthProvider)
const AppContent = () => {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(THEMES.LIGHT);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(THEMES.DARK);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === THEMES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout theme={theme} setTheme={setTheme}>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <Layout theme={theme} setTheme={setTheme}>
                    <Dashboard />
                  </Layout>
                </SocketProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <Layout theme={theme} setTheme={setTheme}>
                    <ProjectList />
                  </Layout>
                </SocketProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <Layout theme={theme} setTheme={setTheme}>
                    <ProjectDetail />
                  </Layout>
                </SocketProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/tasks"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <Layout theme={theme} setTheme={setTheme}>
                    <TaskList />
                  </Layout>
                </SocketProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/kanban"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <Layout theme={theme} setTheme={setTheme}>
                    <KanbanBoard />
                  </Layout>
                </SocketProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <Layout theme={theme} setTheme={setTheme}>
                    <TaskList />
                  </Layout>
                </SocketProvider>
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to dashboard */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

// Main App component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
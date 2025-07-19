import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Create socket connection
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      // User presence events
      newSocket.on('user_online', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('user_offline', (users) => {
        setOnlineUsers(users);
      });

      // Join user to their personal room
      newSocket.emit('join_user_room', user.id);

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else {
      // If no user or token, disconnect socket
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      }
    }
  }, [user, token]);

  // Socket event handlers
  const joinProject = (projectId) => {
    if (socket && projectId) {
      socket.emit('join_project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket && projectId) {
      socket.emit('leave_project', projectId);
    }
  };

  const sendNotification = (notification) => {
    if (socket) {
      socket.emit('send_notification', notification);
    }
  };

  const emitTaskUpdate = (taskData) => {
    if (socket) {
      socket.emit('task_updated', taskData);
    }
  };

  const emitProjectUpdate = (projectData) => {
    if (socket) {
      socket.emit('project_updated', projectData);
    }
  };

  const emitUserTyping = (projectId, isTyping) => {
    if (socket) {
      socket.emit('user_typing', { projectId, isTyping });
    }
  };

  // Subscribe to socket events
  const onTaskUpdate = (callback) => {
    if (socket) {
      socket.on('task_updated', callback);
      return () => socket.off('task_updated', callback);
    }
  };

  const onProjectUpdate = (callback) => {
    if (socket) {
      socket.on('project_updated', callback);
      return () => socket.off('project_updated', callback);
    }
  };

  const onNotification = (callback) => {
    if (socket) {
      socket.on('notification', callback);
      return () => socket.off('notification', callback);
    }
  };

  const onUserTyping = (callback) => {
    if (socket) {
      socket.on('user_typing', callback);
      return () => socket.off('user_typing', callback);
    }
  };

  const onUserOnline = (callback) => {
    if (socket) {
      socket.on('user_online', callback);
      return () => socket.off('user_online', callback);
    }
  };

  const onUserOffline = (callback) => {
    if (socket) {
      socket.on('user_offline', callback);
      return () => socket.off('user_offline', callback);
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    
    // Room management
    joinProject,
    leaveProject,
    
    // Emit events
    sendNotification,
    emitTaskUpdate,
    emitProjectUpdate,
    emitUserTyping,
    
    // Subscribe to events
    onTaskUpdate,
    onProjectUpdate,
    onNotification,
    onUserTyping,
    onUserOnline,
    onUserOffline
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
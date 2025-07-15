
let io;

const initializeSocket = (socketIo) => {
  io = socketIo;
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });
    
    socket.on('leave-project', (projectId) => {
      socket.leave(projectId);
      console.log(`User ${socket.id} left project ${projectId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };

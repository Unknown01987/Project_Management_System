import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import { taskService } from '../../services/taskService';

const KanbanBoard = ({ tasks, onTaskUpdate, onTaskEdit, onTaskDelete, projectId }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      color: 'bg-gray-50',
      headerColor: 'bg-gray-100 text-gray-800',
      icon: '📝'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      color: 'bg-blue-50',
      headerColor: 'bg-blue-100 text-blue-800',
      icon: '🔄'
    },
    {
      id: 'completed',
      title: 'Completed',
      status: 'completed',
      color: 'bg-green-50',
      headerColor: 'bg-green-100 text-green-800',
      icon: '✅'
    }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setData('text/plain', task._id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnStatus) => {
    e.preventDefault();
    setDraggedOver(columnStatus);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDraggedOver(null);

    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTask = await taskService.updateTaskStatus(draggedTask._id, newStatus);
      onTaskUpdate(updatedTask);
      setDraggedTask(null);
    } catch (error) {
      console.error('Error updating task status:', error);
      setDraggedTask(null);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, newStatus);
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getColumnStats = (status) => {
    const columnTasks = getTasksByStatus(status);
    const total = columnTasks.length;
    const overdue = columnTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== 'completed';
    }).length;

    return { total, overdue };
  };

  return (
    <div className="flex space-x-6 h-full overflow-x-auto pb-4">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.status);
        const stats = getColumnStats(column.status);
        const isDraggedOver = draggedOver === column.status;

        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-80 ${column.color} rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
              isDraggedOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div className={`${column.headerColor} p-4 rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{column.icon}</span>
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-white bg-opacity-80 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                    {stats.total}
                  </span>
                  {stats.overdue > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                      {stats.overdue} overdue
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-4 space-y-3 min-h-96 max-h-96 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                  {column.status === 'todo' && (
                    <p className="text-xs mt-1">Drag tasks here or create a new one</p>
                  )}
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      onStatusChange={handleStatusChange}
                      draggable={true}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Column Footer */}
            <div className="p-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                Drop tasks here to move to {column.title.toLowerCase()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
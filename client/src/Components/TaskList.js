import React, { useContext, useEffect } from 'react';
import Task from './Task';
import TaskContext from './TaskContext';
import { useAuth } from './AuthContext';
import { useDrop } from 'react-dnd';

function TaskList() {
  const { tasks, setTasks } = useContext(TaskContext);
  const { user } = useAuth();
  const TASK_WIDTH = 200; // Example width, adjust as needed

  const handleDrop = (draggedId, targetIndex) => {
    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks.find(task => task.id === draggedId);
    const draggedIndex = updatedTasks.indexOf(draggedTask);
  
    // Calculate the target index based on the horizontal position
    const targetIndexHorizontal = Math.floor(targetIndex / TASK_WIDTH);
    const targetIndexVertical = Math.floor(targetIndex % TASK_WIDTH);
  
    // Update positions locally
    updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(targetIndexHorizontal + (targetIndexVertical > TASK_WIDTH / 2 ? 1 : 0), 0, draggedTask);
    setTasks(updatedTasks);
  
    // Update positions in local storage
    try {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error updating task positions in local storage:', error);
    }
  };
  

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item, monitor) => {
      const draggedId = item.id;
      const targetIndex = monitor.getClientOffset().x; // Get the x-coordinate of the drop
      handleDrop(draggedId, targetIndex);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} style={{ minHeight: '100vh', background: isOver ? 'lightblue' : 'white' }}>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          index={index}
          task={task}
          sourceSection={task.section}
          isAdmin={user.role === 'admin'}
        />
      ))}
    </div>
  );
}

export default TaskList;

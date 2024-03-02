import React, { createContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [sourceSection, setSourceSection] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    // Cleanup function is not needed in this case
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const updateTaskList = async (newTasks) => {
    try {
      // Update the backend or local storage with the new task list
      const response = await fetch('http://localhost:5555/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTasks),
      });
      if (!response.ok) {
        throw new Error('Failed to update task list');
      }
      // Update the tasks state with the new task list
      setTasks(newTasks);
    } catch (error) {
      console.error('Error updating task list:', error);
    }
  };

  const onDrop = (index, task, event) => {
    if (event) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }

    // Implement the logic for handling dropped tasks here
    console.log('Dropped task:', task);
    console.log('Drop index:', index);

    // Perform the necessary state update to reorder the tasks
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 0, updatedTasks.splice(tasks.indexOf(task), 1)[0]);
    updateTaskList(updatedTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, sourceSection, setSourceSection, updateTaskList, onDrop }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;

// InProgressTaskList.js
import React from 'react';
import Task from './Task';

function InProgressTaskList({ tasks, onDrop }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedTask = JSON.parse(e.dataTransfer.getData('task'));
    onDrop(droppedTask);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div onDrop={handleDrop} onDragOver={allowDrop}>
      {tasks.map((task, index) => (
        <Task key={task.id} index={index} task={task} />
      ))}
    </div>
  );
}

export default InProgressTaskList;

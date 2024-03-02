import React, { useState, useEffect, useContext } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes'; // Define item types
import InProgressTaskList from './InProgressTaskList';
import DelayedTaskList from './DelayedTaskList';
import CompletedTaskList from './CompletedTaskList';
import EventCard from './EventCard';
import TaskList from './TaskList';
import TaskContext from './TaskContext'; // Import TaskContext

function Dashboard() {
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [delayedTasks, setDelayedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const { sourceSection } = useContext(TaskContext); // Get sourceSection from TaskContext

  useEffect(() => {
    // Clear in progress, delayed, and completed tasks when toDoTasks change
    setInProgressTasks([]);
    setDelayedTasks([]);
    setCompletedTasks([]);
  }, [toDoTasks]);

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop(item, monitor) {
      const { id, status } = item;
      switch (status) {
        case 'todo':
          // Move task to the appropriate list based on target section
          switch (sourceSection) {
            case 'inProgress':
              setInProgressTasks(prevState => [...prevState, { id, title: item.title }]);
              break;
            case 'completed':
              setCompletedTasks(prevState => [...prevState, { id, title: item.title }]);
              break;
            case 'delayed':
              setDelayedTasks(prevState => [...prevState, { id, title: item.title }]);
              break;
            default:
              // By default, move to ToDo
              setToDoTasks(prevState => [...prevState, { id, title: item.title }]);
          }
          break;
        default:
          // Handle other statuses if needed
          break;
      }
    },
  });

  return (
    <div>
      <div className="dashboard">
        <aside className="sidebar">
          <h2>Upcoming Events</h2>
          <EventCard />
        </aside>
        <div className="main-section" ref={drop}>
          <main className="main-content" style={{ height: "fit-content", width: "100%" }}>
            <h1>Main Content</h1>
            <p>This is the main content area of the dashboard.</p>
          </main>  
          <div style={{display: 'flex'}}>
            <div className="column">
              <div className="column-section">
                <h2>ToDo</h2>
                <TaskList tasks={toDoTasks} sourceSection={sourceSection} />
              </div>
            </div>
            <div className="column">
              <div className="column-section">
                <h2>InProgress</h2>
                <InProgressTaskList tasks={inProgressTasks} />
              </div>
            </div>
            <div className="column">
              <div className="column-section">
                <h2>Completed</h2>
                <CompletedTaskList tasks={completedTasks} />
              </div>
            </div>
            <div className="column">
              <div className="column-section">
                <h2>Delayed</h2>
                <DelayedTaskList tasks={delayedTasks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

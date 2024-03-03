import React, { useState, useContext, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EventCard from './EventCard';
import TaskList from './TaskList';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import TaskContext  from './TaskContext'; // Import TaskContext

const Dashboard = () => {
  const { tasks, setTasks, columnIds, setColumnIds } = useContext(TaskContext); // Use TaskContext

  const [columns, setColumns] = useState({
    todo: {
      id: uuidv4(),
      title: 'ToDo',
      items: [
        { id: uuidv4(), title: 'Task 1' }
      ]
    },
    inProgress: {
      id: uuidv4(),
      title: 'InProgress',
      items: []
    },
    completed: {
      id: uuidv4(),
      title: 'Completed',
      items: []
    },
    delayed: {
      id: uuidv4(),
      title: 'Delayed',
      items: []
    }
  });
  useEffect(() => {
    // Update TaskContext with column IDs
    const updatedColumnIds = Object.keys(columns).map(key => columns[key].id);
    setColumnIds(updatedColumnIds);
  }, [columns, setColumnIds]);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    
    // If the item is dropped outside a droppable area, do nothing
    if (!destination) return;
    
    // Ensure that source.droppableId is a valid column id
    if (!columns[source.droppableId] || !columns[destination.droppableId]) {
      console.error("Invalid source or destination column id");
      return;
    }
  
    // If the item is dropped into a different column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
  
      // Get the source and destination items
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
  
      // Remove the item from the source column
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Insert the item into the destination column
      destItems.splice(destination.index, 0, removed);
  
      // Update the columns state
      setColumns(prevColumns => ({
        ...prevColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      }));
    } else { // If the item is dropped within the same column
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
  
      // Remove the item from its original position
      const [removed] = copiedItems.splice(source.index, 1);
      
      // Insert the item into the new position
      copiedItems.splice(destination.index, 0, removed);
  
      // Update the columns state
      setColumns(prevColumns => ({
        ...prevColumns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      }));
    }
  };
  
  
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard">
        <aside className="sidebar">
          <h2>Upcoming Events</h2>
          <EventCard />
        </aside>
        <div className="main-section">
          <main className="main-content" style={{ height: "fit-content", width: "100%" }}>
            <h1>Main Content</h1>
            <p>This is the main content area of the dashboard.</p>
          </main>
          <div style={{ display: 'flex' }}>
          {Object.values(columns).map(column => (
        <Droppable droppableId={column.id} key={column.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                backgroundColor: 'lightgrey',
                flex: '1',
                margin: '8px',
                minHeight: '200px'
              }}
            >
              <div className="column">
                <div className="column-section">
                  <h2>{column.title}</h2>
                  {column.items.map((item, index) => (
                    <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskList task={item} droppableId={column.id} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            </div>
          )}
        </Droppable>
      ))}

          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Dashboard;

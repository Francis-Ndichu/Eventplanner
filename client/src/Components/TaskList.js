import React, { useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import TaskContext from './TaskContext'; // Update import statement

function TaskList() {
  const { tasks, setTasks, columnIds, setColumnIds } = useContext(TaskContext);

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    // Reorder tasks
    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, removed);
    setTasks(newTasks);

    // Reorder columnIds if necessary
    if (source.droppableId !== destination.droppableId) {
      const newColumnIds = Array.from(columnIds);
      newColumnIds.splice(source.index, 1);
      newColumnIds.splice(destination.index, 0, source.droppableId);
      setColumnIds(newColumnIds);
    }
  };

  return (
        // eslint-disable-next-line react/jsx-no-undef
    <Droppable droppableId={String(columnIds)} direction="horizontal">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {tasks.map((task, index) => (
            <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Task task={task} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskList;

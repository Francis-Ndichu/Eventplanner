import React, { useState, useContext, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useAuth } from './AuthContext';
import TaskContext from './TaskContext';
import { useDrag } from 'react-dnd';

function Task({ task }) {
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState(task.name);
  const [dateDue, setDateDue] = useState(task.due_date || '');
  const [priority, setPriority] = useState(task.priority);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const { user } = useAuth();
  const { tasks } = useContext(TaskContext);
  const [deleteStatus, setDeleteStatus] = useState('');

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK', // Define the type here
    item: { id: String(task.id) }, // Convert id to string
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleParticipantChange = (e) => {
    const participantId = e.target.value;
    if (e.target.checked) {
      setSelectedParticipants([...selectedParticipants, participantId]);
    } else {
      setSelectedParticipants(selectedParticipants.filter(id => id !== participantId));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    const updatedTaskData = {
      name: taskName,
      due_date: dateDue,
      priority: priority,
      assigned_users: participants.filter(participant => selectedParticipants.includes(participant.id)),
      // Add other task properties here
    };

    try {
      const response = await fetch(`http://localhost:5555/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTaskData),
      });
      if (response.ok) {
        console.log("Task updated successfully:", task.id);
        setShowModal(false); // Close the modal after successful update
        // Optionally, you can update your state to reflect the update
      } else {
        console.error("Error updating task:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`http://localhost:5555/tasks/${task.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // If task is deleted successfully, update the delete status
        setDeleteStatus('Task deleted successfully');
      } else {
        // If there's an error, update the delete status accordingly
        setDeleteStatus(`Error deleting task: ${response.statusText}`);
      }
    } catch (error) {
      // If there's an error, update the delete status accordingly
      setDeleteStatus(`Error deleting task: ${error.message}`);
    }
  };

  // Effect to update the delete status when the task ID changes
  useEffect(() => {
    setDeleteStatus('');
  }, [task.id]);

  // Find the task with the corresponding ID
  const selectedTask = tasks.find(t => t.id === task.id);
  // Extract participants from the selected task
  const participants = selectedTask ? selectedTask.assigned_users : [];

  // Check if the user is an admin
  const isAdmin = user && user.role === 'admin';

  return (
    <>
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <Card>
          <Card.Body>
            <Card.Title>{task.name}</Card.Title>
            <Card.Text>
              <strong>Due Date:</strong> {task.due_date || 'No due date'}
              <br />
              <strong>Priority:</strong> {task.priority}
              <br />
              <strong>Assigned Users:</strong> {participants.map(participant => participant.fullName).join(', ')}
            </Card.Text>
            {isAdmin && (
              <>
                <Button variant="primary" onClick={handleShowModal}>Update Task</Button>
                <Button variant="danger" onClick={handleDeleteTask}>Delete Task</Button>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Update Task Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <fieldset>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="taskName">Task Name</Form.Label>
                <Form.Control id="taskName" placeholder="Task Name" value={taskName} onChange={e => setTaskName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="dateDue">Date Due</Form.Label>
                <Form.Control id="dateDue" type="date" placeholder="Date Due" value={dateDue} onChange={e => setDateDue(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="priority">Priority</Form.Label>
                <Form.Select id="priority" onChange={handlePriorityChange} value={priority}>
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Participants</Form.Label>
                {participants.map(participant => (
                  <div key={participant.id}>
                    <Form.Check
                      type="checkbox"
                      id={`participant-${participant.id}`}
                      label={`${participant.username} - ${participant.fullName}`}
                      value={participant.id}
                      checked={selectedParticipants.includes(participant.id)}
                      onChange={handleParticipantChange}
                    />
                  </div>
                ))}
              </Form.Group>
            </fieldset>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Task;

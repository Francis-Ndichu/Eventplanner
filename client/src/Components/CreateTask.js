import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [dateDue, setDateDue] = useState('');
  const [priority, setPriority] = useState('');
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/dashboard'); // Assuming navigate is a function available in your environment
  };
  
  const handleShowModal = () => setShowModal(true);

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleParticipantChange = (e) => {
    const participantId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedParticipants([...selectedParticipants, participantId]);
    } else {
      setSelectedParticipants(selectedParticipants.filter(id => id !== participantId));
    }
  };

  useEffect(() => {
    // Fetch participants from the backend
    fetch('http://localhost:5555/api/users')
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));

    handleShowModal();
  }, []);

  const handleSaveChanges = () => {
    const taskData = {
      name: taskName,
      dueDate: dateDue,
      priority: priority,
      participants: selectedParticipants
    };
console.log(taskData)
    fetch('http://localhost:5555/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Task created successfully:', data);
      handleCloseModal();
      navigate('/dashboard');
    })
    .catch(error => console.error('Error creating task:', error));
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Open Modal
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
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
                      defaultChecked={selectedParticipants.includes(participant.id)}
                      onChange={handleParticipantChange}
                    />
                  </div>
                ))}
              </Form.Group>
            </fieldset>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateTask;

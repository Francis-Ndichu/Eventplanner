import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState([{ name: '', cost: '' }]);
  const [eventData, setEventData] = useState({
    event_name: '',
    num_participants: '',
    description: '',
    materials: [],
    estimated_cost: '',
    venue: '',
    time: ''
  });
  const navigate = useNavigate();
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...eventData.materials]; // Create a copy of materials array
    updatedMaterials[index][field] = value; // Update the specified field in the material object
    setEventData({ ...eventData, materials: updatedMaterials }); // Update the state with the new materials array
  };

  // Function to add a new material field
  const handleAddMaterialField = () => {
    setEventData({
      ...eventData,
      materials: [...eventData.materials, { name: '', cost: '' }] // Add a new material object to the materials array
    });
  };

  // Function to remove a material field
  const handleRemoveMaterialField = (index) => {
    const updatedMaterials = [...eventData.materials]; // Create a copy of materials array
    updatedMaterials.splice(index, 1); // Remove the material object at the specified index
    setEventData({ ...eventData, materials: updatedMaterials }); // Update the state with the updated materials array
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5555/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      // Optionally handle success response
      console.log('Event created successfully');
      handleCloseModal();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
console.log(eventData)
  useEffect(() => {
    handleShowModal(); // Show modal when component mounts
  }, []); // Empty dependency array ensures it runs only once after the first render

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Open Modal
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <fieldset >
              <Form.Group className="mb-3">
                <Form.Label htmlFor="event_name">Event Name</Form.Label>
                <Form.Control
                  id="event_name"
                  name="event_name"
                  type="text"
                  value={eventData.event_name}
                  onChange={handleInputChange}
                  placeholder="Event Name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="num_participants">Number of Participants</Form.Label>
                <Form.Control
                  id="num_participants"
                  name="num_participants"
                  type="number"
                  value={eventData.num_participants}
                  onChange={handleInputChange}
                  placeholder="Number of Participants"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                  id="description"
                  name="description"
                  as="textarea"
                  value={eventData.description}
                  onChange={handleInputChange}
                  placeholder="Simple details about the Event"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                    <Form.Label>Materials Required</Form.Label>
                    {eventData.materials.map((material, index) => (
                    <div key={index} className="d-flex mb-2">
                        <Form.Control
                        type="text"
                        value={material.name}
                        onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                        placeholder="Material"
                        />
                        <Form.Control
                        type="text"
                        value={material.cost}
                        onChange={(e) => handleMaterialChange(index, 'cost', e.target.value)}
                        placeholder="Cost"
                        className="ms-2"
                        />
                        <Button
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleRemoveMaterialField(index)}
                        >
                        Remove
                        </Button>
                    </div>
                    ))}
                    <Button variant="secondary" onClick={handleAddMaterialField}>Add Material</Button>
                </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="estimated_cost">Estimated Cost</Form.Label>
                <Form.Control
                  id="estimated_cost"
                  name="estimated_cost"
                  type="text"
                  value={eventData.estimated_cost}
                  onChange={handleInputChange}
                  placeholder="Estimated Cost"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="venue">Venue</Form.Label>
                <Form.Control
                  id="venue"
                  name="venue"
                  type="text"
                  value={eventData.venue}
                  onChange={handleInputChange}
                  placeholder="Venue"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="time">Time</Form.Label>
                <Form.Control
                    id="time"
                    name="time"
                    type="time" // Set the type attribute to "time"
                    value={eventData.time}
                    onChange={handleInputChange}
                    placeholder="Time"
                />
                </Form.Group>

            </fieldset>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateEvent;

import { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';

const EventCard = ({ event }) => {
    const materialsList = Array.isArray(event.materials) ? event.materials.join(', ') : '';

  return (
    <Card>
      <Card.Body>
        <Card.Title>{event.event_name}</Card.Title>
        <Card.Text>Number of Participants: {event.num_participants}</Card.Text>
        <Card.Text>Description: {event.description}</Card.Text>
        <Card.Text>Materials: {materialsList}</Card.Text>
        <Card.Text>Estimated Cost: {event.estimated_cost}</Card.Text>
        <Card.Text>Venue: {event.venue}</Card.Text>
        <Card.Text>Time: {event.time}</Card.Text>
        {/* Add any other details you want to display */}
      </Card.Body>
    </Card>
  );
};

const EventsList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch event data from the backend
    fetch('http://localhost:5555/api/events') // Adjust the API endpoint as per your backend implementation
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <div>
      <h2>Events</h2>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsList;

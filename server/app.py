from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Event, Task, task_user
from flask_migrate import Migrate
from datetime import datetime
import json


app = Flask(__name__)
CORS(app)  # Apply CORS to your Flask app

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)
tasks = [] 

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print(data)
        username = data.get('username')
        password = data.get('password')
        fullName = data.get('fullName')
        email = data.get('email')
        phone = data.get('phone')
        customerType = data.get('customerType')  # Use 'customerType' instead of 'customer_type'
        if User.query.filter_by(username=username).first():
            return jsonify(error="Username already exists"), 400
        else:
            # Store the new user in the database
            new_customer = User(username=username, password=password, fullName=fullName, email=email, phone=phone, customer_type=customerType)  # Use 'customerType' here
            db.session.add(new_customer)
            db.session.commit()
            return jsonify(message="Registration successful"), 200
    except Exception as e:
        return jsonify(error=str(e)), 400


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        customer = User.query.filter_by(username=username).first()
        if customer and customer.password == password:
                return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': customer.id,
                    'full_name': customer.fullName,
                    'phone_number': customer.phone,
                    'username': customer.username,
                    'role': customer.customer_type
                }
            }), 200
        else:
            return jsonify(error="Wrong username or password"), 401
    except Exception as e:
        return jsonify(error=str(e)), 400
    


# Route to create an event
@app.route('/events/create', methods=['POST'])
def create_event():
    data = request.json
    event_time = datetime.strptime(data['time'], '%H:%M')
    data['time'] = event_time
    materials_json = json.dumps(data['materials'])
    new_event = Event(
        event_name=data['event_name'],
        num_participants=data['num_participants'],
        description=data['description'],
        materials=materials_json,
        estimated_cost=data['estimated_cost'],
        venue=data['venue'],
        time=data['time']
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(message='Event created successfully'), 201

# Route to delete an event
@app.route('/events/delete/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event_to_delete = Event.query.get_or_404(event_id)
    db.session.delete(event_to_delete)
    db.session.commit()
    return jsonify(message='Event deleted successfully'), 200

# Route to update an event
@app.route('/events/update/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event_to_update = Event.query.get_or_404(event_id)
    data = request.json
    event_to_update.event_name = data.get('event_name', event_to_update.event_name)
    event_to_update.num_participants = data.get('num_participants', event_to_update.num_participants)
    event_to_update.description = data.get('description', event_to_update.description)
    event_to_update.materials = data.get('materials', event_to_update.materials)
    event_to_update.estimated_cost = data.get('estimated_cost', event_to_update.estimated_cost)
    event_to_update.venue = data.get('venue', event_to_update.venue)
    event_to_update.time = data.get('time', event_to_update.time)
    db.session.commit()
    return jsonify(message='Event updated successfully'), 200
    
@app.route('/api/events', methods=['GET'])
def get_events():
    # Query the Event table to retrieve all events
    events = Event.query.all()

    # Serialize the events to JSON
    event_data = [{
        'id': event.id,
        'event_name': event.event_name,
        'num_participants': event.num_participants,
        'description': event.description,
        'materials': event.materials,
        'estimated_cost': event.estimated_cost,
        'venue': event.venue,
        'time': event.time.strftime('%Y-%m-%d %H:%M:%S') if event.time else None
    } for event in events]

    return jsonify(event_data)

# Route to create a new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json  # Assuming the request contains JSON data for the new task
    event_time = datetime.strptime(data['dueDate'], '%Y-%m-%d')

    data['due_date'] = event_time
  
    # Extract task details from the JSON data
    task_name = data.get('name')
    task_due_date = data['due_date']
    task_priority = data.get('priority')
    participant_ids = data.get('participants')

    # Create a new task instance
    new_task = Task(
        name=task_name,
        due_date=task_due_date,
        priority=task_priority
    )
    print(new_task.due_date)
    # Add the task to the database session
    db.session.add(new_task)

    # If participant IDs are provided, associate them with the task
    if participant_ids:
        participants = User.query.filter(User.id.in_(participant_ids)).all()
        new_task.participants.extend(participants)

    # Commit the changes to the database
    db.session.commit()

    # Return the newly created task as JSON with a status code of 201
    return jsonify(new_task.serialize()), 201

# Route to fetch all tasks with assigned user details

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks_with_user_details = []

    # Query all tasks from the Task model
    tasks = Task.query.all()

    for task in tasks:
        task_with_user = task.serialize()  # Serialize the task
        
        # Access the users associated with the task through the task_user relationship
        users_associated_with_task = []
        for task_user_row in db.session.query(task_user).filter_by(task_id=task.id).all():
            user_id = task_user_row.user_id
            user = User.query.get(user_id)
            users_associated_with_task.append({
                'id': user.id,
                'username': user.username,
                'fullName': user.fullName
            })
        
        task_with_user['assigned_users'] = users_associated_with_task
        
        tasks_with_user_details.append(task_with_user)

    return jsonify(tasks_with_user_details)


# Route to delete a task
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200

# Route to update a task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    print(data)
    event_time = datetime.strptime(data['due_date'], '%Y-%m-%d')

    data['due_date'] = event_time

    # Update task attributes
    if 'name' in data:
        task.name = data['name']
    if 'due_date' in data:
        task.due_date = data['due_date']
    if 'priority' in data:
        task.priority = data['priority']
    if 'assigned_users' in data:
        # Assuming assigned_users is a list of user IDs
        user_ids = data['assigned_users']
        task.participants = User.query.filter(User.id.in_(user_ids)).all()

    # Commit changes to the database
    db.session.commit()

    return jsonify({'message': 'Task updated successfully'}), 200

# Route to get all users
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{'id': user.id, 'username': user.username, 'fullName': user.fullName, 'email': user.email, 'phone': user.phone} for user in users]
    return jsonify(user_list)

# Route to create a new user
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(username=data['username'], password=data['password'], fullName=data['fullName'], email=data['email'], phone=data['phone'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.id, 'username': new_user.username, 'fullName': new_user.fullName, 'email': new_user.email, 'phone': new_user.phone}), 201

# Route to update a user by ID
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.password = data.get('password', user.password)
    user.fullName = data.get('fullName', user.fullName)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    db.session.commit()
    return jsonify({'id': user.id, 'username': user.username, 'fullName': user.fullName, 'email': user.email, 'phone': user.phone})

# Route to delete a user by ID
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(port=5555, debug=True)
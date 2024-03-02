from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    fullName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    customer_type = db.Column(db.String(20), nullable=False, default='regular')  # Add customer_type attribute with default value 'regular'



class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(100), nullable=False)
    num_participants = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)
    materials = db.Column(db.Text)  # Store materials as JSON string in the database
    estimated_cost = db.Column(db.Float)
    venue = db.Column(db.String(100))
    time = db.Column(db.DateTime)
    
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.Date, nullable=True)
    priority = db.Column(db.String(20), nullable=False)
    participants = db.relationship('User', secondary='task_user', backref='tasks')

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'priority': self.priority,
            'participants': [{'id': participant.id, 'fullName': participant.fullName} for participant in self.participants]
        }


# Define association table for many-to-many relationship between Task and User
task_user = db.Table('task_user',
    db.Column('task_id', db.Integer, db.ForeignKey('task.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)
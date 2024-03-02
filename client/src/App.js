import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import CreateEvent from './Components/CreateEvent';
import CreateTask from './Components/CreateTask';
import Logout from './Components/Logout';
import {useAuth} from './Components/AuthContext'; // Import AuthContext

function App() {
  const { user } =  useAuth(); // Get user authentication status and user object

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public routes accessible to all */}
          {!user&& (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </>
          )}

          {/* Protected routes accessible only to authenticated users */}
          {user && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              {user.role === 'admin' && (
                <>
                  <Route path="/createevent" element={<CreateEvent />} />
                  <Route path="/createtask" element={<CreateTask />} />
                </>
              )}
              <Route path="/logout" element={<Logout />} />
            </>
          )}

          {/* Redirect to dashboard if logged in user tries to access login or register page */}
          {user && (
            <>
              <Route path="/register" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

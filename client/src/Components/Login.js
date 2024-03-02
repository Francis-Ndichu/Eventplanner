import React, { useState } from 'react';
import { useAuth } from './AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5555/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password })
            });
            const data = await response.json();
            if (response.ok) {

                const { user } = data;;

                // Store user details in the context
                login(user);
                console.log(user);
                // Store user details in the context
               
                // Redirect to homepage on successful login
                window.location.href = '/dashboard'; // Assuming homepage is '/'
            } else {
                // Handle errors based on response status
                setError(data.error || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
            <div className="card" style={{ width: '50%', height: '27%' }}>
                <div className="card-body">
                    <h3 className="card-title text-center">Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>Login</button>
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

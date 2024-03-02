import React, { useState, useEffect } from 'react';


function Register() {
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    customerType: 'regular' 
  });
  

  useEffect(() => {
    fetchRegisterMessage();
  }, []);

  const fetchRegisterMessage = async () => {
    try {
      const response = await fetch('http://localhost:5555/register');
      if (!response.ok) {
        throw new Error('Failed to fetch');
        
      }
      const data = await response.json();
      setMessage(data.message);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error fetching register message:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await fetch('http://localhost:5555/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(formData),
        
      });
      if (!response.ok) {
        throw new Error('Failed to register');
      }
      const data = await response.json();
      setMessage(data.message);
      // Redirect to login page after successful registration
      window.location.href = '/login';
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  
  

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h3 className="card-title text-center">Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="customerType">Customer Type</label>
                  <select
                    className="form-control"
                    id="customerType"
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleChange}
                  >
                    <option value="regular">Regular</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>Register</button>

              </form>
              <p className="mt-3">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

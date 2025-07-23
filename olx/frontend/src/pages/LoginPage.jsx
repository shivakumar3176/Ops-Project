import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false); // New state to show the resend button
  const [resendMessage, setResendMessage] = useState(''); // New state for success message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowResend(false);
    setResendMessage('');

    try {
      const response = await API.post('/auth/login', formData);
      login(response.data.user, response.data.token);
      navigate('/ads');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed.';
      setError(errorMessage);
      // If the specific error occurs, show the resend button
      if (errorMessage.includes('Please verify your email')) {
        setShowResend(true);
      }
    }
  };

  const handleResendVerification = async () => {
    setError('');
    try {
      const response = await API.post('/auth/resend-verification', { email: formData.email });
      setResendMessage(response.data.message); // Show success message
      setShowResend(false); // Hide the button after click
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend email.');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      
      {/* Conditionally render the resend button */}
      {showResend && (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button onClick={handleResendVerification}>
            Resend Verification Email
          </button>
        </div>
      )}

      {resendMessage && <p style={{ color: 'green', textAlign: 'center', marginTop: '15px' }}>{resendMessage}</p>}
    </div>
  );
}

export default LoginPage;
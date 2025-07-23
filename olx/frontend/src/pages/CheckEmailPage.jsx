import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api';

function CheckEmailPage() {
  const location = useLocation();
  const email = location.state?.email; // Get email from the signup page
  const [message, setMessage] = useState('');

  const handleResendVerification = async () => {
    setMessage('');
    if (!email) {
      setMessage('Could not find an email to resend to. Please sign up again.');
      return;
    }
    try {
      const response = await API.post('/auth/resend-verification', { email });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to resend email.');
    }
  };

  const pageStyle = {
    textAlign: 'center',
    marginTop: '50px',
    padding: '30px',
    maxWidth: '600px',
    margin: '50px auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  };

  return (
    <div style={pageStyle}>
      <h2>Check Your Inbox</h2>
      {email ? (
        <p>We've sent a verification link to <strong>{email}</strong>.</p>
      ) : (
        <p>We've sent a verification link to your email address.</p>
      )}
      <p>Please check your inbox (and spam folder) and click the link to complete your registration.</p>
      
      <hr style={{margin: '20px 0'}} />

      <p>Didn't receive the email?</p>
      <button onClick={handleResendVerification}>Resend Verification Email</button>
      {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
    </div>
  );
}

export default CheckEmailPage;
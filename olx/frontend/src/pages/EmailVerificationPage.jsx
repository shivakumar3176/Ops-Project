// src/pages/EmailVerificationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

function EmailVerificationPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        await API.get(`/auth/verify/${token}`);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
      }
    };
    verifyUserEmail();
  }, [token]);

  const verificationStatusStyle = {
    textAlign: 'center',
    marginTop: '50px',
    padding: '30px',
    maxWidth: '500px',
    margin: '50px auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  };

  return (
    <div style={verificationStatusStyle}>
      {status === 'Verifying...' && <h2>Verifying your email...</h2>}
      {status === 'Success' && (
        <>
          <h2>✅ Email Successfully Verified!</h2>
          <p>You can now log in to your account.</p>
          <Link to="/login">
            <button className="browse-btn">Go to Login</button>
          </Link>
        </>
      )}
      {status === 'Error' && (
        <>
          <h2>❌ Verification Failed</h2>
          <p>The link may be invalid or has expired. Please try signing up again.</p>
          <Link to="/signup">
            <button className="browse-btn">Go to Signup</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default EmailVerificationPage;
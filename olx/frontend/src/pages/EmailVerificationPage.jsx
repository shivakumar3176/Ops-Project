import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

function EmailVerificationPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setStatus('Error');
        return;
      }
      try {
        const response = await API.get(`/auth/verify/${token}`);
        setStatus('Success');
        login(response.data.user, response.data.token);
        setTimeout(() => {
          navigate('/ads'); // Redirect to ads page after 2 seconds
        }, 2000);
      } catch (error) {
        setStatus('Error');
      }
    };
    verifyUserEmail();
  }, [token, login, navigate]);

  const verificationStatusStyle = {
    textAlign: 'center',
    marginTop: '50px',
    padding: '30px',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  return (
    <div style={verificationStatusStyle}>
      {status === 'Verifying...' && <h2>Verifying your email...</h2>}
      {status === 'Success' && (
        <>
          <h2>✅ Email Successfully Verified!</h2>
          <p>You are now logged in. Redirecting to your ads...</p>
        </>
      )}
      {status === 'Error' && (
        <>
          <h2>❌ Verification Failed</h2>
          <p>The link may be invalid or has expired. Please try signing up again.</p>
          <Link to="/signup">
            <button className="browse-btn">Go to Signup</button>
          </Link>
          <br />
          <Link to="/login" style={{ marginTop: '15px', display: 'inline-block' }}>
            <button className="browse-btn">Go to Login</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default EmailVerificationPage;

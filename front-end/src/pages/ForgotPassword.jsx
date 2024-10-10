import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./style.css";

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        crossDomain:true,
        headers: {
          'Content-Type': 'application/json',
          accept:"application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body: JSON.stringify({ email })
      });
      const resData = await response.json();
      console.log(resData);

      if (response.ok) {
        toast.success('Reset link sent to your email.');
        setEmail('');
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      toast.error('Error sending reset link.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="title">Did you forget password?</h2>
        <p className="subtitle">
          Enter your email address and we'll send you a link to restore password
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-button">Request reset link</button>
        </form>
        <div className="back-to-login" onClick={() => navigate('/login')}>Back to log in</div>
      </div>
    </div>
  );
};


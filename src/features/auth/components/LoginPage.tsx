import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useAuth } from '../hooks/useAuth';

/**
 * Login page component
 */
const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>StandupSync</h1>
            <p>Sign in to manage your standups</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { useAuth } from '../hooks/useAuth';

/**
 * Register page component
 */
const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>StandupSync</h1>
            <p>Create an account to manage your standups</p>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 
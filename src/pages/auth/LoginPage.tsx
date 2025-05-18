import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { RootState } from '../../redux/store';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  // If user is already authenticated, redirect them
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  return (
    <div className="auth-page container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="auth-card">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
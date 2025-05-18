import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { RootState } from '../../redux/store';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect them to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="auth-page container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="auth-card">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 
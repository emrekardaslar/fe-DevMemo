import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/auth/actions';
import { RootState, AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(login({ email, password, rememberMe }));
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the reducer and displayed in the component
    }
  };
  
  return (
    <div className="login-form">
      <h2>Login</h2>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          {validationErrors.email && (
            <div className="invalid-feedback">{validationErrors.email}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {validationErrors.password && (
            <div className="invalid-feedback">{validationErrors.password}</div>
          )}
        </div>
        
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember me
          </label>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <a href="/forgot-password" className="text-secondary">
            Forgot password?
          </a>
        </div>
      </form>
      
      <div className="mt-3 text-center">
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default LoginForm; 
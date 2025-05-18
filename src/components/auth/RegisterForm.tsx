import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/auth/actions';
import { RootState, AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      const { firstName, lastName, email, password } = formData;
      await dispatch(register({ firstName, lastName, email, password }));
      setRegistrationSuccess(true);
    } catch (error) {
      // Error is handled by the reducer and displayed in the component
    }
  };
  
  if (registrationSuccess) {
    return (
      <div className="register-success">
        <h2>Registration Successful!</h2>
        <p>
          Thank you for registering. Please check your email to verify your account.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }
  
  return (
    <div className="register-form">
      <h2>Create Account</h2>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.firstName && (
                <div className="invalid-feedback">{validationErrors.firstName}</div>
              )}
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.lastName && (
                <div className="invalid-feedback">{validationErrors.lastName}</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.password && (
            <div className="invalid-feedback">{validationErrors.password}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {validationErrors.confirmPassword && (
            <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100 mt-3"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div className="mt-3 text-center">
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default RegisterForm; 
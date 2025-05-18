import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import StandupForm from './pages/StandupForm';
import StandupDetail from './pages/StandupDetail';
import Search from './pages/Search';
import QueryPage from './pages/QueryPage';
import StandupList from './pages/StandupList';
import TagsPage from './pages/TagsPage';
import WeeklySummaryPage from './pages/WeeklySummary';
import BlockerAnalysis from './pages/BlockerAnalysis';
import MonthlyFocus from './pages/MonthlyFocus';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { initAuth } from './redux/auth/actions';
import { RootState, AppDispatch } from './redux/store';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
  }
`;

// Layout component with header, sidebar, and content area
const AppLayout = () => (
  <AppContainer>
    <Header />
    <MainContainer>
      <Sidebar />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </MainContainer>
  </AppContainer>
);

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Initialize authentication when app loads
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);
  
  return (
    <Routes>
      {/* Auth routes - public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes with app layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/standups" element={<StandupList />} />
          <Route path="/standups/new" element={<StandupForm />} />
          <Route path="/standups/:date" element={<StandupDetail />} />
          <Route path="/standups/:date/edit" element={<StandupForm />} />
          <Route path="/search" element={<Search />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/weekly-summary" element={<WeeklySummaryPage />} />
          <Route path="/blocker-analysis" element={<BlockerAnalysis />} />
          <Route path="/monthly-focus" element={<MonthlyFocus />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      
      {/* Redirect root to dashboard or login based on auth status */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App; 
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
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
import TeamsPage from './pages/TeamsPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import TeamFormPage from './pages/TeamFormPage';

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

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header />
      <MainContainer>
        <Sidebar />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/new" element={<TeamFormPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            <Route path="/teams/:teamId/edit" element={<TeamFormPage />} />
          </Routes>
        </ContentContainer>
      </MainContainer>
    </AppContainer>
  );
};

export default App; 
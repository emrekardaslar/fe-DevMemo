import React from 'react';
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

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
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
          </Routes>
        </ContentContainer>
      </MainContainer>
    </AppContainer>
  );
};

export default App; 
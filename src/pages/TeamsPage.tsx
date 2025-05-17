import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTeamOperations } from '../hooks/useTeamOperations';
import { Team } from '../redux/features/teams/types';

const PageContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const TeamsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TeamCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TeamName = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
`;

const TeamDescription = styled.p`
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
`;

const TeamMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  background-color: var(--card-background);
  border-radius: 8px;
`;

const TeamsPage: React.FC = () => {
  const teamOperations = useTeamOperations();
  const { teams, loading, error } = teamOperations;
  
  useEffect(() => {
    // This prevents infinite loops, only loads teams once
    const loadInitialData = async () => {
      await teamOperations.loadTeams();
    };
    
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <PageContainer>
      <HeaderSection>
        <Title>My Teams</Title>
        <ActionButton to="/teams/new">Create New Team</ActionButton>
      </HeaderSection>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingMessage>Loading teams...</LoadingMessage>
      ) : teams.length === 0 ? (
        <EmptyMessage>
          <h3>No teams found</h3>
          <p>Create your first team to get started</p>
        </EmptyMessage>
      ) : (
        <TeamsList>
          {teams.map((team) => (
            <TeamCard key={team.id}>
              <TeamName>
                <Link to={`/teams/${team.id}`}>{team.name}</Link>
                {team.isDefault && ' (Default)'}
              </TeamName>
              <TeamDescription>
                {team.description || 'No description provided'}
              </TeamDescription>
              <TeamMeta>
                <div>Created: {formatDate(team.createdAt)}</div>
                <div>{team.members?.length || 0} members</div>
              </TeamMeta>
            </TeamCard>
          ))}
        </TeamsList>
      )}
    </PageContainer>
  );
};

export default TeamsPage; 
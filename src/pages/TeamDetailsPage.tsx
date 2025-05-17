import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PlaceholderMessage = styled.div`
  text-align: center;
  padding: 3rem;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  margin: 2rem 0;
  color: var(--text-color-light);
`;

/**
 * Placeholder TeamDetailsPage component
 * The actual Team Detail functionality will be implemented separately
 */
const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/teams');
  };

  return (
    <PageContainer>
      <h1>Team Details</h1>
      <button onClick={handleBackClick}>Back to Teams</button>
      <PlaceholderMessage>
        <h3>Team Details Coming Soon</h3>
        <p>Details for team ID: {teamId}</p>
        <p>Team details functionality is currently under development.</p>
      </PlaceholderMessage>
    </PageContainer>
  );
};

export default TeamDetailsPage; 
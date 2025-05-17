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
 * Placeholder TeamFormPage component
 * The actual Team Form functionality will be implemented separately
 */
const TeamFormPage: React.FC = () => {
  const { teamId } = useParams<{ teamId?: string }>();
  const navigate = useNavigate();
  const isEdit = !!teamId;

  const handleBackClick = () => {
    navigate(teamId ? `/teams/${teamId}` : '/teams');
  };

  return (
    <PageContainer>
      <h1>{isEdit ? 'Edit Team' : 'Create New Team'}</h1>
      <button onClick={handleBackClick}>Back</button>
      <PlaceholderMessage>
        <h3>Team Form Coming Soon</h3>
        {isEdit ? (
          <p>Edit form for team ID: {teamId}</p>
        ) : (
          <p>Create new team form</p>
        )}
        <p>Team form functionality is currently under development.</p>
      </PlaceholderMessage>
    </PageContainer>
  );
};

export default TeamFormPage; 
import React from 'react';
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
 * Placeholder TeamsPage component
 * The actual Teams functionality will be implemented separately
 */
const TeamsPage: React.FC = () => {
  return (
    <PageContainer>
      <h1>Teams</h1>
      <PlaceholderMessage>
        <h3>Team Management Coming Soon</h3>
        <p>The team management feature is currently under development.</p>
      </PlaceholderMessage>
    </PageContainer>
  );
};

export default TeamsPage; 
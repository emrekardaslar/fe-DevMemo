import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTeamOperations } from '../hooks/useTeamOperations';
import { CreateTeamDto, UpdateTeamDto } from '../redux/features/teams/types';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FormCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 1.5rem;
`;

const FormTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 1.5rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Link)`
  background-color: var(--secondary-background);
  color: var(--text-color);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  
  &:hover {
    background-color: var(--border-color);
    text-decoration: none;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
`;

const BackLink = styled(Link)`
  display: block;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

interface TeamFormData {
  name: string;
  description: string;
}

const TeamFormPage: React.FC = () => {
  const { teamId } = useParams<{ teamId?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(teamId);
  const teamOperations = useTeamOperations();
  const { currentTeam, loading, error, loadTeam, createNewTeam, updateExistingTeam } = teamOperations;
  
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    description: ''
  });
  
  // Load team data if in edit mode
  useEffect(() => {
    if (isEditMode && teamId) {
      const loadInitialData = async () => {
        await loadTeam(teamId);
      };
      
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, teamId]);
  
  // Set form data when team is loaded
  useEffect(() => {
    if (isEditMode && currentTeam) {
      setFormData({
        name: currentTeam.name,
        description: currentTeam.description || ''
      });
    }
  }, [isEditMode, currentTeam]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }
    
    let success = false;
    
    if (isEditMode && teamId) {
      // Update existing team
      const updateData: UpdateTeamDto = {
        name: formData.name,
        description: formData.description || undefined
      };
      
      success = await updateExistingTeam(teamId, updateData);
    } else {
      // Create new team
      const createData: CreateTeamDto = {
        name: formData.name,
        description: formData.description || undefined
      };
      
      success = await createNewTeam(createData);
    }
    
    if (success) {
      navigate(isEditMode && teamId ? `/teams/${teamId}` : '/teams');
    }
  };
  
  return (
    <PageContainer>
      <BackLink to={isEditMode && teamId ? `/teams/${teamId}` : '/teams'}>
        ← Back to {isEditMode ? 'Team Details' : 'Teams'}
      </BackLink>
      
      <FormCard>
        <FormTitle>{isEditMode ? 'Edit Team' : 'Create New Team'}</FormTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Team Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter team name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description (Optional)</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter team description"
            />
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton to={isEditMode && teamId ? `/teams/${teamId}` : '/teams'}>
              Cancel
            </CancelButton>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {isEditMode ? 'Update Team' : 'Create Team'}
            </Button>
          </ButtonGroup>
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default TeamFormPage; 
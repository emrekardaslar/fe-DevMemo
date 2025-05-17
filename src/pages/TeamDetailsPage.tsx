import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTeamOperations } from '../hooks/useTeamOperations';
import { AddTeamMemberDto, UpdateMemberRoleDto } from '../redux/features/teams/types';
import { useAppSelector } from '../redux/hooks';
import { selectIsCurrentTeamAdmin } from '../redux/features/teams/selectors';

const PageContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
`;

const Description = styled.p`
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  background-color: var(--error-color);
  
  &:hover {
    background-color: var(--error-dark);
  }
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

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    display: block;
    flex: 1;
    height: 1px;
    background-color: var(--border-color);
    margin-left: 1rem;
  }
`;

const MembersTable = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  background-color: var(--secondary-background);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--hover-background);
  }
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const RoleBadge = styled.span<{ role: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.role) {
      case 'admin': return 'rgba(231, 76, 60, 0.2)';
      case 'member': return 'rgba(52, 152, 219, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'admin': return 'var(--error-color)';
      case 'member': return 'var(--primary-color)';
      default: return 'var(--text-secondary)';
    }
  }};
`;

const MemberActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-secondary);
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddMemberSection = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
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

const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const teamOperations = useTeamOperations();
  const { 
    currentTeam, 
    loading, 
    error, 
    processingId,
    loadTeam, 
    loadTeamMembers, 
    addMember, 
    updateRole, 
    removeMember, 
    deleteExistingTeam,
    leaveCurrentTeam 
  } = teamOperations;
  
  const isAdmin = useAppSelector(selectIsCurrentTeamAdmin);
  
  const [newMember, setNewMember] = useState<AddTeamMemberDto>({
    email: '',
    role: 'member'
  });
  
  useEffect(() => {
    // This prevents infinite loop, only loads team data once when component mounts or teamId changes
    if (teamId) {
      const loadInitialData = async () => {
        await loadTeam(teamId);
        await loadTeamMembers(teamId);
      };
      
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);
  
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamId && newMember.email.trim()) {
      const success = await addMember(teamId, newMember);
      if (success) {
        setNewMember({ email: '', role: 'member' });
      }
    }
  };
  
  const handleChangeRole = async (memberId: string, role: 'admin' | 'member' | 'viewer') => {
    if (teamId && window.confirm('Are you sure you want to change this member\'s role?')) {
      await updateRole(teamId, memberId, { role });
    }
  };
  
  const handleRemoveMember = async (memberId: string) => {
    if (teamId && window.confirm('Are you sure you want to remove this member from the team?')) {
      await removeMember(teamId, memberId);
    }
  };
  
  const handleDeleteTeam = async () => {
    if (teamId && window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      await deleteExistingTeam(teamId);
    }
  };
  
  const handleLeaveTeam = async () => {
    if (teamId && window.confirm('Are you sure you want to leave this team?')) {
      await leaveCurrentTeam(teamId);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  if (loading && !currentTeam) {
    return <LoadingMessage>Loading team...</LoadingMessage>;
  }
  
  if (error && !currentTeam) {
    return (
      <PageContainer>
        <BackLink to="/teams">← Back to Teams</BackLink>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }
  
  if (!currentTeam) {
    return (
      <PageContainer>
        <BackLink to="/teams">← Back to Teams</BackLink>
        <EmptyMessage>Team not found</EmptyMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackLink to="/teams">← Back to Teams</BackLink>
      
      <HeaderSection>
        <div>
          <Title>{currentTeam.name}</Title>
          <Description>{currentTeam.description || 'No description provided'}</Description>
          <div>Created on {formatDate(currentTeam.createdAt)}</div>
        </div>
        <ButtonGroup>
          {isAdmin && (
            <Button onClick={() => navigate(`/teams/${teamId}/edit`)}>Edit Team</Button>
          )}
          {isAdmin ? (
            <DangerButton 
              onClick={handleDeleteTeam} 
              disabled={loading || processingId === teamId}
            >
              Delete Team
            </DangerButton>
          ) : (
            <DangerButton 
              onClick={handleLeaveTeam} 
              disabled={loading || processingId === teamId}
            >
              Leave Team
            </DangerButton>
          )}
        </ButtonGroup>
      </HeaderSection>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <SectionTitle>Team Members</SectionTitle>
      
      {currentTeam.members && currentTeam.members.length > 0 ? (
        <MembersTable>
          <TableHeader>
            <div>Member</div>
            <div>Role</div>
            <div>Joined</div>
            <div>Actions</div>
          </TableHeader>
          {currentTeam.members.map(member => (
            <TableRow key={member.id}>
              <MemberInfo>
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.username} width="32" height="32" style={{ borderRadius: '50%' }} />
                ) : (
                  <Avatar>{getInitials(member.username)}</Avatar>
                )}
                <div>
                  <div>{member.username}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{member.email}</div>
                </div>
              </MemberInfo>
              <div>
                <RoleBadge role={member.role}>{member.role}</RoleBadge>
              </div>
              <div>{formatDate(member.joinedAt)}</div>
              <MemberActions>
                {isAdmin && (
                  <>
                    <ActionButton 
                      title="Change role"
                      onClick={() => handleChangeRole(
                        member.id, 
                        member.role === 'admin' ? 'member' : 'admin'
                      )}
                      disabled={loading || processingId === member.id}
                    >
                      🔄
                    </ActionButton>
                    <ActionButton 
                      title="Remove member"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={loading || processingId === member.id}
                    >
                      🗑️
                    </ActionButton>
                  </>
                )}
              </MemberActions>
            </TableRow>
          ))}
        </MembersTable>
      ) : (
        <EmptyMessage>No members in this team yet</EmptyMessage>
      )}
      
      {isAdmin && (
        <AddMemberSection>
          <h3>Add New Member</h3>
          <form onSubmit={handleAddMember}>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                type="email" 
                id="email"
                value={newMember.email}
                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="role">Role</Label>
              <Select 
                id="role"
                value={newMember.role}
                onChange={e => setNewMember({ 
                  ...newMember, 
                  role: e.target.value as 'admin' | 'member' | 'viewer'
                })}
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </Select>
            </FormGroup>
            <Button type="submit" disabled={loading || !newMember.email.trim()}>
              Add Member
            </Button>
          </form>
        </AddMemberSection>
      )}
    </PageContainer>
  );
};

export default TeamDetailsPage; 
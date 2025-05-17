import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '../hooks/useTeams';
import { CreateTeamRequest } from '../types';

/**
 * Team creation form component
 */
const CreateTeamForm: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { createTeam } = useTeams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
    
    setLoading(true);

    try {
      const teamData: CreateTeamRequest = {
        name: teamName.trim(),
        description: description.trim() || undefined,
        isPublic
      };
      
      const team = await createTeam(teamData);
      navigate(`/teams/${team.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-team-form">
      <h2>Create Team</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Team Name</label>
          <input
            type="text"
            id="teamName"
            className="form-control"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={4}
          />
          <small className="form-text text-muted">
            Briefly describe the purpose of this team
          </small>
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="isPublic"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={loading}
          />
          <label className="form-check-label" htmlFor="isPublic">
            Public team (visible to all users)
          </label>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline-secondary mr-2"
            onClick={() => navigate('/teams')}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Team...' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeamForm; 
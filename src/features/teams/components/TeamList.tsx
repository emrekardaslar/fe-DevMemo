import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTeams } from '../hooks/useTeams';
import { Team, TeamFilterOptions } from '../types';

/**
 * Team list component
 */
const TeamList: React.FC = () => {
  const { getTeams } = useTeams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TeamFilterOptions>({});

  // Load teams on mount and when filter changes
  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getTeams(filter);
        setTeams(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    };
    
    loadTeams();
  }, [getTeams, filter]);

  // Handle filter changes
  const handleFilterChange = (name: keyof TeamFilterOptions, value: any) => {
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle public/private filter
  const togglePublicFilter = () => {
    setFilter(prev => ({
      ...prev,
      isPublic: prev.isPublic === undefined ? true : undefined
    }));
  };

  // Toggle my teams filter
  const toggleMyTeamsFilter = () => {
    setFilter(prev => ({
      ...prev,
      memberOf: prev.memberOf === undefined ? true : undefined
    }));
  };

  return (
    <div className="team-list">
      <h2>Teams</h2>
      
      {/* Filters */}
      <div className="team-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search teams..."
            value={filter.name || ''}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`btn ${filter.isPublic ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={togglePublicFilter}
          >
            Public Teams
          </button>
          
          <button
            className={`btn ${filter.memberOf ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={toggleMyTeamsFilter}
          >
            My Teams
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Teams list */}
      {!loading && teams.length === 0 && (
        <div className="alert alert-info">
          No teams found. {!filter.memberOf && (
            <Link to="/teams/create" className="alert-link">Create one</Link>
          )}
        </div>
      )}
      
      <div className="team-grid">
        {teams.map(team => (
          <div key={team.id} className="team-card">
            <div className="team-logo">
              {team.logo ? (
                <img src={team.logo} alt={`${team.name} logo`} />
              ) : (
                <div className="team-initials">
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="team-info">
              <h3 className="team-name">
                <Link to={`/teams/${team.id}`}>{team.name}</Link>
              </h3>
              
              <p className="team-description">
                {team.description || 'No description'}
              </p>
              
              <div className="team-meta">
                <span className="team-visibility">
                  {team.isPublic ? 'Public' : 'Private'}
                </span>
                <span className="team-members">
                  {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Create team button */}
      <div className="team-actions">
        <Link to="/teams/create" className="btn btn-primary">
          Create Team
        </Link>
      </div>
    </div>
  );
};

export default TeamList; 
// Team member model
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
  username: string;  // Joined from User table
  email: string;     // Joined from User table
  avatarUrl?: string; // Joined from User table
}

// Team model
export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  members?: TeamMember[];
  isDefault?: boolean;
}

// Team state interface
export interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

// DTO for creating a team
export interface CreateTeamDto {
  name: string;
  description?: string;
}

// DTO for updating a team
export interface UpdateTeamDto {
  name?: string;
  description?: string;
}

// DTO for adding a member to team
export interface AddTeamMemberDto {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

// DTO for updating a member's role
export interface UpdateMemberRoleDto {
  role: 'admin' | 'member' | 'viewer';
} 
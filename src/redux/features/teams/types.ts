import { BaseEntity } from '../../../types/common';
import { User } from '../../../types/auth';

/**
 * Redux team types
 */

// Team role
export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

// Team entity
export interface Team extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  owner: string; // User ID
  isPrivate: boolean;
  members?: TeamMember[]; // Include members property
  isDefault?: boolean; // Include for TeamPage component
}

// Team member with consistent fields
export interface TeamMember extends BaseEntity {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  user?: User;
  // These fields are needed to match the usage in selectors
  username: string;
  email: string;
}

// Team membership request
export interface TeamMembershipRequest extends BaseEntity {
  id: string;
  teamId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  user?: User;
}

// Create team request
export interface CreateTeamRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

// Update team request
export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

// Team member update request
export interface TeamMemberUpdateRequest {
  role: TeamRole;
}

export interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  membershipRequests: TeamMembershipRequest[];
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
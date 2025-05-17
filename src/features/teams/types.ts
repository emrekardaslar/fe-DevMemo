import { BaseEntity } from '../../types/common';
import { User } from '../auth/types';

/**
 * Team and team membership types
 */

// Team role
export enum TeamRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  OWNER = 'owner'
}

// Team entity
export interface Team extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  isPublic: boolean;
  createdBy: string;
  memberCount: number;
}

// Team membership
export interface TeamMember extends BaseEntity {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: string;
  user?: User;
}

// Team membership request
export interface TeamMembershipRequest extends BaseEntity {
  id: string;
  teamId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
  user?: User;
}

// Create team request
export interface CreateTeamRequest {
  name: string;
  description?: string;
  isPublic: boolean;
}

// Update team request
export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  logo?: string;
  isPublic?: boolean;
}

// Add team member request
export interface AddTeamMemberRequest {
  userId: string;
  role?: TeamRole;
}

// Update team member request
export interface UpdateTeamMemberRequest {
  role: TeamRole;
}

// Team state for Redux
export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  membershipRequests: TeamMembershipRequest[];
  loading: boolean;
  error: string | null;
}

// Team filter options
export interface TeamFilterOptions {
  name?: string;
  isPublic?: boolean;
  memberOf?: boolean;
} 
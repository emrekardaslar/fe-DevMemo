import { BaseEntity } from './common';
import { User } from './auth';

/**
 * Team types
 */

// Team entity
export interface Team extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  owner: string; // User ID
  isPrivate: boolean;
  memberCount?: number;
  members?: TeamMember[]; // Add members array to match the component usage
}

// Team member roles
export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

// Team member
export interface TeamMember extends BaseEntity {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  user?: User;
  username?: string; // Add username to match selectors
  email?: string; // Add email to match selectors
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

// Team invitation
export interface TeamInvitation extends BaseEntity {
  id: string;
  teamId: string;
  email: string;
  invitedBy: string; // User ID
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
}

// Team creation request
export interface TeamCreateRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

// Team update request
export interface TeamUpdateRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

// Team member update request
export interface TeamMemberUpdateRequest {
  role: TeamRole;
} 
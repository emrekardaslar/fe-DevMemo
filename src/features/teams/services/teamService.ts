import { ApiService } from '../../../services/apiClient';
import {
  Team,
  TeamMember,
  TeamMembershipRequest,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddTeamMemberRequest,
  UpdateTeamMemberRequest,
  TeamFilterOptions
} from '../types';

/**
 * Team API service
 */
class TeamApiService extends ApiService {
  /**
   * Get all teams
   */
  async getTeams(filter?: TeamFilterOptions): Promise<Team[]> {
    const response = await this.get<Team[]>('/teams', filter);
    return response.data;
  }

  /**
   * Get team by ID
   */
  async getTeam(teamId: string): Promise<Team> {
    const response = await this.get<Team>(`/teams/${teamId}`);
    return response.data;
  }

  /**
   * Create a new team
   */
  async createTeam(data: CreateTeamRequest): Promise<Team> {
    const response = await this.post<Team>('/teams', data);
    return response.data;
  }

  /**
   * Update team
   */
  async updateTeam(teamId: string, data: UpdateTeamRequest): Promise<Team> {
    const response = await this.put<Team>(`/teams/${teamId}`, data);
    return response.data;
  }

  /**
   * Delete team
   */
  async deleteTeam(teamId: string): Promise<boolean> {
    const response = await this.delete<{ success: boolean }>(`/teams/${teamId}`);
    return response.success;
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const response = await this.get<TeamMember[]>(`/teams/${teamId}/members`);
    return response.data;
  }

  /**
   * Add team member
   */
  async addTeamMember(teamId: string, data: AddTeamMemberRequest): Promise<TeamMember> {
    const response = await this.post<TeamMember>(`/teams/${teamId}/members`, data);
    return response.data;
  }

  /**
   * Update team member
   */
  async updateTeamMember(
    teamId: string,
    userId: string,
    data: UpdateTeamMemberRequest
  ): Promise<TeamMember> {
    const response = await this.put<TeamMember>(`/teams/${teamId}/members/${userId}`, data);
    return response.data;
  }

  /**
   * Remove team member
   */
  async removeTeamMember(teamId: string, userId: string): Promise<boolean> {
    const response = await this.delete<{ success: boolean }>(`/teams/${teamId}/members/${userId}`);
    return response.success;
  }

  /**
   * Get pending membership requests
   */
  async getMembershipRequests(teamId: string): Promise<TeamMembershipRequest[]> {
    const response = await this.get<TeamMembershipRequest[]>(`/teams/${teamId}/requests`);
    return response.data;
  }

  /**
   * Respond to membership request
   */
  async respondToMembershipRequest(
    teamId: string,
    requestId: string,
    approve: boolean
  ): Promise<{ success: boolean }> {
    const response = await this.post<{ success: boolean }>(
      `/teams/${teamId}/requests/${requestId}`,
      { approve }
    );
    return response.data;
  }

  /**
   * Request to join team
   */
  async requestToJoinTeam(teamId: string): Promise<TeamMembershipRequest> {
    const response = await this.post<TeamMembershipRequest>(`/teams/${teamId}/join`);
    return response.data;
  }

  /**
   * Get user's teams
   */
  async getUserTeams(): Promise<Team[]> {
    const response = await this.get<Team[]>('/user/teams');
    return response.data;
  }
}

export const teamAPI = new TeamApiService(); 
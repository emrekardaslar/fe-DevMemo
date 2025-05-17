import { ApiService } from '../../../services/apiClient';
import { 
  LoginCredentials, 
  RegisterCredentials,
  ProfileUpdateRequest,
  User,
  AuthResponse
} from '../types';

/**
 * Authentication API service
 */
class AuthApiService extends ApiService {
  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: ProfileUpdateRequest): Promise<User> {
    const response = await this.put<User>(`/users/${userId}`, data);
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.get<User>('/auth/me');
    return response.data;
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    const response = await this.post<{ success: boolean }>('/auth/password-reset', { email });
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean }> {
    const response = await this.post<{ success: boolean }>(`/users/${userId}/password`, { 
      oldPassword, 
      newPassword 
    });
    return response.data;
  }
}

export const authAPI = new AuthApiService();

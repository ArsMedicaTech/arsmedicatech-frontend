import { API_URL } from '../env_vars';

class AuthService {
  token: string | null;
  user: { role: 'user' | 'nurse' | 'doctor' | 'admin' } | null;

  constructor() {
    this.token = localStorage.getItem('auth_token');

    // Safely parse user data from localStorage
    try {
      const userData = localStorage.getItem('user');
      this.user = userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Failed to parse user data from localStorage:', error);
      this.user = null;
      // Clean up invalid data
      localStorage.removeItem('user');
    }
  }

  private buildAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async login(username: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('auth_token', this.token ?? '');
        localStorage.setItem('user', JSON.stringify(this.user));
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
    first_name: string = '',
    last_name: string = '',
    role: string = 'patient'
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name,
          last_name,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: this.buildAuthHeaders(),
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<any> {
    // TODO: What was this even for? if (!this.token) {return null;}

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: this.buildAuthHeaders(),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      } else {
        // Token might be invalid, clear it
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: this.buildAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  async setupDefaultAdmin(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/admin/setup`, {
        method: 'POST',
        headers: this.buildAuthHeaders(),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getUser(): any {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  hasRole(role: string): boolean {
    if (!this.user) return false;

    const roleHierarchy = {
      user: 1,
      nurse: 2,
      doctor: 3,
      admin: 4,
    };

    const userRole = this.user.role as keyof typeof roleHierarchy;
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel =
      roleHierarchy[role as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  isDoctor(): boolean {
    return this.hasRole('doctor');
  }

  isNurse(): boolean {
    return this.hasRole('nurse');
  }

  // Helper method to add auth headers to fetch requests
  getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  getFederatedSignInUrl(role: string): string {
    // Returns the backend URL to initiate Cognito OAuth with the selected role
    return `${API_URL}/auth/login/cognito?role=${encodeURIComponent(role)}`;
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;

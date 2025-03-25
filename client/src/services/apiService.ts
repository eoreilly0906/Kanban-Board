import AuthService from './authService';

class ApiService {
  private static readonly API_BASE_URL = '/api';

  // Add authentication headers to requests
  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = AuthService.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API responses
  private static async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      if (response.status === 401 && AuthService.getRefreshToken()) {
        // Token expired, try to refresh
        try {
          await this.refreshToken();
          // Retry the original request
          return this.handleResponse(response);
        } catch (error) {
          // Refresh failed, redirect to login
          AuthService.logout();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      }
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    return response.json();
  }

  // Refresh the access token
  private static async refreshToken(): Promise<void> {
    const refreshToken = AuthService.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    AuthService.handleLoginResponse(data);
  }

  // Make an authenticated GET request
  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Make an authenticated POST request
  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Make an authenticated PUT request
  static async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Make an authenticated DELETE request
  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export default ApiService; 
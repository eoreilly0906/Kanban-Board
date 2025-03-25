interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USERNAME_KEY = 'username';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';

  // Store authentication tokens and user info
  static setAuth(tokens: AuthTokens, username: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(this.USERNAME_KEY, username);
    
    // Set token expiry (15 minutes from now for access token)
    const expiryTime = new Date().getTime() + (15 * 60 * 1000);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  // Get the current access token
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Get the current refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get the current username
  static getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  // Check if the current session is expired
  static isSessionExpired(): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    return new Date().getTime() > parseInt(expiryTime);
  }

  // Clear all authentication data
  static logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isSessionExpired();
  }

  // Handle login response
  static handleLoginResponse(response: LoginResponse): void {
    this.setAuth(
      {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      },
      response.username
    );
  }
}

export default AuthService; 
import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      return !this.isTokenExpired(token);
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    return token;
  }

  login(idToken: string) {
    if (!idToken) {
      console.error('No token provided for login');
      return;
    }
    localStorage.setItem('token', idToken);
    window.location.href = '/';
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

export default new AuthService();

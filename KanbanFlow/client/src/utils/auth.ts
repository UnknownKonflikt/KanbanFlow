import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  // Decodes the token and returns the user's profile information
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  // Checks if the user is logged in by verifying the token exists and is not expired
  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  // Checks if the token is expired
  isTokenExpired(token: string) {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      if (decoded.exp) {
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decoded.exp < currentTime;
      }
      return false; // If the token doesn't have an expiration time, assume it's valid
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }

  // Retrieves the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  // Saves the token to localStorage and redirects to the home page
  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Removes the token from localStorage and redirects to the login page
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
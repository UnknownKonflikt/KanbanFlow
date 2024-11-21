import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  // TODO: make a POST request to the login route
  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (response.status === 401) {
      // Handle 401 Unauthorized error gracefully
      return { error: 'Invalid username or password' };
    }

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error('No token returned');
    }

    console.log('Login successful, token:', data.token);

    return data; // Assuming the API returns a token or user data
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

export { login };

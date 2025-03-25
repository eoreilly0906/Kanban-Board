import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
    // TODO: make a POST request to the login route and return the response
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });
  return response.json();
}


export { login };

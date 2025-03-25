import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from '../services/authService';
import { login } from "../api/authAPI";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const data = await login(loginData);
      AuthService.handleLoginResponse(data);
      navigate('/');
    } catch (err) {
      console.error('Failed to login', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <label>Username</label>
        <input 
          type='text'
          name='username'
          value={loginData.username || ''}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input 
          type='password'
          name='password'
          value={loginData.password || ''}
          onChange={handleChange}
          required
        />
        <button type='submit'>Submit Form</button>
      </form>
    </div>
  )
};

export default Login;

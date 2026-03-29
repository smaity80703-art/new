import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginMessage(null);

    try {
      const { data, error } = await supabase.rpc('verify_admin_login', {
        p_username: credentials.username,
        p_password: credentials.password,
      });

      if (error) throw error;

      if (data) {
        setLoginMessage({
          type: 'success',
          text: 'Login successful!',
        });
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setLoginMessage({
          type: 'error',
          text: 'Invalid username or password.',
        });
      }
    } catch (error) {
      setLoginMessage({
        type: 'error',
        text: 'Login failed. Please try again.',
      });
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p className="subtitle">Access the appointment management dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {loginMessage && (
          <div className={`message ${loginMessage.type}`}>
            {loginMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}

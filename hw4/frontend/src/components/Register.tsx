import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import '../styles/Register.css';

interface RegisterForm {
  username: string;
  email: string;
  fullName: string;
  password: string;
  birthDate?: string;
  phoneNumber?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    fullName: '',
    password: '',
    birthDate: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          full_name: form.fullName,
          password: form.password,
          birth_date: form.birthDate || null,
          phone_number: form.phoneNumber || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || errorData.error || 'Registration failed');
        return;
      }

      alert('User registered successfully! You can now log in.');
      navigate('/login');
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            name="username"
            className="form-input"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            name="fullName"
            className="form-input"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            className="form-input"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            className="form-input"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  function handleSubmit(e) {
    e.preventDefault();

    if (role === 'student') navigate('/student-dashboard');
    else if (role === 'teacher') navigate('/teacher-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="ADOW Primary and Secondary School" className="login-logo" />
        <h1>ADOW Primary and Secondary School</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
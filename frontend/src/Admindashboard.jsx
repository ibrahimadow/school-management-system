import logo from './assets/logo.png';
import './StudentDashboard.css';

function AdminDashboard() {
  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="ADOW Primary and Secondary School" className="navbar-logo" />
        <span className="navbar-title">Admin Dashboard</span>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome back!</h1>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Manage Students</h3>
            <p>Add, edit, or remove student records.</p>
          </div>
          <div className="card">
            <h3>Manage Teachers</h3>
            <p>Add, edit, or remove teacher accounts.</p>
          </div>
          <div className="card">
            <h3>Fee Management</h3>
            <p>Track and update fee payments school-wide.</p>
          </div>
          <div className="card">
            <h3>Announcements</h3>
            <p>Post school-wide news and updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
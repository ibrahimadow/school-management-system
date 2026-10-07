import logo from './assets/logo.png';
import './StudentDashboard.css';

function TeacherDashboard() {
  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="ADOW Primary and Secondary School" className="navbar-logo" />
        <span className="navbar-title">Teacher Dashboard</span>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome back!</h1>
        <div className="dashboard-cards">
          <div className="card">
            <h3>My Classes</h3>
            <p>View and manage your assigned classes.</p>
          </div>
          <div className="card">
            <h3>Attendance</h3>
            <p>Mark and review student attendance.</p>
          </div>
          <div className="card">
            <h3>Grade Entry</h3>
            <p>Enter and update student grades.</p>
          </div>
          <div className="card">
            <h3>Announcements</h3>
            <p>Post updates for students and parents.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
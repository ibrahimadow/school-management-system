import logo from './assets/logo.png';
import './StudentDashboard.css';

function StudentDashboard() {
  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="ADOW Primary and Secondary School" className="navbar-logo" />
        <span className="navbar-title">Student Dashboard</span>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome back!</h1>
        <div className="dashboard-cards">
          <div className="card">
            <h3>My Grades</h3>
            <p>View your latest results and report cards.</p>
          </div>
          <div className="card">
            <h3>Timetable</h3>
            <p>Check your class schedule for the week.</p>
          </div>
          <div className="card">
            <h3>Fee Statement</h3>
            <p>View your current fee balance and history.</p>
          </div>
          <div className="card">
            <h3>Announcements</h3>
            <p>Latest news and updates from the school.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
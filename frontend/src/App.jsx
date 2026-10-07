import logo from './assets/logo.png';
import './App.css';

function App() {
  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="ADOW Primary and Secondary School" className="navbar-logo" />
        <span className="navbar-title">ADOW Primary and Secondary School</span>
      </nav>

      <section id="center">
        <h1>Welcome to ADOW School Management System</h1>
        <p>This is where your dashboards, login, and other pages will go.</p>
      </section>
    </div>
  );
}

export default App;
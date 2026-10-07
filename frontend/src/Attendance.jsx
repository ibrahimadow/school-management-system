import { useState } from 'react';
import logo from './assets/logo.png';
import './Attendance.css';

const initialStudents = [
  { id: 1, name: 'Amina Njoroge', status: 'present' },
  { id: 2, name: 'Brian Otieno', status: 'present' },
  { id: 3, name: 'Cynthia Wanjiru', status: 'present' },
  { id: 4, name: 'David Kimani', status: 'present' },
  { id: 5, name: 'Eunice Achieng', status: 'present' },
];

function Attendance() {
  const [students, setStudents] = useState(initialStudents);
  const [saved, setSaved] = useState(false);

  function toggleStatus(id) {
    setStudents(students.map(student =>
      student.id === id
        ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
        : student
    ));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
  }

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;

  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="ADOW Primary and Secondary School" className="navbar-logo" />
        <span className="navbar-title">Attendance</span>
      </nav>

      <div className="attendance-content">
        <h1>Today's Attendance</h1>

        <div className="attendance-list">
          {students.map(student => (
            <div key={student.id} className="attendance-row">
              <span className="student-name">{student.name}</span>
              <button
                className={`status-btn ${student.status}`}
                onClick={() => toggleStatus(student.id)}
              >
                {student.status === 'present' ? 'Present' : 'Absent'}
              </button>
            </div>
          ))}
        </div>

        <button className="save-btn" onClick={handleSave}>Save Attendance</button>

        {saved && (
          <div className="summary-box">
            <h3>Attendance Saved</h3>
            <p>{presentCount} Present &nbsp;|&nbsp; {absentCount} Absent</p>
            <ul>
              {students.map(s => (
                <li key={s.id}>
                  {s.name} — <strong>{s.status === 'present' ? 'Present' : 'Absent'}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
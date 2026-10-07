import { useState } from 'react';
import logo from './assets/logo.png';
import './Grades.css';

const gradeScale = [
  { grade: 'A',  min: 84, points: 12 },
  { grade: 'A-', min: 80, points: 11 },
  { grade: 'B+', min: 75, points: 10 },
  { grade: 'B',  min: 70, points: 9 },
  { grade: 'B-', min: 65, points: 8 },
  { grade: 'C+', min: 60, points: 7 },
  { grade: 'C',  min: 55, points: 6 },
  { grade: 'C-', min: 50, points: 5 },
  { grade: 'D+', min: 45, points: 4 },
  { grade: 'D',  min: 40, points: 3 },
  { grade: 'D-', min: 35, points: 2 },
  { grade: 'E',  min: 0,  points: 1 },
];

function scoreToGrade(score) {
  return gradeScale.find(g => score >= g.min);
}

function pointsToGrade(points) {
  const rounded = Math.round(points);
  return gradeScale.find(g => g.points === rounded) || gradeScale[gradeScale.length - 1];
}

function getRemark(grade) {
  if (grade.startsWith('A')) return 'Excellent';
  if (grade.startsWith('B')) return 'Very Good';
  if (grade.startsWith('C')) return 'Good';
  if (grade.startsWith('D')) return 'Fair, needs improvement';
  return 'Poor, needs serious improvement';
}

function computeSummary(subjects) {
  const totalPoints = subjects.reduce((sum, s) => sum + s.points, 0);
  const meanPoints = totalPoints / subjects.length;
  const meanGradeInfo = pointsToGrade(meanPoints);
  const totalScore = subjects.reduce((sum, s) => sum + s.score, 0);
  const averageScore = Math.round(totalScore / subjects.length);
  return {
    averageScore,
    meanPoints: meanPoints.toFixed(1),
    meanGrade: meanGradeInfo.grade,
    remark: getRemark(meanGradeInfo.grade),
  };
}

const subjectList = [
  'English',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Business Studies',
  'Computer Studies',
  'I.R.E',
  'Arabic',
];

function Grades() {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [scores, setScores] = useState({});
  const [reportCards, setReportCards] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editScores, setEditScores] = useState({});

  function handleScoreChange(subject, value) {
    setScores({ ...scores, [subject]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!studentName || !studentClass) return;

    const filledSubjects = subjectList.filter(s => scores[s] !== undefined && scores[s] !== '');
    if (filledSubjects.length === 0) return;

    const subjectResults = filledSubjects.map(s => {
      const score = Number(scores[s]);
      const gradeInfo = scoreToGrade(score);
      return { name: s, score, grade: gradeInfo.grade, points: gradeInfo.points };
    });

    const summary = computeSummary(subjectResults);

    const report = {
      id: Date.now(),
      receiptNo: 'RC-' + Math.floor(1000 + Math.random() * 9000),
      studentName,
      studentClass,
      subjects: subjectResults,
      ...summary,
      date: new Date().toLocaleDateString(),
    };

    setReportCards(prev => [report, ...prev]);
    setStudentName('');
    setStudentClass('');
    setScores({});
  }

  function startEdit(report) {
    setEditingId(report.id);
    const initial = {};
    report.subjects.forEach(s => { initial[s.name] = s.score; });
    setEditScores(initial);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditScores({});
  }

  function handleEditScoreChange(subject, value) {
    setEditScores({ ...editScores, [subject]: value });
  }

  function saveEdit(reportId) {
    setReportCards(prev => prev.map(r => {
      if (r.id !== reportId) return r;

      const updatedSubjects = r.subjects.map(s => {
        const newScore = Number(editScores[s.name]);
        const gradeInfo = scoreToGrade(newScore);
        return { name: s.name, score: newScore, grade: gradeInfo.grade, points: gradeInfo.points };
      });

      const summary = computeSummary(updatedSubjects);

      return { ...r, subjects: updatedSubjects, ...summary };
    }));
    setEditingId(null);
    setEditScores({});
  }

  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="ADOW Primary and Secondary School" className="navbar-logo" />
        <span className="navbar-title">Grades / Report Cards</span>
      </nav>

      <div className="grades-content">
        <form className="grades-form" onSubmit={handleSubmit}>
          <label>Student Name</label>
          <input
            type="text"
            placeholder="e.g. Faith Wambui"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />

          <label>Class</label>
          <input
            type="text"
            placeholder="e.g. Grade 7"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            required
          />

          <h3>Subject Scores (out of 100)</h3>
          <div className="subject-grid">
            {subjectList.map(subject => (
              <div key={subject} className="subject-row">
                <label>{subject}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={scores[subject] || ''}
                  onChange={(e) => handleScoreChange(subject, e.target.value)}
                />
              </div>
            ))}
          </div>

          <button type="submit">Generate Report Card</button>
        </form>

        {reportCards.length > 0 && (
          <div className="report-section">
            <h3>Report Cards</h3>
            {reportCards.map(r => {
              const isEditing = editingId === r.id;
              return (
                <div key={r.id} className="report-card">
                  <div className="report-card-header">
                    <img src={logo} alt="School Logo" className="report-logo" />
                    <div className="report-header-text">
                      <h2>ADOW Primary and Secondary School</h2>
                      <p>Discipline · Knowledge · A Brighter Future</p>
                    </div>
                    {!isEditing && (
                      <button className="edit-btn" onClick={() => startEdit(r)}>Edit Scores</button>
                    )}
                  </div>

                  <div className="report-meta">
                    <div>
                      <span className="meta-label">Student</span>
                      <span className="meta-value">{r.studentName}</span>
                    </div>
                    <div>
                      <span className="meta-label">Class</span>
                      <span className="meta-value">{r.studentClass}</span>
                    </div>
                    <div>
                      <span className="meta-label">Date</span>
                      <span className="meta-value">{r.date}</span>
                    </div>
                    <div>
                      <span className="meta-label">Report No.</span>
                      <span className="meta-value">{r.receiptNo}</span>
                    </div>
                  </div>

                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.subjects.map(sub => (
                        <tr key={sub.name}>
                          <td>{sub.name}</td>
                          <td>
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                className="edit-score-input"
                                value={editScores[sub.name]}
                                onChange={(e) => handleEditScoreChange(sub.name, e.target.value)}
                              />
                            ) : (
                              sub.score
                            )}
                          </td>
                          <td>
                            <span className={`mini-grade grade-${sub.grade[0]}`}>
                              {sub.grade}
                            </span>
                          </td>
                          <td>{sub.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {isEditing ? (
                    <div className="edit-actions">
                      <button className="save-edit-btn" onClick={() => saveEdit(r.id)}>Save Changes</button>
                      <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <div className="report-footer">
                      <div className="footer-stat">
                        <span className="meta-label">Average Score</span>
                        <span className="footer-value">{r.averageScore}%</span>
                      </div>
                      <div className="footer-stat">
                        <span className="meta-label">Mean Points</span>
                        <span className="footer-value">{r.meanPoints}</span>
                      </div>
                      <div className="footer-stat">
                        <span className="meta-label">Mean Grade</span>
                        <span className={`grade-badge grade-${r.meanGrade[0]}`}>{r.meanGrade}</span>
                      </div>
                      <div className="footer-stat remark">
                        <span className="meta-label">Remark</span>
                        <span className="footer-value">{r.remark}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Grades;
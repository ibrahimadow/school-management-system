import { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import './FeePayment.css';

function FeePayment() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => setError('Could not load students. Is the backend running?'));
  }, []);

  const selectedStudent = students.find(s => s.id === Number(selectedStudentId));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const paid = Number(amount);
    if (!selectedStudentId || !paid || paid <= 0) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/fee-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: Number(selectedStudentId), amount: paid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      setReceipts(prev => [
        {
          id: data.id,
          receiptNo: data.receipt_no,
          studentName: selectedStudent.name,
          studentClass: selectedStudent.class,
          contact: selectedStudent.contact,
          location: selectedStudent.location,
          amount: paid,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);

      // update the local student list so the balance shown stays accurate
      setStudents(prev =>
        prev.map(s => (s.id === Number(selectedStudentId) ? { ...s, fee_balance: data.new_balance } : s))
      );
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="ADOW Primary and Secondary School" className="navbar-logo" />
        <span className="navbar-title">Fee Payment</span>
      </nav>

      <div className="fee-content">
        <div className="balance-box">
          <span>Current Balance</span>
          <h1>
            {selectedStudent
              ? `KES ${Number(selectedStudent.fee_balance).toLocaleString()}`
              : 'Select a student'}
          </h1>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className="fee-form" onSubmit={handleSubmit}>
          <label htmlFor="student">Select Student</label>
          <select
            id="student"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            required
          >
            <option value="">-- Choose a student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
            ))}
          </select>

          <label htmlFor="amount">Payment Amount (KES)</label>
          <input
            id="amount"
            type="number"
            min="1"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Make Payment'}
          </button>
        </form>

        {receipts.length > 0 && (
          <div className="receipts-section">
            <h3>Payment Receipts</h3>
            {receipts.map(r => (
              <div key={r.id} className="receipt-card">
                <div className="receipt-header">
                  <span>Receipt No: {r.receiptNo}</span>
                  <span>{r.date} {r.time}</span>
                </div>
                <div className="receipt-body">
                  <p><strong>Student:</strong> {r.studentName}</p>
                  <p><strong>Class:</strong> {r.studentClass}</p>
                  <p><strong>Contact:</strong> {r.contact}</p>
                  <p><strong>Location:</strong> {r.location}</p>
                  <p className="receipt-amount"><strong>Amount Paid:</strong> KES {r.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeePayment;
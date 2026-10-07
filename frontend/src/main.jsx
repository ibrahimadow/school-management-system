import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './login.jsx'
import StudentDashboard from './StudentDashboard.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import Attendance from './Attendance.jsx'
import FeePayment from './FeePayment.jsx'
import Grades from './Grades.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/fee-payment" element={<FeePayment />} />
        <Route path="/grades" element={<Grades />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';  // หน้า Login
import Home from './component/Home';    // หน้า Home
import Teacher from './component/Teacher';    // หน้า Teacher
import ScanStudent from './component/ScanStudent';
import StudentList from './component/StudentList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/scan-student" element={<ScanStudent />} />
        <Route path="/student-list" element={<StudentList />} />
      </Routes>
    </Router>
  );
};

export default App;

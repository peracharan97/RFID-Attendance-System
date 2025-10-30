import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import StudentStats from "./pages/StudentStats"; 
import ProxyAttendance from "./pages/ProxyAttendance"; 
import AddStudent from "./pages/AddStudent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentStats />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin-login" element={<Login />} /> 
        <Route path="/class-attendance" element={<ProxyAttendance />} />
  <Route path="/add-student" element={<AddStudent />} />{/* ✅ Add this */}
      </Routes>
    </Router>
  );
}

export default App;

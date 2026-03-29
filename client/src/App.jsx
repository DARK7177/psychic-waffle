import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Login from "./components/auth/Login";
import StudentDashboard from "./components/student/StudentDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import RegisterStudent from "./components/auth/RegisterStudent";
import RegisterTeacher from "./components/auth/RegisterTeacher";
import StudentProfilePage from "./components/student/StudentProfilePage";
import TeacherProfilePage from "./components/teacher/TeacherProfilePage";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/teacher" element={<RegisterTeacher />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/teacher/profile" element={<TeacherProfilePage />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;
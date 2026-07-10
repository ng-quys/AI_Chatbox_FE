import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Dashboard/Home";
import MainLayout from "../layouts/MainLayout";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ExportExam from "../pages/Dashboard/ExportExam";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Định tuyến cho Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Định tuyến cho Dashboard bọc trong MainLayout */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        {/* Điều hướng mặc định */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/test-export" element={<ExportExam />} /> // tạm thời thoi nha "/dashboard/exams/:id/export-word"
      </Routes>
    </BrowserRouter>
  );
}
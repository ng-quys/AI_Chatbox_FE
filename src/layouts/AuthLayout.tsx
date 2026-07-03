import type { ReactNode } from "react";
import "../styles/auth.css";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <section className="auth-intro">
        <div className="auth-intro-content">
          <h1 className="auth-intro-title">
            Kết nối  <span className="text-white">giáo viên</span> với công
            <br />
            cụ tạo đề thông minh
          </h1>

          <p className="auth-intro-desc">
            Hệ thống hỗ trợ giảng viên soạn đề, quản lý ngân hàng câu hỏi và
            xuất đề thi nhanh chóng, chính xác, phù hợp với từng môn học.
          </p>

          <div className="auth-feature-row">
            <div className="auth-feature-btn">
              <span>🪄</span>
              Tạo đề nhanh
            </div>

            <div className="auth-feature-btn">
              <span>📦</span>
              Ngân hàng câu hỏi
            </div>
          </div>

          <div className="auth-feature-btn auth-feature-center">
            <span>🔗</span>
            Xuất đề chuẩn mẫu
          </div>
        </div>

        <p className="auth-copyright">2026 ETECHS. All Rights Reserved.</p>
      </section>

      <section className="auth-form-side">{children}</section>
    </div>
  );
}
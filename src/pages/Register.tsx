import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="card">
        <h2>ĐĂNG KÝ</h2>

        <input className="input" placeholder="Họ tên" />
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Số điện thoại" />
        <input className="input" type="password" placeholder="Mật khẩu" />

        <button className="button">Đăng ký</button>

        <p className="link" onClick={() => navigate("/")}>
          <span className="black">Đã có tài khoản? </span>
          <span className="green">Đăng nhập</span>
        </p>
      </div>
    </AuthLayout>
  );
}
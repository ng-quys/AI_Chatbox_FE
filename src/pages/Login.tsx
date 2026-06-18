import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="card">
        <div className="brand">
          <img src="/logo.png" alt="logo" className="logo" />
          <h1>ETECHS</h1>
        </div>

        <input className="input" placeholder="Email" />
        <input className="input" type="password" placeholder="Mật khẩu" />
        <div className="login-options">
          <label className="remember">
            <input type="checkbox" />
            Ghi nhớ đăng nhập
          </label>

          <span className="forgot">Quên mật khẩu?</span>
        </div>
        <button className="button">Đăng nhập</button>

        <p className="link" onClick={() => navigate("/register")}>
          <span className="black">Chưa có tài khoản? </span>
          <span className="green">Đăng ký</span>
        </p>
      </div>
    </AuthLayout>
  );
}
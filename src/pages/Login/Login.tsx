import { Link } from "react-router-dom";
import { FiMail, FiLock, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/images/logo.png";

export default function Login() {
  return (
    <AuthLayout>
      <div className="login-card">
        <img src={logo} alt="ETECHS" className="login-logo" />

        <form className="login-form">
          <div className="form-group">
            <label>Địa chỉ Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input type="email" placeholder="Email" />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input type="password" placeholder="Password" />
              <FiEyeOff className="input-eye" />
            </div>
          </div>

          <div className="login-options">
            <label className="remember-login">
              <input type="checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <button type="submit" className="login-submit">
            Đăng nhập
          </button>

          <div className="divider">
            <span>hoặc</span>
          </div>

          <button type="button" className="google-btn">
            <FcGoogle className="google-icon" />
            <span>Sign in with Google</span>
          </button>

          <p className="register-text">
            Chưa có tài khoản?{" "}
            <Link to="/register">Đăng ký miễn phí</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
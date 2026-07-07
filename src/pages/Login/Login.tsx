import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/images/logo.png";

import { loginSchema } from "../../utils/validation"; 

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Dữ liệu chuẩn gửi lên API Đăng nhập:", data);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/dashboard");
    } catch (error) {
      console.error("Lỗi đăng nhập hệ thống:", error);
    }
  };

  return (
    <AuthLayout>
      <div className="login-card">
        <img src={logo} alt="ETECHS" className="login-logo" />

        <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
          
          <div className="form-group">
            <label>Địa chỉ Email</label>
            <div className={`input-wrapper ${errors.email ? "border-red-500" : ""}`}>
              <FiMail className="input-icon" />
              <input 
                type="email" 
                placeholder="Email" 
                {...register("email")} 
              />
            </div>

            {errors.email && (
              <p className="validation-error-text">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className={`input-wrapper ${errors.password ? "border-red-500" : ""}`}>
              <FiLock className="input-icon" />
              <input 
                type="password" 
                placeholder="Password" 
                {...register("password")} 
              />
              <FiEyeOff className="input-eye" style={{ cursor: "pointer" }} />
            </div>
            {errors.password && (
              <p className="validation-error-text">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="login-options">
            <label className="remember-login">
              <input 
                type="checkbox" 
                {...register("rememberMe")} 
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          
          <button 
            type="submit" 
            className="login-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          <div className="divider">
            <span>hoặc</span>
          </div>

          <button type="button" className="google-btn" onClick={() => alert("Chức năng đang phát triển")}>
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
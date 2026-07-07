import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiEyeOff, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import logo from "../../assets/images/logo.png";
import "../../styles/forgot-password.css";
import { forgotStepOneSchema, forgotStepTwoSchema, forgotStepThreeSchema } from "../../utils/validation";

type ForgotStep = 1 | 2 | 3;

export default function ForgotPassword() {
  const [step, setStep] = useState<ForgotStep>(1);
  const [savedEmail, setSavedEmail] = useState(""); // Lưu lại email sau step 1 để hiển thị ở step 2
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // ==========================================
  // HOOK FORM CHO BƯỚC 1: NHẬP EMAIL
  // ==========================================
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm({
    resolver: yupResolver(forgotStepOneSchema),
    defaultValues: { email: "" },
  });

  const onStep1Submit = (data: { email: string }) => {
    setSavedEmail(data.email);
    setStep(2); // Thỏa mãn validation -> Sang bước nhập OTP
  };

  // ==========================================
  // HOOK FORM CHO BƯỚC 2: XÁC THỰC OTP
  // ==========================================
  const {
    setValue: setOtpValue,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    setError: setOtpCustomError,
    clearErrors: clearOtpErrors,
  } = useForm({
    resolver: yupResolver(forgotStepTwoSchema),
    defaultValues: { otp: "" },
  });

  // Xử lý sự kiện gõ từng ô OTP độc lập và tự động nhảy con trỏ
  const handleOtpChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    clearOtpErrors("otp");

    // Gộp mảng 6 ký tự thành chuỗi rồi cập nhật vào giá trị form của react-hook-form
    const fullOtpString = nextOtp.join("");
    setOtpValue("otp", fullOtpString, { shouldValidate: true });

    // Tự động chuyển focus sang ô tiếp theo
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const onStep2Submit = (data: { otp: string }) => {
    // Giả lập check mã OTP đúng chuẩn hệ thống (Ví dụ: 123456)
    if (data.otp !== "123456") {
      setOtpCustomError("otp", { message: "Mã OTP không đúng, vui lòng nhập lại" });
      return;
    }
    setStep(3); // Khớp mã -> Chuyển sang bước đổi mật khẩu
  };

  // ==========================================
  // HOOK FORM CHO BƯỚC 3: ĐẶT LAI MẬT KHẨU
  // ==========================================
  type Step3Data = yup.InferType<typeof forgotStepThreeSchema>;
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    formState: { errors: errorsStep3 },
  } = useForm<Step3Data>({
    resolver: yupResolver(forgotStepThreeSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // 1. Tạo một state thuần để lưu mật khẩu (Bỏ hẳn hàm watch của thư viện để React Compiler không bắt bẻ)
  const [localPassword, setLocalPassword] = useState("");

  // 2. Tính toán trực tiếp các rule dựa trên State thuần này
  const passwordRules = {
    length: localPassword.length >= 8,
    upper: /[A-Z]/.test(localPassword),
    lower: /[a-z]/.test(localPassword),
    numberOrSpecial: /[\d\W_]/.test(localPassword),
  };

  const onStep3Submit = (data: Step3Data) => {
    console.log("Dữ liệu reset mật khẩu hoàn chỉnh gửi lên API:", {
      email: savedEmail,
      password: data.password,
    });
    // Xử lý gọi API cập nhật lại mật khẩu ở đây
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-card-top" />

        <div className="forgot-card-body">
          <img src={logo} alt="ETECHS" className="forgot-logo" />

          {/* STEP 1: FORM NHẬP EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSubmitStep1(onStep1Submit)} noValidate>
              <h1 className="forgot-title">Quên mật khẩu?</h1>
              <p className="forgot-desc">
                Nhập email đã đăng ký để nhận hướng dẫn đăng nhập và đặt lại mật khẩu.
              </p>

              <div className="forgot-field">
                <label>Email</label>
                <input
                  className={`forgot-input ${errorsStep1.email ? "input-error" : ""}`}
                  placeholder="tangthimyhang2005@gmail.com"
                  type="email"
                  {...registerStep1("email")}
                />
                {errorsStep1.email && <p className="forgot-error">{errorsStep1.email.message}</p>}
              </div>

              <button type="submit" className="forgot-submit">Gửi liên kết</button>

              <p className="forgot-login-text">
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
              <StepIndicator activeStep={1} />
            </form>
          )}

          {/* STEP 2: FORM XÁC THỰC MÃ OTP */}
          {step === 2 && (
            <form onSubmit={handleSubmitStep2(onStep2Submit)} noValidate>
              <h1 className="forgot-title otp-title">Mã OTP</h1>
              <p className="forgot-desc otp-desc">
                Chúng tôi đã gửi mã OTP tới {savedEmail}
              </p>

              <div className="otp-row">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={(element) => { otpRefs.current[index] = element; }}
                    className={errorsStep2.otp ? "otp-input otp-error" : "otp-input"}
                    value={value}
                    onChange={(event) => handleOtpChange(index, event)}
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>

              {errorsStep2.otp && <p className="otp-error-text">{errorsStep2.otp.message}</p>}

              <p className="resend-text"><strong>Gửi lại mã</strong> sau 00:30</p>
              <button type="submit" className="forgot-submit">Xác thực OTP</button>
              <StepIndicator activeStep={2} />
            </form>
          )}

          {/* STEP 3: FORM ĐẶT LẠI MẬT KHẨU MỚI */}
          {step === 3 && (
            <form onSubmit={handleSubmitStep3(onStep3Submit)} noValidate>
              <h1 className="forgot-title reset-title">Đặt lại mật khẩu</h1>
              <p className="forgot-desc reset-desc">Mã OTP hợp lệ. Vui lòng đặt lại mật khẩu</p>

              <div className="reset-field">
                <label>Mật khẩu mới</label>
                <div className={`reset-input ${errorsStep3.password ? "input-error" : ""}`}>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    {...registerStep3("password")}
                  />
                  <FiEyeOff className="reset-eye" />
                </div>
                {errorsStep3.password && <p className="forgot-error" style={{ marginTop: '8px' }}>{errorsStep3.password.message}</p>}
              </div>

              {/* Các dòng hiển thị rule đáp ứng ký tự */}
              <div className="reset-rules">
                <PasswordRule checked={passwordRules.length}>Mật khẩu phải có ít nhất 8 ký tự.</PasswordRule>
                <PasswordRule checked={passwordRules.upper}>Mật khẩu phải có ít nhất 1 chữ cái in hoa.</PasswordRule>
                <PasswordRule checked={passwordRules.lower}>Mật khẩu phải có ít nhất 1 chữ cái thường.</PasswordRule>
                <PasswordRule checked={passwordRules.numberOrSpecial}>Mật khẩu phải có ít nhất 1 chữ số hoặc ký tự đặc biệt.</PasswordRule>
              </div>

              <div className="reset-field confirm-field">
                <label>Xác nhận mật khẩu</label>
                <div className={`reset-input ${errorsStep3.confirmPassword ? "input-error" : ""}`}>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    {...registerStep3("password", {
                      onChange: (e) => setLocalPassword(e.target.value) // Cập nhật chữ gõ vào state thuần
                    })}
                  />
                  <FiEyeOff className="reset-eye" />
                </div>
                {errorsStep3.confirmPassword && (
                  <p className="forgot-error confirm-error">{errorsStep3.confirmPassword.message}</p>
                )}
              </div>

              <button type="submit" className="forgot-submit reset-submit">Thay đổi mật khẩu</button>
              <StepIndicator activeStep={3} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  return (
    <div className="forgot-step-indicator">
      <span className={activeStep === 1 ? "step-dot active" : "step-dot"} />
      <span className={activeStep === 2 ? "step-dot active" : "step-dot"} />
      <span className={activeStep === 3 ? "step-dot active" : "step-dot"} />
    </div>
  );
}

function PasswordRule({ checked, children }: { checked: boolean; children: React.ReactNode }) {
  return (
    <p className={checked ? "password-rule valid" : "password-rule invalid"}>
      {checked ? <FiCheckCircle /> : <FiXCircle />}
      <span>{children}</span>
    </p>
  );
}
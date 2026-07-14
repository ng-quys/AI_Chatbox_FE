import { useRef, useState  } from "react";
import { Link } from "react-router-dom";
import { FiEyeOff, FiEye, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import logo from "../../assets/images/logo.png";
import "../../styles/forgot-password.css";
import { forgotStepOneSchema, forgotStepTwoSchema, forgotStepThreeSchema } from "../../utils/validation";

type ForgotStep = 1 | 2 | 3;

export default function ForgotPassword() {
  const [step, setStep] = useState<ForgotStep>(1);
  const [savedEmail, setSavedEmail] = useState(""); 
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const isDeleting = useRef(false);
  // State quản lý ẩn/hiện mật khẩu động ở Bước 3
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setStep(2); 
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
    getValues: getOtpValues,
  } = useForm({
    resolver: yupResolver(forgotStepTwoSchema),
    defaultValues: { otp: "" },
  });

  const handleOtpChange = (index: number, value: string) => {
    // Nếu đang trong quá trình xóa (bấm Backspace), chặn đứng không cho ghi đè ngược số cũ
    if (isDeleting.current) {
      isDeleting.current = false;
      return;
    }

    // Chỉ lấy đúng 1 ký tự số cuối cùng vừa được nhập vào (hỗ trợ gõ đè)
    const sanitizedValue = value.substring(value.length - 1).replace(/\D/g, "");
    
    const nextOtp = [...otp];
    nextOtp[index] = sanitizedValue;
    setOtp(nextOtp);
    clearOtpErrors("otp");

    // Đồng bộ giá trị gộp lại cho react-hook-form
    setOtpValue("otp", nextOtp.join(""), { shouldValidate: true });

    // Nếu vừa gõ xong một số, tự động nhảy con trỏ sang ô tiếp theo bên phải
    if (sanitizedValue && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      isDeleting.current = true; 
      const nextOtp = [...otp];

      if (!otp[index] && index > 0) {
        nextOtp[index - 1] = "";
        setOtp(nextOtp);
        setOtpValue("otp", nextOtp.join(""), { shouldValidate: true });
        otpRefs.current[index - 1]?.focus();
        event.preventDefault();
      } else {
        nextOtp[index] = "";
        setOtp(nextOtp);
        setOtpValue("otp", nextOtp.join(""), { shouldValidate: true });
        event.preventDefault();
      }
    } 
    
    else if (event.key === "ArrowLeft") {
      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        event.preventDefault(); 
      }
    } 
    
    else if (event.key === "ArrowRight") {
      if (index < 5) {
        otpRefs.current[index + 1]?.focus();
        event.preventDefault(); 
      }
    } 
    
    else {
      isDeleting.current = false;
    }
  };



  const onStep2Submit = (data: { otp: string }) => {
    if (data.otp !== "123456") {
      setOtpCustomError("otp", { message: "Mã OTP không đúng, vui lòng nhập lại" });
      return;
    }
    setStep(3); 
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

  const [localPassword, setLocalPassword] = useState("");

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
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-card-top" />

        <div className="forgot-card-body">
          <img src={logo} alt="ETECHS" className="forgot-logo" />

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
              <StepIndicator activeStep={1} setStep={setStep} savedEmail={savedEmail} currentOtp={getOtpValues("otp")} />
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitStep2(onStep2Submit)} noValidate>
              <h1 className="forgot-title otp-title">Mã OTP</h1>
              <p className="forgot-desc otp-desc">
                Chúng tôi đã gửi mã OTP tới {savedEmail}
              </p>

              <div className="otp-row">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    ref={(element) => { otpRefs.current[index] = element; }}
                    className={errorsStep2.otp ? "otp-input otp-error" : "otp-input"}
                    value={otp[index]} 
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    maxLength={2} 
                    inputMode="numeric"
                  />
                ))}
              </div>

              {errorsStep2.otp && <p className="otp-error-text">{errorsStep2.otp.message}</p>}

              <p className="resend-text"><strong>Gửi lại mã</strong> sau 00:30</p>
              <button type="submit" className="forgot-submit">Xác thực OTP</button>
              <StepIndicator activeStep={2} setStep={setStep} savedEmail={savedEmail} currentOtp={getOtpValues("otp")} />
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitStep3(onStep3Submit)} noValidate>
              <h1 className="forgot-title reset-title">Đặt lại mật khẩu</h1>
              <p className="forgot-desc reset-desc">Mã OTP hợp lệ. Vui lòng đặt lại mật khẩu</p>

              <div className="reset-field">
                <label>Mật khẩu mới</label>
                <div className={`reset-input ${errorsStep3.password ? "input-error" : ""}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    {...registerStep3("password", {
                      onChange: (e) => setLocalPassword(e.target.value)
                    })}
                  />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ display: "flex", cursor: "pointer" }}>
                    {showPassword ? <FiEye className="reset-eye" /> : <FiEyeOff className="reset-eye" />}
                  </span>
                </div>
                {errorsStep3.password && <p className="forgot-error" style={{ marginTop: '8px' }}>{errorsStep3.password.message}</p>}
              </div>

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
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    {...registerStep3("confirmPassword")} // FIX LỖI: Đổi từ "password" thành "confirmPassword" chuẩn chỉ
                  />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ display: "flex", cursor: "pointer" }}>
                    {showConfirmPassword ? <FiEye className="reset-eye" /> : <FiEyeOff className="reset-eye" />}
                  </span>
                </div>
                {errorsStep3.confirmPassword && (
                  <p className="forgot-error confirm-error">{errorsStep3.confirmPassword.message}</p>
                )}
              </div>

              <button type="submit" className="forgot-submit reset-submit">Thay đổi mật khẩu</button>
              <StepIndicator activeStep={3} setStep={setStep} savedEmail={savedEmail} currentOtp={getOtpValues("otp")} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// THÀNH PHẦN THANH TIẾN TRÌNH THÔNG MINH 
// ==========================================
interface StepIndicatorProps {
  activeStep: ForgotStep;
  setStep: (step: ForgotStep) => void;
  savedEmail: string;
  currentOtp: string;
}

function StepIndicator({ activeStep, setStep, savedEmail, currentOtp }: StepIndicatorProps) {
  const handleDotClick = (targetStep: ForgotStep) => {
    if (targetStep < activeStep) {
      setStep(targetStep);
      return;
    }

    if (targetStep === 2 && savedEmail.trim() !== "") {
      setStep(2);
      return;
    }

    if (targetStep === 3 && savedEmail.trim() !== "" && currentOtp === "123456") {
      setStep(3);
      return;
    }
  };

  return (
    <div className="forgot-step-indicator">
      {[1, 2, 3].map((s) => {
        const isClickable =
          s < activeStep || 
          (s === 2 && savedEmail.trim() !== "") || 
          (s === 3 && savedEmail.trim() !== "" && currentOtp === "123456");

        return (
          <span
            key={s}
            className={`step-dot ${activeStep === s ? "active" : ""} ${isClickable ? "clickable" : ""}`}
            onClick={() => handleDotClick(s as ForgotStep)}
            style={{
              cursor: isClickable ? "pointer" : "not-allowed",
              opacity: isClickable || activeStep === s ? 1 : 0.4,
              transition: "all 0.2s ease"
            }}
          />
        );
      })}
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
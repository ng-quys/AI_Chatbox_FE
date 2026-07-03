import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiEyeOff, FiCheckCircle, FiXCircle } from "react-icons/fi";
import logo from "../../assets/images/logo.png";
import "../../styles/forgot-password.css";

type ForgotStep = 1 | 2 | 3;

type PasswordRules = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  numberOrSpecial: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [step, setStep] = useState<ForgotStep>(1);

  const [email, setEmail] = useState("tangthimyhang2005@gmail.com");
  const [emailError, setEmailError] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const passwordRules = useMemo<PasswordRules>(() => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      numberOrSpecial: /[\d\W_]/.test(password),
    };
  }, [password]);

  const isPasswordValid =
    passwordRules.length &&
    passwordRules.upper &&
    passwordRules.lower &&
    passwordRules.numberOrSpecial;

  const handleSendEmail = () => {
    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Email không đúng định dạng");
      return;
    }

    setEmailError("");
    setStep(2);
  };

  const handleOtpChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    setOtpError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      setOtpError("Vui lòng nhập đủ mã OTP");
      return;
    }

    if (otpValue !== "123456") {
      setOtpError("Mã OTP không đúng, vui lòng nhập lại");
      return;
    }

    setOtpError("");
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!isPasswordValid) {
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmError("Vui lòng xác nhận mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setConfirmError("");

    console.log("Reset password:", {
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-card-top" />

        <div className="forgot-card-body">
          <img src={logo} alt="ETECHS" className="forgot-logo" />

          {step === 1 && (
            <>
              <h1 className="forgot-title">Quên mật khẩu?</h1>

              <p className="forgot-desc">
                Nhập email đã đăng ký để nhận hướng dẫn đăng nhập và đặt lại
                mật khẩu.
              </p>

              <div className="forgot-field">
                <label>Email</label>

                <input
                  className={
                    emailError ? "forgot-input input-error" : "forgot-input"
                  }
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                  }}
                  placeholder="tangthimyhang2005@gmail.com"
                />

                {emailError && <p className="forgot-error">{emailError}</p>}
              </div>

              <button
                type="button"
                className="forgot-submit"
                onClick={handleSendEmail}
              >
                Gửi liên kết
              </button>

              <p className="forgot-login-text">
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>

              <StepIndicator activeStep={1} />
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="forgot-title otp-title">Mã OTP</h1>

              <p className="forgot-desc otp-desc">
                Chúng tôi đã gửi mã OTP tới {email}
              </p>

              <div className="otp-row">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    className={otpError ? "otp-input otp-error" : "otp-input"}
                    value={value}
                    onChange={(event) => handleOtpChange(index, event)}
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>

              {otpError && <p className="otp-error-text">{otpError}</p>}

              <p className="resend-text">
                <strong>Gửi lại mã</strong> sau 00:30
              </p>

              <button
                type="button"
                className="forgot-submit"
                onClick={handleVerifyOtp}
              >
                Xác thực OTP
              </button>

              <StepIndicator activeStep={2} />
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="forgot-title reset-title">Đặt lại mật khẩu</h1>

              <p className="forgot-desc reset-desc">
                Mã OTP hợp lệ. Vui lòng đặt lại mật khẩu
              </p>

              <div className="reset-field">
                <label>Mật khẩu mới</label>

                <div
                  className={
                    password && !isPasswordValid
                      ? "reset-input input-error"
                      : "reset-input"
                  }
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />

                  <FiEyeOff className="reset-eye" />
                </div>
              </div>

              <div className="reset-rules">
                <PasswordRule checked={passwordRules.length}>
                  Mật khẩu phải có ít nhất 8 ký tự.
                </PasswordRule>

                <PasswordRule checked={passwordRules.upper}>
                  Mật khẩu phải có ít nhất 1 chữ cái in hoa.
                </PasswordRule>

                <PasswordRule checked={passwordRules.lower}>
                  Mật khẩu phải có ít nhất 1 chữ cái thường.
                </PasswordRule>

                <PasswordRule checked={passwordRules.numberOrSpecial}>
                  Mật khẩu phải có ít nhất 1 chữ số hoặc ký tự đặc biệt.
                </PasswordRule>
              </div>

              <div className="reset-field confirm-field">
                <label>Xác nhận mật khẩu</label>

                <div
                  className={
                    confirmError ? "reset-input input-error" : "reset-input"
                  }
                >
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setConfirmError("");
                    }}
                    placeholder="Nhập lại mật khẩu"
                  />

                  <FiEyeOff className="reset-eye" />
                </div>

                {confirmError && (
                  <p className="forgot-error confirm-error">{confirmError}</p>
                )}
              </div>

              <button
                type="button"
                className="forgot-submit reset-submit"
                onClick={handleResetPassword}
              >
                Thay đổi mật khẩu
              </button>

              <StepIndicator activeStep={3} />
            </>
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

function PasswordRule({
  checked,
  children,
}: {
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <p className={checked ? "password-rule valid" : "password-rule invalid"}>
      {checked ? <FiCheckCircle /> : <FiXCircle />}
      <span>{children}</span>
    </p>
  );
}
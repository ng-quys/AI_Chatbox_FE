import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {FiMail,FiChevronDown,FiAlertCircle,FiEyeOff,FiCheckCircle,FiXCircle,FiEye} from "react-icons/fi";
import type { RegisterRequest } from "../../types/auth.type";
import logo from "../../assets/images/logo.png";
import "../../styles/register.css";

type RegisterStep = 1 | 2;

type RegisterForm = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  subject: string;
  grade: string;
  organization: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const subjects = ["Ngữ văn", "Toán", "Tin học", "Option"];

const grades = [
  "Lớp 1",
  "Lớp 2",
  "Lớp 3",
  "Lớp 4",
  "Lớp 5",
  "Lớp 6",
  "Lớp 7",
  "Lớp 8",
  "Lớp 9",
  "Lớp 10",
  "Lớp 11",
  "Lớp 12",
];

const organizations = [
  "Trung học phổ thông Nguyễn Du",
  "Đại học Công Thương Thành phố Hồ Chí Minh",
  "Option",
];

const onlyLettersRegex = /^[A-Za-zÀ-ỹ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [step, setStep] = useState<RegisterStep>(1)
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    subject: "",
    grade: "",
    organization: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    "subject" | "grade" | "organization" | null
  >(null);

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const passwordRules = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    numberOrSpecial: /[\d\W_]/.test(form.password),
  };

  const validateStepOne = () => {
    const newErrors: RegisterErrors = {};

    if (!form.lastName.trim()) {
      newErrors.lastName = "Họ và tên đệm không được để trống";
    } else if (!onlyLettersRegex.test(form.lastName)) {
      newErrors.lastName = "Họ và tên đệm chỉ được chứa chữ cái";
    }

    if (!form.firstName.trim()) {
      newErrors.firstName = "Tên không được để trống";
    } else if (!onlyLettersRegex.test(form.firstName)) {
      newErrors.firstName = "Tên chỉ được chứa chữ cái";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không đúng định dạng (vd: example@gmail.com)";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{9}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại phải gồm 9 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Hàm này chỉ kiểm tra xem Bước 1 có hợp lệ hay không để bật/tắt nút click ngầm, HOÀN TOÀN KHÔNG gọi setErrors!
  const checkStepOneValid = () => {
    if (!form.lastName.trim() || !onlyLettersRegex.test(form.lastName)) return false;
    if (!form.firstName.trim() || !onlyLettersRegex.test(form.firstName)) return false;
    if (!form.email.trim() || !emailRegex.test(form.email)) return false;
    if (!form.phone.trim() || !/^\d{9}$/.test(form.phone)) return false;
    return true;
  };

  const validateStepTwo = () => {
    const newErrors: RegisterErrors = {};

    if (!form.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (!passwordRules.length) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStepOne()) {
      setStep(2);
    }
  };
  const [orgSearch, setOrgSearch] = useState("");
 const handleSubmit = async () => {
    if (!validateStepTwo()) return;

    try {
      let finalPhoneNumber = form.phone.trim();
      if (finalPhoneNumber.length === 9 && !finalPhoneNumber.startsWith("0")) {
        finalPhoneNumber = "0" + finalPhoneNumber;
      }

      const requestBody: RegisterRequest = {
        lastName: form.lastName.trim(),    
        firstName: form.firstName.trim(),  
        email: form.email,
        password: form.password,
        
        phoneNumber: finalPhoneNumber,           

        teachingSubject: form.subject || undefined,
        teachingGrade: form.grade || undefined,
        organizationName: form.organization || undefined,
      };

      console.log("🚀 Request JSON (2 trường Tên riêng biệt):", JSON.stringify(requestBody, null, 2));

      // const response = await authApi.register(requestBody);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Đăng ký tài khoản giáo viên thành công!");
      navigate("/login");

    } catch (error) {
      console.error("Lỗi hệ thống khi gửi request đăng ký:", error);
    }
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <Link to="/login">
          <img src={logo} alt="ETECHS" className="register-header-logo" />
        </Link>

        <Link to="/login" className="register-login-btn">
          Đăng nhập
        </Link>
      </header>

      <main className="register-main">
        {step === 1 && (
          <section className="register-card register-card-step-one">
            <div className="register-card-top" />

            <div className="register-card-body">
              <div className="register-grid">
                <div className="register-field">
                  <label>
                    Họ và tên đệm
                    {errors.lastName && <span className="required"> *</span>}
                  </label>

                  <div
                    className={`register-input ${errors.lastName ? "input-error" : ""
                      }`}
                  >
                    <input
                      value={form.lastName}
                      onChange={(event) =>
                        updateField("lastName", event.target.value)
                      }
                    />

                    {errors.lastName && (
                      <FiAlertCircle className="error-icon" />
                    )}
                  </div>

                  {errors.lastName && (
                    <p className="error-text">{errors.lastName}</p>
                  )}
                </div>

                <div className="register-field">
                  <label>
                    Tên
                    {errors.firstName && <span className="required"> *</span>}
                  </label>

                  <div
                    className={`register-input ${errors.firstName ? "input-error" : ""
                      }`}
                  >
                    <input
                      value={form.firstName}
                      onChange={(event) =>
                        updateField("firstName", event.target.value)
                      }
                    />

                    {errors.firstName && (
                      <FiAlertCircle className="error-icon" />
                    )}
                  </div>

                  {errors.firstName && (
                    <p className="error-text">{errors.firstName}</p>
                  )}
                </div>

                <div className="register-field">
                  <label>
                    Địa chỉ Email
                    {errors.email && <span className="required"> *</span>}
                  </label>

                  <div
                    className={`register-input has-icon ${errors.email ? "input-error" : ""
                      }`}
                  >
                    <FiMail className="field-icon" />

                    <input
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                    />

                    {errors.email && <FiAlertCircle className="error-icon" />}
                  </div>

                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="register-field">
                  <label>
                    Số điện thoại
                    {errors.phone && <span className="required"> *</span>}
                  </label>

                  <div className="phone-group">
                    <button type="button" className="country-code">
                      +84
                      <FiChevronDown />
                    </button>

                    <div
                      className={`register-input ${errors.phone ? "input-error" : ""
                        }`}
                    >
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder=" XXX XXX XXX"
                      />

                      {errors.phone && (
                        <FiAlertCircle className="error-icon" />
                      )}
                    </div>
                  </div>

                  {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>

                <div className="register-field dropdown-field">
                  <label>Môn giảng dạy</label>

                  <button
                    type="button"
                    className="register-select"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "subject" ? null : "subject"
                      )
                    }
                  >
                    <span>{form.subject || "Môn"}</span>
                    <FiChevronDown />
                  </button>

                  {openDropdown === "subject" && (
                    <div className="dropdown-menu">
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          className={
                            form.subject === subject ? "selected-option" : ""
                          }
                          onClick={() => {
                            updateField("subject", subject);
                            setOpenDropdown(null);
                          }}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="register-field dropdown-field">
                  <label>Khối lớp</label>

                  <button
                    type="button"
                    className="register-select"
                    onClick={() =>
                      setOpenDropdown(openDropdown === "grade" ? null : "grade")
                    }
                  >
                    <span>{form.grade || "Lớp"}</span>
                    <FiChevronDown />
                  </button>

                  {openDropdown === "grade" && (
                    <div className="grade-menu">
                      {grades.map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          className={form.grade === grade ? "active-grade" : ""}
                          onClick={() => {
                            updateField("grade", grade);
                            setOpenDropdown(null);
                          }}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="register-field organization-field dropdown-field">
                <label>Đơn vị quản lý</label>

                <div
                  className="register-select"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 0, 
                    position: "relative",
                  }}
                >
                  <input
                    type="text"
                    value={openDropdown === "organization" ? orgSearch : form.organization}
                    onChange={(event) => {
                      const val = event.target.value;
                      setOrgSearch(val);
                      updateField("organization", val);
                      setOpenDropdown("organization");
                    }}
                    onFocus={() => {
                      setOpenDropdown("organization");
                      setOrgSearch(form.organization);
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      padding: "0 14px",
                      fontSize: "18px",
                      color: "#111111",
                    }}
                  />

                  <FiChevronDown
                    style={{ marginRight: "14px", cursor: "pointer", fontSize: "20px", flexShrink: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === "organization" ? null : "organization");
                      setOrgSearch(form.organization);
                    }}
                  />
                </div>

                {openDropdown === "organization" && (
                  <div className="dropdown-menu organization-menu">
                    {organizations
                      .filter((org) =>
                        org.toLowerCase().includes(orgSearch.toLowerCase())
                      )
                      .map((organization) => (
                        <button
                          key={organization}
                          type="button"
                          className={
                            form.organization === organization
                              ? "selected-option"
                              : ""
                          }
                          onClick={() => {
                            updateField("organization", organization);
                            setOrgSearch(organization);
                            setOpenDropdown(null);
                          }}
                        >
                          {organization}
                        </button>
                      ))}

                    {organizations.filter((org) =>
                      org.toLowerCase().includes(orgSearch.toLowerCase())
                    ).length === 0}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="register-submit"
                onClick={handleNext}
              >
                Tiếp theo
              </button>

              <p className="register-login-text">
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
              <RegisterStepIndicator activeStep={1} setStep={setStep} validateStepOne={validateStepOne} checkStepOneValid={checkStepOneValid} />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="register-card register-card-password">
            <div className="register-card-top" />

            <div className="register-card-body password-card-body">
              <img src={logo} alt="ETECHS" className="register-card-logo" />

              <div className="password-field">
                <label>Mật khẩu</label>

                <div
                  className={`password-input ${errors.password ? "input-error" : ""
                    }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="Nhập mật khẩu"
                  />

                <span 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    {showPassword ? (
                      <FiEyeOff className="password-eye" />
                    ) : (
                      <FiEye className="password-eye" />
                    )}
                  </span>
                </div>

                <div className="password-rules">
                  <Rule checked={passwordRules.length}>
                    Mật khẩu phải có ít nhất 8 ký tự.
                  </Rule>
                  <Rule checked={passwordRules.upper}>
                    Mật khẩu phải có ít nhất 1 chữ cái in hoa.
                  </Rule>
                  <Rule checked={passwordRules.lower}>
                    Mật khẩu phải có ít nhất 1 chữ cái thường.
                  </Rule>
                  <Rule checked={passwordRules.numberOrSpecial}>
                    Mật khẩu phải có ít nhất 1 chữ số hoặc ký tự đặc biệt.
                  </Rule>
                </div>
              </div>

              <div className="password-field">
                <label>Xác nhận mật khẩu</label>

                <div
                  className={`password-input ${errors.confirmPassword ? "input-error" : ""
                    }`}
                >
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    placeholder="Nhập lại mật khẩu"
                  />

                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    {showConfirmPassword ? <FiEyeOff className="password-eye" /> : <FiEye className="password-eye" />}
                  </span>
                </div>

                {errors.confirmPassword && (
                  <p className="password-error">{errors.confirmPassword}</p>
                )}
              </div>



              <button
                type="button"
                className="register-submit password-submit"
                onClick={handleSubmit}
              >
                Tạo tài khoản
              </button>

              <p className="register-login-text">
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
              <RegisterStepIndicator activeStep={2} setStep={setStep} validateStepOne={validateStepOne} checkStepOneValid={checkStepOneValid} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ==========================================
// THÀNH PHẦN THANH TIẾN ĐỘ ĐĂNG KÝ 
// ==========================================
interface RegisterStepIndicatorProps {
  activeStep: RegisterStep;
  setStep: (step: RegisterStep) => void;
  validateStepOne: () => boolean;
  checkStepOneValid: () => boolean; 
}

function RegisterStepIndicator({ activeStep, setStep, validateStepOne, checkStepOneValid }: RegisterStepIndicatorProps) {
  const handleDotClick = (targetStep: RegisterStep) => {
    if (targetStep === 1) {
      setStep(1);
      return;
    }

    if (targetStep === 2 && validateStepOne()) {
      setStep(2);
    }
  };

  return (
    <div className="forgot-step-indicator" style={{ marginTop: "32px" }}>
      {[1, 2].map((s) => {
        const isClickable = s === 1 || (s === 2 && checkStepOneValid()); 
        
        return (
          <span
            key={s}
            className={`step-dot ${activeStep === s ? "active" : ""} ${isClickable ? "clickable" : ""}`}
            onClick={() => handleDotClick(s as RegisterStep)}
            style={{
              cursor: isClickable ? "pointer" : "not-allowed",
              opacity: isClickable || activeStep === s ? 1 : 0.4,
              transition: "all 0.2s ease",
            }}
          />
        );
      })}
    </div>
  );
}

function Rule({
  checked,
  children,
}: {
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <p className={checked ? "rule valid-rule" : "rule invalid-rule"}>
      {checked ? <FiCheckCircle /> : <FiXCircle />}
      <span>{children}</span>
    </p>
  );
}
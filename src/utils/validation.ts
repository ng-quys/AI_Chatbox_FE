import type { RegisterRequest } from "../types/auth.type";
import * as yup from "yup";
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type RegisterForm = {
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

export type PasswordRules = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  numberOrSpecial: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /d9}$/;
const fullNameRegex = /^[A-Za-zÀ-ỹ\s]+$/;

export const getPasswordRules = (password: string): PasswordRules => {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    numberOrSpecial: /[\d\W_]/.test(password),
  };
};

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc, không được để trống') 
    .email('Email phải đúng định dạng (Ví dụ: user@etechs.edu.vn)') 
    .min(5, 'Email phải có ít nhất 5 ký tự') 
    .max(50, 'Email không được vượt quá 50 ký tự'), 

  password: yup
    .string()
    .required('Mật khẩu không được để trống') 
    .min(6, 'Mật khẩu phải chứa từ 6 đến 20 ký tự') 
    .max(20, 'Mật khẩu không được vượt quá 20 ký tự'), 


  role: yup
    .string()
    .oneOf(['Teacher', 'Admin', 'Student'], 'Vai trò không hợp lệ') 
    .default('Teacher'),
    
  rememberMe: yup.boolean().default(false)
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;

export const validateRegister = (
  form: RegisterRequest
): FormErrors<RegisterRequest> => {
  const errors: FormErrors<RegisterRequest> = {};

  // Validate Họ và tên đệm gửi lên BE
  if (!form.lastName.trim()) {
    errors.lastName = "Họ và tên đệm không được để trống";
  } else if (!fullNameRegex.test(form.lastName)) {
    errors.lastName = "Họ và tên đệm chỉ được chứa chữ cái";
  }

  // Validate Tên gửi lên BE
  if (!form.firstName.trim()) {
    errors.firstName = "Tên không được để trống";
  } else if (!fullNameRegex.test(form.firstName)) {
    errors.firstName = "Tên chỉ được chứa chữ cái";
  }

  if (!form.email.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!form.password.trim()) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (form.password.length < 8 || form.password.length > 64) {
    errors.password = "Mật khẩu phải từ 8 đến 64 ký tự";
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!phoneRegex.test(form.phoneNumber)) {
    errors.phoneNumber = "Số điện thoại phải gồm đúng 9 chữ số";
  }

  if (form.organizationName && form.organizationName.trim().length > 100) {
    errors.organizationName = "Tên đơn vị quản lý tối đa 100 ký tự";
  }

  return errors;
};

export const validateRegisterStepOne = (
  form: RegisterForm
): FormErrors<RegisterForm> => {
  const errors: FormErrors<RegisterForm> = {};

  if (!form.lastName.trim()) {
    errors.lastName = "Họ và tên đệm không được để trống";
  } else if (!fullNameRegex.test(form.lastName)) {
    errors.lastName = "Họ và tên đệm chỉ được chứa chữ cái";
  }

  if (!form.firstName.trim()) {
    errors.firstName = "Tên không được để trống";
  } else if (!fullNameRegex.test(form.firstName)) {
    errors.firstName = "Tên chỉ được chứa chữ cái";
  }

  if (!form.email.trim()) {
    errors.email = "Email không được để trống";
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Email không đúng định dạng (vd: example@gmail.com)";
  }

  if (!form.phone.trim()) {
    errors.phone = "Số điện thoại không được để trống";
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0";
  }

  return errors;
};

export const validateRegisterStepTwo = (
  form: RegisterForm
): FormErrors<RegisterForm> => {
  const errors: FormErrors<RegisterForm> = {};
  const passwordRules = getPasswordRules(form.password);

  if (!form.password.trim()) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (
    !passwordRules.length ||
    !passwordRules.upper ||
    !passwordRules.lower ||
    !passwordRules.numberOrSpecial
  ) {
    errors.password = "Mật khẩu chưa đáp ứng đầy đủ yêu cầu";
  }

  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  }

  return errors;
};
  
export const forgotStepOneSchema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không đúng định dạng (Ví dụ: name@etechs.vn)")
    .max(50, "Email không được vượt quá 50 ký tự"),
}).required();

export const forgotStepTwoSchema = yup.object({
  otp: yup
    .string()
    .required("Vui lòng nhập đủ mã OTP")
    .matches(/^\d{6}$/, "Mã OTP phải gồm đúng 6 chữ số"),
}).required();

export const forgotStepThreeSchema = yup.object({
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ cái in hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ cái thường")
    .matches(/[\d\W_]/, "Mật khẩu phải có ít nhất 1 chữ số hoặc ký tự đặc biệt"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp"), 
}).required();
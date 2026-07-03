import type { LoginRequest, RegisterRequest } from "../types/auth.type";

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
const phoneRegex = /^\d{10}$/;
const fullNameRegex = /^[A-Za-zÀ-ỹ\s]+$/;

export const getPasswordRules = (password: string): PasswordRules => {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    numberOrSpecial: /[\d\W_]/.test(password),
  };
};

export const validateLogin = (
  form: LoginRequest
): FormErrors<LoginRequest> => {
  const errors: FormErrors<LoginRequest> = {};

  if (!form.email.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!form.password.trim()) {
    errors.password = "Vui lòng nhập mật khẩu";
  }

  return errors;
};

export const validateRegister = (
  form: RegisterRequest
): FormErrors<RegisterRequest> => {
  const errors: FormErrors<RegisterRequest> = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên";
  } else if (
    form.fullName.trim().length < 2 ||
    form.fullName.trim().length > 100
  ) {
    errors.fullName = "Họ và tên phải từ 2 đến 100 ký tự";
  } else if (!fullNameRegex.test(form.fullName)) {
    errors.fullName = "Họ và tên không được chứa số hoặc ký tự đặc biệt";
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
    errors.phoneNumber = "Số điện thoại phải gồm đúng 10 chữ số";
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
    errors.phone = "Số điện thoại phải có 10 chữ số";
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
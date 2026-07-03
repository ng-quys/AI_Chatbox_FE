import type { ApiError } from "../types/api.type";

export const mapApiErrorsToFormErrors = <T extends object>(
  apiErrors: ApiError[] | null
): Partial<Record<keyof T, string>> => {
  const formErrors: Partial<Record<keyof T, string>> = {};

  if (!apiErrors) return formErrors;

  apiErrors.forEach((error) => {
    if (error.field) {
      formErrors[error.field as keyof T] = error.message;
    }
  });

  return formErrors;
};
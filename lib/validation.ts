// lib/validations.ts

export interface PasswordCheck {
  isValid: boolean;
  message: string;
}

export function validatePassword(password: string): PasswordCheck {
  const minLength = 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<> ]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long.",
    };
  }
  if (!hasUppercase) {
    return { isValid: false, message: "Add at least one uppercase letter." };
  }
  if (!hasNumber) {
    return { isValid: false, message: "Add at least one number." };
  }
  // if (!hasSpecial) {
  //   return { isValid: false, message: "Add at least one special character." };
  // }

  return { isValid: true, message: "Password is strong!" };
}

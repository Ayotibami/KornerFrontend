export interface PasswordCheck {
  isValid: boolean;
  message: string;
}

// Validates a password against minimum security requirements before sending it to the server.
// Client-side validation gives instant feedback without a round-trip.
// The server also validates — this is just UX, not a security gate.
//
// Returns isValid: false with a human-readable message if any rule fails,
// or isValid: true with a success message if all rules pass.
export function validatePassword(password: string): PasswordCheck {
  const minLength = 8;
  const hasNumber = /\d/.test(password);
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
  // Special character check disabled — uncomment to enforce it.
  // if (!/[!@#$%^&*(),.?":{}|<> ]/.test(password)) {
  //   return { isValid: false, message: "Add at least one special character." };
  // }

  return { isValid: true, message: "Password is strong!" };
}

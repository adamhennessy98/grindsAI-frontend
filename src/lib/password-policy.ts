export function passwordRequirementError(password: string) {
  if (password.length < 12) return "Use at least 12 characters for your password.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Use a mix of upper and lower case letters and a number.";
  }
  return null;
}

export const PASSWORD_GUIDANCE = "Use 12+ characters, with upper and lower case letters and a number.";

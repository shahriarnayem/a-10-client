const messages = {
  "auth/email-already-in-use": "This email already has a marketplace account.",
  "auth/invalid-email": "Enter a valid marketplace account email.",
  "auth/weak-password": "Use a password with at least six characters.",
  "auth/popup-closed-by-user": "Google sign-in was closed before completion.",
  "auth/invalid-credential": "The email or password is incorrect.",
};
 
export function firebaseErrorMessage(error) {
  return messages[error.code] || error.message || "Authentication could not be completed.";
}

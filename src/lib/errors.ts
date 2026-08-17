const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/invalid-email": "That email address doesn't look valid.",
  "auth/user-disabled": "This account has been disabled. Contact your administrator.",
  "auth/user-not-found": "No account found with that email address.",
  "auth/wrong-password": "Incorrect email or password. Please try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/network-request-failed": "Network problem. Check your connection and try again.",
  "permission-denied": "You don't have permission to perform this action.",
  unavailable: "Unable to reach the server. Check your connection and try again.",
  "failed-precondition": "This action can't be completed right now. Please refresh and retry.",
};

export function humanizeError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);
    if (MESSAGES[code]) return MESSAGES[code]!;
    const short = code.split("/").pop() ?? code;
    if (MESSAGES[short]) return MESSAGES[short]!;
  }
  if (import.meta.env.DEV) console.error(error);
  return fallback;
}

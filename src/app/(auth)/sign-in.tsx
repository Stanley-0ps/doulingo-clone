import AuthScreen from "@/components/auth/AuthScreen";

/**
 * Sign In — same layout and visual style as Sign Up, with sign-in copy and no
 * password field (email + social auth only).
 */
export default function SignInScreen() {
  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Pick up right where you left off ✨"
      submitLabel="Sign In"
      showPasswordField={false}
      footerQuestion="Don't have an account?"
      footerLinkLabel="Sign up"
      footerHref="/sign-up"
    />
  );
}

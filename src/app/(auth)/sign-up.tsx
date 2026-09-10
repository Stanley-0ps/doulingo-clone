import AuthScreen from "@/components/auth/AuthScreen";

/**
 * Sign Up — replicates `prompt_material/03-auth-screen.png`.
 * Email + password fields plus the social providers.
 */
export default function SignUpScreen() {
  return (
    <AuthScreen
      title="Create your account"
      subtitle="Start your language journey today ✨"
      submitLabel="Sign Up"
      showPasswordField
      footerQuestion="Already have an account?"
      footerLinkLabel="Log in"
      footerHref="/sign-in"
    />
  );
}

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main>
      <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/app" />
    </main>
  );
}

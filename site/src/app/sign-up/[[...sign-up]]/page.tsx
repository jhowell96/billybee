import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main>
      <SignUp path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/app" />
    </main>
  );
}

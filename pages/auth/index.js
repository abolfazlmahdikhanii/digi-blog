import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      fill="#4285F4"
      d="M43.611 20.083H24v8.832h11.303c-1.649 4.657-6.08 8.02-11.303 8.02-8.336 0-15.09-6.754-15.09-15.09s6.754-15.09 15.09-15.09c4.64 0 8.707 2.176 11.45 5.568l7.071-7.071C38.239 4.686 31.623 1.917 24 1.917 10.732 1.917 0 12.649 0 25.917S10.732 50 24 50c11.427 0 20.78-7.925 23.456-18.616H24v-11.301z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.043 16.32c1.23 0 2.228-.68 3.14-1.92h.02c.078.02.195.04.313.06.117.02.254.02.39.02.508 0 .938-.117 1.445-.293.156-.06.293-.117.43-.195a4.405 4.405 0 0 0-1.68-2.93c-.664-.47-1.328-.703-2.11-.703-.312 0-.664.117-1.015.293-.37.176-.703.41-1.016.664-.176-.02-.352-.06-.527-.117-.176-.06-.333-.117-.47-.195-1.21-1.406-2.52-2.11-3.92-2.11-1.425 0-2.618.645-3.69 1.933-1.386 1.64-2.187 3.59-2.187 5.76 0 2.24.78 4.15 2.24 5.66 1.092 1.13 2.38 1.7 3.77 1.7.585 0 1.152-.156 1.7-.47.527-.293.957-.684 1.348-1.152.097-.137.175-.274.234-.41.06-.157.08-.294.08-.43 0-.176-.04-.333-.12-.47-.08-.137-.175-.254-.312-.352-.117-.08-.254-.117-.41-.117-.215 0-.41.08-.587.234-.175.156-.253.352-.253.586 0 .215.08.39.234.527.156.137.332.215.527.234.43 0 .82-.176 1.172-.527.35-.352.528-.782.528-1.29 0-.117-.02-.234-.06-.35a.866.866 0 0 0-.156-.273c-.08-.098-.176-.176-.293-.235zm-2.675-14.34c.957-.02 1.836.312 2.596.937.586.488.996 1.133 1.25 1.855.156-.02.313-.02.47-.02.136 0 .273 0 .41.02.254.605.625 1.113 1.074 1.547.45.43.918.78 1.407.996.117.06.234.117.35.176.118.06.216.117.294.176-.02.02-.02.02 0 0-.02.03-.04.05-.06.07-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05l-.06.06c-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06l-.06.06c-.02.02-.04.04-.06.06-.02.02-.02.03-.04.05l-.06.06a.04.04 0 0 1-.06.06c-1.016-1.113-1.62-2.422-1.797-3.887a.48.48 0 0 1-.02-.117V9.7c0-.137.02-.274.06-.41.04-.137.08-.254.14-.37.76-.977 1.25-2.09 1.406-3.262z" />
  </svg>
);

export default function LoginPage() {
  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleContinue = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.elements.namedItem("email");
    if (emailInput.value) {
      setEmail(emailInput.value);
      setStep("OTP");
    }
  };

  const handleGoBack = () => {
    setStep("EMAIL");
    setEmail("");
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      {step === "EMAIL" && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              Log in or sign up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContinue} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            <div className="grid gap-4">
              <Button variant="outline" className="w-full justify-center">
                <GoogleIcon />
                Sign in with Google
              </Button>
              <Button variant="outline" className="w-full justify-center">
                <FacebookIcon />
                Sign in with Facebook
              </Button>
              <Button variant="outline" className="w-full justify-center">
                <AppleIcon />
                Sign in with Apple
              </Button>
            </div>
            <p className="mt-4 px-8 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </>
      )}
      {step === "OTP" && (
        <>
          <CardHeader>
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="absolute top-4 left-4 p-0 h-auto justify-start text-muted-foreground hover:text-foreground"
            >
              &larr; Back
            </Button>
            <CardTitle className="text-2xl font-headline text-center pt-8">
              Check your inbox
            </CardTitle>
            <CardDescription className="text-center">
              We've sent a 4-digit code to {email}. The code expires shortly, so
              please enter it soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="">
                <Inp
                  maxLength={4}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </Inp>
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <Button variant="link" className="p-0 h-auto">
                Resend code
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

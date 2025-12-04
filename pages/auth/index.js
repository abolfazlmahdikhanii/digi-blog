import { useEffect, useState } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authSchema } from "@/validations/auth";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { formatTime } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";



export default function LoginPage() {
  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const { refetch ,user} = useAuth();
  const [otp, setOtp] = useState("");
  const router = useRouter();
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timerInterval);
    };
  }, [timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();

    try {
      setIsOtpLoading(true)
      const validEmail = authSchema.parse({ email });
      if (validEmail.email) {
        fetch("/api/auth/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })
          .then((res) => {
            if (res.status === 200) {
              toast.success("Email Sent Succesfully:)");
              setStep("OTP");
              setTimer(120);
              setIsOtpLoading(false)
            }
            else {
              throw Error
            }
          })
          .catch((err) => {
            console.log(err);
            setIsOtpLoading(false)
            toast.error(err);
          });
      }
    } catch (error) {
      toast.error("Email Is Not Valid !");
    }
  };

  const handleGoBack = () => {
    setStep("EMAIL");
    setEmail("");
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      toast.error("Fill The Otp");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Failed Verify Otp!");
      }
      
      refetch();
      console.log(user);
      if (data.isProfileComplete) {
        router.replace("/");
      } else {
        router.replace("/get-started");
      }
    
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Card  className="mx-auto max-w-sm min-w-sm mt-[50%]">
      {step === "EMAIL" && (
        <>
          <CardHeader className={"w-full"}>
            <CardTitle className="text-xl font-headline text-center mb-3 ">
              Log in or sign up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" onClick={handleSendOtp} disabled={isOtpLoading}>
                Continue {isOtpLoading&&<Spinner/>}
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
            <div className="grid gap-7">
              <div className="flex items-center justify-center">
                <InputOTP
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
                </InputOTP>
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={otp.length < 4 || isLoading}
              >
                Continue {isLoading && <Spinner />}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {timer <= 1 ? (
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={handleSendOtp}
                  disabled={isOtpLoading}
                >
                  Resend code
                </Button>
              ) : (
                <span>{formatTime(timer)}</span>
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

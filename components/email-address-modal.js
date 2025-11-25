"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import userSchema from "@/validations/user";
import z from "zod";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { authSchema } from "@/validations/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { formatTime } from "@/lib/utils";

export function EmailAddressModal({ onClose }) {
  const { user, refetch } = useAuth();
  const [email, setEmail] = useState(user.email || "");
  const [step, setStep] = useState("EMAIL");
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
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
  const handleContinue = async (e) => {
    e.preventDefault();

    try {
      const validEmail = authSchema.parse({ email });
      if (!validEmail.email) return;
      const res = await fetch("/api/user/email/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 200) {
        toast.success("Email Sent Succesfully:)");
        setStep("OTP");
        setTimer(120);
      }
    } catch (error) {
      
      toast.error("Email Is Not Valid !");
    }
  };
  const updateEmail = async (e) => {
    e.preventDefault();
    try {
      if (!otp) {
        toast.error(err);
        return;
      }

      const res = await fetch("/api/user/email/verify-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      if (res.status === 200) {
        toast.success("Update Email Successfully");
        onClose();
        refetch();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoBack = () => {
    setStep("EMAIL");
    setNewEmail("");
    setOtp("");
  };

  return (
    <>
      {step === "EMAIL" && (
        <>
          <DialogHeader>
            <DialogTitle>Email address</DialogTitle>
            <DialogDescription>
              You can sign in to DigiBlog with this email address.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContinue}>
            <div className="py-4 space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <DialogFooter className={"mt-4"}>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600/80 hover:bg-green-600/90 text-white rounded-full"
              >
                Continue
              </Button>
            </DialogFooter>
          </form>
        </>
      )}

      {step === "OTP" && (
        <>
          <DialogHeader>
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="absolute top-4 left-4 p-0 h-auto justify-start text-muted-foreground hover:text-foreground"
            >
              &larr; Back
            </Button>
            <DialogTitle className="text-2xl font-headline text-center pt-8">
              Check your inbox
            </DialogTitle>
            <DialogDescription className="text-center">
              We've sent a 6-digit code to {newEmail}. The code expires shortly,
              so please enter it soon.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <form className="grid gap-4">
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
              <div className="mt-4 text-center text-sm">
                {timer <= 1 ? (
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={handleContinue}
                  >
                    Resend code
                  </Button>
                ) : (
                  <span>{formatTime(timer)}</span>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                  onClick={updateEmail}
                >
                  Verify and Save
                </Button>
              </DialogFooter>
            </form>
          </div>
        </>
      )}
    </>
  );
}

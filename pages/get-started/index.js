"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import usersModel from "@/models/users";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import connectToDB from "@/configs/db";
import { toast } from "sonner";
import Image from "next/image";

const DigiBlogLogo = () => (
   <Image
        width={150}
        height={140}
        src={"/images/logo.png"}
        className="object-cover w-[140px] h-[180px]"
        alt="logo"
      />
);

export default function FullNamePage({ userInfo }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(userInfo?.name || user?.name || "");
  const router = useRouter();

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Fill The Field!");
      return;
    }
    try {
      const res = await fetch(`/api/auth/${user ? user._id : userInfo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: fullName.trim() }),
      });
      if (!res.ok) throw new Error("Failed Update Name!");

      router.replace("/get-started/topics");
    } catch (error) {
      toast.error("Failed Update!");
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <header className="p-4 flex justify-center py-4">
        <DigiBlogLogo />
      </header>
      <main className="flex mt-24 items-center justify-center">
        <div className="text-center max-w-lg w-full">
          <h1 className="text-4xl  mb-8">Welcome to Medium!</h1>
          <p className="text-muted-foreground mb-12">
            We need a little more information to finish creating your account.
          </p>

          <div className="text-left w-full mx-auto max-w-sm space-y-8">
            <div className="flex flex-col w-full max-w-sm items-center gap-2">
              <Label htmlFor="name" className={"text-xs text-neutral-400"}>
                Your full name
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="full name ..."
                className={"min-h-12 h-12 "}
                value={fullName}
                onChange={(e) => setFullName(e.target.value.trim())}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground mt-1">
              Your email is{" "}
              <span className="font-semibold text-foreground">
                {user ? user?.email : userInfo?.email}
              </span>
            </p>
          </div>

          <Button
            onClick={handleUpdateName}
            className="w-full max-w-xs rounded-full mt-12 min-h-10.5  disabled:opacity-50"
            disabled={!fullName.trim()}
          >
            Create account
          </Button>
        </div>
      </main>
    </div>
  );
}
export async function getServerSideProps(context) {
  const { token, refreshToken } = context.req.cookies;
  await connectToDB();

  if (!token && !refreshToken) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const validToken = verifyToken(token);
  const validRefreshToken = verifyRefreshToken(refreshToken);
  if (!validToken && !validRefreshToken) {
    return { redirect: { destination: "/welcome", permanent: false } };
  }

  const user = await usersModel.findOne({ email: validToken.email || validRefreshToken.email });
  if (!user) {
    return { redirect: { destination: "/welcome", permanent: false } };
  }

  // If profile complete, go home
  if (user.isProfileComplete) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const hasCompletedName = user.name && user.name !== user.username;

  // If name already completed, go to next step (topics)
  if (hasCompletedName) {
    return { redirect: { destination: "/get-started/topics", permanent: false } };
  }

  // Stay here to collect name
  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
    },
  };
}

"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MailX, MoveLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const EmailSucess = (path: any) => {
  const [email, setEmail] = useState<any>();

  console.log(path);

  const openMailClient = () => {
    window.location.href = "mailto:";
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    setEmail(userEmail);
  }, []);

  return (
    <Card className="border-none bg-dark-200 rounded-lg  w-[496px]">
      <CardHeader>
        <CardTitle className="mb-1 flex justify-center">
          <Image
            src="/assets/gifs/email-success.gif"
            height={96}
            width={96}
            alt="email"
          />
        </CardTitle>
        <CardDescription className="text-gray-500">
          <div className="text-12-regular text-center mb-1">
            We sent a password reset link to
          </div>{" "}
          <div className="text-14-regular text-center">{email}</div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="shad-primary-btn w-full" onClick={openMailClient}>
          Open email app
        </Button>

        <p className="text-14-regular text-dark-600 text-center">
          Did not receive email?{" "}
          <Button variant="ghost" className="text-blue-400 p-1">
            Click to resend
          </Button>
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={path?.path} className="flex justify-center text-green-500">
          {" "}
          <MoveLeft className="text-14-regular mr-2" /> Back to login
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EmailSucess;

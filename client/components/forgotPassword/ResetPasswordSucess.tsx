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

interface ResetPasswordSuccessProps {
  handleLogin: () => Promise<void>;
  path: any;
}

const ResetPasswordSucess = ({
  handleLogin,
  path,
}: ResetPasswordSuccessProps) => {
  return (
    <Card className="border-none bg-dark-200 rounded-lg  w-[496px]">
      <CardHeader>
        <CardTitle className="mb-1 flex justify-center">
          <Image
            src="/assets/gifs/success.gif"
            height={96}
            width={96}
            alt="email"
          />
        </CardTitle>
        <CardDescription className="text-gray-500">
          <div className="text-16-semibold text-center mb-1">
            Your password has been successfully changed
          </div>{" "}
          <div className="text-14-regular text-center">
            Click below to login magically
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="shad-primary-btn w-full" onClick={handleLogin}>
          Continue
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={path} className="flex justify-center text-green-500">
          {" "}
          <MoveLeft className="text-14-regular mr-2" /> Back to login
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordSucess;

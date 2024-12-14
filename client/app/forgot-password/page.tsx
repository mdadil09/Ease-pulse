/* eslint-disable react/no-unescaped-entities */
"use client";

import EmailSucess from "@/components/forgotPassword/EmailSucess";
import ForgotPasswordRequest from "@/components/forgotPassword/ForgotPasswordRequest";
import { PasswordFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const userPath = "/?user=true";

  return (
    <div className="flex h-screen items-center justify-center">
      {!isEmailSent ? (
        <ForgotPasswordRequest
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsEmailSent={setIsEmailSent}
        />
      ) : (
        <EmailSucess path={userPath} />
      )}
    </div>
  );
};

export default ForgotPassword;

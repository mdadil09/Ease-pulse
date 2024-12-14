/* eslint-disable react/no-unescaped-entities */
"use client";

import ForgotPasswordRequest from "@/components/admin/forgotPassword/ForgotPasswordRequest";
import EmailSucess from "@/components/forgotPassword/EmailSucess";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const adminPath = "/?admin=true";

  return (
    <div className="flex h-screen items-center justify-center">
      {!isEmailSent ? (
        <ForgotPasswordRequest
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsEmailSent={setIsEmailSent}
        />
      ) : (
        <EmailSucess path={adminPath} />
      )}
    </div>
  );
};

export default ForgotPassword;

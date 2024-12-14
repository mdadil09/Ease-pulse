/* eslint-disable react/no-unescaped-entities */
"use client";

import { adminLogin, resetPasswordAdmin } from "@/api/api";
import CustomFormField from "@/components/CustomFormField";
import ResetPasswordSucess from "@/components/forgotPassword/ResetPasswordSucess";
import { FormFieldType } from "@/components/forms/PatientForm";
import SubmitButton from "@/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ForgotPasswordFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ResetPassword = ({}: {
  isLoading: boolean;
  setIsLoading: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("id");
  const adminPath = "/?admin=true";

  const form = useForm<z.infer<typeof ForgotPasswordFormValidation>>({
    resolver: zodResolver(ForgotPasswordFormValidation),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (
    values: z.infer<typeof ForgotPasswordFormValidation>
  ) => {
    setIsLoading(true);

    const { newPassword, confirmPassword } = values;

    try {
      const data = await resetPasswordAdmin(newPassword, userId, token);
      console.log(data);
      if (data) {
        setPassword(newPassword);
        setIsSuccess(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    if (!email) {
      console.log("Email is undefined");
      return;
    }

    try {
      const data = await adminLogin({ email, password });

      console.log(data);

      if (data) {
        const id = data?._id;
        router.push(`/admin?id=${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userEmail: any = localStorage.getItem("email");
    setEmail(userEmail);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      {!isSuccess ? (
        <Card className="border-none bg-dark-200 rounded-lg  w-[496px]">
          <CardHeader>
            <CardTitle className="mb-5">
              <Image
                src="/assets/icons/logo-full.svg"
                height={28}
                width={162}
                alt="logo"
                className="h-5 w-fit"
              />{" "}
            </CardTitle>
            <CardDescription className="flex flex-col text-gray-500">
              <span className="text-14-regular  mb-1">Set new password</span>{" "}
              <span className="text-12-regular">
                Your new password must be different from previously used
                password.
              </span>{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 flex-1"
              >
                <div>
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter your new password"
                    iconSrc=""
                    iconAlt="password"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                    iconSrc=""
                    iconAlt="password"
                  />
                </div>
                <SubmitButton isLoading={isLoading}>
                  Reset password
                </SubmitButton>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/?admin=true"
              className="flex justify-center text-green-500"
            >
              {" "}
              <MoveLeft className="text-14-regular mr-2" /> Back to login
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <ResetPasswordSucess handleLogin={handleLogin} path={adminPath} />
      )}
    </div>
  );
};

export default ResetPassword;

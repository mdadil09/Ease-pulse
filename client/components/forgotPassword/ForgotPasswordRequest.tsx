/* eslint-disable react/no-unescaped-entities */
"use client";

import { forgotPasswordRequest } from "@/api/api";
import CustomFormField from "@/components/CustomFormField";
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
import { EmailFormValidation, PasswordFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";

const ForgotPasswordRequest = ({
  isLoading,
  setIsLoading,
  setIsEmailSent,
}: {
  isLoading: boolean;
  setIsLoading: (open: boolean) => void;
  setIsEmailSent: (open: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof EmailFormValidation>>({
    resolver: zodResolver(EmailFormValidation),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof EmailFormValidation>) => {
    setIsLoading(true);

    const { email } = values;

    try {
      const data = await forgotPasswordRequest(email);

      if (data) {
        setIsEmailSent(true);

        localStorage.setItem("email", email);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
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
        <CardDescription className="text-dark-700 text-18-semibold">
          Find Your Account
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
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Please enter your email address to search for your account"
                placeholder="Enter your email address"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />
            </div>
            <SubmitButton isLoading={isLoading}>
              Confirm your email
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/?user=true" className="flex justify-center text-green-500">
          {" "}
          <MoveLeft className="text-14-regular mr-2" /> Go back
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordRequest;

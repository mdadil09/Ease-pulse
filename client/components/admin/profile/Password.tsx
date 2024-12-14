/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordFormValidation } from "@/lib/validation";
import { PatientFormDefaultValues } from "@/constants";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import { updateAdminPassword, updatePassword } from "@/api/api";
import { useRouter } from "next/navigation";
import PassworldConfDialog from "@/components/user/profile/PassworldConfDialog";

const Password = ({ admin, setIsLoading }: any) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof PasswordFormValidation>>({
    resolver: zodResolver(PasswordFormValidation),
    defaultValues: {
      email: admin?.email,
    },
  });

  console.log(admin?.email);

  const onSubmit = async (values: z.infer<typeof PasswordFormValidation>) => {
    setIsLoading(true);

    const { email, newPassword } = values;

    console.log(email);

    try {
      const updatedPasswordData = await updateAdminPassword({
        email,
        newPassword,
      });

      if (updatedPasswordData) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          localStorage.clear();
          router.push("/");
        }, 5000);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password here. After saving, you'll be logged out.
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
                label="Email"
                placeholder="Enter your email address"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="Current Password"
                placeholder="Enter your current password"
                iconSrc=""
                iconAlt="password"
              />

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
            <Button
              type="submit"
              variant="outline"
              className="shad-primary-btn"
            >
              Save password
            </Button>
          </form>
        </Form>
        {open && <PassworldConfDialog open={open} setOpen={setOpen} />}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Password;

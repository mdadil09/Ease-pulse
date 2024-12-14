"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { AdminFormValidation } from "@/lib/validation";
import { adminLogin } from "@/api/api";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";

const AdminLoginModal = () => {
  const router = useRouter();
  const path = usePathname();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof AdminFormValidation>>({
    resolver: zodResolver(AdminFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (path) {
      setOpen(true);
    }
    router.prefetch("/admin");
  }, []);

  async function onSubmit({
    email,
    password,
  }: z.infer<typeof AdminFormValidation>) {
    setIsLoading(true);

    try {
      const admin: any = await adminLogin({ email, password });

      if (admin) {
        const hospitalName = admin?.hospital;
        const hospitalId = admin?._id;
        router.push(`/admin?id=${hospitalId}&hospital=${hospitalName}`);
        setOpen(false);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Login
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please login;
          </AlertDialogDescription>
        </AlertDialogHeader>
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
                label="Password"
                placeholder="Enter your password"
                iconSrc=""
                iconAlt="password"
              />
            </div>
            <AlertDialogFooter>
              <SubmitButton isLoading={isLoading}>Login</SubmitButton>
            </AlertDialogFooter>
          </form>
        </Form>
        <Link
          href="/admin/forgot-password"
          className="text-14-regular text-green-500 text-center mt-0"
        >
          forgot password?
        </Link>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminLoginModal;

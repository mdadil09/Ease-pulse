"use client";

import AdminLoginModal from "@/components/admin/modal/AdminLoginModal";
import PatientForm from "@/components/forms/PatientForm";
import { OtpModal } from "@/components/ui/OtpModal";
import UserLoginModal from "@/components/user/UserLoginModal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";
  const isUser = searchParams.user === "true";
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <AdminLoginModal />}
      {isUser && <UserLoginModal />}

      <OtpModal open={open} setOpen={setOpen} />
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="h-4 mb-12 mt-4 w-fit"
          />

          <PatientForm open={open} setOpen={setOpen} />

          <div className="text-14-regular mt-5 mb-5 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 EasePulse
            </p>
            <div>
              <Link
                href="/?admin=true"
                className="text-green-500 text-14-regular"
              >
                Login as admin
              </Link>{" "}
              {" | "}
              <Link
                href="/?user=true"
                className="text-green-500 text-14-regular"
              >
                Login as user
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}

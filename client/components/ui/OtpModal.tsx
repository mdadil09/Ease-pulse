"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { MoveRight } from "lucide-react";
import axios from "axios";
import { verifyOtp } from "@/api/api";

export const OtpModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const path = usePathname();
  // const [phone, setPhone] = useState<any>();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  // useEffect(() => {
  //   const parsedNumber: any = localStorage.getItem("phone");
  //   setPhone(parsedNumber);
  // }, []);

  const validateOtp = async () => {
    try {
      const newUser = await verifyOtp(phone, otp);

      //@ts-ignore
      const userId = newUser?._id;

      if (newUser) {
        router.push(`/patients/${userId}/register`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpen && setOpen(false);
    // router.push("/");
  };

  console.log(phone);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Verfiy your phone number
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
            {phone
              ? `An otp is sent to ${phone}, please enter your otp.`
              : "Loading..."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            className="shad-primary-btn w-full flex items-center"
            onClick={validateOtp}
          >
            Continue <MoveRight className="ml-2" size={18} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

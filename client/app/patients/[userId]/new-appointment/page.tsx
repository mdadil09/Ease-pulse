"use client";

import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function NewAppointment() {
  const params = useParams();
  const { userId }: any = params;
  console.log("userId: ", userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-5 mt-4 w-fit"
          />
          <AppointmentForm type="create" userId={userId} patientId={userId} />
          <p className="copyright mt-10 py-2">© 2024 EasePulse</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}

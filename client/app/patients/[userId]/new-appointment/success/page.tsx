"use client";

import { getAppointmentDetails, getDoctors, getPayment } from "@/api/api";
import { User } from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formatDate } from "react-datepicker/dist/date_utils";

const Success = () => {
  const searchParams = useSearchParams();
  let appointmentId = searchParams.get("appointmentId");
  let sessionId = searchParams.get("session_id");
  const params = useParams();
  const { userId } = params;
  const [user, setUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState([]);

  const [appointment, setAppointment] = useState<any>();
  const [paymentDetail, setPaymentDetail] = useState<any>();

  const getAppointment = async () => {
    try {
      const data = await getAppointmentDetails(appointmentId);
      setAppointment(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorData = async () => {
    try {
      const doc = await getDoctors();

      setDoctors(doc);
    } catch (error) {
      console.log(error);
    }
  };

  const getPaymentDetail = async () => {
    try {
      const payment = await getPayment(sessionId);
      if (payment) {
        setPaymentDetail(payment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("sessionId: ", sessionId);

  useEffect(() => {
    const data: any = localStorage.getItem("user");
    const parsedUser = JSON.parse(data);
    setUser(data);
    getDoctorData();
    getAppointment();
    if (sessionId != null) {
      getPaymentDetail();
    }
  }, [sessionId]);

  const doctor: any = doctors.find(
    (doc: any) => doc.name === appointment?.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-5 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We'll be in touch shortly to confirm</p>
        </section>
        {sessionId && (
          <section className="request-details">
            <p>Payment details</p>
            <div className="flex items-center gap-3">
              <p>Status:</p>
              <p className="text-green-500">
                {paymentDetail?.session.payment_status}
              </p>
            </div>
            <div className="flex gap-2">
              <p>Transaction id:</p>
              <p>{paymentDetail?.session.payment_intent}</p>
            </div>
          </section>
        )}
        <section className="request-details">
          <p>Requested appointment details</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6 rounded-full"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>{formatDateTime(appointment?.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <Link href={`/user?id=${userId}`} className="text-green-500 flex">
          <MoveLeft className="text-16-regular text-green-500 mr-4" /> Go to
          client dashboard
        </Link>
        <p className="copyright py-6">© 2024 EasePulse</p>
      </div>
    </div>
  );
};

export default Success;

"use client";

import {
  editAppointmentStatus,
  getAppointmentDetails,
  getDoctors,
  getPayment,
  makePayment,
} from "@/api/api";
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

const Cancel = () => {
  const searchParams = useSearchParams();
  let appointmentId = searchParams.get("appointmentId");
  let sessionId = searchParams.get("session_id");

  const params = useParams();
  const { userId } = params;

  const [user, setUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState([]);
  const status = "";

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

  useEffect(() => {
    const data: any = localStorage.getItem("user");
    const parsedUser = JSON.parse(data);
    setUser(data);
    getDoctorData();
    getAppointment();
    getPaymentDetail();
  }, []);

  const doctor: any = doctors.find(
    (doc: any) => doc.name === appointment?.primaryPhysician
  );

  const retryPayment = async () => {
    const payment = await makePayment(doctor?.price, appointmentId, userId);
  };

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
            src="/assets/images/cancel.png"
            height={80}
            width={80}
            alt="cancel"
            className="mb-4"
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Payment Failed,
            <span className="text-green-500">
              but Your Appointment is Confirmed!
            </span>{" "}
          </h2>
          <p>We'll be in touch shortly to confirm</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
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

        <div className="flex flex-col items-center">
          <p className="mb-2">
            If your payment has been deducted, please wait while we update your
            payment status.{" "}
          </p>
          <div>
            <p>If your payment has not been deducted, you can:</p>
            <div className="flex flex-row justify-center items-center mt-2">
              <Button className="shad-primary-btn mr-2" onClick={retryPayment}>
                Retry Payment
              </Button>
              <Button
                className="shad-primary-btn"
                onClick={() => editAppointmentStatus(appointmentId, status)}
              >
                Pay at Clinic
              </Button>
            </div>
          </div>
        </div>

        <Link href={`/user?id=${userId}`} className="text-green-500 flex">
          <MoveLeft className="text-16-regular text-green-500 mr-4" /> Go to
          client dashboard
        </Link>
        <p className="copyright py-6">© 2024 EasePulse</p>
      </div>
    </div>
  );
};

export default Cancel;

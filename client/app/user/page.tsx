"use client";

import {
  deleteAppointment,
  getAppointmentDetailByUserId,
  getDoctors,
  makePayment,
} from "@/api/api";
import { columns } from "@/components/table/userColumns";
import { DataTable } from "@/components/table/DataTable";
import StatCard from "@/components/ui/StatCard";
import { PowerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { json } from "stream/consumers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileMenu from "@/components/ui/ProfileMenu";

const User = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let id: any = searchParams.get("id");
  const [appointments, setAppointments] = useState<any>();
  const [doctors, setDoctors] = useState<any>();
  const [user, setUser] = useState<any>();
  const [tableData, setTableData] = useState<any>();

  const getAppointments = async () => {
    try {
      const appointmentsData = await getAppointmentDetailByUserId(id);
      setAppointments(appointmentsData);
    } catch (error) {
      console.log(error);
    }
  };

  const counts = appointments?.reduce(
    (acc: any, appointment: any) => {
      if (appointment.status === "scheduled") {
        acc.scheduledCount += 1;
      } else if (appointment.status === "pending") {
        acc.pendingCount += 1;
      } else if (appointment.status === "cancelled") {
        acc.cancelledCount += 1;
      }

      return acc;
    },
    { scheduledCount: 0, pendingCount: 0, cancelledCount: 0 }
  );

  console.log("counts: ", counts);

  const getDoctorsData = async () => {
    try {
      const doctors = await getDoctors();

      setDoctors(doctors);
    } catch (error) {
      console.log(error);
    }
  };

  // const mergedData = appointments?.map((appointment: any) => {
  //   const doctor = doctors?.find(
  //     (doc: any) => doc.name === appointment.primaryPhysician
  //   );
  //   return {
  //     ...appointment,
  //     doctor,
  //   };
  // });

  const handleDelteAppointment = async (appointmentId: any) => {
    try {
      const delAppointment = await deleteAppointment(appointmentId);

      if (delAppointment) {
        setTableData(
          tableData.filter((item: any) => item._id != appointmentId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  const doctor: any = doctors.find(
  //    (doc: any) => doc.name === appointment?.primaryPhysician
  //  );

  const handleLogOut = () => {
    router.push("/");
    localStorage.clear();
  };

  // const retryPayment = async () => {
  //   const payment = await makePayment(doctor?.price, appointmentId, userId);
  // };

  useEffect(() => {
    const userInfo: any = localStorage.getItem("user");
    const parsedUser: any = JSON.parse(userInfo);
    setUser(parsedUser);
    getAppointments();
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (appointments && doctors) {
      const updatedTableData = appointments.map((appointment: any) => {
        const doctor = doctors.find(
          (doc: any) => doc.name === appointment.primaryPhysician
        );
        return {
          ...appointment,
          doctor,
        };
      });
      setTableData(updatedTableData);
    }
  }, [appointments, doctors]);

  console.log("user: ", user);

  console.log("appointments: ", appointments);
  console.log(tableData);

  let userBadge = user?.user.name.slice(0, 2);

  return (
    <div className="mx-auto flex max-w-8xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={28}
            width={162}
            alt="logo"
            className="h-5 w-fit"
          />
        </Link>
        <div className="flex align-middle">
          <ProfileMenu
            id={id}
            userBadge={userBadge}
            handleLogOut={handleLogOut}
            user={user?.user}
          />
        </div>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome {user?.name} 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={counts?.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={counts?.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={counts?.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable
          columns={columns(handleDelteAppointment)}
          data={tableData || []}
        />
      </main>
    </div>
  );
};

export default User;

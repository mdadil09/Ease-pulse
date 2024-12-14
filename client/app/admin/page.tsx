"use client";

import { getAllAppointments, getDoctors } from "@/api/api";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import ProfileMenu from "@/components/ui/ProfileMenu";
import ProfileMenuAdmin from "@/components/ui/ProfileMenuAdmin";
import StatCard from "@/components/ui/StatCard";
import { PowerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Admin = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let id = searchParams.get("id");
  let hospitalName = searchParams.get("hospital");
  const [appointments, setAppointments] = useState<any>();
  const [doctors, setDoctors] = useState<any>();
  const [user, setUser] = useState<any>();

  const getAppointments = async () => {
    try {
      const appointmentsData = await getAllAppointments(id);
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

  const mergedData = appointments?.map((appointment: any) => {
    const doctor = doctors?.find(
      (doc: any) => doc.name === appointment.primaryPhysician
    );
    return {
      ...appointment,
      doctor,
    };
  });

  const handleLogOut = () => {
    router.push("/");
    localStorage.clear();
  };

  useEffect(() => {
    const userInfo: any = localStorage.getItem("admin");
    const parsedUser: any = JSON.parse(userInfo);
    setUser(parsedUser);
    getAppointments();
    getDoctorsData();
  }, []);

  console.log("appointments: ", appointments);
  console.log(mergedData);
  console.log("user:", user);

  let userBadge = hospitalName?.slice(0, 2);

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
        <ProfileMenuAdmin
          user={user}
          id={id}
          userBadge={userBadge!}
          handleLogOut={handleLogOut}
        />
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome {hospitalName} 👋</h1>
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

        <DataTable columns={columns} data={mergedData || []} />
      </main>
    </div>
  );
};

export default Admin;

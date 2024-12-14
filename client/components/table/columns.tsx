"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import AppointmentModal from "../ui/AppointmentModal";
import PaymentStatusBadge from "../ui/PaymentStatusBadge";

export const columns: ColumnDef<any>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.patients[0].name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: () => "Doctor",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Image
            src={row.original?.doctor?.image}
            alt={row.original?.doctor?.name}
            height={100}
            width={100}
            className="size-8 rounded-full"
          />
          <p className="whitespace-nowrap">
            Dr. {row.original.primaryPhysician}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <PaymentStatusBadge status={row.original.paymentStatus} />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      console.log("userId: ", data.createdBy);

      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={data.patients[0]._id}
            userId={data.createdBy}
            appointment={data}
            title="Schedule Appointment"
            description="Please confirm the following details to scheduled"
          />

          <AppointmentModal
            type="cancel"
            patientId={data.patients[0]._id}
            userId={data.createdBy}
            appointment={data}
            title="Cancel Appointment"
            description="Are you sure you want to cancel this appointment?"
          />
        </div>
      );
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { FilePenLine, MoreHorizontal, RecycleIcon, Trash2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import AppointmentModal from "../ui/AppointmentModal";
import PaymentStatusBadge from "../ui/PaymentStatusBadge";
import { deleteAppointment } from "@/api/api";

export const columns = (
  handleDelteAppointment: (params: any) => void
): ColumnDef<any>[] => [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
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
      return (
        <div className="flex gap-1 items-center">
          {data.status === "scheduled" || data.status === "cancelled" ? (
            <Button
              disabled={
                data.status === "scheduled" || data.status === "cancelled"
              }
            >
              {" "}
              <FilePenLine className="text-14-regular text-blue-400 mr-4 cursor-pointer" />
            </Button>
          ) : (
            <AppointmentModal
              type="edit"
              patientId={""}
              userId={data.createdBy}
              appointment={data}
              title="Edit Appointment"
              description="Please edit your appointment details"
            />
          )}
          <Trash2
            className="text-14-regular text-red-700 cursor-pointer"
            onClick={() => handleDelteAppointment(data._id)}
          />
          {/* {data.paymentStatus === "unpaid" && (
            <Button className="shad-primary-btn h-7 rounded-md px-2 py-2 ml-2 text-12-regular">
              Retry Payment
            </Button>
          )} */}
        </div>
      );
    },
  },
];

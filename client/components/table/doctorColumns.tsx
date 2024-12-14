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
  handleDeleteDoctor: (params: any) => void,
  handleEditDoctor: (params: any) => void
): ColumnDef<any>[] => [
  {
    header: "Sr.",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.original.image}
          alt={row.original.name}
          height={100}
          width={100}
          className="size-8 rounded-full"
        />
        <p className="whitespace-nowrap">Dr. {row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {row.original.specialization}
      </p>
    ),
  },
  {
    accessorKey: "price",
    header: () => "Price",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap">{row.original.price}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <FilePenLine
            className="text-14-regular text-blue-400 mr-4 cursor-pointer"
            onClick={() => handleEditDoctor(data._id)}
          />
          <Trash2
            className="text-14-regular text-red-700 cursor-pointer"
            onClick={() => handleDeleteDoctor(data._id)}
          />
        </div>
      );
    },
  },
];

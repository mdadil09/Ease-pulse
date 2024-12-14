import { PaymentStatusIcon, StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "paid",
        "bg-red-600": status === "unpaid",
        "bg-yellow-700": status === "",
      })}
    >
      <Image
        src={PaymentStatusIcon[status]}
        alt={status}
        height={24}
        width={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "paid",
          "text-red-500": status === "unpaid",
          "text-yellow-400": status === "",
        })}
      >
        {status != "" ? status : "offline"}
      </p>
    </div>
  );
};

export default PaymentStatusBadge;

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import AppointmentForm, { Appointment } from "../forms/AppointmentForm";
import { FilePenLine } from "lucide-react";

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
  title,
  description,
}: {
  type: "schedule" | "cancel" | "edit";
  patientId: string;
  userId: string;
  appointment?: Appointment;
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type === "edit" ? (
            <FilePenLine className="text-14-regular text-blue-400 mr-4 cursor-pointer" />
          ) : (
            type
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} an appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;

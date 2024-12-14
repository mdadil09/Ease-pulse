"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useEffect, useState } from "react";
import { CreateAppointmentSchema, UserFormValidation } from "@/lib/validation";
import {
  cancelAppointment,
  getAdminData,
  getAllAdminData,
  getDoctors,
  getDoctorsByHospital,
  getPayment,
  getStarted,
  makePayment,
  newAppointment,
  scheduleAppointment,
} from "@/api/api";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { FormFieldType, User } from "./PatientForm";
import { Doctors, paymentOptions } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export interface Appointment {
  primaryPhysician: string;
  schedule: Date;
  reason: string;
  note: string;
  status: string;
  cancellationReason: string;
  paymentMode: string;
  userId: string;
  hospital: string;
}

export interface ScheduleAppointmentInput {
  primaryPhysician: string;
  schedule: Date;
  reason: string;
  status: string;
  note: string;
  appointmentId: string;
}

export interface cancelAppointmentInput {
  cancellationReason: string;
  appointmentId: string;
}

const AppointmentForm = ({
  type,
  userId,
  patientId,
  appointment,
  setOpen,
}: {
  type: "create" | "cancel" | "schedule" | "edit";
  userId: string;
  patientId: string;
  appointment?: any;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hospitalId = searchParams.get("id");
  const hospitalName = searchParams.get("hospital");

  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [paymentMode, setPaymentMode] = useState(
    appointment ? appointment.paymentMode : "offline"
  );
  const [hospitalData, setHospitalData] = useState<any>();

  console.log("paymentMode: ", paymentMode);

  // const [fee, setFee] = useState();

  const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment ? appointment.cancellationReason : "",
      paymentMode: appointment ? appointment.paymentMode : "offline",
      hospital: appointment ? appointment.hospital : "",
    },
  });

  const selectedDoctor = form.watch("primaryPhysician");
  const selectedHospital = form.watch("hospital");

  const getHospitalData = async () => {
    const data = await getAllAdminData();

    setHospitalData(data);
  };

  const hos: any = hospitalData?.find(
    (item: any) => item?.hospital === selectedHospital
  );

  const hosId: any = hos ? hos?._id : 0;

  const getDoctorData = async () => {
    try {
      const doc = await getDoctorsByHospital(hosId);

      setDoctors(doc);
      console.log("hhdhd", doctors);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(selectedDoctor);

  const doctor: any = doctors?.find(
    (item: any) => item?.name === selectedDoctor
  );
  const price: any = doctor ? doctor?.price : 0;

  useEffect(() => {
    if (hosId) {
      getDoctorData();
    }
    getHospitalData();
  }, [hosId]);

  async function onSubmit(values: z.infer<typeof CreateAppointmentSchema>) {
    setIsLoading(true);

    console.log(values);
    console.log(type);

    let status;

    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      const {
        primaryPhysician,
        schedule,
        reason,
        note,
        cancellationReason,
        paymentMode,
        hospital,
      } = values;

      if (type === "create" && userId) {
        if (paymentMode === "online") {
          const appointment = await newAppointment({
            hospital,
            primaryPhysician,
            schedule: new Date(schedule),
            reason,
            note: note || "",
            status: status as Status,
            cancellationReason: "",
            paymentMode: paymentMode,
            userId,
          });
          if (appointment) {
            const appointmentId = appointment.newAppointment._id;
            const payment = await makePayment(price, appointmentId, userId);
            console.log(payment);
            form.reset();
            // if (appointment && payment) {
            //   router.push(
            //     `/patients/${userId}/new-appointment/success?appointmentId=${appointmentId}`
            //   );
            // }
          }
        } else {
          console.log("error");
        }
        if (paymentMode === "offline") {
          const appointment = await newAppointment({
            hospital,
            primaryPhysician,
            schedule: new Date(schedule),
            reason,
            note: note || "",
            status: status as Status,
            cancellationReason: "",
            paymentMode: paymentMode,
            userId,
          });

          if (appointment) {
            form.reset();
            const appointmentId = appointment.newAppointment._id;

            router.push(
              `/patients/${userId}/new-appointment/success?appointmentId=${appointmentId}`
            );
          }
        }
      }

      if (type === "schedule" && userId) {
        const updateAppointment = await scheduleAppointment({
          primaryPhysician,
          schedule: new Date(schedule),
          reason,
          note: note || "",
          appointmentId: appointment?._id,
          status: status as Status,
        });

        if (updateAppointment) {
          setOpen && setOpen(false);
          form.reset();
          // router.refresh()
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }

        console.log("updateAppointment: ", updateAppointment);
      }

      if (type === "edit" && userId) {
        const updateAppointment = await scheduleAppointment({
          primaryPhysician,
          schedule: new Date(schedule),
          reason,
          appointmentId: appointment?._id,
          note: note || "",
          status: status as Status,
        });

        console.log("nndndn");

        console.log(updateAppointment);
        if (updateAppointment) {
          setOpen && setOpen(false);
          form.reset();
          // router.refresh()
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }

        console.log("updateAppointment: ", updateAppointment);
      }

      if (type === "cancel" && userId) {
        console.log(buttonLabel);

        const cancelAppointmentData = await cancelAppointment({
          cancellationReason: cancellationReason || "",
          appointmentId: appointment?._id,
        });

        if (cancelAppointmentData) {
          setOpen && setOpen(false);
          form.reset();
          // router.back();
          // router.refresh()
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }

        console.log("cancelAppointmentData: ", cancelAppointmentData);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  let buttonLabel: any;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    case "edit":
      buttonLabel = "Edit Appointment";
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-8 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}
        {type !== "cancel" && (
          <>
            {type === "create" && (
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="hospital"
                label="Hospital"
                placeholder="Select a Hospital"
              >
                {hospitalData?.map((hosp: any, i: any) => (
                  <SelectItem key={hosp?.hospital + i} value={hosp?.hospital}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        src={hosp?.image}
                        width={32}
                        height={32}
                        alt="hosp"
                        className="rounded-full border border-dark-500"
                      />
                      <p>{hosp?.hospital}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            )}

            {type === "create" || type === "schedule" ? (
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary care physician"
                placeholder="Select a doctor"
              >
                {doctors?.map((doctor: any, i: any) => (
                  <SelectItem key={doctor?.name + i} value={doctor?.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        src={doctor?.image}
                        width={32}
                        height={32}
                        alt="doctor"
                        className="rounded-full border border-dark-500"
                      />
                      <p>
                        {doctor?.name} - {doctor.specialization}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            ) : null}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="ex: Annual montly check-up"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional comments/notes"
                placeholder="ex: Prefer afternoon appointments, if possible"
              />
            </div>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected Appointment Date"
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />

            {type == "create" && (
              <div className="flex flex-col gap-6 xl:flex-row w-36">
                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="paymentMode"
                  label="Select payment mode"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <RadioGroup
                        className="flex h-11 gap-6 xl:justify-between"
                        onValueChange={(value) => {
                          field.onChange(value);
                          setPaymentMode(value);
                        }}
                        defaultValue={field.value}
                      >
                        {paymentOptions.map((option, i) => (
                          <div key={option + i} className="radio-group">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
            )}
            {type === "create" && paymentMode === "online" && (
              <div className="flex gap-6 h-11 xl:justify-start">
                <p className="text-16-semibold text-dark-700 mr-0">
                  Consulation fee: ₹{price}
                </p>
                <p className="text-12-regular text-green-500 mt-1">
                  (Consulation fee is valid for 15 days)
                </p>
              </div>
            )}
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}
        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  AdminFormValidation,
  DoctorFormValidation,
  UserFormValidation,
} from "@/lib/validation";
import {
  addDoctor,
  adminLogin,
  editDoctor,
  getSingleDoctor,
  getStarted,
} from "@/api/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import SubmitButton from "@/components/SubmitButton";
import FileUploader from "@/components/FileUploader";
import { Bounce, toast } from "react-toastify";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addDoctorState, editDoctorState } from "@/lib/redux/slice/doctorSlice";
import { Doctors } from "@/constants";

const AddDoctorModal = ({
  type,
  open,
  setOpen,
  doctorId,
}: {
  type: "add" | "edit";
  open: boolean;
  setOpen?: (open: boolean) => void;
  doctorId: any;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let id: any = searchParams.get("id");
  const dispatch = useAppDispatch();

  const [doctorInfo, setDoctorInfo] = useState<any>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getSingleDoctorInfo = async () => {
    try {
      const doctor = await getSingleDoctor(doctorId);

      console.log(doctor);

      if (doctor) {
        setDoctorInfo(doctor);
        // form.reset({
        //   ...DoctorFormValidation,
        //   name: doctorInfo?.doctor.name || "",
        //   specialization: doctorInfo?.doctor.specialization || "",
        //   price: doctorInfo?.doctor.price || "",
        //   // image: doctorInfo?.doctor.image || "",
        // });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (doctorId) {
      getSingleDoctorInfo();
    }
  }, [doctorId]);

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof DoctorFormValidation>>({
    resolver: zodResolver(DoctorFormValidation),
    defaultValues: {
      name: type === "edit" ? doctorInfo?.doctor.name : "",
      specialization: type === "edit" ? doctorInfo?.doctor.specialization : "",
      price: type === "edit" ? doctorInfo?.doctor.price : "",
    },
  });

  useEffect(() => {
    if (doctorInfo) {
      form.reset({
        name: type === "edit" ? doctorInfo?.doctor.name || "" : "",
        specialization:
          type === "edit" ? doctorInfo?.doctor.specialization || "" : "",
        price: type === "edit" ? doctorInfo?.doctor.price || "" : "",
      });
    }
  }, [doctorInfo, form, type]);

  async function onSubmit(values: z.infer<typeof DoctorFormValidation>) {
    setIsLoading(true);
    console.log(doctorId);

    const { name, specialization, price } = values;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("specialization", specialization);
    formData.append("price", price);

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
      formData.append("fileName", values.image[0].name);
    }

    try {
      if (type === "add" && id) {
        const newDoctor = await addDoctor(formData, id);

        const doctorData = {
          _id: newDoctor.doctor._id,
          name: newDoctor.doctor.name,
          specialization: newDoctor.doctor.specialization,
          price: newDoctor.doctor.price,
          image: newDoctor.doctor.image,
        };

        dispatch(addDoctorState(doctorData));
        if (newDoctor) {
          toast.success(newDoctor.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          setOpen && setOpen(false);
          form.reset();
        }
      }

      if (type === "edit" && doctorId) {
        const doctor = await editDoctor(formData, doctorId);

        dispatch(editDoctorState(doctor));

        if (doctor) {
          console.log(doctor);
          toast.success("Doctor info updated successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          setOpen && setOpen(false);
          form.reset();
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  }
  const closeModal = () => {
    setOpen && setOpen(false);
    setIsLoading && setIsLoading(false);
    form.reset();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent
        className={`shad-alert-dialog overflow-y-auto ${
          type == "edit" ? "h-[90vh]" : "h-[90vh]"
        } remove-scrollbar`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            {type === "add" && "Add Doctor"}
            {type === "edit" && "Edit Doctor Information"}
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type === "add" && "Add new doctor, please fill below details"}
            {type === "edit" && "Edit doctor info, please fill below details"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex-1"
          >
            {type === "add" && (
              <div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter doctor name"
                  iconSrc="/assets/icons/user.svg"
                  iconAlt="name"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="specialization"
                  label="Specialization"
                  placeholder="Enter doctor specialization"
                  iconSrc=""
                  iconAlt=""
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="price"
                  label="Price"
                  placeholder="Enter doctor fee"
                  iconSrc=""
                  iconAlt=""
                />
                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="image"
                  label="Paste doctor recent image here"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <FileUploader
                        files={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
            )}
            {type === "edit" && (
              <div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter doctor name"
                  iconSrc="/assets/icons/user.svg"
                  iconAlt="name"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="specialization"
                  label="Specialization"
                  placeholder="Enter doctor specialization"
                  iconSrc=""
                  iconAlt=""
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="price"
                  label="Price"
                  placeholder="Enter doctor fee"
                  iconSrc=""
                  iconAlt=""
                />
                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="image"
                  label="Paste doctor recent image here"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <FileUploader
                        files={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
            )}
            <AlertDialogFooter>
              <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddDoctorModal;

/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUp } from "lucide-react";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import {
  PatientEditFormValidation,
  PatientFormValidation,
} from "@/lib/validation";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { editPatientInfo } from "@/api/api";

const PersonalInfo = ({ patient, setIsLoading, userBadge, form, id }: any) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarImage, setAvatarImage] = useState<string>(
    patient?.profilePicture
  );

  const handleAvatarClick = () => {
    console.log("Avatar clicked");
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      console.log("Selected file:", file);

      const fileURL = URL.createObjectURL(file);
      setAvatarImage(fileURL);
      setSelectedFile(file);
    } else {
      console.log("No file selected or file input is null");
    }
  };

  const onSubmit = async (
    values: z.infer<typeof PatientEditFormValidation>
  ) => {
    console.log("values: ", values);
    console.log("values: ", values);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("birthDate", values.birthDate.toISOString());
    formData.append("address", values.address);
    formData.append("occupation", values.occupation);
    formData.append("emergencyContactName", values.emergencyContactName);
    formData.append("emergencyContactNumber", values.emergencyContactNumber);
    formData.append("insuranceProvider", values.insuranceProvider);
    formData.append("insurancePolicyNumber", values.insurancePolicyNumber);
    formData.append("allergies", values.allergies || "");
    formData.append("currentMedication", values.currentMedication || "");
    formData.append("familyMedicalHistory", values.familyMedicalHistory || "");
    formData.append("pastMedicalHistory", values.pastMedicalHistory || "");

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    // Convert object to JSON string and log
    try {
      const updatedPatient = await editPatientInfo(formData, id);

      if (updatedPatient) {
        console.log("updatedPatient: ", updatedPatient);
        localStorage.setItem("user", JSON.stringify(updatedPatient?.user));
        setIsLoading(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(patient);

  return (
    <Card className="border-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-12"
        >
          <div>
            <Avatar
              className="cursor-pointer mt-5 size-28 ml-4"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={avatarImage || patient?.profilePicture} />
              <AvatarFallback className="bg-green-400 text-16-regular">
                {userBadge}
              </AvatarFallback>
            </Avatar>
            <ImageUp
              className="absolute bottom-0 top-24 left-24 cursor-pointer z-50 text-16-regular text-green-500"
              onClick={handleAvatarClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 ">
            <section className="space-y-6">
              {/* NAME */}

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  placeholder="John Doe"
                  iconSrc="/assets/icons/user.svg"
                  iconAlt="user"
                  label="Full name"
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="birthDate"
                  label="Date of birth"
                />
              </div>

              {/* EMAIL & PHONE */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email address"
                  placeholder="johndoe@gmail.com"
                  iconSrc="/assets/icons/email.svg"
                  iconAlt="email"
                />

                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Address & Occupation */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="14 street, New york, NY - 5101"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="occupation"
                  label="Occupation"
                  placeholder=" Software Engineer"
                />
              </div>

              {/* Emergency Contact Name & Emergency Contact Number */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="emergencyContactName"
                  label="Emergency contact name"
                  placeholder="Guardian's name"
                />

                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="emergencyContactNumber"
                  label="Emergency contact number"
                  placeholder="(555) 123-4567"
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="mb-9 space-y-1">
                <h2 className="sub-header">Medical Information</h2>
              </div>

              {/* INSURANCE & POLICY NUMBER */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insuranceProvider"
                  label="Insurance provider"
                  placeholder="BlueCross BlueShield"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insurancePolicyNumber"
                  label="Insurance policy number"
                  placeholder="ABC123456789"
                />
              </div>

              {/* ALLERGY & CURRENT MEDICATIONS */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="allergies"
                  label="Allergies (if any)"
                  placeholder="Peanuts, Penicillin, Pollen"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="currentMedication"
                  label="Current medications"
                  placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                />
              </div>

              {/* FAMILY MEDICATION & PAST MEDICATIONS */}
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="familyMedicalHistory"
                  label=" Family medical history (if relevant)"
                  placeholder="Mother had brain cancer, Father has hypertension"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="pastMedicalHistory"
                  label="Past medical history"
                  placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                />
              </div>
            </section>
            <Button
              type="submit"
              variant="outline"
              className="shad-primary-btn"
            >
              Save changes
            </Button>
          </CardContent>
          <CardFooter></CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default PersonalInfo;

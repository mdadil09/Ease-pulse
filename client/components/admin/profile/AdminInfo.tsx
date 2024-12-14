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
  AdminEditFormValidation,
  EmailFormValidation,
  PatientEditFormValidation,
  PatientFormValidation,
} from "@/lib/validation";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/forms/PatientForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { editPatientInfo, updateAdmin } from "@/api/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bounce, toast } from "react-toastify";

const AdminInfo = ({ form, adminData, setIsLoading, adminBadge, id }: any) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarImage, setAvatarImage] = useState<string>(adminData?.image);

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

  const onSubmit = async (values: z.infer<typeof AdminEditFormValidation>) => {
    console.log("values: ", values);
    console.log("values: ", values);
    setIsLoading(true);

    const formData = new FormData();

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    // Convert object to JSON string and log
    try {
      const updatedAdmin = await updateAdmin(id, formData);

      console.log("updatedAdmin: ", updatedAdmin);
      if (updatedAdmin) {
        localStorage.setItem("admin", JSON.stringify(updatedAdmin));
        //@ts-ignore
        toast.success("Admin info update successfully!", {
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
        window.location.reload();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(adminData);

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
              <AvatarImage src={avatarImage || adminData?.image} />
              <AvatarFallback className="bg-green-400 text-16-regular">
                {adminBadge}
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
            <CardTitle>Admin Information</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 ">
            <section className="space-y-6">
              {/* EMAIL & Hospitalname */}
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
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="hospital"
                  label="Hospital Name"
                  placeholder=""
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
          <CardFooter>
            <p className="text-gray-500">
              Note: You can't edit admin email and hospital name. If you want
              any changes please contact admin.
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AdminInfo;

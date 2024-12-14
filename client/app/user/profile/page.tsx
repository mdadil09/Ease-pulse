/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleUserRound, Key } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProfileMenu from "@/components/ui/ProfileMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PatientFormDefaultValues } from "@/constants";
import {
  PatientEditFormValidation,
  PatientFormValidation,
} from "@/lib/validation";
import { getPatientInfo } from "@/api/api";
import Password from "@/components/user/profile/Password";
import PersonalInfo from "@/components/user/profile/PersonalInfo";

export interface PatientInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // or Date if you want to handle it as a Date object
  gender: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string;
  currentMedication: string;
  familyMedicalHistory: string;
  pastMedicalHistory: string;
  identificationType: string;
  identificationNumber: string;
  identificationDocument: string;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
  createdAt: string; // or Date if you want to handle it as a Date object
  updatedAt: string; // or Date if you want to handle it as a Date object
  __v: number;
  createdBy: string;
}

const Profile = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let id: any = searchParams.get("id");
  const [user, setUser] = useState<any | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<PatientInfo>();

  const form = useForm<z.infer<typeof PatientEditFormValidation>>({
    resolver: zodResolver(PatientEditFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: patient?.name,
      email: patient?.email,
      phone: patient?.phone,
    },
  });

  const getPatientData = async () => {
    try {
      const patientData = await getPatientInfo(id);

      if (patientData) {
        setPatient(patientData);
        form.reset({
          ...PatientFormDefaultValues,
          ...patientData,
          birthDate: new Date(patientData.birthDate),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(typeof patient?.name);

  useEffect(() => {
    const userInfo: any = localStorage.getItem("user");
    const parsedUser: any = JSON.parse(userInfo);
    setUser(parsedUser);
    getPatientData();
  }, []);

  const handleLogOut = () => {
    router.push("/");
    localStorage.clear();
  };

  let userBadge = user?.user.name.slice(0, 2);

  return (
    <div className="mx-auto">
      <header className="admin-header-profile">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={28}
            width={162}
            alt="logo"
            className="h-5 w-fit"
          />
        </Link>
        <div className="flex align-middle">
          <ProfileMenu
            id={id}
            userBadge={userBadge}
            handleLogOut={handleLogOut}
            user={user?.user}
          />
        </div>
      </header>
      <Tabs defaultValue="account" className=" flex justify-between">
        <div className="bg-dark-200 z-10 fixed h-screen max-h-screen w-16 lg:w-36 xl:w-48 2xl:w-48">
          <TabsList className="flex justify-start flex-row mt-5">
            <TabsTrigger value="account">
              <CircleUserRound className="mr-2" />
              <p className="hidden lg:inline"> Personal Info</p>
            </TabsTrigger>
          </TabsList>
          <TabsList className="flex justify-start flex-row mt-5">
            <TabsTrigger value="password">
              <Key className="mr-2" />
              <p className="hidden lg:inline">Password</p>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="account"
          className="bg-dark-200 overflow-y-auto rounded border-none w-3/4 lg:w-4/5 xl:w-4/5 2xl:w-5/6 mr-4 left-20 lg:left-40 xl:left-56 2xl:left-56 mt-5 h-5/6 fixed  scrollbar"
        >
          <PersonalInfo
            form={form}
            patient={patient}
            setIsLoading={setIsLoading}
            id={id}
          />
        </TabsContent>
        <TabsContent
          value="password"
          className="bg-dark-200 rounded w-3/4 lg:w-4/5 xl:w-4/5 2xl:w-5/6 mr-4 left-20 lg:left-40 xl:left-56 2xl:left-56 mt-5 fixed"
        >
          <Password patient={patient} setIsLoading={setIsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

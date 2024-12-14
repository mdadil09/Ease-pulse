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
import { AdminDefaultValues, PatientFormDefaultValues } from "@/constants";
import { AdminEditFormValidation, AdminFormValidation } from "@/lib/validation";
import { getAdminData, getPatientInfo } from "@/api/api";
import ProfileMenuAdmin from "@/components/ui/ProfileMenuAdmin";
import Password from "@/components/admin/profile/Password";
import AdminInfo from "@/components/admin/profile/AdminInfo";

const Profile = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let id: any = searchParams.get("id");
  let hospitalName: any = searchParams.get("hospital");
  const [isLoading, setIsLoading] = useState(false);
  const [admin, setAdmin] = useState<any>();
  const [adminData, setAdminData] = useState<any>();

  const form = useForm<z.infer<typeof AdminEditFormValidation>>({
    resolver: zodResolver(AdminEditFormValidation),
    defaultValues: {
      ...AdminDefaultValues,
      email: adminData?.email,
      hospital: adminData?.hospital,
    },
  });

  const getAdmin = async () => {
    try {
      const adminInfo = await getAdminData(id);

      if (adminInfo) {
        setAdminData(adminInfo);
        form.reset({
          ...AdminDefaultValues,
          ...adminInfo,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = () => {
    router.push("/");
    localStorage.clear();
  };

  let adminBadge = admin?.hospital.slice(0, 2);

  useEffect(() => {
    //@ts-ignore
    const parsedAdmin: any = JSON.parse(localStorage.getItem("admin"));

    setAdmin(parsedAdmin);

    getAdmin();
  }, []);

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
          <ProfileMenuAdmin
            id={id}
            userBadge={adminBadge}
            handleLogOut={handleLogOut}
            user={adminData}
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
          <AdminInfo
            form={form}
            adminData={adminData}
            setIsLoading={setIsLoading}
            id={id}
            adminBadge={adminBadge}
          />{" "}
        </TabsContent>
        <TabsContent
          value="password"
          className="bg-dark-200 rounded w-3/4 lg:w-4/5 xl:w-4/5 2xl:w-5/6 mr-4 left-20 lg:left-40 xl:left-56 2xl:left-56 mt-5 fixed"
        >
          <Password admin={admin} setIsLoading={setIsLoading} />
        </TabsContent>
      </Tabs>
      t
    </div>
  );
};

export default Profile;

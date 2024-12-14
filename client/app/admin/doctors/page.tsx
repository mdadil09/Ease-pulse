"use client";

import {
  addDoctor,
  deleteDoctor,
  editDoctor,
  getDoctors,
  getDoctorsByHospital,
} from "@/api/api";
import AddDoctorModal from "@/components/admin/doctor/AddDoctorModal";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/doctorColumns";
import { Button } from "@/components/ui/button";
import ProfileMenuAdmin from "@/components/ui/ProfileMenuAdmin";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  deleteDoctorState,
  setDoctorState,
} from "@/lib/redux/slice/doctorSlice";
import { BriefcaseMedical, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner";
import Spinner from "@/components/ui/Spinner";

const Doctors = () => {
  const [admin, setAdmin] = useState<any>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [doctors, setDoctors] = useState<any>();
  const [doctorInfo, setDoctorInfo] = useState<any>();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [doctorId, setDoctorId] = useState<any>();
  const dispatch = useAppDispatch();
  const doctorData = useAppSelector((state) => state.doctorReducer.doctor);
  const [loading, setLoading] = useState(false);

  console.log("doctorData: ", doctorData);

  let id: any = searchParams.get("id");

  let adminBadge = admin?.hospital.slice(0, 2);
  const handleLogOut = () => {
    router.push("/");
    localStorage.clear();
  };

  const addDoctorInfo = () => {
    setOpen(true);
  };

  const handleDeleteDoctor = async (id: any) => {
    setLoading(true);

    try {
      const doctor = await deleteDoctor(id);
      dispatch(deleteDoctorState(id));

      if (doctor) {
        toast.success(doctor, {
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
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleEditDoctor = async (data: any) => {
    setDoctorId(data);
    setEditOpen(true);
    console.log(doctorId);
  };

  const getDoctorsData = async () => {
    try {
      console.log(id);

      const doctors = await getDoctorsByHospital(id);

      dispatch(setDoctorState(doctors));

      setDoctors(doctors);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    //@ts-ignore
    const parsedAdmin: any = JSON.parse(localStorage.getItem("admin"));

    setAdmin(parsedAdmin);
    getDoctorsData();
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
            user={admin}
          />
        </div>
      </header>
      <header className="p-12 flex justify-between items-center">
        <div className="flex justify-start items-center">
          <BriefcaseMedical className="mr-4" size="32px" />
          <p className="text-24-bold">Doctors</p>
        </div>
        <div className="flex justify-start items-center">
          <Button className="shad-primary-btn" onClick={addDoctorInfo}>
            <Plus size={22} className="mr-2" />
            Add Doctor
          </Button>
        </div>
      </header>
      <AddDoctorModal
        type="add"
        open={open}
        setOpen={setOpen}
        doctorId={doctorId}
      />
      <AddDoctorModal
        type="edit"
        open={editOpen}
        setOpen={setEditOpen}
        doctorId={doctorId}
      />
      <div className="p-12 pt-4">
        <DataTable
          columns={columns(handleDeleteDoctor, handleEditDoctor)}
          data={doctorData}
        />{" "}
      </div>
      {loading && <Spinner />}
    </div>
  );
};
export default Doctors;

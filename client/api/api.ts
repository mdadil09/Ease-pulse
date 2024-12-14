"use client";

import {
  Appointment,
  cancelAppointmentInput,
  ScheduleAppointmentInput,
} from "@/components/forms/AppointmentForm";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_SECRET } from "@/enviroment/enviroment";
import { baseUrl } from "@/constants";
import { Bounce, toast } from "react-toastify";

interface formProps {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface loginProps {
  email: string;
  password: string;
}

export const getStarted = async ({
  name,
  email,
  phone,
  password,
}: formProps) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${baseUrl}/api/auth/register`,
      { name, email, phone, password },
      config
    );

    localStorage.setItem("phone", phone);

    console.log(res);

    return res.data.message;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const verifyOtp = async (phone: any, otp: any) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${baseUrl}/api/auth/verifyotp`,
      { phone, otp },
      config
    );

    const user = res.data;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user?.token);

    console.log(res);

    return res.data.user;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const registerPatient = async (formData: FormData, userId: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post(
      `${baseUrl}/api/patient/patientRegistration/${userId}`,
      formData,
      config
    );

    console.log("res: ", res);
    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getPatientInfo = async (id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(
      `${baseUrl}/api/patient/patientInfo/${id}`,
      config
    );

    console.log("res: ", res);
    return res.data.patientInfo;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const newAppointment = async ({
  primaryPhysician,
  schedule,
  reason,
  note,
  status,
  paymentMode,
  userId,
  hospital,
}: Appointment) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post(
      `${baseUrl}/api/patient/newAppointment/${userId}`,
      {
        primaryPhysician,
        schedule,
        reason,
        note,
        status,
        paymentMode,
        hospital,
      },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAppointmentDetails = async (appointmentId: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${baseUrl}/api/patient/appointment/${appointmentId}`,
      config
    );

    console.log(res);

    return res.data.appointment;
  } catch (error) {
    console.log(error);
  }
};

export const getDoctors = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${baseUrl}/api/doctor/`, config);

    console.log("res: ", res);

    return res.data.doctors;
  } catch (error) {
    console.log(error);
  }
};

export const getDoctorsByHospital = async (id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${baseUrl}/api/doctor/doctorByHospital/${id}`,
      config
    );

    console.log("res: ", res);

    return res.data.doctors;
  } catch (error) {
    console.log(error);
  }
};

export const adminLogin = async ({ email, password }: loginProps) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${baseUrl}/api/auth/admin/login`,
      { email, password },
      config
    );

    console.log("res: ", res);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("admin", JSON.stringify(res.data.admin));

    return res.data.admin;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getAllAppointments = async (id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${baseUrl}/api/patient/getAllAppointments/${id}`,
      config
    );

    console.log("res: ", res);

    return res.data.appointment;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const scheduleAppointment = async ({
  primaryPhysician,
  schedule,
  reason,
  appointmentId,
  status,
}: ScheduleAppointmentInput) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.patch(
      `${baseUrl}/api/patient/updateAppointment/${appointmentId}`,
      { primaryPhysician, schedule, reason, status },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const cancelAppointment = async ({
  cancellationReason,
  appointmentId,
}: cancelAppointmentInput) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.patch(
      `${baseUrl}/api/patient/cancelAppointment/${appointmentId}`,
      { cancellationReason },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const userLogin = async ({ email, password }: loginProps) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      `${baseUrl}/api/auth/login`,
      { email, password },
      config
    );

    console.log("res: ", res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getAppointmentDetailByUserId = async (id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(
      `${baseUrl}/api/patient/getAppointmentById/${id}`,
      config
    );

    console.log("res: ", res);

    return res.data.appointment;
  } catch (error) {
    console.log(error);
  }
};

export const editPatientInfo = async (formData: FormData, id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(
      `${baseUrl}/api/patient/patientInfo/edit/${id}`,
      formData,
      config
    );

    console.log("res: ", res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const updatePassword = async ({ email, newPassword }: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.patch(
      `${baseUrl}/api/auth/updatePassword`,
      { email, newPassword },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const forgotPasswordRequest = async (email: string) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${baseUrl}/api/auth/requestPasswordReset`,
      { email },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (
  newPassword: string,
  userId: string | null,
  token: string | null
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${baseUrl}/api/auth/resetPassword`,
      { newPassword, userId, token },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const makePayment = async (
  price: any,
  appointmentId: any,
  userId: any
) => {
  const stripe: any = await loadStripe(STRIPE_SECRET);

  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const session: any = await axios.post(
      `${baseUrl}/api/payment/process-payment`,
      { price, appointmentId, userId },
      config
    );

    const result = stripe.redirectToCheckout({
      sessionId: session.data.id,
    });

    console.log(session.data);

    return session.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getPayment = async (sessionId: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${baseUrl}/api/payment/success/${sessionId}`,
      config
    );

    console.log(res.data);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const deleteAppointment = async (appointmentId: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(
      `${baseUrl}/api/patient/deleteAppointment/${appointmentId}`,
      config
    );

    console.log("token: ", token);

    console.log(res);

    return res;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const updateAdminPassword = async ({ email, newPassword }: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post(
      `${baseUrl}/api/auth/admin/updatePassword`,
      { email, newPassword },
      config
    );
    console.log(res.data);

    return res.data.message;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const addDoctor = async (formData: FormData, id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.post(
      `${baseUrl}/api/doctor/addDoctor/${id}`,
      formData,
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const editDoctor = async (formData: FormData, id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(
      `${baseUrl}/api/doctor/editDoctor/${id}`,
      formData,
      config
    );

    console.log(res);

    return res.data.doctor;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const deleteDoctor = async (id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.delete(
      `${baseUrl}/api/doctor/deleteDoctor/${id}`,
      config
    );

    console.log(res);

    return res.data.message;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getSingleDoctor = async (id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(`${baseUrl}/api/doctor/${id}`, config);

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getAdminData = async (id: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(`${baseUrl}/api/admin/${id}`, config);

    console.log(res);

    return res.data.admin;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getAllAdminData = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(`${baseUrl}/api/admin/allAdmin`, config);

    console.log(res);

    return res.data.admin;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const getAllAdminDataByHospitalName = async (hospital: any) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(
      `${baseUrl}/api/admin/allAdmin/${hospital}`,
      config
    );

    console.log(res);

    return res.data.admin;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const updateAdmin = async (id: any, formData: FormData) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(
      `${baseUrl}/api/admin/updateAdmin/${id}`,
      formData,
      config
    );

    console.log(res);

    return res.data.adminInfo;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const editAppointmentStatus = async (
  appointmentId: any,
  status: string
) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.put(
      `${baseUrl}/api/patient/editAppointment/${appointmentId}`,
      { status },
      config
    );

    console.log(res);

    if (res.status === 200) {
      toast.success(res.data.message, {
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

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

export const forgotPasswordRequestAdmin = async (email: string) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${baseUrl}/api/auth/admin/requestPasswordReset`,
      { email },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPasswordAdmin = async (
  newPassword: string,
  userId: string | null,
  token: string | null
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${baseUrl}/api/auth/admin/resetPassword`,
      { newPassword, userId, token },
      config
    );

    console.log(res);

    return res.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    toast.error(error.response.data.message, {
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
};

const doctors = require("../db/doctorData");
const Admin = require("../models/admin");
const DoctorInfo = require("../models/doctor");
const cloudinary = require("cloudinary").v2;

const insertDoctor = async () => {
  try {
    for (let doctor of doctors) {
      const { name, image, hospitalEmail } = doctor;
      const admin = await Admin.findOne({ email: hospitalEmail });

      // console.log(admin);

      if (admin) {
        const createDoctor = await DoctorInfo.create({
          name: name,
          image: image,
          hospitalID: admin._id,
        });
        console.log(createDoctor);
      }
    }

    // await DoctorInfo.deleteMany();
  } catch (error) {
    console.log(error);
  }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await DoctorInfo.find();

    res.status(200).send({
      doctors: doctor,
      message: "Doctor fetched successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const getDoctorByHospital = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const doctor = await DoctorInfo.find({ hospitalID: id });
    console.log(doctor);

    res.status(200).send({
      doctors: doctor,
      message: "Doctor fetched successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const updateSpecializations = async () => {
  try {
    const updates = [
      {
        _id: "66b0b49941470593e6285550",
        specialization: "Cardiologist",
        price: 700,
      },
      {
        _id: "66b0b49941470593e6285555",
        specialization: "Pediatrician",
        price: 300,
      },
      {
        _id: "66b0b49941470593e6285559",
        specialization: "Dermatologist",
        price: 350,
      },
      {
        _id: "66b0b49941470593e628555c",
        specialization: "Neurologist",
        price: 1000,
      },
      {
        _id: "66b0b49941470593e6285560",
        specialization: "General Physician",
        price: 500,
      },
      {
        _id: "66b0b49a41470593e6285563",
        specialization: "Oncologist",
        price: 500,
      },
      {
        _id: "66b0b49a41470593e6285566",
        specialization: "Endocrinologist",
        price: 250,
      },
      {
        _id: "66b0b49a41470593e6285569",
        specialization: "Orthopedic Surgeon",
        price: 900,
      },
      {
        _id: "66b0b49a41470593e628556c",
        specialization: "Gastroenterologist",
        price: 300,
      },
    ];
    await Promise.all(
      updates.map(async (update) => {
        await DoctorInfo.updateOne(
          { _id: update._id },
          { $set: { price: update.price } }
        );
      })
    );

    console.log("Price updated successfully.");
  } catch (error) {
    console.log(error);
  }
};

const addDoctor = async (req, res) => {
  try {
    const { name, specialization, price } = req.body;

    const image = req.file ? req.file.path : undefined;

    const hospitalId = req.params.hospitalID;

    const newDoctor = await DoctorInfo.create({
      image: image,
      name: name,
      specialization: specialization,
      price: price,
      hospitalID: hospitalId,
    });

    res.status(200).send({
      doctor: newDoctor,
      message: "Doctor created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const editDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, specialization, price } = req.body;
    const image = req.file ? req.file.path : undefined;

    const doctor = await DoctorInfo.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          name: name,
          specialization: specialization,
          image: image,
          price: Number(price),
        },
      },
      { new: true }
    );

    res.status(200).send({
      doctor: doctor,
      message: "Doctor Info updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const id = req.params.id;

    const doctor = await DoctorInfo.findById(id);

    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const imageUrl = doctor.image;
    const publicId = extractPublicIdFromUrl(imageUrl);

    console.log(publicId);
    await cloudinary.uploader.destroy(publicId);

    await DoctorInfo.findOneAndDelete({ _id: id });

    res.status(200).send({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const extractPublicIdFromUrl = (imageUrl) => {
  const regex = /\/([^\/]+)\.[a-zA-Z]+$/;
  const match = imageUrl.match(regex);
  return match ? match[1] : null;
};

const getSingleDoctor = async (req, res) => {
  try {
    const id = req.params.id;

    const doctor = await DoctorInfo.findOne({ _id: id });

    if (!doctor) {
      return res
        .status(400)
        .send({ message: "Doctor with given id is not found" });
    }

    res.status(200).send({
      doctor: doctor,
      message: "Doctor found successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  getDoctor,
  insertDoctor,
  updateSpecializations,
  addDoctor,
  editDoctor,
  deleteDoctor,
  getSingleDoctor,
  getDoctorByHospital,
};

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db/db");
const authRoutes = require("./routes/userAuth");
const patientRoutes = require("./routes/patientInfo");
const multer = require("multer");
const {
  addPatientInformation,
  editPatientInfo,
} = require("./controller/patientInfo");
const { storage } = require("./utils/storage");
const doctorRoutes = require("./routes/doctor");
const DoctorInfo = require("./models/doctor");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");
const adminProfileRoutes = require("./routes/adminProfile");
const { adminRegister, updateAdminInfo } = require("./controller/admin");
const {
  insertDoctor,
  updateSpecializations,
  addDoctor,
  editDoctor,
} = require("./controller/doctor");
const { handleWebhook } = require("./controller/payment");
const protect = require("./middleware/auth");

const app = express();
dotenv.config();

//PORT
const port = process.env.PORT || 5001;

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);
//middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Image upload
const upload = multer({ storage });

//routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", protect, patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminProfileRoutes);

//routes with files
app.post(
  "/api/patient/patientRegistration/:id",
  protect,
  upload.single("identificationDocument"),
  addPatientInformation
);

app.put(
  "/api/patient/patientInfo/edit/:id",
  protect,
  upload.single("avatar"),
  editPatientInfo
);

app.post(
  "/api/doctor/addDoctor/:hospitalID",
  protect,
  upload.single("image"),
  addDoctor
);

app.put(
  "/api/doctor/editDoctor/:id",
  protect,
  upload.single("image"),
  editDoctor
);

app.put(
  "/api/admin/updateAdmin/:id",
  protect,
  upload.single("avatar"),
  updateAdminInfo
);

//database connection
connectDB();

// insertDoctor();
// updateSpecializations();
// adminRegister();

//starting the server

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

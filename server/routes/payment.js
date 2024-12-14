const express = require("express");
const {
  processPayment,
  handleWebhook,
  retrivePayment,
} = require("../controller/payment");
const protect = require("../middleware/auth");
const router = express.Router();

router.post("/process-payment/", protect, processPayment);
router.post("/retry-payment/", protect, processPayment);

router.get("/success/:sessionId", protect, retrivePayment);

module.exports = router;

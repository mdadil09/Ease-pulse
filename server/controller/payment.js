const NewAppointment = require("../models/newAppointment");
const sendEmail = require("../utils/sendEmail");

const stripe = require("stripe")(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const processPayment = async (req, res) => {
  try {
    const { price, appointmentId, userId } = req.body;

    const product = await stripe.products.create({
      name: "Consultation fee",
    });

    const priceData = await stripe.prices.create({
      unit_amount: price * 100, // price should be in cents
      currency: "INR",
      product: product.id,
    });

    const lineItems = [
      {
        price: priceData.id,
        quantity: 1,
      },
    ];

    const sessions = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:3000/patients/${userId}/new-appointment/success?session_id={CHECKOUT_SESSION_ID}&appointmentId=${appointmentId}`,
      cancel_url: `http://localhost:3000/patients/${userId}/new-appointment/cancel?session_id={CHECKOUT_SESSION_ID}&appointmentId=${appointmentId}`,
      metadata: {
        appointmentId,
        userId,
      },
    });

    res.status(200).send({ status: sessions.status, id: sessions.id });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .send({ message: "An error occurred while processing the payment." });
  }
};

const retrivePayment = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(session.payment_status);

    const appointmentId = session.metadata.appointmentId;

    const appointment = await NewAppointment.findByIdAndUpdate(
      appointmentId,
      { $set: { paymentStatus: session.payment_status } },
      { new: true }
    );

    console.log(appointment);

    res.status(200).send({ session: session });
  } catch (error) {
    console.log(error);
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const appointmentId = paymentIntent.metadata.appointmentId;
      const userId = paymentIntent.metadata.userId;
      // await updatePaymentStatus(appointmentId, userId, "paid");
      console.log(`PaymentIntent was successful!`, paymentIntent);
      break;
    case "payment_intent.payment_failed":
      const paymentFailed = event.data.object;
      console.log(`PaymentIntent failed.`, paymentFailed);
      break;
    case "charge.succeeded":
      const charge = event.data.object;
      const htmlContent = `<h1>Hi, ${charge.billing_details.name}</h1>
      <p>Your payment for order ${charge.payment_intent} was successfull.</p>
      <a href="${charge.receipt_url}">View Receipt</a>`;

      sendEmail(
        charge.billing_details.email,
        "Payment was successfull",
        htmlContent
      );
      console.log(`Charge was successful!`, charge);
      break;
    case "charge.failed":
      const chargeFailed = event.data.object;
      // await updatePaymentStatus(appointmentId, userId, chargeFailed.status);
      console.log(`Charge failed.`, chargeFailed.status);
      break;
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(`Checkout Session was completed!`, session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const updatePaymentStatus = async (userId, status) => {
  const appointment = await NewAppointment.findOneAndUpdate(
    {
      createdBy: userId,
    },
    { $set: { payment_status: status } },
    { new: true }
  );
  console.log(
    `Updating payment status for appointment ${appointmentId} and user ${userId} to ${status} of ${appointment}`
  );
};

module.exports = { processPayment, handleWebhook, retrivePayment };

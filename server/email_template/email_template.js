function generateEmailTemplate(name, newAppointment, location, image, email) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="width: 100%; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        ${
          newAppointment.status != "cancelled"
            ? `<h2 style="color: #4CAF50; text-align: center;">Appointment Confirmation</h2>`
            : `<h2 style="color: #CC0000; text-align: center;">
              Appointment Cancelled
            </h2>`
        }
          <p>Hi ${name},</p>

          ${
            newAppointment.status === "pending"
              ? `<p>Your request for appointment has been confirmed! Here are the details:</p>`
              : ""
          }

          ${
            newAppointment.status === "scheduled"
              ? `<p>Your appointment has been scheduled! Here are the details:</p>`
              : ""
          }

          ${
            newAppointment.status === "cancelled"
              ? `<p>We regret to inform you, your appointment has been cancelled!</p>`
              : ""
          }

          ${
            newAppointment.status != "cancelled"
              ? `<div style="border: 1px solid #ddd; border-radius: 8px; padding: 10px; margin: 20px 0; background-color: #f9f9f9;">
                  <h3 style="margin: 10px 0;">Appointment Details</h3>
                  <p><strong>Date:</strong> ${newAppointment.schedule}</p>
                  <p><strong>Doctor:</strong> ${newAppointment.primaryPhysician}</p>
                  <p><strong>Location:</strong> ${location}</p>
                </div>`
              : `<p><strong>Cancellation Reason:</strong> ${newAppointment.cancellationReason}</p>`
          }

          ${
            newAppointment.status === "pending"
              ? `<p>We will confirm your appointment soon if your requested slots are available; otherwise, we will provide alternative slots.</p>`
              : ""
          }

          <p>${
            newAppointment.status != "cancelled"
              ? "We look forward to seeing you!"
              : `We're sorry for the inconvenience.<br> Please feel free to contact us if you'd like to reschedule or if you have any questions.<br>email: ${email}`
          }
          </p>
          <p>Best regards,</p>
          <p>Your Clinic Team</p>
          <img src=${image} alt="Hospital logo" />
        </div>
      </div>
    </body>
  </html>
  `;
}

module.exports = { generateEmailTemplate };

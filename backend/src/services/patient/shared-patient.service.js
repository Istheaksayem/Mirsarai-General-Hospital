import Patient from '../../models/patient.model.js';
import Appointment from '../../models/appointment.model.js';
import generatePatientId from '../../utils/generatePatientId.js';
import sendEmail from '../../utils/sendEmail.js';
import env from '../../config/env.js';

/**
 * Find an existing patient by phone OR email, or create a new one if none found.
 * Searches multiple identifiers to prevent duplicate patient records.
 *
 * @param {Object} params
 * @param {string} params.phone  - Patient phone number (required)
 * @param {string} [params.email] - Patient email
 * @param {string} params.name   - Patient full name (used for creation)
 * @param {number} [params.age]  - Patient age
 * @param {string} [params.gender] - Patient gender
 * @param {boolean} [params.skipWelcomeEmail=false] - Skip sending the welcome email
 * @returns {Promise<Object|null>} Patient document (lean), or null if no identifiers provided
 */
export const findOrCreatePatient = async ({ phone, email, name, age, gender, skipWelcomeEmail = false } = {}) => {
  const conditions = [];
  if (phone) conditions.push({ mobile: phone });
  if (email) conditions.push({ email: email.toLowerCase() });

  if (conditions.length === 0) return null;

  let patient = await Patient.findOne({ $or: conditions }).lean();

  if (!patient) {
    const patientId = await generatePatientId();
    const data = { patientId, fullName: name, mobile: phone };
    if (email) data.email = email;
    if (age !== undefined && age !== null) data.age = age;
    if (gender) data.gender = gender;

    patient = await Patient.create(data);
    patient = patient.toObject();

    if (!skipWelcomeEmail && email) {
      try {
        await sendEmail({
          email,
          subject: 'Welcome to Mirsarai General Hospital Patient Portal',
          message: `Dear ${name},

You have been registered at Mirsarai General Hospital.

Your Patient ID: ${patientId}

You can access your information — prescriptions, lab reports, and more — through your patient dashboard.

Visit: ${env.clientUrl || 'http://localhost:3000'}/login-patient?email=${encodeURIComponent(email)}

Thank you,
Mirsarai General Hospital`,
        });
      } catch (err) {
        console.log('Welcome email sending failed:', err.message);
      }
    }
  }

  return patient;
};

/**
 * Link a patient record to an appointment (sets patientId + syncs denormalized fields).
 *
 * @param {string} appointmentId - MongoDB _id of the appointment
 * @param {Object} patient - Patient document
 * @returns {Promise<void>}
 */
export const linkPatientToAppointment = async (appointmentId, patient) => {
  await Appointment.findByIdAndUpdate(appointmentId, {
    $set: {
      patientId: patient._id,
      patientName: patient.fullName,
      patientPhone: patient.mobile,
    },
  });
};

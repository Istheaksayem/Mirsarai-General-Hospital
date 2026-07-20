import { StatusCodes } from 'http-status-codes';
import Prescription from '../models/prescription.model.js';
import Patient from '../models/patient.model.js';
import ApiError from '../utils/ApiError.js';

function deriveFileType(fileUrl) {
  if (!fileUrl) return null;
  const ext = fileUrl.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'image';
  if (['doc', 'docx'].includes(ext)) return 'word';
  return null;
}

export async function lookupPatient(query) {
  const patient = await Patient.findOne({
    $or: [
      { patientId: query },
      { mobile: query },
    ],
  }).lean();

  if (!patient) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No patient found with that ID or mobile number');
  }

  return {
    _id: patient._id,
    patientId: patient.patientId,
    fullName: patient.fullName,
    mobile: patient.mobile,
  };
}

export async function createPrescription({ patientId, doctorId, doctorName, patientInfo, fileUrl, textContent, diagnosis, notes, followUpDate }) {
  const existingPatient = await Patient.findById(patientId).lean();
  if (!existingPatient) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  }

  if (!fileUrl && !textContent) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Either a file or prescription text must be provided');
  }

  const fileType = deriveFileType(fileUrl);

  const prescription = await Prescription.create({
    patientId,
    doctorId,
    doctorName,
    patientInfo,
    fileUrl,
    fileType,
    textContent,
    diagnosis,
    notes,
    followUpDate: followUpDate || undefined,
  });

  return prescription.toObject();
}

export async function getDoctorPrescriptions(doctorId, { page = 1, limit = 20, patientId } = {}) {
  const filter = { doctorId };
  if (patientId) filter.patientId = patientId;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const [data, total] = await Promise.all([
    Prescription.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Prescription.countDocuments(filter),
  ]);

  return { data, total, page: parseInt(page, 10), limit: limitNum };
}

export async function getPatientPrescriptions(patientId, { page = 1, limit = 50 } = {}) {
  const filter = { patientId, status: 'active' };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const [data, total] = await Promise.all([
    Prescription.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Prescription.countDocuments(filter),
  ]);

  return { data, total, page: parseInt(page, 10), limit: limitNum };
}

export async function getPrescriptionById(prescriptionId) {
  const prescription = await Prescription.findById(prescriptionId).lean();
  if (!prescription) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found');
  }
  return prescription;
}

export async function deletePrescription(prescriptionId, doctorId) {
  const prescription = await Prescription.findOneAndUpdate(
    { _id: prescriptionId, doctorId },
    { status: 'archived' },
    { new: true }
  ).lean();

  if (!prescription) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found or unauthorized');
  }

  return prescription;
}

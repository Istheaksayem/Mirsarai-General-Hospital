import Counter from '../models/counter.model.js';

const generatePatientId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'patientId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const year = new Date().getFullYear();
  const seq = String(counter.seq).padStart(6, '0');
  return `MGH-${year}-${seq}`;
};

export default generatePatientId;

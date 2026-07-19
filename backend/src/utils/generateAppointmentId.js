import Counter from '../models/counter.model.js';

const generateAppointmentId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'appointmentId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.seq).padStart(6, '0');
  return `MGH-APP-${seq}`;
};

export default generateAppointmentId;

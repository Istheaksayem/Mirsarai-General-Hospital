import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      bn: { type: String, default: '' },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      en: { type: String, default: '' },
      bn: { type: String, default: '' },
    },
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#1E2B7A',
    },
    gradient: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    highlights: [String],
    tagline: {
      type: String,
      default: '',
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
      },
    ],
    displayOrder: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ isVisible: 1, displayOrder: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

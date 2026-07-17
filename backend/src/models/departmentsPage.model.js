import mongoose from 'mongoose';

const bilingualSchema = new mongoose.Schema(
  { en: { type: String, required: true }, bn: { type: String, default: '' } },
  { _id: false }
);

const featureSchema = new mongoose.Schema(
  {
    icon:         { type: String, required: true },
    title:        { type: bilingualSchema, required: true },
    description:  { type: bilingualSchema, required: true },
    color:        { type: String, default: '#1E2B7A' },
    bg:           { type: String, default: 'rgba(30,43,122,0.08)' },
    isVisible:    { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    department:   { type: String, required: true },
    rating:       { type: Number, default: 5, min: 1, max: 5 },
    text:         { type: bilingualSchema, required: true },
    avatar:       { type: String, default: '' },
    color:        { type: String, default: '#76BC21' },
    isVisible:    { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { _id: false }
);

const buttonSchema = new mongoose.Schema(
  {
    label: { type: bilingualSchema, required: true },
    link:  { type: String, required: true }
  },
  { _id: false }
);

const departmentsPageSchema = new mongoose.Schema(
  {
    title:    { type: bilingualSchema, required: true },
    subtitle: { type: bilingualSchema, required: true },
    hospitalStats: {
      patientsCount:  { type: String, default: '15K+' },
      yearsOfService: { type: String, default: '10+' }
    },
    features:     { type: [featureSchema], default: [] },
    testimonials: { type: [testimonialSchema], default: [] },
    cta: {
      title:        { type: bilingualSchema, required: true },
      description:  { type: bilingualSchema, required: true },
      primaryBtn:   { type: buttonSchema, required: true },
      secondaryBtn: { type: buttonSchema, required: true }
    },
    seo: {
      metaTitle:       { type: bilingualSchema },
      metaDescription: { type: bilingualSchema },
    },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null }
  },
  {
    timestamps: true,
    collection: 'departments_pages'
  }
);

const DepartmentsPage = mongoose.model('DepartmentsPage', departmentsPageSchema);
export default DepartmentsPage;

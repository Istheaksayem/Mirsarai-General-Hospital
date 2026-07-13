import { z } from 'zod';

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  bn: z.string().default('')
});

const seoSchema = z.object({
  metaTitle: localizedStringSchema.optional(),
  metaDescription: localizedStringSchema.optional()
});

const featureSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  icon: z.string().default('')
});

const serviceCategorySchema = z.object({
  category: localizedStringSchema,
  icon: z.string().default(''),
  accent: z.string().default('#f59e0b'),
  items: z.array(localizedStringSchema).default([])
});

const workingHoursSchema = z.object({
  weekdays: z.string().default(''),
  emergency: localizedStringSchema.optional().default({ en: '', bn: '' })
});

const statSchema = z.object({
  value: z.string().min(1, 'Stat value is required'),
  label: localizedStringSchema
});

const guidelineSchema = z.object({
  en: z.string().default(''),
  bn: z.string().default('')
});

const vaccinationEntrySchema = z.object({
  age: localizedStringSchema,
  vaccines: z.array(z.string()).default([])
});

export const putNicuBabyCareSchema = z.object({
  body: z.object({
    title: localizedStringSchema,
    subtitle: localizedStringSchema.optional(),
    heroDescription: localizedStringSchema.optional(),
    backgroundImage: z.string().default(''),
    description: localizedStringSchema,
    features: z.array(featureSchema).default([]),
    services: z.array(serviceCategorySchema).default([]),
    equipment: z.array(localizedStringSchema).default([]),
    guidelines: z.array(guidelineSchema).default([]),
    workingHours: workingHoursSchema.optional(),
    vaccinationSchedule: z.array(vaccinationEntrySchema).default([]),
    statistics: z.array(statSchema).default([]),
    seo: seoSchema.optional()
  })
});

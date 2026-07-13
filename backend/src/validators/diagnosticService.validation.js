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
  accent: z.string().default('#1E2B7A'),
  tests: z.array(localizedStringSchema).default([])
});

const workingHoursSchema = z.object({
  weekdays: z.string().default(''),
  weekends: z.string().default(''),
  emergency: localizedStringSchema.optional().default({ en: '', bn: '' })
});

const statSchema = z.object({
  value: z.string().min(1, 'Stat value is required'),
  label: localizedStringSchema
});

export const putDiagnosticServiceSchema = z.object({
  body: z.object({
    title: localizedStringSchema,
    subtitle: localizedStringSchema,
    heroDescription: localizedStringSchema,
    backgroundImage: z.string().default(''),
    description: localizedStringSchema,
    features: z.array(featureSchema).default([]),
    services: z.array(serviceCategorySchema).default([]),
    workingHours: workingHoursSchema.optional(),
    statistics: z.array(statSchema).default([]),
    seo: seoSchema.optional()
  })
});

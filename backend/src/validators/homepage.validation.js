import { z } from 'zod';

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  bn: z.string().min(1, 'Bangla text is required')
});

const buttonSchema = z.object({
  en: z.string().min(1, 'English button text is required'),
  bn: z.string().min(1, 'Bangla button text is required'),
  link: z.string().min(1, 'Button link is required')
});

const statSchema = z.object({
  number: z.string().min(1, 'Stat number is required'),
  label: localizedStringSchema,
  icon: z.string().min(1, 'Stat icon is required'),
  color: z.string().min(1, 'Stat color is required')
});

const emergencySchema = z.object({
  phone: z.string().min(1, 'Emergency phone number is required'),
  badge: localizedStringSchema,
  heading: localizedStringSchema,
  subheading: localizedStringSchema,
  description: localizedStringSchema,
  quickInfo: z.array(localizedStringSchema).default([])
});

const appointmentCTASchema = z.object({
  badge: localizedStringSchema,
  heading: localizedStringSchema,
  description: localizedStringSchema,
  primaryBtn: buttonSchema,
  secondaryBtn: buttonSchema,
  features: z.array(localizedStringSchema).default([])
});

const statisticsSchema = z.object({
  sectionBadge: localizedStringSchema,
  heading: localizedStringSchema,
  description: localizedStringSchema,
  stats: z.array(statSchema).default([])
});

// Full update schema (PUT)
export const putHomepageSchema = z.object({
  body: z.object({
    emergency: emergencySchema,
    appointmentCTA: appointmentCTASchema,
    statistics: statisticsSchema
  })
});

// Partial update schema (PATCH)
export const patchHomepageSchema = z.object({
  body: z.object({
    emergency: emergencySchema.partial().optional(),
    appointmentCTA: appointmentCTASchema.partial().optional(),
    statistics: statisticsSchema.partial().optional()
  })
});

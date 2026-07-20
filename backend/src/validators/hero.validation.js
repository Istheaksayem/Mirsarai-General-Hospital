import { z } from 'zod';

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  bn: z.string().min(1, 'Bangla text is required')
});

const slideButtonSchema = z.object({
  label: localizedStringSchema,
  link: z.string().min(1, 'Button link is required'),
  variant: z.string().min(1, 'Button variant style is required')
});

const slideSchema = z.object({
  id: z.number().optional(),
  slideNumber: z.string().min(1, 'Slide number display is required'),
  heading: localizedStringSchema,
  description: localizedStringSchema,
  image: z.string().min(1, 'Slide image URL is required'),
  buttons: z.array(slideButtonSchema).default([])
});

const appointmentBookingSchema = z.object({
  enabled: z.boolean().default(true),
  title: localizedStringSchema,
  departmentLabel: localizedStringSchema,
  doctorLabel: localizedStringSchema,
  buttonLabel: localizedStringSchema
});

const joinTeamSchema = z.object({
  enabled: z.boolean().default(true),
  question: localizedStringSchema,
  title: localizedStringSchema,
  buttonLabel: localizedStringSchema,
  buttonLink: z.string().min(1, 'Button link is required'),
  image: z.string().min(1, 'Join team image URL is required')
});

const shapeSchema = z.object({
  color: z.string().min(1, 'Shape color is required'),
  size: z.number().positive('Shape size must be positive'),
  position: z.record(z.string()).default({}), // e.g. { "top": "15%", "left": "8%" }
  opacity: z.number().min(0).max(1, 'Opacity must be between 0 and 1')
});

const decorativeShapesSchema = z.object({
  enabled: z.boolean().default(true),
  shapes: z.array(shapeSchema).default([])
});

// Full update schema (PUT)
export const putHeroSchema = z.object({
  body: z.object({
    slides: z.array(slideSchema),
    appointmentBooking: appointmentBookingSchema,
    joinTeam: joinTeamSchema,
    decorativeShapes: decorativeShapesSchema
  })
});

// Partial update schema (PATCH)
export const patchHeroSchema = z.object({
  body: z.object({
    slides: z.array(slideSchema).optional(),
    appointmentBooking: appointmentBookingSchema.partial().optional(),
    joinTeam: joinTeamSchema.partial().optional(),
    decorativeShapes: decorativeShapesSchema.partial().optional()
  })
});

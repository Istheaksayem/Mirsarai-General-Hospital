import { z } from 'zod';

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  bn: z.string().min(1, 'Bangla text is required')
});

const seoSchema = z.object({
  metaTitle: localizedStringSchema,
  metaDescription: localizedStringSchema,
  keywords: localizedStringSchema,
  ogImage: z.string().optional().default('')
});

const sectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  order: z.number().int()
});

const contactSchema = z.object({
  icon: z.string().min(1, 'Icon name is required'),
  title: localizedStringSchema,
  number: z.string().min(1, 'Phone number is required'),
  available: localizedStringSchema
});

const stepSchema = z.object({
  en: z.string().min(1, 'English step text is required'),
  bn: z.string().min(1, 'Bangla step text is required')
});

const firstAidItemSchema = z.object({
  icon: z.string().min(1, 'Icon name is required'),
  title: localizedStringSchema,
  steps: z.array(stepSchema).default([])
});

const tipSchema = z.object({
  icon: z.string().min(1, 'Icon name is required'),
  title: localizedStringSchema,
  description: localizedStringSchema
});

export const putEmergencyInfoSchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema,
      image: z.string().min(1, 'Hero image is required')
    }),
    emergencyContacts: z.object({
      title: localizedStringSchema,
      contacts: z.array(contactSchema).default([])
    }),
    firstAid: z.object({
      title: localizedStringSchema,
      items: z.array(firstAidItemSchema).default([])
    }),
    whenToCallEmergency: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema,
      situations: z.array(stepSchema).default([])
    }),
    emergencyPreparedness: z.object({
      title: localizedStringSchema,
      tips: z.array(tipSchema).default([])
    }),
    sections: z.object({
      hero: sectionConfigSchema,
      contacts: sectionConfigSchema,
      firstAid: sectionConfigSchema,
      situations: sectionConfigSchema,
      preparedness: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

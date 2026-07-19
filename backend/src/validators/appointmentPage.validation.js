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

const featureCardSchema = z.object({
  icon: z.string().min(1, 'Feature icon is required'),
  title: localizedStringSchema,
  description: localizedStringSchema
});

export const putAppointmentPageSchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema,
      image: z.string().min(1, 'Hero image is required')
    }),
    features: z.array(featureCardSchema).default([]),
    whyChooseUs: z.object({
      title: localizedStringSchema,
      items: z.array(localizedStringSchema).default([])
    }),
    emergencyBanner: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema,
      buttonText: localizedStringSchema,
      phone: z.string().min(1, 'Emergency phone is required')
    }),
    contactCard: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema,
      phone: z.string().min(1, 'Contact phone is required')
    }),
    formSection: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema
    }),
    disclaimer: localizedStringSchema,
    sections: z.object({
      hero: sectionConfigSchema,
      features: sectionConfigSchema,
      sidebar: sectionConfigSchema,
      form: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

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

const formFieldsSchema = z.object({
  name: z.object({
    label: localizedStringSchema,
    placeholder: localizedStringSchema
  }),
  phone: z.object({
    label: localizedStringSchema,
    placeholder: localizedStringSchema
  }),
  email: z.object({
    label: localizedStringSchema,
    placeholder: localizedStringSchema
  }),
  message: z.object({
    label: localizedStringSchema,
    placeholder: localizedStringSchema
  })
});

export const putContactPageSchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema,
      image: z.string().min(1, 'Hero image is required')
    }),
    contactInfo: z.object({
      title: localizedStringSchema,
      addressCard: z.object({
        label: localizedStringSchema,
        name: localizedStringSchema,
        location: localizedStringSchema
      }),
      hotlineCard: z.object({
        label: localizedStringSchema,
        number: z.string().min(1, 'Hotline number is required'),
        numberLabel: localizedStringSchema
      }),
      emailCard: z.object({
        label: localizedStringSchema,
        address: z.string().min(1, 'Email address is required')
      })
    }),
    form: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema,
      buttonText: localizedStringSchema,
      fields: formFieldsSchema
    }),
    sections: z.object({
      hero: sectionConfigSchema,
      contactInfo: sectionConfigSchema,
      form: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

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

const categorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  name: localizedStringSchema,
  icon: z.string().min(1, 'Icon name is required')
});

const faqItemSchema = z.object({
  id: z.number().int(),
  category: z.string().min(1, 'Category is required'),
  question: localizedStringSchema,
  answer: localizedStringSchema
});

const contactInfoSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address')
});

export const putFAQSchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema,
      image: z.string().min(1, 'Hero image is required')
    }),
    categories: z.array(categorySchema).default([]),
    faqs: z.array(faqItemSchema).default([]),
    contactInfo: contactInfoSchema,
    sections: z.object({
      hero: sectionConfigSchema,
      faqs: sectionConfigSchema,
      contact: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

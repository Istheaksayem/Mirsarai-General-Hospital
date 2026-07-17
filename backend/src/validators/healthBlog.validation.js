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
  name: localizedStringSchema
});

const postSchema = z.object({
  id: z.number().int(),
  category: z.string().min(1, 'Category is required'),
  title: localizedStringSchema,
  excerpt: localizedStringSchema,
  author: localizedStringSchema,
  date: z.string().min(1, 'Date is required'),
  readTime: localizedStringSchema,
  image: z.string().min(1, 'Image is required')
});

const tagSchema = z.object({
  en: z.string().min(1, 'English tag is required'),
  bn: z.string().min(1, 'Bangla tag is required')
});

export const putHealthBlogSchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema,
      image: z.string().min(1, 'Hero image is required')
    }),
    categories: z.array(categorySchema).default([]),
    posts: z.array(postSchema).default([]),
    tags: z.array(tagSchema).default([]),
    sections: z.object({
      hero: sectionConfigSchema,
      posts: sectionConfigSchema,
      tags: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

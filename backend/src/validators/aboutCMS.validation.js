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

// About Us Validation
const statSchema = z.object({
  title: localizedStringSchema,
  value: z.string().min(1, 'Stat value is required')
});

export const putAboutUsSchema = z.object({
  body: z.object({
    title: localizedStringSchema,
    subtitle: localizedStringSchema,
    description: localizedStringSchema,
    content: z.array(localizedStringSchema).default([]),
    statistics: z.array(statSchema).default([]),
    image: z.string().min(1, 'Image path/URL is required'),
    features: z.array(localizedStringSchema).default([]),
    sections: z.object({
      hero: sectionConfigSchema,
      story: sectionConfigSchema,
      features: sectionConfigSchema,
      statistics: sectionConfigSchema,
      cta: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

// Mission Vision Validation
const coreValueValSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema
});

export const putMissionVisionSchema = z.object({
  body: z.object({
    title: localizedStringSchema,
    mission: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema
    }),
    vision: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema
    }),
    coreValues: z.array(coreValueValSchema).default([]),
    image: z.string().min(1, 'Image path/URL is required'),
    sections: z.object({
      hero: sectionConfigSchema,
      missionVision: sectionConfigSchema,
      coreValues: sectionConfigSchema,
      commitment: sectionConfigSchema,
      whyItMatters: sectionConfigSchema,
      cta: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

// Gallery Validation
const galleryCategoryValSchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  title: localizedStringSchema,
  description: localizedStringSchema
});

const galleryImageValSchema = z.object({
  id: z.number().int(),
  category: z.string().min(1, 'Category ID is required'),
  src: z.string().min(1, 'Image source is required'),
  title: localizedStringSchema,
  description: localizedStringSchema
});

const galleryStatItemSchema = z.object({
  number: z.string().min(1, 'Number is required'),
  label: localizedStringSchema
});

export const putGallerySchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema
    }),
    categories: z.array(galleryCategoryValSchema).default([]),
    images: z.array(galleryImageValSchema).default([]),
    stats: z.object({
      title: localizedStringSchema,
      items: z.array(galleryStatItemSchema).default([])
    }),
    sections: z.object({
      hero: sectionConfigSchema,
      stats: sectionConfigSchema,
      categories: sectionConfigSchema,
      images: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

// Career Validation
const benefitValSchema = z.object({
  icon: z.string().min(1, 'Icon name is required'),
  title: localizedStringSchema,
  description: localizedStringSchema
});

const positionValSchema = z.object({
  id: z.number().int(),
  title: localizedStringSchema,
  department: localizedStringSchema,
  type: localizedStringSchema,
  experience: localizedStringSchema,
  description: localizedStringSchema
});

const stepValSchema = z.object({
  step: z.number().int(),
  title: localizedStringSchema,
  description: localizedStringSchema
});

export const putCareerSchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema,
      image: z.string().min(1, 'Image is required')
    }),
    whyJoinUs: z.object({
      title: localizedStringSchema,
      benefits: z.array(benefitValSchema).default([])
    }),
    openPositions: z.array(positionValSchema).default([]),
    applicationProcess: z.object({
      title: localizedStringSchema,
      steps: z.array(stepValSchema).default([])
    }),
    contact: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema,
      email: z.string().email('Invalid email address'),
      phone: z.string().min(1, 'Phone number is required')
    }),
    sections: z.object({
      hero: sectionConfigSchema,
      whyJoinUs: sectionConfigSchema,
      openPositions: sectionConfigSchema,
      applicationProcess: sectionConfigSchema,
      contact: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

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

const featureItemValSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  color: z.string().optional().default('from-blue-500 via-primary to-blue-900')
});

const featuresSectionValSchema = z.object({
  badge: localizedStringSchema,
  heading: localizedStringSchema,
  description: localizedStringSchema,
  items: z.array(featureItemValSchema).default([])
});

export const putAboutUsSchema = z.object({
  body: z.object({
    title: localizedStringSchema,
    subtitle: localizedStringSchema,
    storyHeading: localizedStringSchema,
    description: localizedStringSchema,
    content: z.array(localizedStringSchema).default([]),
    statistics: z.array(statSchema).default([]),
    image: z.string().min(1, 'Image path/URL is required'),
    features: z.array(localizedStringSchema).default([]),
    featuresSection: featuresSectionValSchema.optional(),
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

const whyItMattersItemValSchema = z.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  color: z.string().optional().default('from-red-500 to-pink-600')
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
    commitmentHeading: localizedStringSchema.optional(),
    commitmentDescription: localizedStringSchema.optional(),
    whyItMattersHeading: localizedStringSchema.optional(),
    whyItMattersDescription: localizedStringSchema.optional(),
    whyItMattersItems: z.array(whyItMattersItemValSchema).optional().default([]),
    ctaHeading: localizedStringSchema.optional(),
    ctaDescription: localizedStringSchema.optional(),
    ctaPrimaryButtonText: localizedStringSchema.optional(),
    ctaSecondaryButtonText: localizedStringSchema.optional(),
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
      description: localizedStringSchema,
      image: z.string().optional()
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
const jobListingValSchema = z.object({
  id: z.number().int(),
  title: localizedStringSchema,
  department: localizedStringSchema,
  location: localizedStringSchema,
  jobType: localizedStringSchema,
  description: localizedStringSchema,
  requirements: localizedStringSchema,
  applyLink: z.string().min(1, 'Apply link is required'),
  bannerImage: z.string().min(1, 'Banner image is required'),
  isActive: z.boolean().default(true)
});

export const putCareerSchema = z.object({
  body: z.object({
    title: localizedStringSchema,
    description: localizedStringSchema,
    image: z.string().min(1, 'Hero image is required'),
    jobListings: z.array(jobListingValSchema).default([]),
    sections: z.object({
      hero: sectionConfigSchema,
      jobListings: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

// Our Team Validation
const qualificationValSchema = z.object({
  title: localizedStringSchema,
  institution: localizedStringSchema,
  year: z.string().optional().default('')
});

const experienceValSchema = z.object({
  title: localizedStringSchema,
  institution: localizedStringSchema,
  period: z.string().optional().default(''),
  description: localizedStringSchema.optional().default({ en: '', bn: '' })
});

const socialLinkValSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().min(1, 'URL is required')
});

const teamMemberValSchema = z.object({
  name: localizedStringSchema,
  designation: localizedStringSchema,
  department: localizedStringSchema,
  bio: localizedStringSchema,
  image: z.string().optional().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  order: z.number().int().optional().default(0),
  slug: z.string().optional().default(''),
  qualifications: z.array(qualificationValSchema).optional().default([]),
  experience: z.array(experienceValSchema).optional().default([]),
  specialties: z.array(localizedStringSchema).optional().default([]),
  socialLinks: z.array(socialLinkValSchema).optional().default([])
});

export const putOurTeamSchema = z.object({
  body: z.object({
    hero: z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      description: localizedStringSchema,
      image: z.string().optional().default('')
    }),
    sectionTitle: localizedStringSchema,
    sectionDescription: localizedStringSchema,
    members: z.array(teamMemberValSchema).default([]),
    sections: z.object({
      hero: sectionConfigSchema,
      members: sectionConfigSchema,
      cta: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

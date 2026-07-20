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

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  icon: z.string().min(1, 'Icon name is required'),
  url: z.string().min(1, 'URL is required'),
  hoverColor: z.string().min(1, 'Hover color is required')
});

const linkSchema = z.object({
  label: localizedStringSchema,
  href: z.string().min(1, 'Link URL is required')
});

const departmentItemSchema = z.object({
  name: localizedStringSchema,
  href: z.string().default('/departments')
});

const contactBlockSchema = z.object({
  icon: z.string().default('FaMapMarkerAlt'),
  hospitalName: localizedStringSchema,
  location: localizedStringSchema
});

const phoneBlockSchema = z.object({
  icon: z.string().default('FaPhoneAlt'),
  number: z.string().min(1, 'Phone number is required')
});

const emailBlockSchema = z.object({
  icon: z.string().default('FaEnvelope'),
  address: z.string().min(1, 'Email address is required')
});

const emergencyCardSchema = z.object({
  icon: z.string().default('FaHeartbeat'),
  label: localizedStringSchema,
  phoneNumber: z.string().min(1, 'Emergency phone number is required'),
  gradient: z.string().default('from-[#76BC21] to-green-600'),
  badgeGradient: z.string().default('from-white/10 to-white/5'),
  blobColor: z.string().default('bg-[#76BC21]/20'),
  iconGradient: z.string().default('from-[#76BC21] to-green-600')
});

const bottomBarLinkSchema = z.object({
  label: localizedStringSchema,
  href: z.string().default('/privacy')
});

const bottomBarSchema = z.object({
  hospitalName: localizedStringSchema,
  rightsText: localizedStringSchema,
  privacyPolicy: bottomBarLinkSchema,
  termsOfService: bottomBarLinkSchema
});

export const putFooterSchema = z.object({
  body: z.object({
    brand: z.object({
      logo: z.string().min(1, 'Logo URL is required'),
      description: localizedStringSchema,
      socialLinks: z.array(socialLinkSchema).min(0)
    }),
    exploreLinks: z.object({
      title: localizedStringSchema,
      links: z.array(linkSchema).min(1, 'At least one explore link is required')
    }),
    departments: z.object({
      title: localizedStringSchema,
      items: z.array(departmentItemSchema).min(1, 'At least one department is required')
    }),
    contactInfo: z.object({
      title: localizedStringSchema,
      address: contactBlockSchema,
      phone: phoneBlockSchema,
      email: emailBlockSchema
    }),
    emergencyCard: emergencyCardSchema,
    bottomBar: bottomBarSchema,
    sections: z.object({
      brand: sectionConfigSchema,
      exploreLinks: sectionConfigSchema,
      departments: sectionConfigSchema,
      contactInfo: sectionConfigSchema,
      emergencyCard: sectionConfigSchema,
      bottomBar: sectionConfigSchema
    }).optional(),
    seo: seoSchema.optional()
  })
});

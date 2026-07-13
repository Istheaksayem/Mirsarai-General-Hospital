import { StatusCodes } from 'http-status-codes';
import NicuBabyCare from '../models/nicuBabyCare.model.js';
import ApiError from '../utils/ApiError.js';

const projectBilingual = (page, lang = 'en') => {
  if (!page) return null;
  const L = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
  };

  return {
    type: page.type,
    title: L(page.title),
    subtitle: L(page.subtitle),
    heroDescription: L(page.heroDescription),
    backgroundImage: page.backgroundImage || '',
    description: L(page.description),
    features: (page.features || []).map((f) => ({
      title: L(f.title),
      description: L(f.description),
      icon: f.icon || ''
    })),
    services: (page.services || []).map((s) => ({
      category: L(s.category),
      icon: s.icon || '',
      accent: s.accent || '#f59e0b',
      items: (s.items || []).map((i) => L(i))
    })),
    equipment: (page.equipment || []).map((e) => L(e)),
    guidelines: (page.guidelines || []).map((g) => L(g)),
    workingHours: page.workingHours
      ? {
          weekdays: page.workingHours.weekdays || '',
          emergency: L(page.workingHours.emergency)
        }
      : undefined,
    vaccinationSchedule: (page.vaccinationSchedule || []).map((v) => ({
      age: L(v.age),
      vaccines: v.vaccines || []
    })),
    statistics: (page.statistics || []).map((s) => ({
      value: s.value,
      label: L(s.label)
    })),
    seo: page.seo
      ? {
          metaTitle: L(page.seo.metaTitle),
          metaDescription: L(page.seo.metaDescription)
        }
      : undefined
  };
};

export const getPublicNicuBabyCare = async (lang = 'en') => {
  const page = await NicuBabyCare.findOne({ type: 'nicu' }).lean();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'NICU & Baby Care page not found');
  }
  return projectBilingual(page, lang);
};

export const getAdminNicuBabyCare = async () => {
  const page = await NicuBabyCare.findOne({ type: 'nicu' });
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'NICU & Baby Care page not found');
  }
  return page;
};

export const updateNicuBabyCare = async (data, userId) => {
  let page = await NicuBabyCare.findOne({ type: 'nicu' });

  if (!page) {
    page = new NicuBabyCare({ type: 'nicu', ...data });
    if (userId) page.createdBy = userId;
  } else {
    page.set(data);
  }

  if (userId) page.updatedBy = userId;
  await page.save();
  return page;
};

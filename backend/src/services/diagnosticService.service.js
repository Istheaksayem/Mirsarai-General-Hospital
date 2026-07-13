import { StatusCodes } from 'http-status-codes';
import DiagnosticService from '../models/diagnosticService.model.js';
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
      accent: s.accent || '#1E2B7A',
      tests: (s.tests || []).map((t) => L(t))
    })),
    workingHours: page.workingHours
      ? {
          weekdays: page.workingHours.weekdays || '',
          weekends: page.workingHours.weekends || '',
          emergency: L(page.workingHours.emergency)
        }
      : undefined,
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

export const getPublicDiagnosticService = async (lang = 'en') => {
  const page = await DiagnosticService.findOne({ type: 'diagnostic-services' }).lean();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Diagnostic service page not found');
  }
  return projectBilingual(page, lang);
};

export const getAdminDiagnosticService = async () => {
  const page = await DiagnosticService.findOne({ type: 'diagnostic-services' });
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Diagnostic service page not found');
  }
  return page;
};

export const updateDiagnosticService = async (data, userId) => {
  let page = await DiagnosticService.findOne({ type: 'diagnostic-services' });

  if (!page) {
    page = new DiagnosticService({ type: 'diagnostic-services', ...data });
    if (userId) page.createdBy = userId;
  } else {
    page.set(data);
  }

  if (userId) page.updatedBy = userId;
  await page.save();
  return page;
};

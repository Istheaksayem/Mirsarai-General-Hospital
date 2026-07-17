import DepartmentsPage from '../models/departmentsPage.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

// ── Helpers ───────────────────────────────────────────────────────────────────
const L = (field, lang) => {
  if (!field) return '';
  return field[lang] || field.en || '';
};

const projectBilingual = (page, lang) => {
  if (!page) return null;
  return {
    title: L(page.title, lang),
    subtitle: L(page.subtitle, lang),
    hospitalStats: page.hospitalStats || { patientsCount: '15K+', yearsOfService: '10+' },
    features: (page.features || [])
      .filter(f => f.isVisible)
      .map(f => ({
        icon: f.icon,
        title: L(f.title, lang),
        description: L(f.description, lang),
        color: f.color,
        bg: f.bg
      })),
    testimonials: (page.testimonials || [])
      .filter(t => t.isVisible)
      .map(t => ({
        name: t.name,
        department: t.department,
        rating: t.rating,
        text: L(t.text, lang),
        avatar: t.avatar,
        color: t.color
      })),
    cta: {
      title: L(page.cta?.title, lang),
      description: L(page.cta?.description, lang),
      primaryBtn: {
        label: L(page.cta?.primaryBtn?.label, lang),
        link: page.cta?.primaryBtn?.link || '#'
      },
      secondaryBtn: {
        label: L(page.cta?.secondaryBtn?.label, lang),
        link: page.cta?.secondaryBtn?.link || '#'
      }
    },
    seo: {
      metaTitle: L(page.seo?.metaTitle, lang),
      metaDescription: L(page.seo?.metaDescription, lang)
    }
  };
};

// ── Public ────────────────────────────────────────────────────────────────────
export const getPublicDepartmentsPageConfig = async (lang = 'en') => {
  const page = await DepartmentsPage.findOne().lean();
  if (!page) {
    // Return empty default structure rather than throwing an error to prevent breaking frontends
    return {
      title: 'Our Departments',
      subtitle: 'DEPARTMENTS',
      hospitalStats: { patientsCount: '15K+', yearsOfService: '10+' },
      features: [],
      testimonials: [],
      cta: {
        title: 'Need Medical Assistance?',
        description: 'Our specialists are ready to help. Book an appointment today and get the care you deserve.',
        primaryBtn: { label: 'Book Appointment', link: '/appointment' },
        secondaryBtn: { label: 'View Our Doctors', link: '/doctors' }
      },
      seo: { metaTitle: 'Departments', metaDescription: '' }
    };
  }
  return projectBilingual(page, lang);
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminDepartmentsPageConfig = async () => {
  let page = await DepartmentsPage.findOne().select('-__v').lean();
  if (!page) {
    // Automatically seed an empty layout document if none exists
    page = await DepartmentsPage.create({
      title: { en: 'Our Departments', bn: 'আমাদের বিভাগসমূহ' },
      subtitle: { en: 'DEPARTMENTS', bn: 'বিভাগসমূহ' },
      hospitalStats: { patientsCount: '15K+', yearsOfService: '10+' },
      features: [],
      testimonials: [],
      cta: {
        title: { en: 'Need Medical Assistance?', bn: 'চিকিৎসা সহায়তা প্রয়োজন?' },
        description: { en: 'Our specialists are ready to help.', bn: 'আমাদের বিশেষজ্ঞরা সাহায্য করতে প্রস্তুত।' },
        primaryBtn: { label: { en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' }, link: '/appointment' },
        secondaryBtn: { label: { en: 'View Our Doctors', bn: 'আমাদের ডাক্তারদের দেখুন' }, link: '/doctors' }
      },
      seo: {
        metaTitle: { en: 'Our Departments', bn: 'আমাদের বিভাগসমূহ' },
        metaDescription: { en: 'Hospital departments page', bn: 'হাসপাতালের বিভাগসমূহ' }
      }
    });
  }
  return page;
};

export const updateDepartmentsPageConfig = async (data, userId) => {
  let page = await DepartmentsPage.findOne();
  if (!page) {
    page = new DepartmentsPage(data);
    page.createdBy = userId;
  } else {
    page.set(data);
  }
  page.updatedBy = userId;
  await page.save();
  return page;
};

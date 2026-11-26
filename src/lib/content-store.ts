// Server-side persistent storage manager for Site Content and Inquiries
import fs from 'fs';
import path from 'path';
import { DEFAULT_CONTENT, SiteContent } from '@/data/default-content';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

export interface InquiryRecord {
  id: string;
  name: string;
  phone: string;
  goal: string;
  date: string;
  time: string;
  status: 'new' | 'contacted' | 'completed' | 'archived';
  createdAt: string;
  notes?: string;
}

// In-memory fallback if filesystem is read-only (e.g. serverless)
let memoryContentFallback: SiteContent | null = null;
let memoryInquiriesFallback: InquiryRecord[] = [];

async function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('[content-store] Could not create data directory, using memory fallback:', err);
  }
}

// Deep clean string to strip dangerous HTML tags/scripts (XSS protection)
function sanitizeText(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const fileData = await fs.promises.readFile(CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      // Merge with default content to ensure schema completeness
      return {
        general: { ...DEFAULT_CONTENT.general, ...(parsed.general || {}) },
        hero: {
          ...DEFAULT_CONTENT.hero,
          ...(parsed.hero || {}),
          stats: Array.isArray(parsed.hero?.stats) && parsed.hero.stats.length > 0
            ? parsed.hero.stats
            : DEFAULT_CONTENT.hero.stats,
        },
        about: {
          ...DEFAULT_CONTENT.about,
          ...(parsed.about || {}),
          pillars: Array.isArray(parsed.about?.pillars) && parsed.about.pillars.length > 0
            ? parsed.about.pillars
            : DEFAULT_CONTENT.about.pillars,
        },
        facilities: Array.isArray(parsed.facilities) && parsed.facilities.length > 0
          ? parsed.facilities
          : DEFAULT_CONTENT.facilities,
        transformations: Array.isArray(parsed.transformations) && parsed.transformations.length > 0
          ? parsed.transformations
          : DEFAULT_CONTENT.transformations,
        trainer: {
          ...DEFAULT_CONTENT.trainer,
          ...(parsed.trainer || {}),
          specialties: Array.isArray(parsed.trainer?.specialties)
            ? parsed.trainer.specialties
            : DEFAULT_CONTENT.trainer.specialties,
          photos: Array.isArray(parsed.trainer?.photos) && parsed.trainer.photos.length > 0
            ? parsed.trainer.photos
            : DEFAULT_CONTENT.trainer.photos,
        },
        pricing: Array.isArray(parsed.pricing) && parsed.pricing.length > 0
          ? parsed.pricing
          : DEFAULT_CONTENT.pricing,
      };
    }
  } catch (err) {
    console.warn('[content-store] Error reading site-content.json, using fallback:', err);
  }

  if (memoryContentFallback) {
    return memoryContentFallback;
  }

  return DEFAULT_CONTENT;
}

export async function saveSiteContent(newContent: SiteContent): Promise<SiteContent> {
  // Validate and sanitize content structure
  const sanitized: SiteContent = {
    general: {
      gymName: sanitizeText(newContent.general?.gymName) || DEFAULT_CONTENT.general.gymName,
      tagline: sanitizeText(newContent.general?.tagline) || DEFAULT_CONTENT.general.tagline,
      badgeText: sanitizeText(newContent.general?.badgeText) || DEFAULT_CONTENT.general.badgeText,
      phone: sanitizeText(newContent.general?.phone) || DEFAULT_CONTENT.general.phone,
      whatsapp: sanitizeText(newContent.general?.whatsapp) || DEFAULT_CONTENT.general.whatsapp,
      email: sanitizeText(newContent.general?.email) || '',
      instagram: sanitizeText(newContent.general?.instagram) || DEFAULT_CONTENT.general.instagram,
      address: sanitizeText(newContent.general?.address) || DEFAULT_CONTENT.general.address,
      mapsUrl: sanitizeText(newContent.general?.mapsUrl) || DEFAULT_CONTENT.general.mapsUrl,
      morningHours: sanitizeText(newContent.general?.morningHours) || DEFAULT_CONTENT.general.morningHours,
      eveningHours: sanitizeText(newContent.general?.eveningHours) || DEFAULT_CONTENT.general.eveningHours,
      sundayHours: sanitizeText(newContent.general?.sundayHours) || DEFAULT_CONTENT.general.sundayHours,
    },
    hero: {
      liveStatusText: sanitizeText(newContent.hero?.liveStatusText) || DEFAULT_CONTENT.hero.liveStatusText,
      headlinePart1: sanitizeText(newContent.hero?.headlinePart1) || DEFAULT_CONTENT.hero.headlinePart1,
      headlineHighlight: sanitizeText(newContent.hero?.headlineHighlight) || DEFAULT_CONTENT.hero.headlineHighlight,
      headlinePart2: sanitizeText(newContent.hero?.headlinePart2) || DEFAULT_CONTENT.hero.headlinePart2,
      subtitle: sanitizeText(newContent.hero?.subtitle) || DEFAULT_CONTENT.hero.subtitle,
      stats: (newContent.hero?.stats || DEFAULT_CONTENT.hero.stats).map((st) => ({
        value: sanitizeText(st.value),
        label: sanitizeText(st.label),
        highlight: Boolean(st.highlight),
      })),
    },
    about: {
      eyebrow: sanitizeText(newContent.about?.eyebrow) || DEFAULT_CONTENT.about.eyebrow,
      heading: sanitizeText(newContent.about?.heading) || DEFAULT_CONTENT.about.heading,
      description: sanitizeText(newContent.about?.description) || DEFAULT_CONTENT.about.description,
      pillars: (newContent.about?.pillars || DEFAULT_CONTENT.about.pillars).map((p, idx) => ({
        id: p.id || `pillar-${idx + 1}`,
        number: sanitizeText(p.number) || `0${idx + 1}`,
        title: sanitizeText(p.title),
        desc: sanitizeText(p.desc),
      })),
    },
    facilities: (newContent.facilities || DEFAULT_CONTENT.facilities).map((fac, idx) => ({
      id: fac.id || `facility-${idx + 1}`,
      src: sanitizeText(fac.src) || '/facility/gym-floor-wide.webp',
      title: sanitizeText(fac.title),
      tag: sanitizeText(fac.tag),
      specs: sanitizeText(fac.specs),
      desc: sanitizeText(fac.desc),
    })),
    transformations: (newContent.transformations || DEFAULT_CONTENT.transformations).map((tr, idx) => ({
      id: tr.id || `transformation-${idx + 1}`,
      src: sanitizeText(tr.src) || '/transformations/transformation-1-male-fatloss.webp',
      title: sanitizeText(tr.title),
      badge: sanitizeText(tr.badge),
      story: sanitizeText(tr.story),
      achievements: Array.isArray(tr.achievements)
        ? tr.achievements.map(sanitizeText).filter(Boolean)
        : [],
    })),
    trainer: {
      name: sanitizeText(newContent.trainer?.name) || DEFAULT_CONTENT.trainer.name,
      title: sanitizeText(newContent.trainer?.title) || DEFAULT_CONTENT.trainer.title,
      experience: sanitizeText(newContent.trainer?.experience) || DEFAULT_CONTENT.trainer.experience,
      bio: sanitizeText(newContent.trainer?.bio) || DEFAULT_CONTENT.trainer.bio,
      specialties: Array.isArray(newContent.trainer?.specialties)
        ? newContent.trainer.specialties.map(sanitizeText).filter(Boolean)
        : DEFAULT_CONTENT.trainer.specialties,
      instagramHandle: sanitizeText(newContent.trainer?.instagramHandle) || DEFAULT_CONTENT.trainer.instagramHandle,
      photos: (newContent.trainer?.photos || DEFAULT_CONTENT.trainer.photos).map((tp, idx) => ({
        id: tp.id || `trainer-photo-${idx + 1}`,
        src: sanitizeText(tp.src) || '/trainers/coach-riyaz-conditioning.webp',
        title: sanitizeText(tp.title),
        tag: sanitizeText(tp.tag),
        desc: sanitizeText(tp.desc),
      })),
    },
    pricing: (newContent.pricing || DEFAULT_CONTENT.pricing).map((pl, idx) => ({
      id: pl.id || `plan-${idx + 1}`,
      name: sanitizeText(pl.name),
      price: sanitizeText(pl.price),
      duration: sanitizeText(pl.duration),
      perMonth: sanitizeText(pl.perMonth),
      badge: pl.badge ? sanitizeText(pl.badge) : null,
      highlight: Boolean(pl.highlight),
      description: sanitizeText(pl.description),
      features: Array.isArray(pl.features)
        ? pl.features.map(sanitizeText).filter(Boolean)
        : [],
    })),
  };

  memoryContentFallback = sanitized;

  try {
    await ensureDataDir();
    await fs.promises.writeFile(CONTENT_FILE, JSON.stringify(sanitized, null, 2), 'utf-8');
  } catch (err) {
    console.error('[content-store] Failed to write site-content.json, saved to memory:', err);
  }

  return sanitized;
}

export async function resetSiteContentToDefaults(): Promise<SiteContent> {
  memoryContentFallback = DEFAULT_CONTENT;
  try {
    await ensureDataDir();
    if (fs.existsSync(CONTENT_FILE)) {
      await fs.promises.unlink(CONTENT_FILE);
    }
  } catch (err) {
    console.warn('[content-store] Could not remove site-content.json:', err);
  }
  return DEFAULT_CONTENT;
}

// Inquiries persistence
export async function getInquiries(): Promise<InquiryRecord[]> {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const fileData = await fs.promises.readFile(INQUIRIES_FILE, 'utf-8');
      const list = JSON.parse(fileData);
      if (Array.isArray(list)) return list;
    }
  } catch (err) {
    console.warn('[content-store] Error reading inquiries.json:', err);
  }
  return memoryInquiriesFallback;
}

export async function addInquiry(data: {
  name: string;
  phone: string;
  goal: string;
  date: string;
  time: string;
}): Promise<InquiryRecord> {
  const current = await getInquiries();
  const newRecord: InquiryRecord = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: sanitizeText(data.name),
    phone: sanitizeText(data.phone),
    goal: sanitizeText(data.goal),
    date: sanitizeText(data.date),
    time: sanitizeText(data.time),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...current].slice(0, 100); // keep up to 100 recent
  memoryInquiriesFallback = updated;

  try {
    await ensureDataDir();
    await fs.promises.writeFile(INQUIRIES_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('[content-store] Failed to write inquiries.json:', err);
  }

  return newRecord;
}

export async function updateInquiryStatus(id: string, status: InquiryRecord['status']): Promise<boolean> {
  const current = await getInquiries();
  const record = current.find((r) => r.id === id);
  if (!record) return false;

  record.status = status;
  memoryInquiriesFallback = current;

  try {
    await ensureDataDir();
    await fs.promises.writeFile(INQUIRIES_FILE, JSON.stringify(current, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[content-store] Failed to update inquiry status:', err);
    return false;
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const current = await getInquiries();
  const filtered = current.filter((r) => r.id !== id);
  memoryInquiriesFallback = filtered;

  try {
    await ensureDataDir();
    await fs.promises.writeFile(INQUIRIES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[content-store] Failed to delete inquiry:', err);
    return false;
  }
}

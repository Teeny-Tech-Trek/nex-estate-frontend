import api from '@/config/apiConfig';
import type { Property, PropertyMutationPayload } from '@/types/property';
import { toCdnUrl } from '@/lib/cdn';

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

type UploadProgressCallback = (progress: number) => void;

const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeProperty = (raw: Partial<Property>): Property => {
  return {
    _id: String(raw._id || ''),
    title: String(raw.title || ''),
    price: toNumber(raw.price),
    location: String(raw.location || ''),
    address: String(raw.address || ''),
    bedrooms: toNumber(raw.bedrooms),
    bathrooms: toNumber(raw.bathrooms),
    area: toNumber(raw.area),
    areaUnit: String(raw.areaUnit || 'sq ft'),
    status: (raw.status as Property['status']) || 'draft',
    type: (raw.type as Property['type']) || 'single_family',
    yearBuilt: toNumber(raw.yearBuilt),
    images: Array.isArray(raw.images) ? raw.images.filter(Boolean).map((url) => toCdnUrl(String(url)) || String(url)) : [],
    imageVariants: Array.isArray(raw.imageVariants)
      ? raw.imageVariants
          .filter((variant) => variant?.medium || variant?.thumb || variant?.full)
          .map((variant) => ({
            id: variant.id,
            thumb: toCdnUrl(String(variant.thumb || variant.medium || variant.full || '')) || String(variant.thumb || variant.medium || variant.full || ''),
            medium: toCdnUrl(String(variant.medium || variant.full || variant.thumb || '')) || String(variant.medium || variant.full || variant.thumb || ''),
            full: toCdnUrl(String(variant.full || variant.medium || variant.thumb || '')) || String(variant.full || variant.medium || variant.thumb || ''),
            originalName: variant.originalName,
          }))
      : [],
    description: String(raw.description || ''),
    leads: toNumber(raw.leads),
    views: toNumber(raw.views),
    conversions: toNumber(raw.conversions),
    favorite: Boolean(raw.favorite),
    createdAt: String(raw.createdAt || new Date().toISOString()),
    analytics: {
      riskScore: toNumber(raw.analytics?.riskScore),
      investmentPotential: toNumber(raw.analytics?.investmentPotential),
      rentalYield: toNumber(raw.analytics?.rentalYield),
      appreciation: toNumber(raw.analytics?.appreciation),
      demandScore: toNumber(raw.analytics?.demandScore),
      marketValue: toNumber(raw.analytics?.marketValue),
      pricePerSqFt: toNumber(raw.analytics?.pricePerSqFt),
    },
    hazards: Array.isArray(raw.hazards) ? raw.hazards : [],
    amenities: {
      transit: Array.isArray(raw.amenities?.transit) ? raw.amenities.transit : [],
      education: Array.isArray(raw.amenities?.education) ? raw.amenities.education : [],
      shopping: Array.isArray(raw.amenities?.shopping) ? raw.amenities.shopping : [],
      parks: Array.isArray(raw.amenities?.parks) ? raw.amenities.parks : [],
      healthcare: Array.isArray(raw.amenities?.healthcare) ? raw.amenities.healthcare : [],
      other: Array.isArray(raw.amenities?.other) ? raw.amenities.other : [],
    },
    createdBy: raw.createdBy,
    organization: raw.organization ?? null,
  };
};

const appendPropertyFormData = (
  payload: PropertyMutationPayload,
  files: File[],
  deletedImages: string[] = []
) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(payload));
  if (deletedImages.length > 0) {
    formData.append('deletedImages', JSON.stringify(deletedImages));
  }
  files.forEach((file) => formData.append('images', file));
  return formData;
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosErr = error as any;
  if (axiosErr?.mapped?.message) {
    return axiosErr.mapped.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
      'string'
  ) {
    return (error as { response?: { data?: { message?: string } } }).response!.data!.message!;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const getProperties = async (): Promise<Property[]> => {
  const res = await api.get<ApiEnvelope<Property[]>>('/properties/list');
  const data = Array.isArray(res.data?.data) ? res.data.data : [];
  return data.map(normalizeProperty);
};

export const createProperty = async (
  payload: PropertyMutationPayload,
  files: File[],
  onProgress?: UploadProgressCallback
): Promise<Property> => {
  const formData = appendPropertyFormData(payload, files);
  try {
    const res = await api.post<ApiEnvelope<Property>>('/properties/create', formData, {
      timeout: 120000,
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        onProgress(Math.min(Math.round((event.loaded / event.total) * 100), 100));
      },
    });
    if (!res.data?.data) throw new Error(res.data?.message || 'Failed to create property');
    return normalizeProperty(res.data.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to create property'));
  }
};

export const updateProperty = async (
  id: string,
  payload: PropertyMutationPayload,
  files: File[],
  deletedImages: string[],
  onProgress?: UploadProgressCallback
): Promise<Property> => {
  const formData = appendPropertyFormData(payload, files, deletedImages);
  try {
    const res = await api.put<ApiEnvelope<Property>>(`/properties/update/${id}`, formData, {
      timeout: 120000,
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        onProgress(Math.min(Math.round((event.loaded / event.total) * 100), 100));
      },
    });
    if (!res.data?.data) throw new Error(res.data?.message || 'Failed to update property');
    return normalizeProperty(res.data.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to update property'));
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    const res = await api.delete<ApiEnvelope<null>>(`/properties/${id}`);
    if (!res.data?.success) throw new Error(res.data?.message || 'Failed to delete property');
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to delete property'));
  }
};

export const togglePropertyFavorite = async (id: string): Promise<Property> => {
  try {
    const res = await api.patch<ApiEnvelope<Property>>(`/properties/${id}/toggle-favorite`);
    if (!res.data?.data) throw new Error(res.data?.message || 'Failed to toggle favorite');
    return normalizeProperty(res.data.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to toggle favorite'));
  }
};

export const propertyService = {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyFavorite,
};

export default propertyService;

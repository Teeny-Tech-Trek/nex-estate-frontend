import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Property, PropertyMutationPayload } from '@/types/property';
import propertyService from '@/services/property.service';
import { getFriendlyErrorMessage } from '../lib/errorMapper';

type ModalMode = 'add' | 'edit';
type ViewMode = 'grid' | 'analytics';

const toMutationPayload = (property: Property): PropertyMutationPayload => ({
  title: property.title || '',
  price: Number(property.price) || 0,
  location: property.location || '',
  address: property.address || '',
  bedrooms: Number(property.bedrooms) || 0,
  bathrooms: Number(property.bathrooms) || 0,
  area: Number(property.area) || 0,
  areaUnit: property.areaUnit || 'sq ft',
  status: property.status || 'draft',
  type: property.type || 'single_family',
  yearBuilt: Number(property.yearBuilt) || new Date().getFullYear(),
  images: Array.isArray(property.images) ? property.images : [],
  description: property.description || '',
  leads: Number(property.leads) || 0,
  views: Number(property.views) || 0,
  favorite: Boolean(property.favorite),
  analytics: {
    riskScore: Number(property.analytics?.riskScore) || 0,
    investmentPotential: Number(property.analytics?.investmentPotential) || 0,
    rentalYield: Number(property.analytics?.rentalYield) || 0,
    appreciation: Number(property.analytics?.appreciation) || 0,
    demandScore: Number(property.analytics?.demandScore) || 0,
    marketValue: Number(property.analytics?.marketValue) || 0,
    pricePerSqFt: Number(property.analytics?.pricePerSqFt) || 0,
  },
  hazards: Array.isArray(property.hazards) ? property.hazards : [],
  amenities: {
    transit: property.amenities?.transit || [],
    education: property.amenities?.education || [],
    shopping: property.amenities?.shopping || [],
    parks: property.amenities?.parks || [],
    healthcare: property.amenities?.healthcare || [],
    other: property.amenities?.other || [],
  },
});

export const usePropertiesLogic = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [isViewPropertyOpen, setIsViewPropertyOpen] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await propertyService.getProperties();
      setProperties(data);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to load properties'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProperties();
  }, [fetchProperties]);

  const toggleFavorite = useCallback(async (id: string) => {
    const previous = properties;
    setProperties((current) =>
      current.map((item) =>
        item._id === id ? { ...item, favorite: !item.favorite } : item
      )
    );

    try {
      const updated = await propertyService.togglePropertyFavorite(id);
      setProperties((current) =>
        current.map((item) => (item._id === id ? updated : item))
      );
    } catch (err) {
      setProperties(previous);
      setError(getFriendlyErrorMessage(err, 'Failed to update favorite'));
    }
  }, [properties]);

  const handleViewProperty = useCallback((property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setIsViewPropertyOpen(true);
  }, []);

  const openAddModal = useCallback(() => {
    setSelectedProperty(null);
    setModalMode('add');
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((property: Property) => {
    setSelectedProperty(property);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleSaveProperty = useCallback(
    async (propertyData: Property, files: File[], deletedImages: string[]) => {
      if (submitLockRef.current) return;
      try {
        submitLockRef.current = true;
        setIsSaving(true);
        setUploadProgress(0);
        setError(null);
        const payload = toMutationPayload(propertyData);

        if (modalMode === 'add') {
          const created = await propertyService.createProperty(payload, files, setUploadProgress);
          setProperties((current) => [created, ...current]);
        } else if (selectedProperty?._id) {
          const updated = await propertyService.updateProperty(
            selectedProperty._id,
            payload,
            files,
            deletedImages || [],
            setUploadProgress
          );
          setProperties((current) =>
            current.map((item) => (item._id === updated._id ? updated : item))
          );
          setSelectedProperty(updated);
        }

        setIsModalOpen(false);
      } catch (err) {
        setError(getFriendlyErrorMessage(err, 'Failed to save property'));
      } finally {
        setIsSaving(false);
        setUploadProgress(0);
        submitLockRef.current = false;
      }
    },
    [modalMode, selectedProperty]
  );

  const handleDeleteProperty = useCallback(async (id: string) => {
    const confirmed = window.confirm('Delete this property? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setError(null);
      await propertyService.deleteProperty(id);
      setProperties((current) => current.filter((item) => item._id !== id));
      if (selectedProperty?._id === id) {
        setSelectedProperty(null);
        setIsViewPropertyOpen(false);
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to delete property'));
    }
  }, [selectedProperty]);

  const nextImage = useCallback(() => {
    const imageCount =
      selectedProperty?.imageVariants?.length || selectedProperty?.images?.length || 0;
    if (!imageCount) return;
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  }, [selectedProperty]);

  const prevImage = useCallback(() => {
    const imageCount =
      selectedProperty?.imageVariants?.length || selectedProperty?.images?.length || 0;
    if (!imageCount) return;
    setCurrentImageIndex((prev) =>
      (prev - 1 + imageCount) % imageCount
    );
  }, [selectedProperty]);

  const stats = useMemo(() => {
    const total = properties.length;
    const available = properties.filter((p) => p.status === 'available').length;
    const sold = properties.filter((p) => p.status === 'sold').length;
    const totalLeads = properties.reduce((sum, p) => sum + (p.leads || 0), 0);
    const averageRisk =
      total > 0
        ? Math.round(
            properties.reduce((sum, p) => sum + (p.analytics?.riskScore || 0), 0) / total
          )
        : 0;
    return { total, available, sold, totalLeads, averageRisk };
  }, [properties]);

  return {
    properties,
    setProperties,
    selectedProperty,
    isModalOpen,
    modalMode,
    isViewPropertyOpen,
    view,
    currentImageIndex,
    isLoading,
    isSaving,
    uploadProgress,
    error,
    stats,
    setIsViewPropertyOpen,
    setView,
    setCurrentImageIndex,
    setIsModalOpen,
    toggleFavorite,
    handleViewProperty,
    openAddModal,
    openEditModal,
    handleSaveProperty,
    handleDeleteProperty,
    nextImage,
    prevImage,
    fetchProperties,
  };
};

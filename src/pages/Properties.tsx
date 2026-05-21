import React, { useMemo, useState } from 'react';
import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertiesLogic } from '@/Logics/UsePropertiesLogic';
import PropertyFormModal from '@/components/PropertyFormModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Property } from '@/types/property';

type FilterStatus = 'all' | 'available' | 'sold' | 'pending' | 'draft';
const MISSING_TEXT = '-';

const hasValidNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const formatNumberValue = (
  value: unknown,
  options: { zeroAsMissing?: boolean; suffix?: string } = {}
) => {
  const { zeroAsMissing = false, suffix = '' } = options;
  if (!hasValidNumber(value)) return MISSING_TEXT;
  if (zeroAsMissing && value <= 0) return MISSING_TEXT;
  return `${value.toLocaleString()}${suffix}`;
};

const formatCurrencyValue = (value: unknown) => {
  if (!hasValidNumber(value) || value <= 0) return '—';
  return `₹${value.toLocaleString('en-IN')}`;
};

const formatTextValue = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return '—';
  return value.trim();
};

const Properties: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    properties,
    selectedProperty,
    isModalOpen,
    modalMode,
    isViewPropertyOpen,
    currentImageIndex,
    isLoading,
    isSaving,
    uploadProgress,
    error,
    stats,
    setIsViewPropertyOpen,
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
  } = usePropertiesLogic();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const scopeLabel = useMemo(() => {
    if (user?.role === 'owner' || user?.role === 'admin') return 'Organization portfolio';
    return 'My portfolio';
  }, [user?.role]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return properties.filter((p) => {
      const text = `${p.title} ${p.location} ${p.address}`.toLowerCase();
      return (!q || text.includes(q)) && (statusFilter === 'all' || p.status === statusFilter);
    });
  }, [properties, query, statusFilter]);
  const availableRate = stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0;
  const soldRate = stats.total > 0 ? Math.round((stats.sold / stats.total) * 100) : 0;
  const avgLeadsPerProperty = stats.total > 0 ? (stats.totalLeads / stats.total).toFixed(1) : "0.0";

  const openPropertyLeads = (propertyId: string) => {
    const property = properties.find((item) => item._id === propertyId);
    const propertyName = property?.title || 'Property';
    navigate(`/leads?propertyId=${encodeURIComponent(propertyId)}&propertyName=${encodeURIComponent(propertyName)}`);
  };

  const openPropertyVisits = (propertyId: string) => {
    const property = properties.find((item) => item._id === propertyId);
    const propertyName = property?.title || 'Property';
    navigate(`/visits?propertyId=${encodeURIComponent(propertyId)}&propertyName=${encodeURIComponent(propertyName)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-400 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm animate-pulse">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]" style={{ padding: "clamp(12px, 2vw, 32px)" }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1600px] mx-auto" style={{ padding: "clamp(12px, 2vw, 32px) clamp(8px, 1.5vw, 24px)" }}>

        {/* ── Header ── */}
        <div className="mb-6 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-8 mb-6 lg:mb-10">
            <div className="space-y-1.5 min-w-0">
              <p className="uppercase tracking-[0.18em] text-blue-400/70 font-medium" style={{ fontSize: "clamp(10px, 0.75vw, 12px)" }}>{scopeLabel}</p>
              <h1 className="font-bold font-syne-bold text-white tracking-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 3.4rem) " }}>Properties</h1>
              <p className="text-slate-400" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.15rem)" }}>Manage your real estate portfolio</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Usage pill */}
              <div className="flex items-center gap-4 px-5 py-3 bg-slate-900/40 border border-slate-800/50 rounded-full backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <span className="text-white font-bold text-sm">{stats.total}</span>
                  <span className="text-slate-500 text-sm">properties</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void fetchProperties()}
                className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200 backdrop-blur-sm group"
              >
                <Lucide.RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:rotate-180 transition-all duration-500" />
              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="group flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold transition-all duration-200 hover:scale-105"
              >
                <Lucide.Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Add Property
              </button>
            </div>
          </div>

          {/* ── KPI Stats — same layout as Avatars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-0 sm:px-2 mb-10">
            <KpiStat value={stats.total} label="Total Properties" sub={`${stats.available} available`} />
            <KpiStat value={stats.available} label="Available" sub={`${availableRate}% available rate`} />
            <KpiStat value={stats.sold} label="Sold" sub={`${soldRate}% sold share`} />
            <KpiStat value={stats.totalLeads} label="Total Leads" sub={`${avgLeadsPerProperty} avg leads/property`} />
          </div>

          {/* ── Search + Filter ── */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Lucide.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or location…"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/30 border border-slate-800/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:bg-slate-900/50 focus:border-slate-700/50 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="px-4 py-3.5 bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-300 text-sm hover:bg-slate-900/50 transition-all focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* ── Error ── */}
        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300 text-sm flex items-center gap-2">
            <Lucide.AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}

        {/* ── Grid / Empty states ── */}
        {filtered.length === 0 ? (
          query || statusFilter !== 'all' ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
                <Lucide.Search className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Properties Found</h3>
              <p className="text-slate-400 text-center max-w-md">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Lucide.Building2 className="w-12 h-12 text-slate-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">No Properties Yet</h3>
              <p className="text-slate-400 text-center max-w-md mb-8">Add your first property to start managing your portfolio.</p>
              <button
                type="button"
                onClick={openAddModal}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-105"
              >
                <Lucide.Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Add Your First Property
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onView={() => handleViewProperty(property)}
                onEdit={() => openEditModal(property)}
                onDelete={() => void handleDeleteProperty(property._id)}
                onFavorite={() => void toggleFavorite(property._id)}
                onLeads={() => openPropertyLeads(property._id)}
                onVisits={() => openPropertyVisits(property._id)}
              />
            ))}
          </div>
        )}
      </div>

      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedProperty}
        onSave={handleSaveProperty}
        isSubmitting={isSaving}
        uploadProgress={uploadProgress}
      />

      <PropertyViewDialog
        isOpen={isViewPropertyOpen}
        property={selectedProperty}
        currentImageIndex={currentImageIndex}
        onClose={() => setIsViewPropertyOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
        onEdit={selectedProperty ? () => openEditModal(selectedProperty) : () => {}}
        onDelete={selectedProperty ? () => void handleDeleteProperty(selectedProperty._id) : () => {}}
        onLeads={selectedProperty ? () => openPropertyLeads(selectedProperty._id) : () => {}}
        onVisits={selectedProperty ? () => openPropertyVisits(selectedProperty._id) : () => {}}
      />

      {isSaving ? (
        <div className="fixed bottom-6 right-6 rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-slate-100 text-sm flex items-center gap-3 shadow-2xl">
          <div className="h-4 w-4 rounded-full border-t-2 border-blue-400 animate-spin" />
          <span>Saving{uploadProgress > 0 ? ` — ${uploadProgress}%` : '...'}</span>
        </div>
      ) : null}
    </div>
  );
};

/* ─── KPI Stat ─── */
const KpiStat = ({
  value,
  label,
  sub,
}: {
  value: number;
  label: string;
  sub: string;
}) => (
  <div className="min-w-0 rounded-xl border border-slate-800/50 bg-slate-900/25 p-4">
    <div className="flex items-baseline gap-3 mb-1.5">
      <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">{value.toLocaleString()}</span>
    </div>
    <div className="text-slate-400 font-medium text-sm md:text-base">{label}</div>
    <div className="text-slate-600 text-xs md:text-sm mt-0.5 break-words">{sub}</div>
  </div>
);

/* ─── Status config ─── */
const statusConfig: Record<string, { label: string; color: string; dot: string; badge: string }> = {
  available: { label: 'Available', color: 'text-emerald-400', dot: 'bg-emerald-400', badge: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30' },
  sold:      { label: 'Sold',      color: 'text-blue-400',    dot: 'bg-blue-400',    badge: 'bg-blue-400/10 text-blue-300 border-blue-400/30' },
  pending:   { label: 'Pending',   color: 'text-amber-400',   dot: 'bg-amber-400',   badge: 'bg-amber-400/10 text-amber-300 border-amber-400/30' },
  draft:     { label: 'Draft',     color: 'text-slate-500',   dot: 'bg-slate-500',   badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
};

/* ─── Smart Image ─── */
const SmartImage = ({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-full w-full bg-slate-900/90">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800/80 via-slate-700/40 to-slate-800/80" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        fetchPriority={eager ? 'high' : 'auto'}
        onLoad={(event) => {
          const img = event.currentTarget;
          if (typeof img.decode === 'function') {
            img.decode().catch(() => {}).finally(() => setLoaded(true));
          } else {
            setLoaded(true);
          }
        }}
        className={`${className ?? ''} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

/* ─── Property Card — Avatars card style ─── */
const PropertyCard = ({
  property,
  onView,
  onEdit,
  onDelete,
  onFavorite,
  onLeads,
  onVisits,
}: {
  property: Property;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onLeads: () => void;
  onVisits: () => void;
}) => {
  const sc = statusConfig[property.status] ?? statusConfig.draft;
  const image =
    property.imageVariants?.[0]?.thumb ||
    property.imageVariants?.[0]?.medium ||
    property.images?.[0] ||
    '/placeholder.svg';

  const hasViews = hasValidNumber(property.views) && property.views > 0;
  const conversionRate =
    hasViews && hasValidNumber(property.leads)
      ? Math.round((property.leads / property.views) * 100)
      : null;
  const titleText = formatTextValue(property.title);
  const priceText = formatCurrencyValue(property.price);
  const locationText = formatTextValue(property.location);
  const bedroomsText = formatNumberValue(property.bedrooms, { zeroAsMissing: true });
  const bathroomsText = formatNumberValue(property.bathrooms, { zeroAsMissing: true });
  const areaText = formatNumberValue(property.area, { zeroAsMissing: true, suffix: ' sq.ft' });
  const specsCompact = [
    bedroomsText !== MISSING_TEXT ? `${bedroomsText} bd` : null,
    bathroomsText !== MISSING_TEXT ? `${bathroomsText} ba` : null,
    areaText !== MISSING_TEXT ? areaText : null,
  ].filter(Boolean) as string[];
  const viewsText = formatNumberValue(property.views);
  const leadsText = formatNumberValue(property.leads);
  const riskText = formatNumberValue(property.analytics?.riskScore, {
    zeroAsMissing: true,
    suffix: '%',
  });

  return (
    <article className="group relative bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">

      {/* Image with gradient fade matching page bg */}
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          src={image}
          alt={titleText}
          className="h-full w-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1929]/65 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium ${sc.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </div>

        {/* Top actions: favorite + delete */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onFavorite}
            title="Toggle favorite"
            className="h-8 w-8 rounded-full bg-slate-900/70 border border-slate-700/60 inline-flex items-center justify-center backdrop-blur-sm hover:border-slate-500 hover:bg-slate-800 transition-all duration-200"
          >
            <Lucide.Heart
              className={`h-3.5 w-3.5 transition-colors ${property.favorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
            />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete property"
            className="h-8 w-8 rounded-full bg-slate-900/70 border border-red-500/40 text-red-400 inline-flex items-center justify-center backdrop-blur-sm hover:bg-red-500/20 hover:border-red-500/60 transition-all duration-200"
          >
            <Lucide.Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title + price */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold text-base leading-tight break-words sm:truncate sm:flex-1">{titleText}</h3>
          <span className="text-white font-bold text-base shrink-0">{priceText}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-5">
          <Lucide.MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{locationText}</span>
        </div>

        {/* Metrics rows — no borders/boxes, like Avatars */}
        <div className="space-y-3.5 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Beds / Baths / Area</span>
            <span className="text-white font-semibold">
              {specsCompact.length > 0 ? specsCompact.join(' · ') : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Views</span>
            <span className="text-white font-semibold">{viewsText}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Leads</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <span className="text-white font-semibold">{leadsText}</span>
              {conversionRate !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(conversionRate || 0, 100)}%` }}
                    />
                  </div>
                  <span className="text-emerald-400 text-xs font-semibold w-9 text-right">{conversionRate}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Risk Score</span>
            <span className="text-white font-semibold">{riskText}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={onLeads}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200 text-xs sm:text-sm font-medium"
          >
            <Lucide.Users className="w-4 h-4" /> Leads
          </button>
          <button
            type="button"
            onClick={onVisits}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200 text-xs sm:text-sm font-medium"
          >
            <Lucide.CalendarCheck2 className="w-4 h-4" /> Visits
          </button>
          <button
            type="button"
            onClick={onView}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all duration-200 text-xs sm:text-sm font-medium"
          >
            <Lucide.Eye className="w-4 h-4" /> View
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all duration-200 text-xs sm:text-sm font-medium"
          >
            <Lucide.Pencil className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>
    </article>
  );
};

/* ─── Property View Dialog ─── */
const PropertyViewDialog = ({
  isOpen,
  property,
  currentImageIndex,
  onClose,
  onNext,
  onPrev,
  onEdit,
  onDelete,
  onLeads,
  onVisits,
}: {
  isOpen: boolean;
  property: Property | null;
  currentImageIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onLeads: () => void;
  onVisits: () => void;
}) => {
  if (!property) return null;

  const sc = statusConfig[property.status] ?? statusConfig.draft;

  const dialogImages =
    property.imageVariants?.length
      ? property.imageVariants.map((v) => v.full || v.medium || v.thumb)
      : property.images?.length
      ? property.images
      : ['/placeholder.svg'];

  const currentImage = dialogImages[currentImageIndex] || dialogImages[0];
  const hasMultiple = dialogImages.length > 1;
  const hasViews = hasValidNumber(property.views) && property.views > 0;
  const conversionRate =
    hasViews && hasValidNumber(property.leads)
      ? Math.round((property.leads / property.views) * 100)
      : null;
  const titleText = formatTextValue(property.title);
  const priceText = formatCurrencyValue(property.price);
  const locationText = formatTextValue(property.location);
  const bedroomsText = formatNumberValue(property.bedrooms, { zeroAsMissing: true });
  const bathroomsText = formatNumberValue(property.bathrooms, { zeroAsMissing: true });
  const areaText = formatNumberValue(property.area, { zeroAsMissing: true, suffix: ' sq.ft' });
  const dialogSpecs = [
    bedroomsText !== MISSING_TEXT ? `${bedroomsText} Bedrooms` : null,
    bathroomsText !== MISSING_TEXT ? `${bathroomsText} Bathrooms` : null,
    areaText !== MISSING_TEXT ? areaText : null,
  ].filter(Boolean) as string[];
  const viewsText = formatNumberValue(property.views);
  const leadsText = formatNumberValue(property.leads);
  const riskNumeric = property.analytics?.riskScore;
  const riskText = formatNumberValue(riskNumeric, { zeroAsMissing: true, suffix: '%' });
  const riskColor =
    hasValidNumber(riskNumeric) && riskNumeric > 50
      ? 'text-red-400'
      : hasValidNumber(riskNumeric)
      ? 'text-emerald-400'
      : 'text-slate-400';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0d1b33] border border-slate-800/60 text-white p-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/60 [&>button]:hidden">

        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          <SmartImage
            src={currentImage}
            alt={titleText}
            eager
            className="h-full w-full object-contain"
          />
          {/* Gradient fade into modal bg */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b33] via-[#0d1b33]/25 to-transparent" />

          {/* Nav arrows */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-slate-900/80 border border-slate-700/70 inline-flex items-center justify-center backdrop-blur-sm hover:bg-slate-800 transition-all"
              >
                <Lucide.ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-slate-900/80 border border-slate-700/70 inline-flex items-center justify-center backdrop-blur-sm hover:bg-slate-800 transition-all"
              >
                <Lucide.ChevronRight className="h-5 w-5 text-white" />
              </button>
              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {dialogImages.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentImageIndex ? 'h-1.5 w-5 bg-white' : 'h-1.5 w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium ${sc.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
              {sc.label}
            </span>
          </div>
          
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-900/80 border border-slate-700/70 backdrop-blur-sm inline-flex items-center justify-center hover:bg-slate-800 transition-all group"
          >
            <Lucide.X className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        {/* Content — flowing, no box grid */}
        <div className="px-7 pb-7">
          {/* Title + price */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">{titleText}</h2>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">{priceText}</p>
              <p className="text-xs text-slate-500 mt-0.5">Listed price</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-6">
            <Lucide.MapPin className="h-3.5 w-3.5 shrink-0" />
            {locationText}
          </div>

          {/* Specs inline row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-800/50">
            {dialogSpecs.length > 0 ? (
              dialogSpecs.map((spec, index) => (
                <React.Fragment key={spec}>
                  <span className="flex items-center gap-1.5">
                    {index === 0 ? <Lucide.Bed className="h-4 w-4 text-slate-600" /> : null}
                    {index === 1 ? <Lucide.Bath className="h-4 w-4 text-slate-600" /> : null}
                    {index === 2 ? <Lucide.Maximize className="h-4 w-4 text-slate-600" /> : null}
                    {spec}
                  </span>
                  {index < dialogSpecs.length - 1 ? (
                    <div className="h-3 w-px bg-slate-700/50" />
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <span className="text-slate-500">—</span>
            )}
          </div>

          {/* Metric rows — Avatars-style, no boxes at all */}
          <div className="space-y-4 mb-7">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Views</span>
              <span className="text-white font-semibold">{viewsText}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Leads</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <span className="text-white font-semibold">{leadsText}</span>
                {conversionRate !== null && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(conversionRate || 0, 100)}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">{conversionRate}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Risk Score</span>
              <span className={`font-semibold ${riskColor}`}>
                {riskText}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <div className={`flex items-center gap-1.5 font-semibold ${sc.color}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { onClose(); onLeads(); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200 text-sm font-medium"
            >
              <Lucide.Users className="w-4 h-4" /> View Leads
            </button>
            <button
              type="button"
              onClick={() => { onClose(); onVisits(); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200 text-sm font-medium"
            >
              <Lucide.CalendarCheck2 className="w-4 h-4" /> View Visits
            </button>
            <button
              type="button"
              onClick={() => { onClose(); onEdit(); }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all duration-200 text-xs sm:text-sm font-medium"
            >
              <Lucide.Pencil className="w-4 h-4" /> Edit Property
            </button>
            <button
              type="button"
              onClick={() => { onClose(); onDelete(); }}
              className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 text-sm font-medium"
            >
              <Lucide.Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Properties;


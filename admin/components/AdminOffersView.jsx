import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Search,
  Plus,
  X,
  Calendar,
  Tag,
  CalendarDays,
  PauseCircle,
  TrendingUp,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Power,
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  Bookmark,
  Upload,
  Camera,
  Sliders,
  Palette,
  CheckCircle2,
  RefreshCw,
  Package,
  Layers,
  Globe,
  ShoppingBag
} from 'lucide-react';
import ExportDropdown from './ExportDropdown';

// Products Catalog for "Selected Products" offer popup selector
const defaultProductsCatalog = [
  {
    id: 1,
    name: "Tripole Walker 55L Backpack",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&auto=format&fit=crop&q=80",
    category: "Backpacks",
    brand: "Tripole",
    sku: "TRP-BLK-S",
    price: 6999,
    mrp: 8499
  },
  {
    id: 2,
    name: "CTR RUB-50 Trekking Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80",
    category: "Footwear",
    brand: "CTR",
    sku: "CTR-RUB-50",
    price: 3999,
    mrp: 4999
  },
  {
    id: 3,
    name: "Rocksport Rain Poncho",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80",
    category: "Rainwear",
    brand: "Rocksport",
    sku: "RSP-RP-001",
    price: 1199,
    mrp: 1499
  },
  {
    id: 4,
    name: "Campingaz Camp Stove & Burner",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=120&auto=format&fit=crop&q=80",
    category: "Camping",
    brand: "Campingaz",
    sku: "CPZ-STV-01",
    price: 2999,
    mrp: 3999
  },
  {
    id: 5,
    name: "Tripole SummitGrip Gloves",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=120&auto=format&fit=crop&q=80",
    category: "Accessories",
    brand: "Tripole",
    sku: "TRP-SG-BLK",
    price: 1499,
    mrp: 1999
  },
  {
    id: 6,
    name: "Quechua 2-Person Waterproof Tent",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=120&auto=format&fit=crop&q=80",
    category: "Camping",
    brand: "Quechua",
    sku: "QCH-TNT-02",
    price: 4599,
    mrp: 5999
  },
  {
    id: 7,
    name: "Wildcraft Alpine Thermal Jacket",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=120&auto=format&fit=crop&q=80",
    category: "Apparel",
    brand: "Wildcraft",
    sku: "WLD-JKT-ALP",
    price: 3499,
    mrp: 4999
  },
  {
    id: 8,
    name: "CTR Trailblazer Trekking Pole (Pair)",
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=120&auto=format&fit=crop&q=80",
    category: "Accessories",
    brand: "CTR",
    sku: "CTR-POL-TBL",
    price: 1899,
    mrp: 2499
  }
];

// Categories Catalog for "Category" offer popup selector
const defaultCategoriesCatalog = [
  { id: 'Backpacks', name: 'Backpacks & Rucksacks', count: 18, icon: '🎒' },
  { id: 'Footwear', name: 'Footwear & Trekking Shoes', count: 24, icon: '🥾' },
  { id: 'Camping', name: 'Camping & Tents', count: 32, icon: '⛺' },
  { id: 'Rainwear', name: 'Rainwear & Ponchos', count: 12, icon: '🌧️' },
  { id: 'Accessories', name: 'Gear Accessories & Tools', count: 45, icon: '🧭' },
  { id: 'Apparel', name: 'Jackets & Thermal Apparel', count: 28, icon: '🧥' }
];

// Brands Catalog for "Brand" offer popup selector
const defaultBrandsCatalog = [
  { id: 'Tripole', name: 'Tripole Gears', count: 19, code: 'TRP' },
  { id: 'CTR', name: 'CTR Outdoor Equipment', count: 25, code: 'CTR' },
  { id: 'Rocksport', name: 'Rocksport Adventure', count: 14, code: 'RSP' },
  { id: 'Campingaz', name: 'Campingaz', count: 9, code: 'CPZ' },
  { id: 'Quechua', name: 'Quechua', count: 31, code: 'QCH' },
  { id: 'Wildcraft', name: 'Wildcraft India', count: 42, code: 'WLD' }
];

const initialOffersData = [];

const AdminOffersView = forwardRef(({ hideHeaderActions = false }, ref) => {
  const [offersList, setOffersList] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [offerTypeFilter, setOfferTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [selectedIds, setSelectedIds] = useState([]);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Modal / Popup State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit'); // 'edit' | 'create'
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const bannerFileInputRef = useRef(null);

  // Picker Popups State (Products, Categories, Brands)
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [productPickerSearch, setProductPickerSearch] = useState('');
  const [productPickerCategoryFilter, setProductPickerCategoryFilter] = useState('All');

  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [categoryPickerSearch, setCategoryPickerSearch] = useState('');

  const [isBrandPickerOpen, setIsBrandPickerOpen] = useState(false);
  const [brandPickerSearch, setBrandPickerSearch] = useState('');
  
  // Current Editing Offer Form State
  const [currentOffer, setCurrentOffer] = useState({
    id: null,
    name: '',
    tagline: '',
    bannerImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    bannerOverlay: 0.45,
    bannerTextColor: '#ffffff',
    description: '',
    type: 'Percentage',
    discountValue: 20,
    unit: '%',
    appliesTo: 'All Products',
    appliesToType: 'All Products',
    selectedProducts: [],
    selectedCategories: [],
    selectedBrands: [],
    channel: ['Online', 'Store'],
    startDate: '2026-06-20',
    endDate: '2026-06-30',
    usageLimit: 500,
    status: 'Active'
  });

  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/offers');
      const data = await res.json();
      if (data.success && Array.isArray(data.offers)) {
        setOffersList(data.offers);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Open Edit Modal
  const handleEditOffer = (offer) => {
    const bannerImg = offer.bannerImage || offer.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80';
    setCurrentOffer({
      id: offer.id,
      name: offer.name,
      tagline: offer.tagline || '',
      image: offer.image || bannerImg,
      bannerImage: bannerImg,
      bannerOverlay: offer.bannerOverlay ?? 0.45,
      bannerTextColor: offer.bannerTextColor || '#ffffff',
      description: offer.description || '',
      type: offer.type,
      discountValue: offer.discountValue,
      unit: offer.type === 'Percentage' ? '%' : '₹',
      appliesTo: offer.appliesTo,
      appliesToType: offer.appliesToType || 'All Products',
      selectedProducts: offer.selectedProducts ? [...offer.selectedProducts] : (offer.appliesToType === 'Selected Products' ? [1, 2, 3] : []),
      selectedCategories: offer.selectedCategories ? [...offer.selectedCategories] : (offer.appliesToType === 'Category' ? ['Apparel'] : []),
      selectedBrands: offer.selectedBrands ? [...offer.selectedBrands] : (offer.appliesToType === 'Brand' ? ['CTR'] : []),
      channel: [...offer.channel],
      startDate: offer.startDate || '2026-06-20',
      endDate: offer.endDate || '2026-06-30',
      usageLimit: offer.usageLimit ?? 500,
      status: offer.status
    });
    setModalMode('edit');
    setIsEditingBanner(false);
    setIsModalOpen(true);
    setActionMenuOpenId(null);
  };

  // Open Create Modal
  const handleCreateOffer = () => {
    const defaultImg = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80';
    setCurrentOffer({
      id: null,
      name: '',
      tagline: 'Step into adventure',
      image: defaultImg,
      bannerImage: defaultImg,
      bannerOverlay: 0.45,
      bannerTextColor: '#ffffff',
      description: '',
      type: 'Percentage',
      discountValue: 15,
      unit: '%',
      appliesTo: 'All Products',
      appliesToType: 'All Products',
      selectedProducts: [],
      selectedCategories: [],
      selectedBrands: [],
      channel: ['Online', 'Store'],
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      usageLimit: 500,
      status: 'Active'
    });
    setModalMode('create');
    setIsEditingBanner(false);
    setIsModalOpen(true);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCurrentOffer(prev => ({
          ...prev,
          bannerImage: dataUrl,
          image: dataUrl
        }));
        showToast('Banner image updated successfully!');
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  useImperativeHandle(ref, () => ({
    handleCreateOffer,
    handleEditOffer
  }));

  const handleSaveOffer = (e, targetStatus) => {
    if (e) e.preventDefault();
    if (!currentOffer.name.trim()) {
      alert('Offer Name is required');
      return;
    }

    const finalStatus = targetStatus || currentOffer.status || 'Active';

    let discountDisplay = `${currentOffer.discountValue}% OFF`;
    if (currentOffer.type === 'Flat Discount') {
      discountDisplay = `₹${currentOffer.discountValue} OFF`;
    } else if (currentOffer.type === 'Buy X Get Y') {
      discountDisplay = 'Buy 1 Get 1 Free';
    } else if (currentOffer.type === 'Combo Offer') {
      discountDisplay = `Combo ${currentOffer.discountValue}% OFF`;
    }

    // Compute accurate Applies To display string
    let computedAppliesTo = currentOffer.appliesTo;
    if (currentOffer.appliesToType === 'All Products') {
      computedAppliesTo = 'All Products';
    } else if (currentOffer.appliesToType === 'Selected Products') {
      const pCount = (currentOffer.selectedProducts || []).length;
      computedAppliesTo = `Selected Products (${pCount})`;
    } else if (currentOffer.appliesToType === 'Category') {
      const cats = (currentOffer.selectedCategories || []);
      computedAppliesTo = cats.length > 0 ? `Category: ${cats.join(', ')}` : 'Category: All';
    } else if (currentOffer.appliesToType === 'Brand') {
      const brs = (currentOffer.selectedBrands || []);
      computedAppliesTo = brs.length > 0 ? `Brand: ${brs.join(', ')}` : 'Brand: All';
    }

    // Format validity display
    const startParts = currentOffer.startDate.split('-');
    const endParts = currentOffer.endDate.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startStr = startParts.length === 3 ? `${parseInt(startParts[2])} ${monthNames[parseInt(startParts[1]) - 1]}` : currentOffer.startDate;
    const endStr = endParts.length === 3 ? `${parseInt(endParts[2])} ${monthNames[parseInt(endParts[1]) - 1]} ${endParts[0]}` : currentOffer.endDate;
    const validityDisplay = `${startStr} - ${endStr}`;

    const resolvedImage = currentOffer.image || currentOffer.bannerImage || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&auto=format&fit=crop&q=60';

    if (modalMode === 'edit' && currentOffer.id) {
      const updatedOffer = {
        ...currentOffer,
        appliesTo: computedAppliesTo,
        image: resolvedImage,
        status: finalStatus,
        discountDisplay,
        validityDisplay
      };
      setOffersList(prev => prev.map(item => item.id === currentOffer.id ? updatedOffer : item));
      showToast(`Offer "${currentOffer.name}" updated successfully!`);

      fetch(`https://dzire-backend.onrender.com/api/admin/offers/${encodeURIComponent(currentOffer.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOffer)
      }).catch(err => console.error('Error updating offer:', err));
    } else {
      const newOffer = {
        ...currentOffer,
        id: String(Date.now()),
        appliesTo: computedAppliesTo,
        image: resolvedImage,
        status: finalStatus,
        discountDisplay,
        validityDisplay,
        usageCount: 0
      };
      setOffersList(prev => [newOffer, ...prev]);
      showToast(`New offer "${currentOffer.name}" created!`);

      fetch('https://dzire-backend.onrender.com/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOffer)
      }).catch(err => console.error('Error creating offer:', err));
    }
    setIsModalOpen(false);
  };


  const handleDuplicate = (offer) => {
    const duplicated = {
      ...offer,
      id: String(Date.now()),
      name: `${offer.name} (Copy)`,
      usageCount: 0,
      status: 'Draft'
    };
    setOffersList(prev => [duplicated, ...prev]);
    showToast(`Duplicated offer "${duplicated.name}" created!`);
    setActionMenuOpenId(null);

    fetch('https://dzire-backend.onrender.com/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicated)
    }).catch(err => console.error('Error duplicating offer:', err));
  };

  const handleToggleStatus = (id) => {
    let nextStatus = 'Active';
    setOffersList(prev => prev.map(o => {
      if (o.id === id) {
        nextStatus = o.status === 'Active' ? 'Paused' : 'Active';
        return { ...o, status: nextStatus };
      }
      return o;
    }));
    setActionMenuOpenId(null);

    fetch(`https://dzire-backend.onrender.com/api/admin/offers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).catch(err => console.error('Error toggling offer status:', err));
  };

  const handleDeleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffersList(prev => prev.filter(o => o.id !== id));
      showToast('Offer deleted successfully.');
      setActionMenuOpenId(null);
      if (isModalOpen) setIsModalOpen(false);

      fetch(`https://dzire-backend.onrender.com/api/admin/offers/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }).catch(err => console.error('Error deleting offer:', err));
    }
  };

  const handleToggleChannel = (channelName) => {
    setCurrentOffer(prev => {
      const exists = prev.channel.includes(channelName);
      if (exists) {
        if (prev.channel.length === 1) return prev;
        return { ...prev, channel: prev.channel.filter(c => c !== channelName) };
      } else {
        return { ...prev, channel: [...prev.channel, channelName] };
      }
    });
  };

  // Counts
  const totalCount = offersList.length;
  const activeCount = offersList.filter(o => o.status === 'Active').length;
  const scheduledCount = offersList.filter(o => o.status === 'Scheduled').length;
  const expiredCount = offersList.filter(o => o.status === 'Expired').length;
  const draftCount = offersList.filter(o => o.status === 'Draft').length;

  // Filtered
  const filteredOffers = useMemo(() => {
    return offersList.filter(offer => {
      if (selectedTab !== 'All' && offer.status !== selectedTab) return false;
      if (channelFilter !== 'All') {
        if (channelFilter === 'Online' && !offer.channel.includes('Online')) return false;
        if (channelFilter === 'Store' && !offer.channel.includes('Store')) return false;
      }
      if (offerTypeFilter !== 'All' && offer.type !== offerTypeFilter) return false;
      if (categoryFilter !== 'All' && !offer.appliesTo.includes(categoryFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          offer.name.toLowerCase().includes(q) ||
          (offer.tagline && offer.tagline.toLowerCase().includes(q)) ||
          offer.discountDisplay.toLowerCase().includes(q) ||
          offer.appliesTo.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [offersList, selectedTab, channelFilter, offerTypeFilter, categoryFilter, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOffers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOffers.map(o => o.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setChannelFilter('All');
    setOfferTypeFilter('All');
    setCategoryFilter('All');
    setSelectedTab('All');
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
      {/* Toast Notification */}
      {feedbackToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <Check size={18} />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Row */}
      {!hideHeaderActions && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Offers & Promotions
            </h2>
            <p style={{ fontSize: '13.5px', color: '#6b7280', margin: 0 }}>
              Create and manage offers for your online store and physical store (Pune).
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ExportDropdown
              fileName="Dzire_Offers_Export"
              title="Offers & Promotions Register"
              headers={['Offer Name', 'Type', 'Discount', 'Applies To', 'Channel', 'Validity', 'Usage', 'Status']}
              rows={filteredOffers.map(o => [
                o.name,
                o.type,
                o.discountDisplay,
                o.appliesTo,
                o.channel.join(', '),
                o.validityDisplay,
                `${o.usageCount} / ${o.usageLimit || '∞'}`,
                o.status
              ])}
            />

            <button
              onClick={handleCreateOffer}
              style={{
                backgroundColor: '#ff6600',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#e65c00'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#ff6600'}
            >
              <Plus size={17} strokeWidth={2.5} />
              <span>Create Offer</span>
            </button>
          </div>
        </div>
      )}

      {/* Top 4 Metric Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Card 1: Active Offers */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #eef2f6',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: '#ffedd5',
            color: '#f97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Tag size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{activeCount}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Active Offers</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>↑ 3</span>
              <span style={{ color: '#9ca3af', fontWeight: '400' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Scheduled Offers */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #eef2f6',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: '#ccfbf1',
            color: '#0d9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarDays size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{scheduledCount}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Scheduled Offers</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>↑ 2</span>
              <span style={{ color: '#9ca3af', fontWeight: '400' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Expired Offers */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #eef2f6',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PauseCircle size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{expiredCount}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Expired Offers</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>—</span>
              <span style={{ color: '#9ca3af', fontWeight: '400' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Estimated Revenue */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #eef2f6',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: '#f3e8ff',
            color: '#9333ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>₹2,48,500</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Estimated Revenue</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>↑ 18%</span>
              <span style={{ color: '#9ca3af', fontWeight: '400' }}>vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
      }}>
        {/* Status Filter Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 20px',
          backgroundColor: '#ffffff',
          gap: '24px'
        }}>
          {[
            { id: 'All', label: `All (${totalCount})` },
            { id: 'Active', label: `Active (${activeCount})` },
            { id: 'Scheduled', label: `Scheduled (${scheduledCount})` },
            { id: 'Expired', label: `Expired (${expiredCount})` },
            { id: 'Draft', label: `Draft (${draftCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: '14px 0',
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: selectedTab === tab.id ? '700' : '500',
                color: selectedTab === tab.id ? '#ff6600' : '#4b5563',
                borderBottom: selectedTab === tab.id ? '2.5px solid #ff6600' : '2.5px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Controls Bar */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f3f4f6'
        }}>
          {/* Search input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '380px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search offers by name, code or product..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '13.5px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
            />
          </div>

          {/* Right Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Channel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Channel</span>
              <select
                value={channelFilter}
                onChange={e => setChannelFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  fontSize: '13px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All</option>
                <option value="Online">Online</option>
                <option value="Store">Store</option>
              </select>
            </div>

            {/* Offer Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Offer Type</span>
              <select
                value={offerTypeFilter}
                onChange={e => setOfferTypeFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  fontSize: '13px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All</option>
                <option value="Percentage">Percentage</option>
                <option value="Flat Discount">Flat Discount</option>
                <option value="Buy X Get Y">Buy X Get Y</option>
                <option value="Combo Offer">Combo Offer</option>
              </select>
            </div>

            {/* Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Category</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  fontSize: '13px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All</option>
                <option value="Apparel">Apparel</option>
                <option value="Footwear">Footwear</option>
                <option value="Gear">Gear</option>
              </select>
            </div>

            {/* Clear */}
            <button
              onClick={clearAllFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6600',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Offers Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '980px' }}>
            <thead>
              <tr style={{
                backgroundColor: '#fafbfc',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '600'
              }}>
                <th style={{ padding: '12px 16px', width: '40px', textAlign: 'center', backgroundColor: '#fafbfc' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredOffers.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Offer Name</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Type</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Discount</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Applies To</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Channel</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Validity</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Status</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Usage</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: '#fafbfc' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map(offer => {
                const isSelected = selectedIds.includes(offer.id);

                return (
                  <tr
                    key={offer.id}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: isSelected ? '#fffaf5' : '#ffffff',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseOver={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#fcfcfd';
                    }}
                    onMouseOut={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(offer.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>

                    {/* Offer Name & Image */}
                    <td style={{ padding: '14px 14px' }}>
                      <div
                        onClick={() => handleEditOffer(offer)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                      >
                        <img
                          src={offer.image}
                          alt={offer.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                            {offer.name}
                          </div>
                          {offer.tagline && (
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                              {offer.tagline}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          offer.type === 'Percentage' ? '#fff7ed' :
                          offer.type === 'Flat Discount' ? '#ecfdf5' : '#f5f3ff',
                        color:
                          offer.type === 'Percentage' ? '#ea580c' :
                          offer.type === 'Flat Discount' ? '#059669' : '#7c3aed',
                        border: `1px solid ${
                          offer.type === 'Percentage' ? '#fed7aa' :
                          offer.type === 'Flat Discount' ? '#a7f3d0' : '#ddd6fe'
                        }`
                      }}>
                        {offer.type}
                      </span>
                    </td>

                    {/* Discount */}
                    <td style={{ padding: '14px 14px', fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                      {offer.discountDisplay}
                    </td>

                    {/* Applies To */}
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {offer.appliesToType === 'Selected Products' ? (
                          <Package size={14} color="#ea580c" />
                        ) : offer.appliesToType === 'Category' ? (
                          <Layers size={14} color="#7c3aed" />
                        ) : offer.appliesToType === 'Brand' ? (
                          <Tag size={14} color="#059669" />
                        ) : (
                          <Globe size={14} color="#64748b" />
                        )}
                        <span style={{
                          fontSize: '12.5px',
                          fontWeight: '600',
                          color:
                            offer.appliesToType === 'Selected Products' ? '#c2410c' :
                            offer.appliesToType === 'Category' ? '#6d28d9' :
                            offer.appliesToType === 'Brand' ? '#047857' : '#374151'
                        }}>
                          {offer.appliesTo}
                        </span>
                      </div>
                    </td>

                    {/* Channel Badges */}
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {offer.channel.map(ch => (
                          <span
                            key={ch}
                            style={{
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              backgroundColor: ch === 'Online' ? '#eff6ff' : '#fff7ed',
                              color: ch === 'Online' ? '#2563eb' : '#c2410c',
                              border: `1px solid ${ch === 'Online' ? '#bfdbfe' : '#fed7aa'}`
                            }}
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Validity */}
                    <td style={{ padding: '14px 14px', fontSize: '12.5px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {offer.validityDisplay}
                    </td>

                    {/* Status Pill */}
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          offer.status === 'Active' ? '#ecfdf5' :
                          offer.status === 'Scheduled' ? '#eff6ff' :
                          offer.status === 'Expired' ? '#fef2f2' : '#f3f4f6',
                        color:
                          offer.status === 'Active' ? '#059669' :
                          offer.status === 'Scheduled' ? '#2563eb' :
                          offer.status === 'Expired' ? '#dc2626' : '#6b7280'
                      }}>
                        {offer.status}
                      </span>
                    </td>

                    {/* Usage */}
                    <td style={{ padding: '14px 14px', fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                      {offer.usageCount} / {offer.usageLimit === 0 ? '∞' : offer.usageLimit}
                    </td>

                    {/* Actions Menu */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', position: 'relative' }}>
                      <button
                        onClick={() => setActionMenuOpenId(actionMenuOpenId === offer.id ? null : offer.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}
                        title="Actions"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Action Menu */}
                      {actionMenuOpenId === offer.id && (
                        <div style={{
                          position: 'absolute',
                          right: '16px',
                          top: '40px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                          width: '150px',
                          zIndex: 50,
                          padding: '4px 0',
                          textAlign: 'left'
                        }}>
                          <button
                            onClick={() => handleEditOffer(offer)}
                            style={{
                              width: '100%',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              fontSize: '13px',
                              color: '#374151',
                              cursor: 'pointer'
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit2 size={14} />
                            <span>Edit Offer</span>
                          </button>

                          <button
                            onClick={() => handleDuplicate(offer)}
                            style={{
                              width: '100%',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              fontSize: '13px',
                              color: '#374151',
                              cursor: 'pointer'
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Copy size={14} />
                            <span>Duplicate</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(offer.id)}
                            style={{
                              width: '100%',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              fontSize: '13px',
                              color: offer.status === 'Active' ? '#d97706' : '#059669',
                              cursor: 'pointer'
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Power size={14} />
                            <span>{offer.status === 'Active' ? 'Pause' : 'Activate'}</span>
                          </button>

                          <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }} />

                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            style={{
                              width: '100%',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              fontSize: '13px',
                              color: '#ef4444',
                              cursor: 'pointer'
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredOffers.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ padding: '36px 20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                    No promotional offers found matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#fafbfc'
        }}>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Showing 1-{Math.min(filteredOffers.length, 8)} of {offersList.length} offers
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#9ca3af',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ff6600',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#ff6600',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              1
            </button>
            <button
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#4b5563',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              2
            </button>
            <button
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#4b5563',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              3
            </button>
            <button
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#4b5563',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              style={{
                padding: '5px 10px',
                fontSize: '13px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#4b5563',
                cursor: 'pointer'
              }}
            >
              <option>10 per page</option>
              <option>25 per page</option>
              <option>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Centered Popup Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          {/* Centered Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'modalFadeIn 0.2s ease-out'
            }}
          >
            <style>{`
              @keyframes modalFadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.96) translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}</style>

            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ffffff'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>
                {modalMode === 'edit' ? 'Edit Offer' : 'Create Offer'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* Graphic Banner Preview & Live Customizer */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  minHeight: '140px',
                  overflow: 'hidden',
                  marginBottom: isEditingBanner ? '14px' : '22px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 24px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                  border: isEditingBanner ? '2px solid #ff6600' : '1px solid #cbd5e1',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  backgroundColor: '#0f172a'
                }}
                onClick={(e) => {
                  if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    setIsEditingBanner(!isEditingBanner);
                  }
                }}
              >
                {/* Background Image - with direct key for instant React update */}
                <img
                  key={currentOffer.bannerImage}
                  src={currentOffer.bannerImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80"}
                  alt="Banner Background"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
                  }}
                />

                {/* Dark Gradient Overlay for text readability */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(90deg, rgba(15, 23, 42, ${Math.max(0.35, currentOffer.bannerOverlay ?? 0.45)}) 0%, rgba(15, 23, 42, ${Math.max(0.15, (currentOffer.bannerOverlay ?? 0.45) - 0.2)}) 100%)`,
                  zIndex: 2,
                  pointerEvents: 'none'
                }} />

                {/* Banner Text Content */}
                <div style={{ position: 'relative', zIndex: 3, flex: 1, paddingRight: '16px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: currentOffer.bannerTextColor || '#ffffff',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    lineHeight: '1.2',
                    textShadow: '0 2px 6px rgba(0,0,0,0.7)'
                  }}>
                    {currentOffer.name || 'CTR SHOES SPECIAL'}
                  </div>
                  <div style={{
                    fontSize: '13.5px',
                    color: '#f1f5f9',
                    marginTop: '5px',
                    fontWeight: '500',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                  }}>
                    {currentOffer.tagline || 'Step into adventure'}
                  </div>
                </div>

                {/* Banner Quick Actions */}
                <div style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    accept="image/*"
                    onChange={handleBannerUpload}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      bannerFileInputRef.current?.click();
                    }}
                    title="Upload new image from your device"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                  >
                    <Camera size={13} />
                    <span>Change Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditingBanner(!isEditingBanner);
                    }}
                    style={{
                      padding: '7px 14px',
                      backgroundColor: isEditingBanner ? '#ff6600' : 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: isEditingBanner ? '#ffffff' : '#1e293b',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isEditingBanner ? 'Close Editor' : 'Edit Banner'}
                  </button>
                </div>
              </div>

              {/* Banner Customization Panel (Expandable) */}
              {isEditingBanner && (
                <div style={{
                  padding: '18px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Palette size={16} color="#ff6600" />
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
                        Banner Customization & Branding
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingBanner(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '12px',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Done Editing
                    </button>
                  </div>

                  {/* Headline & Subtitle Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>
                        Banner Title / Headline <span style={{ color: '#ff6600' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={currentOffer.name}
                        onChange={e => setCurrentOffer({ ...currentOffer, name: e.target.value })}
                        placeholder="e.g. CTR SHOES SPECIAL"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '13px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          fontWeight: '600'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>
                        Banner Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={currentOffer.tagline}
                        onChange={e => setCurrentOffer({ ...currentOffer, tagline: e.target.value })}
                        placeholder="e.g. Step into adventure / Stay dry. Stay outdoors."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '13px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Preset Themes */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                      Choose Preset Adventure Theme (Click to Apply Instantly)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                      {[
                        { label: 'CTR Shoes (Red)', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80' },
                        { label: 'Mountain Trail', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80' },
                        { label: 'Hiking Peak', url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&auto=format&fit=crop&q=80' },
                        { label: 'Forest Campfire', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&auto=format&fit=crop&q=80' },
                        { label: 'Desert Trek', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80' },
                        { label: 'Dark Carbon', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80' }
                      ].map((preset, idx) => {
                        const isCurrent = currentOffer.bannerImage === preset.url;
                        return (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentOffer(prev => ({
                                ...prev,
                                bannerImage: preset.url,
                                image: preset.url
                              }));
                              showToast(`Theme "${preset.label}" applied!`);
                            }}
                            style={{
                              position: 'relative',
                              height: '58px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: isCurrent ? '2px solid #ff6600' : '1px solid #cbd5e1',
                              boxShadow: isCurrent ? '0 0 0 2px rgba(255,102,0,0.3)' : 'none',
                              transform: isCurrent ? 'scale(1.02)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0,0,0,0.65)',
                              color: '#ffffff',
                              fontSize: '9px',
                              fontWeight: '600',
                              padding: '2px 3px',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {preset.label}
                            </div>
                            {isCurrent && (
                              <div style={{ position: 'absolute', top: 3, right: 3, backgroundColor: '#ff6600', borderRadius: '50%', padding: '2px' }}>
                                <Check size={10} color="#ffffff" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload or Custom URL & Overlay Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px', alignItems: 'flex-start' }}>
                    {/* Upload */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>
                        Upload Image File
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          bannerFileInputRef.current?.click();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          backgroundColor: '#ffffff',
                          border: '1px dashed #ff6600',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#ff6600',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff7ed'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <Upload size={14} color="#ff6600" />
                        <span>Choose From Device</span>
                      </button>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>
                        Or Paste Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={currentOffer.bannerImage?.startsWith('data:') ? '' : currentOffer.bannerImage}
                        onChange={e => {
                          const val = e.target.value;
                          setCurrentOffer(prev => ({
                            ...prev,
                            bannerImage: val,
                            image: val
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          fontSize: '12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Overlay Darkness */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>
                        Dark Overlay
                      </label>
                      <select
                        value={currentOffer.bannerOverlay ?? 0.45}
                        onChange={e => setCurrentOffer({ ...currentOffer, bannerOverlay: parseFloat(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          fontSize: '12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value={0.2}>Light (20%)</option>
                        <option value={0.45}>Medium (45% - Default)</option>
                        <option value={0.65}>Dark (65%)</option>
                        <option value={0.85}>High Contrast (85%)</option>
                        <option value={0.0}>No Overlay (0%)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={e => handleSaveOffer(e)} id="offer-modal-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Offer Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Offer Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentOffer.name}
                    onChange={e => setCurrentOffer({ ...currentOffer, name: e.target.value })}
                    placeholder="e.g. Monsoon Essentials"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      fontSize: '13.5px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Short Description
                  </label>
                  <textarea
                    rows="2"
                    maxLength="150"
                    value={currentOffer.description}
                    onChange={e => setCurrentOffer({ ...currentOffer, description: e.target.value })}
                    placeholder="Stay dry, stay outdoors with our monsoon gear."
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      fontSize: '13px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{ textAlign: 'right', fontSize: '11.5px', color: '#9ca3af', marginTop: '3px' }}>
                    Character count: {currentOffer.description?.length || 0}/150
                  </div>
                </div>

                {/* Offer Type Radio Options */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                    Offer Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { id: 'Percentage', label: 'Percentage Discount' },
                      { id: 'Flat Discount', label: 'Flat Discount' },
                      { id: 'Buy X Get Y', label: 'Buy X Get Y' },
                      { id: 'Combo Offer', label: 'Combo Offer' }
                    ].map(ot => (
                      <label
                        key={ot.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#374151',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="radio"
                          name="offerType"
                          checked={currentOffer.type === ot.id}
                          onChange={() => setCurrentOffer({
                            ...currentOffer,
                            type: ot.id,
                            unit: ot.id === 'Percentage' ? '%' : '₹'
                          })}
                          style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                        />
                        <span>{ot.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discount Value */}
                {currentOffer.type !== 'Buy X Get Y' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                      Discount Value <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        required
                        min="1"
                        value={currentOffer.discountValue}
                        onChange={e => setCurrentOffer({ ...currentOffer, discountValue: parseFloat(e.target.value) || 0 })}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          outline: 'none'
                        }}
                      />
                      <select
                        value={currentOffer.unit}
                        onChange={e => setCurrentOffer({
                          ...currentOffer,
                          unit: e.target.value,
                          type: e.target.value === '%' ? 'Percentage' : 'Flat Discount'
                        })}
                        style={{
                          width: '70px',
                          padding: '9px 10px',
                          fontSize: '14px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="%">%</option>
                        <option value="₹">₹</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Applies To Section */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                    <span>Applies To <span style={{ color: '#ef4444' }}>*</span></span>
                    {currentOffer.appliesToType !== 'All Products' && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#fff7ed',
                        color: '#ea580c',
                        border: '1px solid #fed7aa'
                      }}>
                        {currentOffer.appliesToType === 'Selected Products'
                          ? `${currentOffer.selectedProducts?.length || 0} Products Configured`
                          : currentOffer.appliesToType === 'Category'
                            ? `${currentOffer.selectedCategories?.length || 0} Categories Configured`
                            : `${currentOffer.selectedBrands?.length || 0} Brands Configured`}
                      </span>
                    )}
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Option 1: All Products */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      fontSize: '13.5px',
                      color: '#374151',
                      cursor: 'pointer',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: currentOffer.appliesToType === 'All Products' ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                      backgroundColor: currentOffer.appliesToType === 'All Products' ? '#fff7ed' : '#ffffff',
                      transition: 'all 0.15s ease'
                    }}>
                      <input
                        type="radio"
                        name="offerAppliesTo"
                        checked={currentOffer.appliesToType === 'All Products'}
                        onChange={() => setCurrentOffer({
                          ...currentOffer,
                          appliesToType: 'All Products',
                          appliesTo: 'All Products',
                          selectedProducts: [],
                          selectedCategories: [],
                          selectedBrands: []
                        })}
                        style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                      />
                      <Globe size={15} color={currentOffer.appliesToType === 'All Products' ? '#ff6600' : '#64748b'} />
                      <span style={{ fontWeight: currentOffer.appliesToType === 'All Products' ? '700' : '500', color: currentOffer.appliesToType === 'All Products' ? '#9a3412' : '#374151' }}>
                        All Products
                      </span>
                    </label>

                    {/* Option 2: Selected Products (Opens Product Catalog Popup) */}
                    <div style={{
                      borderRadius: '8px',
                      border: currentOffer.appliesToType === 'Selected Products' ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                      backgroundColor: currentOffer.appliesToType === 'Selected Products' ? '#fff7ed' : '#ffffff',
                      overflow: 'hidden',
                      transition: 'all 0.15s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        padding: '10px 12px'
                      }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          fontSize: '13.5px',
                          color: '#374151',
                          cursor: 'pointer',
                          flex: 1
                        }}>
                          <input
                            type="radio"
                            name="offerAppliesTo"
                            checked={currentOffer.appliesToType === 'Selected Products'}
                            onChange={() => {
                              setCurrentOffer(prev => ({
                                ...prev,
                                appliesToType: 'Selected Products',
                                appliesTo: `Selected Products (${prev.selectedProducts?.length || 0})`
                              }));
                            }}
                            style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                          />
                          <Package size={15} color={currentOffer.appliesToType === 'Selected Products' ? '#ff6600' : '#64748b'} />
                          <div>
                            <span style={{ fontWeight: currentOffer.appliesToType === 'Selected Products' ? '700' : '500', color: currentOffer.appliesToType === 'Selected Products' ? '#9a3412' : '#374151' }}>
                              Selected Products ({currentOffer.selectedProducts?.length || 0})
                            </span>
                            <span style={{ display: 'block', fontSize: '11px', color: currentOffer.appliesToType === 'Selected Products' ? '#c2410c' : '#64748b' }}>
                              Choose specific products from catalog popup
                            </span>
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentOffer(prev => ({
                              ...prev,
                              appliesToType: 'Selected Products',
                              appliesTo: `Selected Products (${prev.selectedProducts?.length || 0})`
                            }));
                            setIsProductPickerOpen(true);
                          }}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = '#ff6600'; e.currentTarget.style.color = '#ff6600'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; }}
                        >
                          <Package size={13} />
                          <span>Select Products</span>
                        </button>
                      </div>

                      {/* Expands when Selected Products is active */}
                      {currentOffer.appliesToType === 'Selected Products' && (
                        <div style={{
                          padding: '12px 14px',
                          borderTop: '1px solid #fed7aa',
                          backgroundColor: '#ffffff'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                              Selected Products List ({currentOffer.selectedProducts?.length || 0}):
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsProductPickerOpen(true)}
                              style={{
                                padding: '5px 12px',
                                backgroundColor: '#ff6600',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <Package size={13} />
                              <span>{currentOffer.selectedProducts?.length > 0 ? 'Change / Add Products' : '+ Open Products Popup'}</span>
                            </button>
                          </div>

                          {/* Selected Products Preview Cards */}
                          {currentOffer.selectedProducts?.length > 0 ? (
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              maxHeight: '160px',
                              overflowY: 'auto'
                            }}>
                              {currentOffer.selectedProducts.map(prodId => {
                                const prod = defaultProductsCatalog.find(p => p.id === prodId);
                                if (!prod) return null;
                                return (
                                  <div
                                    key={prod.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '6px 10px',
                                      backgroundColor: '#f8fafc',
                                      border: '1px solid #e2e8f0',
                                      borderRadius: '6px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <img
                                        src={prod.image}
                                        alt={prod.name}
                                        style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                                      />
                                      <div>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{prod.name}</div>
                                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                                          {prod.category} • {prod.sku} • ₹{prod.price.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCurrentOffer(prev => {
                                          const nextList = prev.selectedProducts.filter(id => id !== prod.id);
                                          return {
                                            ...prev,
                                            selectedProducts: nextList,
                                            appliesTo: `Selected Products (${nextList.length})`
                                          };
                                        });
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        padding: '2px'
                                      }}
                                      title="Remove Product"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              onClick={() => setIsProductPickerOpen(true)}
                              style={{
                                padding: '14px',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                border: '1px dashed #cbd5e1',
                                borderRadius: '6px',
                                color: '#64748b',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              No products selected yet. <strong>Click here to open product selection popup.</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Option 3: Category (Opens Category Selector Popup) */}
                    <div style={{
                      borderRadius: '8px',
                      border: currentOffer.appliesToType === 'Category' ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                      backgroundColor: currentOffer.appliesToType === 'Category' ? '#fff7ed' : '#ffffff',
                      overflow: 'hidden',
                      transition: 'all 0.15s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        padding: '10px 12px'
                      }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          fontSize: '13.5px',
                          color: '#374151',
                          cursor: 'pointer',
                          flex: 1
                        }}>
                          <input
                            type="radio"
                            name="offerAppliesTo"
                            checked={currentOffer.appliesToType === 'Category'}
                            onChange={() => {
                              setCurrentOffer(prev => ({
                                ...prev,
                                appliesToType: 'Category',
                                appliesTo: `Category: ${prev.selectedCategories?.join(', ') || 'All'}`
                              }));
                            }}
                            style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                          />
                          <Layers size={15} color={currentOffer.appliesToType === 'Category' ? '#ff6600' : '#64748b'} />
                          <div>
                            <span style={{ fontWeight: currentOffer.appliesToType === 'Category' ? '700' : '500', color: currentOffer.appliesToType === 'Category' ? '#9a3412' : '#374151' }}>
                              Category ({currentOffer.selectedCategories?.length || 0})
                            </span>
                            <span style={{ display: 'block', fontSize: '11px', color: currentOffer.appliesToType === 'Category' ? '#c2410c' : '#64748b' }}>
                              Apply offer discount to specific product categories
                            </span>
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentOffer(prev => ({
                              ...prev,
                              appliesToType: 'Category',
                              appliesTo: `Category: ${prev.selectedCategories?.join(', ') || 'All'}`
                            }));
                            setIsCategoryPickerOpen(true);
                          }}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = '#ff6600'; e.currentTarget.style.color = '#ff6600'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; }}
                        >
                          <Layers size={13} />
                          <span>Select Categories</span>
                        </button>
                      </div>

                      {/* Expands when Category is clicked */}
                      {currentOffer.appliesToType === 'Category' && (
                        <div style={{
                          padding: '12px 14px',
                          borderTop: '1px solid #fed7aa',
                          backgroundColor: '#ffffff'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                              Selected Categories ({currentOffer.selectedCategories?.length || 0}):
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsCategoryPickerOpen(true)}
                              style={{
                                padding: '5px 12px',
                                backgroundColor: '#ff6600',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <Layers size={13} />
                              <span>{currentOffer.selectedCategories?.length > 0 ? 'Change Categories' : '+ Open Category Popup'}</span>
                            </button>
                          </div>

                          {/* Selected Category Badges */}
                          {currentOffer.selectedCategories?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {currentOffer.selectedCategories.map(catId => {
                                const cat = defaultCategoriesCatalog.find(c => c.id === catId);
                                return (
                                  <span
                                    key={catId}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '4px 8px',
                                      backgroundColor: '#eff6ff',
                                      border: '1px solid #bfdbfe',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      color: '#1d4ed8'
                                    }}
                                  >
                                    <span>{cat?.icon || '🏷️'}</span>
                                    <span>{cat?.name || catId}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCurrentOffer(prev => {
                                          const nextList = prev.selectedCategories.filter(id => id !== catId);
                                          return {
                                            ...prev,
                                            selectedCategories: nextList,
                                            appliesTo: `Category: ${nextList.join(', ') || 'All'}`
                                          };
                                        });
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#1e40af',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <X size={12} />
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              onClick={() => setIsCategoryPickerOpen(true)}
                              style={{
                                padding: '14px',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                border: '1px dashed #cbd5e1',
                                borderRadius: '6px',
                                color: '#64748b',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              No categories selected. <strong>Click here to open category popup.</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Option 4: Brand (Opens Brand Selector Popup) */}
                    <div style={{
                      borderRadius: '8px',
                      border: currentOffer.appliesToType === 'Brand' ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                      backgroundColor: currentOffer.appliesToType === 'Brand' ? '#fff7ed' : '#ffffff',
                      overflow: 'hidden',
                      transition: 'all 0.15s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        padding: '10px 12px'
                      }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          fontSize: '13.5px',
                          color: '#374151',
                          cursor: 'pointer',
                          flex: 1
                        }}>
                          <input
                            type="radio"
                            name="offerAppliesTo"
                            checked={currentOffer.appliesToType === 'Brand'}
                            onChange={() => {
                              setCurrentOffer(prev => ({
                                ...prev,
                                appliesToType: 'Brand',
                                appliesTo: `Brand: ${prev.selectedBrands?.join(', ') || 'All'}`
                              }));
                            }}
                            style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                          />
                          <Tag size={15} color={currentOffer.appliesToType === 'Brand' ? '#ff6600' : '#64748b'} />
                          <div>
                            <span style={{ fontWeight: currentOffer.appliesToType === 'Brand' ? '700' : '500', color: currentOffer.appliesToType === 'Brand' ? '#9a3412' : '#374151' }}>
                              Brand ({currentOffer.selectedBrands?.length || 0})
                            </span>
                            <span style={{ display: 'block', fontSize: '11px', color: currentOffer.appliesToType === 'Brand' ? '#c2410c' : '#64748b' }}>
                              Apply offer discount only to items of selected brands
                            </span>
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentOffer(prev => ({
                              ...prev,
                              appliesToType: 'Brand',
                              appliesTo: `Brand: ${prev.selectedBrands?.join(', ') || 'All'}`
                            }));
                            setIsBrandPickerOpen(true);
                          }}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = '#ff6600'; e.currentTarget.style.color = '#ff6600'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; }}
                        >
                          <Tag size={13} />
                          <span>Select Brands</span>
                        </button>
                      </div>

                      {/* Expands when Brand is clicked */}
                      {currentOffer.appliesToType === 'Brand' && (
                        <div style={{
                          padding: '12px 14px',
                          borderTop: '1px solid #fed7aa',
                          backgroundColor: '#ffffff'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                              Selected Brands ({currentOffer.selectedBrands?.length || 0}):
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsBrandPickerOpen(true)}
                              style={{
                                padding: '5px 12px',
                                backgroundColor: '#ff6600',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <Tag size={13} />
                              <span>{currentOffer.selectedBrands?.length > 0 ? 'Change Brands' : '+ Open Brand Popup'}</span>
                            </button>
                          </div>

                          {/* Selected Brand Badges */}
                          {currentOffer.selectedBrands?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {currentOffer.selectedBrands.map(brandId => {
                                const brand = defaultBrandsCatalog.find(b => b.id === brandId);
                                return (
                                  <span
                                    key={brandId}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '4px 8px',
                                      backgroundColor: '#fff7ed',
                                      border: '1px solid #fed7aa',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      color: '#ea580c'
                                    }}
                                  >
                                    <span style={{
                                      fontSize: '10px',
                                      fontWeight: '800',
                                      backgroundColor: '#ea580c',
                                      color: '#ffffff',
                                      padding: '1px 4px',
                                      borderRadius: '3px'
                                    }}>
                                      {brand?.code || brandId.slice(0, 3).toUpperCase()}
                                    </span>
                                    <span>{brand?.name || brandId}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCurrentOffer(prev => {
                                          const nextList = prev.selectedBrands.filter(id => id !== brandId);
                                          return {
                                            ...prev,
                                            selectedBrands: nextList,
                                            appliesTo: `Brand: ${nextList.join(', ') || 'All'}`
                                          };
                                        });
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#9a3412',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <X size={12} />
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              onClick={() => setIsBrandPickerOpen(true)}
                              style={{
                                padding: '14px',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                border: '1px dashed #cbd5e1',
                                borderRadius: '6px',
                                color: '#64748b',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              No brands selected. <strong>Click here to open brand popup.</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sales Channel */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                    Sales Channel
                  </label>
                  <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#374151', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={currentOffer.channel.includes('Online')}
                        onChange={() => handleToggleChannel('Online')}
                        style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                      />
                      <span>Online Store</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#374151', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={currentOffer.channel.includes('Store')}
                        onChange={() => handleToggleChannel('Store')}
                        style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                      />
                      <span>Physical Store (Pune)</span>
                    </label>
                  </div>
                </div>

                {/* Validity Period */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Validity Period <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Calendar size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#9ca3af' }} />
                      <input
                        type="date"
                        value={currentOffer.startDate}
                        onChange={e => setCurrentOffer({ ...currentOffer, startDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 8px 9px 32px',
                          fontSize: '13px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>to</span>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Calendar size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#9ca3af' }} />
                      <input
                        type="date"
                        value={currentOffer.endDate}
                        onChange={e => setCurrentOffer({ ...currentOffer, endDate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 8px 9px 32px',
                          fontSize: '13px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Usage Limit & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                      Usage Limit (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentOffer.usageLimit || ''}
                      onChange={e => setCurrentOffer({ ...currentOffer, usageLimit: parseInt(e.target.value) || 0 })}
                      placeholder="500"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        fontSize: '13.5px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px', display: 'block' }}>
                      Leave empty for unlimited usage
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                      Status
                    </label>
                    <select
                      value={currentOffer.status}
                      onChange={e => setCurrentOffer({ ...currentOffer, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        fontSize: '13.5px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Paused">Paused</option>
                      <option value="Draft">Draft</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ffffff'
            }}>
              <div>
                {modalMode === 'edit' && currentOffer.id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteOffer(currentOffer.id)}
                    style={{
                      padding: '9px 16px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #fee2e2',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={e => handleSaveOffer(e, 'Draft')}
                  style={{
                    padding: '9px 18px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={e => handleSaveOffer(e)}
                  style={{
                    padding: '9px 22px',
                    backgroundColor: '#ff6600',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#e65c00'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#ff6600'}
                >
                  {modalMode === 'edit' ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal 1: Selected Products Catalog Picker */}
      {isProductPickerOpen && (() => {
        const categoriesList = ['All', 'Backpacks', 'Footwear', 'Camping', 'Rainwear', 'Accessories', 'Apparel'];
        const filteredProducts = defaultProductsCatalog.filter(p => {
          const matchesSearch =
            p.name.toLowerCase().includes(productPickerSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(productPickerSearch.toLowerCase()) ||
            p.brand.toLowerCase().includes(productPickerSearch.toLowerCase()) ||
            p.category.toLowerCase().includes(productPickerSearch.toLowerCase());
          const matchesCategory =
            productPickerCategoryFilter === 'All' || p.category === productPickerCategoryFilter;
          return matchesSearch && matchesCategory;
        });

        const selectedIds = currentOffer.selectedProducts || [];

        const toggleProduct = (productId) => {
          setCurrentOffer(prev => {
            const list = prev.selectedProducts || [];
            const nextList = list.includes(productId)
              ? list.filter(id => id !== productId)
              : [...list, productId];
            return {
              ...prev,
              selectedProducts: nextList,
              appliesTo: `Selected Products (${nextList.length})`
            };
          });
        };

        const selectAllFiltered = () => {
          const filteredIds = filteredProducts.map(p => p.id);
          setCurrentOffer(prev => {
            const nextList = Array.from(new Set([...(prev.selectedProducts || []), ...filteredIds]));
            return {
              ...prev,
              selectedProducts: nextList,
              appliesTo: `Selected Products (${nextList.length})`
            };
          });
        };

        const clearProductSelection = () => {
          setCurrentOffer(prev => ({
            ...prev,
            selectedProducts: [],
            appliesTo: 'Selected Products (0)'
          }));
        };

        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '740px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                padding: '18px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#fff7ed',
                    color: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Select Products for Offer
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                      Choose which specific items this promotional offer discount applies to.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductPickerOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search & Category Filter bar */}
              <div style={{ padding: '14px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search products by name, SKU, brand, or category..."
                      value={productPickerSearch}
                      onChange={e => setProductPickerSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px 8px 32px',
                        fontSize: '13px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#334155',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    + Select All ({filteredProducts.length})
                  </button>
                  {selectedIds.length > 0 && (
                    <button
                      type="button"
                      onClick={clearProductSelection}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#ef4444',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* Category pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProductPickerCategoryFilter(cat)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11.5px',
                        fontWeight: productPickerCategoryFilter === cat ? '700' : '500',
                        border: productPickerCategoryFilter === cat ? '1.5px solid #ff6600' : '1px solid #cbd5e1',
                        backgroundColor: productPickerCategoryFilter === cat ? '#fff7ed' : '#ffffff',
                        color: productPickerCategoryFilter === cat ? '#ea580c' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Items List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredProducts.map(product => {
                  const isChecked = selectedIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: isChecked ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                        backgroundColor: isChecked ? '#fffaf5' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ accentColor: '#ff6600', cursor: 'pointer', transform: 'scale(1.15)' }}
                        />
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>
                            {product.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 5px', borderRadius: '3px' }}>
                              {product.sku}
                            </span>
                            <span style={{ fontSize: '11px', color: '#475569' }}>
                              Category: <strong>{product.category}</strong>
                            </span>
                            <span style={{ fontSize: '11px', color: '#475569' }}>
                              Brand: <strong>{product.brand}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.mrp && (
                          <div style={{ fontSize: '11.5px', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{product.mrp.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
                    No products found matching "{productPickerSearch}". Try a different search keyword or category filter.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '14px 24px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                  <span style={{ color: '#ea580c', fontWeight: '800' }}>{selectedIds.length}</span> of {defaultProductsCatalog.length} Products Selected
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsProductPickerOpen(false)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProductPickerOpen(false)}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#ff6600',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)'
                    }}
                  >
                    Apply Products ({selectedIds.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Popup Modal 2: Category Picker Modal */}
      {isCategoryPickerOpen && (() => {
        const filteredCategories = defaultCategoriesCatalog.filter(c =>
          c.name.toLowerCase().includes(categoryPickerSearch.toLowerCase()) ||
          c.id.toLowerCase().includes(categoryPickerSearch.toLowerCase())
        );

        const selectedList = currentOffer.selectedCategories || [];

        const toggleCategory = (catId) => {
          setCurrentOffer(prev => {
            const list = prev.selectedCategories || [];
            const nextList = list.includes(catId)
              ? list.filter(id => id !== catId)
              : [...list, catId];
            return {
              ...prev,
              selectedCategories: nextList,
              appliesTo: `Category: ${nextList.join(', ') || 'All'}`
            };
          });
        };

        const selectAll = () => {
          const allCats = defaultCategoriesCatalog.map(c => c.id);
          setCurrentOffer(prev => ({
            ...prev,
            selectedCategories: allCats,
            appliesTo: `Category: ${allCats.join(', ')}`
          }));
        };

        const clearAll = () => {
          setCurrentOffer(prev => ({
            ...prev,
            selectedCategories: [],
            appliesTo: 'Category: All'
          }));
        };

        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                padding: '18px 22px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#fff7ed',
                    color: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Select Categories for Offer
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                      Offer discount will apply to all products in selected categories.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCategoryPickerOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search bar */}
              <div style={{ padding: '12px 22px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categoryPickerSearch}
                    onChange={e => setCategoryPickerSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px 6px 30px',
                      fontSize: '12.5px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={selectAll}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Select All
                </button>
                {selectedList.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Categories Grid */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {filteredCategories.map(cat => {
                  const isChecked = selectedList.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: isChecked ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                        backgroundColor: isChecked ? '#fffaf5' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ accentColor: '#ff6600', cursor: 'pointer', transform: 'scale(1.15)' }}
                      />
                      <div style={{ fontSize: '20px' }}>{cat.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                          {cat.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {cat.count} products
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{
                padding: '14px 22px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                  <span style={{ color: '#ea580c', fontWeight: '800' }}>{selectedList.length}</span> Categories Selected
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryPickerOpen(false)}
                    style={{
                      padding: '7px 14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCategoryPickerOpen(false)}
                    style={{
                      padding: '7px 18px',
                      backgroundColor: '#ff6600',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)'
                    }}
                  >
                    Done ({selectedList.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Popup Modal 3: Brand Picker Modal */}
      {isBrandPickerOpen && (() => {
        const filteredBrands = defaultBrandsCatalog.filter(b =>
          b.name.toLowerCase().includes(brandPickerSearch.toLowerCase()) ||
          b.id.toLowerCase().includes(brandPickerSearch.toLowerCase()) ||
          b.code.toLowerCase().includes(brandPickerSearch.toLowerCase())
        );

        const selectedList = currentOffer.selectedBrands || [];

        const toggleBrand = (brandId) => {
          setCurrentOffer(prev => {
            const list = prev.selectedBrands || [];
            const nextList = list.includes(brandId)
              ? list.filter(id => id !== brandId)
              : [...list, brandId];
            return {
              ...prev,
              selectedBrands: nextList,
              appliesTo: `Brand: ${nextList.join(', ') || 'All'}`
            };
          });
        };

        const selectAll = () => {
          const allBrands = defaultBrandsCatalog.map(b => b.id);
          setCurrentOffer(prev => ({
            ...prev,
            selectedBrands: allBrands,
            appliesTo: `Brand: ${allBrands.join(', ')}`
          }));
        };

        const clearAll = () => {
          setCurrentOffer(prev => ({
            ...prev,
            selectedBrands: [],
            appliesTo: 'Brand: All'
          }));
        };

        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                padding: '18px 22px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#fff7ed',
                    color: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Tag size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      Select Brands for Offer
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                      Offer discount will apply only to products of selected brands.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBrandPickerOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search bar */}
              <div style={{ padding: '12px 22px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandPickerSearch}
                    onChange={e => setBrandPickerSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px 6px 30px',
                      fontSize: '12.5px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={selectAll}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Select All
                </button>
                {selectedList.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Brands Grid */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {filteredBrands.map(brand => {
                  const isChecked = selectedList.includes(brand.id);
                  return (
                    <div
                      key={brand.id}
                      onClick={() => toggleBrand(brand.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: isChecked ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
                        backgroundColor: isChecked ? '#fffaf5' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ accentColor: '#ff6600', cursor: 'pointer', transform: 'scale(1.15)' }}
                      />
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#fff7ed',
                        border: '1px solid #fed7aa',
                        color: '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '11.5px'
                      }}>
                        {brand.code}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                          {brand.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {brand.count} products
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{
                padding: '14px 22px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                  <span style={{ color: '#ea580c', fontWeight: '800' }}>{selectedList.length}</span> Brands Selected
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsBrandPickerOpen(false)}
                    style={{
                      padding: '7px 14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBrandPickerOpen(false)}
                    style={{
                      padding: '7px 18px',
                      backgroundColor: '#ff6600',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)'
                    }}
                  >
                    Done ({selectedList.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
});

export default AdminOffersView;

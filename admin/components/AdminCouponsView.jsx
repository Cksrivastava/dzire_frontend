import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import {
  Search,
  Filter,
  Plus,
  X,
  Calendar,
  Ticket,
  PlayCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Power,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Store,
  Globe,
  Sparkles,
  Info,
  User,
  Users,
  Mail,
  UserCheck,
  CheckSquare,
  Square,
  Package,
  Layers,
  Tag,
  ShoppingBag
} from 'lucide-react';
import ExportDropdown from './ExportDropdown';

// Products Catalog for "Selected Products" coupon popup selector
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

// Categories Catalog for "Category" coupon popup selector
const defaultCategoriesCatalog = [
  { id: 'Backpacks', name: 'Backpacks & Rucksacks', count: 18, icon: '🎒' },
  { id: 'Footwear', name: 'Footwear & Trekking Shoes', count: 24, icon: '🥾' },
  { id: 'Camping', name: 'Camping & Tents', count: 32, icon: '⛺' },
  { id: 'Rainwear', name: 'Rainwear & Ponchos', count: 12, icon: '🌧️' },
  { id: 'Accessories', name: 'Gear Accessories & Tools', count: 45, icon: '🧭' },
  { id: 'Apparel', name: 'Jackets & Thermal Apparel', count: 28, icon: '🧥' }
];

// Brands Catalog for "Brand" coupon popup selector
const defaultBrandsCatalog = [
  { id: 'Tripole', name: 'Tripole Gears', count: 19, code: 'TRP' },
  { id: 'CTR', name: 'CTR Outdoor Equipment', count: 25, code: 'CTR' },
  { id: 'Rocksport', name: 'Rocksport Adventure', count: 14, code: 'RSP' },
  { id: 'Campingaz', name: 'Campingaz', count: 9, code: 'CPZ' },
  { id: 'Quechua', name: 'Quechua', count: 31, code: 'QCH' },
  { id: 'Wildcraft', name: 'Wildcraft India', count: 42, code: 'WLD' }
];

// Directory of registered customer emails & details for autocomplete / selection
const defaultCustomersDirectory = [
  { id: 'CUST1001', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98765 43210', type: 'Regular' },
  { id: 'CUST1002', name: 'Sneha Patel', email: 'sneha.patel@gmail.com', phone: '+91 97654 32109', type: 'VIP' },
  { id: 'CUST1003', name: 'Amit Desai', email: 'amit.desai@gmail.com', phone: '+91 98111 22334', type: 'Regular' },
  { id: 'CUST1004', name: 'Priya Verma', email: 'priya.verma@gmail.com', phone: '+91 98222 33445', type: 'VIP' },
  { id: 'CUST1005', name: 'Vikram Joshi', email: 'vikram.joshi@outlook.com', phone: '+91 98333 44556', type: 'B2B' },
  { id: 'CUST1006', name: 'Neha Gupta', email: 'neha.gupta@yahoo.com', phone: '+91 98444 55667', type: 'Regular' },
  { id: 'USR-101', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', type: 'Regular' },
  { id: 'USR-103', name: 'Rohit Verma', email: 'rohit.verma@outlook.com', phone: '+91 97123 45678', type: 'Regular' },
  { id: 'USR-104', name: 'Sneha Reddy', email: 'sneha.reddy@yahoo.com', phone: '+91 96543 21098', type: 'VIP' },
  { id: 'USR-106', name: 'Ananya Deshmukh', email: 'ananya.d@gmail.com', phone: '+91 98450 12345', type: 'Regular' }
];

const initialCouponsData = [];

const AdminCouponsView = forwardRef(({ hideHeaderActions = false }, ref) => {
  const [couponsList, setCouponsList] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [audienceFilter, setAudienceFilter] = useState('All');

  const [selectedIds, setSelectedIds] = useState([]);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Drawer / Side Panel State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('edit'); // 'edit' | 'create'
  const [drawerActiveTab, setDrawerActiveTab] = useState('Details'); // 'Details' | 'Eligibility & Rules' | 'Usage & Analytics'
  
  // User selection sub-state for drawer
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [customEmailInput, setCustomEmailInput] = useState('');

  // Popups State for Product, Category, and Brand Selection
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [isBrandPickerOpen, setIsBrandPickerOpen] = useState(false);

  // Search & Filter States inside Popups
  const [productPickerSearch, setProductPickerSearch] = useState('');
  const [productPickerCategoryFilter, setProductPickerCategoryFilter] = useState('All');
  const [categoryPickerSearch, setCategoryPickerSearch] = useState('');
  const [brandPickerSearch, setBrandPickerSearch] = useState('');

  // Drawer Form State
  const [currentCoupon, setCurrentCoupon] = useState({
    id: null,
    code: '',
    name: '',
    description: '',
    type: 'Percentage',
    discountValue: 20,
    unit: '%',
    appliesTo: 'All Products',
    channel: ['Online', 'Store'],
    userScope: 'all', // 'all' | 'single' | 'multiple'
    selectedEmails: [],
    selectedProducts: [], // Array of product IDs [1, 2]
    selectedCategories: [], // Array of category IDs ['Backpacks']
    selectedBrands: [], // Array of brand IDs ['CTR']
    startDate: '2026-06-20',
    endDate: '2026-06-30',
    usageLimit: 500,
    limitPerCustomer: 1,
    hasMinOrder: true,
    minOrderValue: 1000,
    hasMaxDiscount: false,
    maxDiscount: 0,
    status: 'Active'
  });

  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('https://dzire-backend.onrender.com/api/admin/coupons');
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        setCouponsList(data.coupons);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Open Edit Drawer
  const handleEditCoupon = (coupon) => {
    setCurrentCoupon({
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      type: coupon.type,
      discountValue: coupon.discountValue,
      unit: coupon.type === 'Percentage' ? '%' : '₹',
      appliesTo: coupon.appliesTo,
      channel: [...coupon.channel],
      userScope: coupon.userScope || 'all',
      selectedEmails: coupon.selectedEmails ? [...coupon.selectedEmails] : [],
      selectedProducts: coupon.selectedProducts ? [...coupon.selectedProducts] : [],
      selectedCategories: coupon.selectedCategories ? [...coupon.selectedCategories] : [],
      selectedBrands: coupon.selectedBrands ? [...coupon.selectedBrands] : (coupon.appliesTo === 'CTR Brand' ? ['CTR'] : []),
      startDate: coupon.startDate || '2026-06-20',
      endDate: coupon.endDate || '2026-06-30',
      usageLimit: coupon.usageLimit,
      limitPerCustomer: coupon.limitPerCustomer || 1,
      hasMinOrder: coupon.hasMinOrder ?? true,
      minOrderValue: coupon.minOrderValue || 1000,
      hasMaxDiscount: coupon.hasMaxDiscount ?? false,
      maxDiscount: coupon.maxDiscount || 0,
      status: coupon.status
    });
    setUserSearchQuery('');
    setCustomEmailInput('');
    setDrawerMode('edit');
    setDrawerActiveTab('Details');
    setIsDrawerOpen(true);
    setActionMenuOpenId(null);
  };

  // Open Create Drawer
  const handleCreateCoupon = () => {
    setCurrentCoupon({
      id: null,
      code: '',
      name: '',
      description: '',
      type: 'Percentage',
      discountValue: 15,
      unit: '%',
      appliesTo: '',
      channel: [],
      userScope: '',
      selectedEmails: [],
      selectedProducts: [],
      selectedCategories: [],
      selectedBrands: [],
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      usageLimit: 500,
      limitPerCustomer: 1,
      hasMinOrder: true,
      minOrderValue: 1000,
      hasMaxDiscount: false,
      maxDiscount: 0,
      status: 'Active'
    });
    setUserSearchQuery('');
    setCustomEmailInput('');
    setDrawerMode('create');
    setDrawerActiveTab('Details');
    setIsDrawerOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleCreateCoupon,
    handleEditCoupon
  }));

  const handleGenerateCode = () => {
    const prefixes = ['SAVE', 'DZIR', 'DEAL', 'FLAT', 'MEGA', 'BEST', 'COOL', 'FAST', 'SHOP', 'GIFT'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setCurrentCoupon(prev => ({ ...prev, code: `${randomPrefix}${randomNum}` }));
  };

  const handleAddMultipleCustomEmail = () => {
    if (!customEmailInput.trim()) return;
    const splitEmails = customEmailInput
      .split(/[,;\s]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e && e.includes('@'));

    if (splitEmails.length === 0) {
      alert('Please enter a valid email address with @ symbol.');
      return;
    }

    setCurrentCoupon(prev => ({
      ...prev,
      selectedEmails: Array.from(new Set([...(prev.selectedEmails || []), ...splitEmails]))
    }));
    setCustomEmailInput('');
  };

  const handleSaveCoupon = (e) => {
    if (e) e.preventDefault();
    if (!currentCoupon.code || !currentCoupon.code.trim()) {
      alert('Coupon code is required');
      return;
    }
    if (currentCoupon.code.trim().length !== 6) {
      alert(`Coupon code must be exactly 6 characters (Current: ${currentCoupon.code.trim().length} characters).`);
      return;
    }

    if (!currentCoupon.channel || currentCoupon.channel.length === 0) {
      alert('Please select at least one sales channel (Online or Store).');
      return;
    }

    if (!currentCoupon.appliesTo && !currentCoupon.userScope) {
      alert('Please select an option for "Applies To".');
      return;
    }

    // Validation for User Selection
    if (currentCoupon.userScope === 'single' && (!currentCoupon.selectedEmails || currentCoupon.selectedEmails.length === 0)) {
      alert('Please select or enter the customer email address for this 1-user coupon.');
      return;
    }
    if (currentCoupon.userScope === 'multiple' && (!currentCoupon.selectedEmails || currentCoupon.selectedEmails.length === 0)) {
      alert('Please select or add at least one customer email address for this multiple-user coupon.');
      return;
    }

    // Validation for Product, Category, and Brand Selection
    if (currentCoupon.appliesTo === 'Selected Products' && (!currentCoupon.selectedProducts || currentCoupon.selectedProducts.length === 0)) {
      alert('Please select at least one product for this coupon.');
      setIsProductPickerOpen(true);
      return;
    }
    if (currentCoupon.appliesTo === 'Category' && (!currentCoupon.selectedCategories || currentCoupon.selectedCategories.length === 0)) {
      alert('Please select at least one category for this coupon.');
      setIsCategoryPickerOpen(true);
      return;
    }
    if ((currentCoupon.appliesTo === 'Brand' || currentCoupon.appliesTo.includes('Brand')) && (!currentCoupon.selectedBrands || currentCoupon.selectedBrands.length === 0)) {
      alert('Please select at least one brand for this coupon.');
      setIsBrandPickerOpen(true);
      return;
    }

    const discountDisplay = currentCoupon.type === 'Free Shipping'
      ? 'Free Shipping'
      : currentCoupon.type === 'Percentage'
        ? `${currentCoupon.discountValue}% OFF`
        : `₹${currentCoupon.discountValue} OFF`;

    // Format validity display
    const startParts = currentCoupon.startDate.split('-');
    const endParts = currentCoupon.endDate.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startStr = startParts.length === 3 ? `${parseInt(startParts[2])} ${monthNames[parseInt(startParts[1]) - 1]}` : currentCoupon.startDate;
    const endStr = endParts.length === 3 ? `${parseInt(endParts[2])} ${monthNames[parseInt(endParts[1]) - 1]} ${endParts[0]}` : currentCoupon.endDate;
    const validityDisplay = `${startStr} - ${endStr}`;

    if (drawerMode === 'edit' && currentCoupon.id) {
      const updatedCoupon = {
        ...currentCoupon,
        code: currentCoupon.code.toUpperCase(),
        discountDisplay,
        validityDisplay
      };
      setCouponsList(prev => prev.map(item => item.id === currentCoupon.id ? updatedCoupon : item));
      showToast(`Coupon "${currentCoupon.code.toUpperCase()}" updated successfully!`);

      fetch(`https://dzire-backend.onrender.com/api/admin/coupons/${encodeURIComponent(currentCoupon.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCoupon)
      }).catch(err => console.error('Error updating coupon:', err));
    } else {
      const newCoupon = {
        ...currentCoupon,
        id: String(Date.now()),
        code: currentCoupon.code.toUpperCase(),
        discountDisplay,
        validityDisplay,
        usageCount: 0
      };
      setCouponsList(prev => [newCoupon, ...prev]);
      showToast(`New coupon "${currentCoupon.code.toUpperCase()}" created!`);

      fetch('https://dzire-backend.onrender.com/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon)
      }).catch(err => console.error('Error creating coupon:', err));
    }
    setIsDrawerOpen(false);
  };

  const handleDuplicate = (coupon) => {
    const baseCode = (coupon.code || 'COUPON').slice(0, 4);
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const duplicatedCode = `${baseCode}${randomSuffix}`.slice(0, 6);
    const duplicated = {
      ...coupon,
      id: String(Date.now()),
      code: duplicatedCode,
      name: `${coupon.name} (Copy)`,
      userScope: coupon.userScope || 'all',
      selectedEmails: coupon.selectedEmails ? [...coupon.selectedEmails] : [],
      usageCount: 0,
      status: 'Draft'
    };
    setCouponsList(prev => [duplicated, ...prev]);
    showToast(`Duplicated coupon code "${duplicated.code}" created!`);
    setActionMenuOpenId(null);

    fetch('https://dzire-backend.onrender.com/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicated)
    }).catch(err => console.error('Error duplicating coupon:', err));
  };

  const handleToggleStatus = (id) => {
    let nextStatus = 'Active';
    setCouponsList(prev => prev.map(c => {
      if (c.id === id) {
        nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    setActionMenuOpenId(null);

    fetch(`https://dzire-backend.onrender.com/api/admin/coupons/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).catch(err => console.error('Error toggling coupon status:', err));
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCouponsList(prev => prev.filter(c => c.id !== id));
      showToast('Coupon removed successfully.');
      setActionMenuOpenId(null);

      fetch(`https://dzire-backend.onrender.com/api/admin/coupons/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }).catch(err => console.error('Error deleting coupon:', err));
    }
  };

  const handleToggleChannel = (channelName) => {
    setCurrentCoupon(prev => {
      const exists = prev.channel.includes(channelName);
      if (exists) {
        if (prev.channel.length === 1) return prev; // At least one channel required
        return { ...prev, channel: prev.channel.filter(c => c !== channelName) };
      } else {
        return { ...prev, channel: [...prev.channel, channelName] };
      }
    });
  };

  // Metric Computations
  const totalCount = couponsList.length;
  const activeCount = couponsList.filter(c => c.status === 'Active').length;
  const scheduledCount = couponsList.filter(c => c.status === 'Scheduled').length;
  const expiredCount = couponsList.filter(c => c.status === 'Expired').length;
  const draftCount = couponsList.filter(c => c.status === 'Draft').length;

  // Filtered List
  const filteredCoupons = useMemo(() => {
    return couponsList.filter(coupon => {
      // Tab filter
      if (selectedTab !== 'All' && coupon.status !== selectedTab) {
        return false;
      }
      // Status dropdown filter
      if (statusFilter !== 'All' && coupon.status !== statusFilter) {
        return false;
      }
      // Audience / User Scope filter
      if (audienceFilter !== 'All') {
        const scope = coupon.userScope || 'all';
        if (audienceFilter === 'All Users' && scope !== 'all') return false;
        if (audienceFilter === 'Single User' && scope !== 'single') return false;
        if (audienceFilter === 'Multiple Users' && scope !== 'multiple') return false;
      }
      // Channel filter
      if (channelFilter !== 'All') {
        if (channelFilter === 'Online' && !coupon.channel.includes('Online')) return false;
        if (channelFilter === 'Store' && !coupon.channel.includes('Store')) return false;
      }
      // Discount Type filter
      if (discountTypeFilter !== 'All') {
        if (discountTypeFilter === 'Percentage' && coupon.type !== 'Percentage') return false;
        if (discountTypeFilter === 'Flat Discount' && coupon.type !== 'Flat Discount') return false;
        if (discountTypeFilter === 'Free Shipping' && coupon.type !== 'Free Shipping') return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          coupon.code.toLowerCase().includes(q) ||
          coupon.name.toLowerCase().includes(q) ||
          coupon.discountDisplay.toLowerCase().includes(q) ||
          coupon.appliesTo.toLowerCase().includes(q) ||
          (coupon.selectedEmails && coupon.selectedEmails.some(em => em.toLowerCase().includes(q)));
        if (!matches) return false;
      }
      return true;
    });
  }, [couponsList, selectedTab, statusFilter, channelFilter, discountTypeFilter, audienceFilter, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCoupons.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCoupons.map(c => c.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setChannelFilter('All');
    setDiscountTypeFilter('All');
    setStatusFilter('All');
    setSelectedTab('All');
    setAudienceFilter('All');
  };

  // Unified "Applies To" Section with expandable Single User & Multiple Users Email Pickers
  const renderAppliesToSection = () => {
    const filteredDirectory = defaultCustomersDirectory.filter(cust =>
      cust.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    const isSingleUserSelected = currentCoupon.userScope === 'single';
    const isMultipleUsersSelected = currentCoupon.userScope === 'multiple';
    const isAllProducts = currentCoupon.appliesTo === 'All Products' && currentCoupon.userScope === 'all';
    const isSelectedProducts = currentCoupon.appliesTo === 'Selected Products' && currentCoupon.userScope === 'all';
    const isCategory = currentCoupon.appliesTo === 'Category' && currentCoupon.userScope === 'all';
    const isBrand = (currentCoupon.appliesTo === 'Brand' || currentCoupon.appliesTo.includes('Brand')) && currentCoupon.userScope === 'all';

    return (
      <div>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
          <span>Applies To <span style={{ color: '#ef4444' }}>*</span></span>
          {(isSingleUserSelected || isMultipleUsersSelected) && (
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: isSingleUserSelected ? '#eff6ff' : '#f5f3ff',
              color: isSingleUserSelected ? '#1d4ed8' : '#6d28d9',
              border: `1px solid ${isSingleUserSelected ? '#bfdbfe' : '#ddd6fe'}`
            }}>
              {isSingleUserSelected
                ? (currentCoupon.selectedEmails?.length > 0 ? '✓ 1 User Configured' : '⚠ Email Required')
                : `${currentCoupon.selectedEmails?.length || 0} Users Configured`}
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
            border: isAllProducts ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
            backgroundColor: isAllProducts ? '#fff7ed' : '#ffffff',
            transition: 'all 0.15s ease'
          }}>
            <input
              type="radio"
              name="appliesTo"
              checked={isAllProducts}
              onChange={() => setCurrentCoupon({
                ...currentCoupon,
                appliesTo: 'All Products',
                userScope: 'all',
                selectedEmails: []
              })}
              style={{ accentColor: '#ff6600', cursor: 'pointer' }}
            />
            <Globe size={15} color={isAllProducts ? '#ff6600' : '#64748b'} />
            <span style={{ fontWeight: isAllProducts ? '700' : '500', color: isAllProducts ? '#9a3412' : '#374151' }}>
              All Products
            </span>
          </label>

          {/* Option 2: 1 User Only (Single User) - Opens email picker on click */}
          <div style={{
            borderRadius: '8px',
            border: isSingleUserSelected ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
            backgroundColor: isSingleUserSelected ? '#fff7ed' : '#ffffff',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              fontSize: '13.5px',
              color: '#374151',
              cursor: 'pointer',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <input
                  type="radio"
                  name="appliesTo"
                  checked={isSingleUserSelected}
                  onChange={() => setCurrentCoupon(prev => ({
                    ...prev,
                    appliesTo: 'Single User',
                    userScope: 'single',
                    selectedEmails: prev.selectedEmails?.length > 0 ? [prev.selectedEmails[0]] : []
                  }))}
                  style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                />
                <User size={15} color={isSingleUserSelected ? '#ff6600' : '#64748b'} />
                <div>
                  <span style={{ fontWeight: isSingleUserSelected ? '700' : '500', color: isSingleUserSelected ? '#9a3412' : '#374151', display: 'inline-block' }}>
                    1 User Only (Single User by Email)
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: isSingleUserSelected ? '#c2410c' : '#64748b' }}>
                    Assign discount to only 1 specific customer email
                  </span>
                </div>
              </div>
              {isSingleUserSelected && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: currentCoupon.selectedEmails?.length > 0 ? '#dcfce7' : '#eff6ff',
                  color: currentCoupon.selectedEmails?.length > 0 ? '#166534' : '#1d4ed8',
                  whiteSpace: 'nowrap'
                }}>
                  {currentCoupon.selectedEmails?.length > 0 ? '✓ Email Added' : 'Select Email'}
                </span>
              )}
            </label>

            {/* Expands when 1 User Only is clicked */}
            {isSingleUserSelected && (
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid #fed7aa',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                    Choose or Enter Customer Email: <span style={{ color: '#ef4444' }}>*</span>
                  </span>
                  {currentCoupon.selectedEmails?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentCoupon(prev => ({ ...prev, selectedEmails: [] }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '11px',
                        color: '#ef4444',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {currentCoupon.selectedEmails?.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {currentCoupon.selectedEmails[0]?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#166534' }}>
                          {defaultCustomersDirectory.find(c => c.email.toLowerCase() === currentCoupon.selectedEmails[0]?.toLowerCase())?.name || 'Assigned Customer'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={11} />
                          <span>{currentCoupon.selectedEmails[0]}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentCoupon(prev => ({ ...prev, selectedEmails: [] }))}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #86efac',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#166534',
                        cursor: 'pointer'
                      }}
                    >
                      Change User
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ position: 'relative', marginBottom: '8px' }}>
                      <Search size={13} style={{ position: 'absolute', left: '9px', top: '9px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search customer by name or enter email..."
                        value={userSearchQuery}
                        onChange={e => setUserSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 8px 7px 28px',
                          fontSize: '12.5px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Quick custom email button */}
                    {userSearchQuery.trim().includes('@') && !filteredDirectory.some(c => c.email.toLowerCase() === userSearchQuery.trim().toLowerCase()) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentCoupon(prev => ({ ...prev, selectedEmails: [userSearchQuery.trim().toLowerCase()] }));
                          setUserSearchQuery('');
                        }}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          backgroundColor: '#eff6ff',
                          border: '1px dashed #3b82f6',
                          borderRadius: '6px',
                          color: '#1d4ed8',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          marginBottom: '8px'
                        }}
                      >
                        <Plus size={13} />
                        <span>Assign email: <strong>{userSearchQuery.trim()}</strong></span>
                      </button>
                    )}

                    {/* Customer Directory List */}
                    <div style={{
                      maxHeight: '140px',
                      overflowY: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff'
                    }}>
                      {filteredDirectory.map(cust => (
                        <div
                          key={cust.id}
                          onClick={() => {
                            setCurrentCoupon(prev => ({ ...prev, selectedEmails: [cust.email] }));
                            setUserSearchQuery('');
                          }}
                          style={{
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer'
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#e2e8f0',
                              color: '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: '700'
                            }}>
                              {cust.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>{cust.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{cust.email}</div>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '9.5px',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            backgroundColor: cust.type === 'VIP' ? '#fef3c7' : '#f1f5f9',
                            color: cust.type === 'VIP' ? '#b45309' : '#475569',
                            fontWeight: '600'
                          }}>
                            {cust.type}
                          </span>
                        </div>
                      ))}
                      {filteredDirectory.length === 0 && (
                        <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '11.5px' }}>
                          No registered customer found. Enter an email address above to assign.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Option 3: Multiple Users - Opens multi-email picker on click */}
          <div style={{
            borderRadius: '8px',
            border: isMultipleUsersSelected ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
            backgroundColor: isMultipleUsersSelected ? '#fff7ed' : '#ffffff',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              fontSize: '13.5px',
              color: '#374151',
              cursor: 'pointer',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <input
                  type="radio"
                  name="appliesTo"
                  checked={isMultipleUsersSelected}
                  onChange={() => setCurrentCoupon(prev => ({
                    ...prev,
                    appliesTo: 'Multiple Users',
                    userScope: 'multiple'
                  }))}
                  style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                />
                <Users size={15} color={isMultipleUsersSelected ? '#ff6600' : '#64748b'} />
                <div>
                  <span style={{ fontWeight: isMultipleUsersSelected ? '700' : '500', color: isMultipleUsersSelected ? '#9a3412' : '#374151', display: 'inline-block' }}>
                    Multiple Users (Selected Customers)
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: isMultipleUsersSelected ? '#c2410c' : '#64748b' }}>
                    Assign discount to a specific list of user emails
                  </span>
                </div>
              </div>
              {isMultipleUsersSelected && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: currentCoupon.selectedEmails?.length > 0 ? '#ede9fe' : '#f1f5f9',
                  color: currentCoupon.selectedEmails?.length > 0 ? '#6d28d9' : '#64748b',
                  whiteSpace: 'nowrap'
                }}>
                  {currentCoupon.selectedEmails?.length || 0} Users Selected
                </span>
              )}
            </label>

            {/* Expands when Multiple Users is clicked */}
            {isMultipleUsersSelected && (
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid #fed7aa',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                    Add Customer Emails: <span style={{ color: '#ef4444' }}>*</span>
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const allEmails = defaultCustomersDirectory.map(c => c.email);
                        setCurrentCoupon(prev => ({
                          ...prev,
                          selectedEmails: Array.from(new Set([...(prev.selectedEmails || []), ...allEmails]))
                        }));
                      }}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      + Select All ({defaultCustomersDirectory.length})
                    </button>
                    {currentCoupon.selectedEmails?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCurrentCoupon(prev => ({ ...prev, selectedEmails: [] }))}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11px',
                          color: '#ef4444',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct type email row */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail size={13} style={{ position: 'absolute', left: '9px', top: '9px', color: '#94a3b8' }} />
                    <input
                      type="email"
                      placeholder="Type email and click Add (or comma separated)..."
                      value={customEmailInput}
                      onChange={e => setCustomEmailInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMultipleCustomEmail();
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '6px 8px 6px 28px',
                        fontSize: '12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMultipleCustomEmail}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Add Email
                  </button>
                </div>

                {/* Selected Emails Badges List */}
                {currentCoupon.selectedEmails?.length > 0 && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '6px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    maxHeight: '90px',
                    overflowY: 'auto',
                    marginBottom: '8px'
                  }}>
                    {currentCoupon.selectedEmails.map(email => (
                      <span
                        key={email}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 7px',
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#1d4ed8'
                        }}
                      >
                        <Mail size={10} />
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentCoupon(prev => ({
                              ...prev,
                              selectedEmails: prev.selectedEmails.filter(e => e !== email)
                            }));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: '#1e40af',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Registered Customers Directory Checklist */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>
                      Registered Customers Directory:
                    </span>
                    <div style={{ position: 'relative', width: '140px' }}>
                      <Search size={11} style={{ position: 'absolute', left: '6px', top: '7px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={userSearchQuery}
                        onChange={e => setUserSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '3px 5px 3px 22px',
                          fontSize: '11px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{
                    maxHeight: '130px',
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff'
                  }}>
                    {filteredDirectory.map(cust => {
                      const isChecked = currentCoupon.selectedEmails?.includes(cust.email);
                      return (
                        <label
                          key={cust.id}
                          style={{
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            backgroundColor: isChecked ? '#f0fdf4' : '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <input
                              type="checkbox"
                              checked={isChecked || false}
                              onChange={() => {
                                setCurrentCoupon(prev => {
                                  const list = prev.selectedEmails || [];
                                  if (list.includes(cust.email)) {
                                    return { ...prev, selectedEmails: list.filter(e => e !== cust.email) };
                                  } else {
                                    return { ...prev, selectedEmails: [...list, cust.email] };
                                  }
                                });
                              }}
                              style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>{cust.name}</span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>({cust.email})</span>
                          </div>
                          <span style={{
                            fontSize: '9.5px',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            backgroundColor: cust.type === 'VIP' ? '#fef3c7' : '#f1f5f9',
                            color: cust.type === 'VIP' ? '#b45309' : '#475569',
                            fontWeight: '600'
                          }}>
                            {cust.type}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Option 4: Selected Products (Opens Product Catalog Popup) */}
          <div style={{
            borderRadius: '8px',
            border: isSelectedProducts ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
            backgroundColor: isSelectedProducts ? '#fff7ed' : '#ffffff',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              fontSize: '13.5px',
              color: '#374151',
              cursor: 'pointer',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <input
                  type="radio"
                  name="appliesTo"
                  checked={isSelectedProducts}
                  onChange={() => {
                    setCurrentCoupon(prev => ({
                      ...prev,
                      appliesTo: 'Selected Products',
                      userScope: 'all',
                      selectedEmails: []
                    }));
                    setIsProductPickerOpen(true);
                  }}
                  style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                />
                <Package size={15} color={isSelectedProducts ? '#ff6600' : '#64748b'} />
                <div>
                  <span style={{ fontWeight: isSelectedProducts ? '700' : '500', color: isSelectedProducts ? '#9a3412' : '#374151' }}>
                    Selected Products
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: isSelectedProducts ? '#c2410c' : '#64748b' }}>
                    Choose specific products from catalog popup
                  </span>
                </div>
              </div>
              {isSelectedProducts && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: currentCoupon.selectedProducts?.length > 0 ? '#dcfce7' : '#eff6ff',
                  color: currentCoupon.selectedProducts?.length > 0 ? '#166534' : '#1d4ed8',
                  whiteSpace: 'nowrap'
                }}>
                  {currentCoupon.selectedProducts?.length > 0 ? `✓ ${currentCoupon.selectedProducts.length} Products` : 'Choose Products'}
                </span>
              )}
            </label>

            {/* Expands when Selected Products is clicked */}
            {isSelectedProducts && (
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid #fed7aa',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                    Selected Products List ({currentCoupon.selectedProducts?.length || 0}):
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
                    <span>{currentCoupon.selectedProducts?.length > 0 ? 'Change / Add Products' : '+ Open Products Popup'}</span>
                  </button>
                </div>

                {/* Selected Products Preview Cards */}
                {currentCoupon.selectedProducts?.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    maxHeight: '160px',
                    overflowY: 'auto'
                  }}>
                    {currentCoupon.selectedProducts.map(prodId => {
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
                              setCurrentCoupon(prev => ({
                                ...prev,
                                selectedProducts: prev.selectedProducts.filter(id => id !== prod.id)
                              }));
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

          {/* Option 5: Category (Opens Category Selector Popup) */}
          <div style={{
            borderRadius: '8px',
            border: isCategory ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
            backgroundColor: isCategory ? '#fff7ed' : '#ffffff',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              fontSize: '13.5px',
              color: '#374151',
              cursor: 'pointer',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <input
                  type="radio"
                  name="appliesTo"
                  checked={isCategory}
                  onChange={() => {
                    setCurrentCoupon(prev => ({
                      ...prev,
                      appliesTo: 'Category',
                      userScope: 'all',
                      selectedEmails: []
                    }));
                    setIsCategoryPickerOpen(true);
                  }}
                  style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                />
                <Layers size={15} color={isCategory ? '#ff6600' : '#64748b'} />
                <div>
                  <span style={{ fontWeight: isCategory ? '700' : '500', color: isCategory ? '#9a3412' : '#374151' }}>
                    Category
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: isCategory ? '#c2410c' : '#64748b' }}>
                    Apply discount to specific product categories
                  </span>
                </div>
              </div>
              {isCategory && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: currentCoupon.selectedCategories?.length > 0 ? '#dcfce7' : '#eff6ff',
                  color: currentCoupon.selectedCategories?.length > 0 ? '#166534' : '#1d4ed8',
                  whiteSpace: 'nowrap'
                }}>
                  {currentCoupon.selectedCategories?.length > 0 ? `✓ ${currentCoupon.selectedCategories.length} Categories` : 'Choose Categories'}
                </span>
              )}
            </label>

            {/* Expands when Category is clicked */}
            {isCategory && (
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid #fed7aa',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                    Selected Categories ({currentCoupon.selectedCategories?.length || 0}):
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
                    <span>{currentCoupon.selectedCategories?.length > 0 ? 'Change Categories' : '+ Open Category Popup'}</span>
                  </button>
                </div>

                {/* Selected Category Badges */}
                {currentCoupon.selectedCategories?.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {currentCoupon.selectedCategories.map(catId => {
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
                              setCurrentCoupon(prev => ({
                                ...prev,
                                selectedCategories: prev.selectedCategories.filter(id => id !== catId)
                              }));
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

          {/* Option 6: Brand (Opens Brand Selector Popup) */}
          <div style={{
            borderRadius: '8px',
            border: isBrand ? '1.5px solid #ff6600' : '1px solid #e2e8f0',
            backgroundColor: isBrand ? '#fff7ed' : '#ffffff',
            overflow: 'hidden',
            transition: 'all 0.15s ease'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              fontSize: '13.5px',
              color: '#374151',
              cursor: 'pointer',
              padding: '10px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <input
                  type="radio"
                  name="appliesTo"
                  checked={isBrand}
                  onChange={() => {
                    setCurrentCoupon(prev => ({
                      ...prev,
                      appliesTo: 'Brand',
                      userScope: 'all',
                      selectedEmails: []
                    }));
                    setIsBrandPickerOpen(true);
                  }}
                  style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                />
                <Tag size={15} color={isBrand ? '#ff6600' : '#64748b'} />
                <div>
                  <span style={{ fontWeight: isBrand ? '700' : '500', color: isBrand ? '#9a3412' : '#374151' }}>
                    Brand
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: isBrand ? '#c2410c' : '#64748b' }}>
                    Apply discount only to items of selected brands
                  </span>
                </div>
              </div>
              {isBrand && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: currentCoupon.selectedBrands?.length > 0 ? '#dcfce7' : '#eff6ff',
                  color: currentCoupon.selectedBrands?.length > 0 ? '#166534' : '#1d4ed8',
                  whiteSpace: 'nowrap'
                }}>
                  {currentCoupon.selectedBrands?.length > 0 ? `✓ ${currentCoupon.selectedBrands.length} Brands` : 'Choose Brands'}
                </span>
              )}
            </label>

            {/* Expands when Brand is clicked */}
            {isBrand && (
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid #fed7aa',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                    Selected Brands ({currentCoupon.selectedBrands?.length || 0}):
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
                    <span>{currentCoupon.selectedBrands?.length > 0 ? 'Change Brands' : '+ Open Brand Popup'}</span>
                  </button>
                </div>

                {/* Selected Brand Badges */}
                {currentCoupon.selectedBrands?.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {currentCoupon.selectedBrands.map(brandId => {
                      const b = defaultBrandsCatalog.find(item => item.id === brandId);
                      return (
                        <span
                          key={brandId}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 9px',
                            backgroundColor: '#f5f3ff',
                            border: '1px solid #ddd6fe',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#6d28d9'
                          }}
                        >
                          <span style={{ fontSize: '10px', backgroundColor: '#e9d5ff', padding: '1px 4px', borderRadius: '3px' }}>
                            {b?.code || brandId}
                          </span>
                          <span>{b?.name || brandId}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentCoupon(prev => ({
                                ...prev,
                                selectedBrands: prev.selectedBrands.filter(id => id !== brandId)
                              }));
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#5b21b6',
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
                    No brands selected. <strong>Click here to open brand selection popup.</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Popup Modal 1: Product Picker Modal
  const renderProductPickerModal = () => {
    if (!isProductPickerOpen) return null;

    const categoriesList = ['All', ...new Set(defaultProductsCatalog.map(p => p.category))];
    const filteredProducts = defaultProductsCatalog.filter(p => {
      if (productPickerCategoryFilter !== 'All' && p.category !== productPickerCategoryFilter) return false;
      if (productPickerSearch.trim()) {
        const q = productPickerSearch.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    const selectedIds = currentCoupon.selectedProducts || [];

    const toggleProduct = (productId) => {
      setCurrentCoupon(prev => {
        const list = prev.selectedProducts || [];
        if (list.includes(productId)) {
          return { ...prev, selectedProducts: list.filter(id => id !== productId) };
        } else {
          return { ...prev, selectedProducts: [...list, productId] };
        }
      });
    };

    const selectAllFiltered = () => {
      const filteredIds = filteredProducts.map(p => p.id);
      setCurrentCoupon(prev => ({
        ...prev,
        selectedProducts: Array.from(new Set([...(prev.selectedProducts || []), ...filteredIds]))
      }));
    };

    const clearProductSelection = () => {
      setCurrentCoupon(prev => ({ ...prev, selectedProducts: [] }));
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
                  Select Products for Coupon
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Choose which specific items this coupon discount applies to.
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
  };

  // Popup Modal 2: Category Picker Modal
  const renderCategoryPickerModal = () => {
    if (!isCategoryPickerOpen) return null;

    const filteredCategories = defaultCategoriesCatalog.filter(c =>
      c.name.toLowerCase().includes(categoryPickerSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(categoryPickerSearch.toLowerCase())
    );

    const selectedList = currentCoupon.selectedCategories || [];

    const toggleCategory = (catId) => {
      setCurrentCoupon(prev => {
        const list = prev.selectedCategories || [];
        if (list.includes(catId)) {
          return { ...prev, selectedCategories: list.filter(id => id !== catId) };
        } else {
          return { ...prev, selectedCategories: [...list, catId] };
        }
      });
    };

    const selectAll = () => {
      setCurrentCoupon(prev => ({
        ...prev,
        selectedCategories: defaultCategoriesCatalog.map(c => c.id)
      }));
    };

    const clearAll = () => {
      setCurrentCoupon(prev => ({ ...prev, selectedCategories: [] }));
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
                  Select Eligible Categories
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Coupon discount will apply to all products within selected categories.
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsCategoryPickerOpen(false)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
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
                onClick={() => setIsCategoryPickerOpen(false)}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#ff6600',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Apply Categories ({selectedList.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Popup Modal 3: Brand Picker Modal
  const renderBrandPickerModal = () => {
    if (!isBrandPickerOpen) return null;

    const filteredBrands = defaultBrandsCatalog.filter(b =>
      b.name.toLowerCase().includes(brandPickerSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(brandPickerSearch.toLowerCase()) ||
      b.code.toLowerCase().includes(brandPickerSearch.toLowerCase())
    );

    const selectedList = currentCoupon.selectedBrands || [];

    const toggleBrand = (brandId) => {
      setCurrentCoupon(prev => {
        const list = prev.selectedBrands || [];
        if (list.includes(brandId)) {
          return { ...prev, selectedBrands: list.filter(id => id !== brandId) };
        } else {
          return { ...prev, selectedBrands: [...list, brandId] };
        }
      });
    };

    const selectAll = () => {
      setCurrentCoupon(prev => ({
        ...prev,
        selectedBrands: defaultBrandsCatalog.map(b => b.id)
      }));
    };

    const clearAll = () => {
      setCurrentCoupon(prev => ({ ...prev, selectedBrands: [] }));
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
                  Select Eligible Brands
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Coupon discount will apply only to items from selected brands.
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
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#e2e8f0',
                    color: '#334155',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {brand.code}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
                      {brand.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {brand.count} items
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsBrandPickerOpen(false)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
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
                onClick={() => setIsBrandPickerOpen(false)}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#ff6600',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Apply Brands ({selectedList.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

      {/* Header Action Row */}
      {!hideHeaderActions && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Coupons
            </h2>
            <p style={{ fontSize: '13.5px', color: '#6b7280', margin: 0 }}>
              Create and manage coupon codes for your online and physical stores.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ExportDropdown
              fileName="Dzire_Coupons_Export"
              title="Coupons Master Register"
              headers={['Coupon Code', 'Coupon Name', 'Type', 'Discount', 'Customer Scope', 'Assigned Emails', 'Applies To', 'Channel', 'Validity', 'Usage', 'Status']}
              rows={filteredCoupons.map(c => [
                c.code,
                c.name,
                c.type,
                c.discountDisplay,
                c.userScope === 'single' ? 'Single User (1 User)' : c.userScope === 'multiple' ? 'Multiple Users' : 'All Users',
                c.selectedEmails?.length ? c.selectedEmails.join(', ') : 'All Customers',
                c.appliesTo,
                c.channel.join(', '),
                c.validityDisplay,
                `${c.usageCount} / ${c.usageLimit}`,
                c.status
              ])}
            />

            <button
              onClick={handleCreateCoupon}
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
              <span>Create Coupon</span>
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
        {/* Card 1: Total Coupons */}
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
            <Ticket size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{totalCount}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Total Coupons</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>↑ 6</span>
              <span style={{ color: '#9ca3af', fontWeight: '400' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Coupons */}
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
            <PlayCircle size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{activeCount}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Active Coupons</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>↑ 3</span>
              <span style={{ color: '#9ca3af', fontWeight: '400' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Scheduled */}
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
            backgroundColor: '#dbeafe',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{scheduledCount}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Scheduled</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>—</span>
              <span style={{ color: '#9ca3af', fontWeight: '400' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Expired */}
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
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{expiredCount}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: '2px 0 3px 0' }}>Expired</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>↑ 2</span>
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
          {/* Left: Search input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '340px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by name, code or email..."
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Audience / User Scope Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Audience</span>
              <select
                value={audienceFilter}
                onChange={e => setAudienceFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
                  fontSize: '13px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Audiences</option>
                <option value="All Users">All Users</option>
                <option value="Single User">Single User (1 User)</option>
                <option value="Multiple Users">Multiple Users</option>
              </select>
            </div>

            {/* Channel filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Channel</span>
              <select
                value={channelFilter}
                onChange={e => setChannelFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
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

            {/* Discount Type filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Discount Type</span>
              <select
                value={discountTypeFilter}
                onChange={e => setDiscountTypeFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
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
                <option value="Free Shipping">Free Shipping</option>
              </select>
            </div>

            {/* Status filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Status</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
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
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Paused">Paused</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearAllFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6600',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 6px'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1080px' }}>
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
                    checked={selectedIds.length > 0 && selectedIds.length === filteredCoupons.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Coupon Code</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Coupon Name</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Type</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Discount</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Eligible Users</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Applies To</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Channel</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Validity</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Usage</th>
                <th style={{ padding: '12px 14px', backgroundColor: '#fafbfc' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: '#fafbfc' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map(coupon => {
                const isSelected = selectedIds.includes(coupon.id);
                const usageRatio = coupon.usageLimit > 0 ? (coupon.usageCount / coupon.usageLimit) * 100 : 0;
                const isFullUsage = coupon.usageCount >= coupon.usageLimit;

                return (
                  <tr
                    key={coupon.id}
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
                        onChange={() => toggleSelectRow(coupon.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>

                    {/* Code */}
                    <td style={{ padding: '14px 14px' }}>
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '13.5px',
                          fontWeight: '700',
                          color: '#111827',
                          fontFamily: 'monospace',
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        title="Click to edit"
                      >
                        {coupon.code}
                      </button>
                    </td>

                    {/* Name */}
                    <td style={{ padding: '14px 14px', fontSize: '13.5px', color: '#1f2937', fontWeight: '500' }}>
                      {coupon.name}
                    </td>

                    {/* Type Badge */}
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: coupon.type === 'Percentage' ? '#fff7ed' : '#ecfdf5',
                        color: coupon.type === 'Percentage' ? '#ea580c' : '#059669',
                        border: `1px solid ${coupon.type === 'Percentage' ? '#fed7aa' : '#a7f3d0'}`
                      }}>
                        {coupon.type}
                      </span>
                    </td>

                    {/* Discount */}
                    <td style={{ padding: '14px 14px', fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                      {coupon.discountDisplay}
                    </td>

                    {/* Eligible Users Scope Badge */}
                    <td style={{ padding: '14px 14px' }}>
                      {coupon.userScope === 'single' ? (
                        <div
                          title={`Single User: ${coupon.selectedEmails?.[0] || '1 user'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            maxWidth: '170px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <User size={12} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {coupon.selectedEmails?.[0] || '1 User'}
                          </span>
                        </div>
                      ) : coupon.userScope === 'multiple' ? (
                        <div
                          title={`Assigned to ${coupon.selectedEmails?.length || 0} users:\n${coupon.selectedEmails?.join('\n') || ''}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            backgroundColor: '#f5f3ff',
                            color: '#6d28d9',
                            border: '1px solid #ddd6fe',
                            cursor: 'help'
                          }}
                        >
                          <Users size={12} />
                          <span>{coupon.selectedEmails?.length || 0} Users</span>
                        </div>
                      ) : (
                        <div
                          title="Open for all registered and guest customers"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            backgroundColor: '#f0fdf4',
                            color: '#15803d',
                            border: '1px solid #bbf7d0'
                          }}
                        >
                          <Globe size={12} />
                          <span>All Users</span>
                        </div>
                      )}
                    </td>

                    {/* Applies To */}
                    <td style={{ padding: '14px 14px', fontSize: '13px' }}>
                      {coupon.appliesTo === 'Selected Products' ? (
                        <div
                          title={`Products: ${coupon.selectedProducts?.map(id => defaultProductsCatalog.find(p => p.id === id)?.name).filter(Boolean).join(', ') || 'Selected Products'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe'
                          }}
                        >
                          <Package size={12} />
                          <span>{coupon.selectedProducts?.length ? `${coupon.selectedProducts.length} Products` : 'Selected Products'}</span>
                        </div>
                      ) : coupon.appliesTo === 'Category' ? (
                        <div
                          title={`Categories: ${coupon.selectedCategories?.join(', ') || 'Category'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            backgroundColor: '#fdf4ff',
                            color: '#a21caf',
                            border: '1px solid #f5d0fe'
                          }}
                        >
                          <Layers size={12} />
                          <span>{coupon.selectedCategories?.length ? `${coupon.selectedCategories.join(', ')}` : 'Category'}</span>
                        </div>
                      ) : (coupon.appliesTo === 'Brand' || coupon.appliesTo.includes('Brand')) ? (
                        <div
                          title={`Brands: ${coupon.selectedBrands?.join(', ') || coupon.appliesTo}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            backgroundColor: '#f5f3ff',
                            color: '#6d28d9',
                            border: '1px solid #ddd6fe'
                          }}
                        >
                          <Tag size={12} />
                          <span>{coupon.selectedBrands?.length ? `${coupon.selectedBrands.join(', ')}` : coupon.appliesTo}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#4b5563' }}>
                          {coupon.appliesTo}
                        </span>
                      )}
                    </td>

                    {/* Channel Badges */}
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {coupon.channel.map(ch => (
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
                      {coupon.validityDisplay}
                    </td>

                    {/* Usage Progress */}
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ minWidth: '85px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          {coupon.usageCount} / {coupon.usageLimit}
                        </div>
                        <div style={{ width: '100%', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(usageRatio, 100)}%`,
                            height: '100%',
                            backgroundColor: isFullUsage || coupon.status === 'Expired' ? '#ef4444' : '#10b981',
                            borderRadius: '3px'
                          }} />
                        </div>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          coupon.status === 'Active' ? '#ecfdf5' :
                          coupon.status === 'Scheduled' ? '#eff6ff' :
                          coupon.status === 'Paused' ? '#fefce8' :
                          coupon.status === 'Expired' ? '#fef2f2' : '#f3f4f6',
                        color:
                          coupon.status === 'Active' ? '#059669' :
                          coupon.status === 'Scheduled' ? '#2563eb' :
                          coupon.status === 'Paused' ? '#ca8a04' :
                          coupon.status === 'Expired' ? '#dc2626' : '#6b7280'
                      }}>
                        {coupon.status}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', position: 'relative' }}>
                      <button
                        onClick={() => setActionMenuOpenId(actionMenuOpenId === coupon.id ? null : coupon.id)}
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
                      {actionMenuOpenId === coupon.id && (
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
                            onClick={() => handleEditCoupon(coupon)}
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
                            <span>Edit Coupon</span>
                          </button>

                          <button
                            onClick={() => handleDuplicate(coupon)}
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
                            onClick={() => handleToggleStatus(coupon.id)}
                            style={{
                              width: '100%',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'none',
                              border: 'none',
                              fontSize: '13px',
                              color: coupon.status === 'Active' ? '#d97706' : '#059669',
                              cursor: 'pointer'
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Power size={14} />
                            <span>{coupon.status === 'Active' ? 'Pause' : 'Activate'}</span>
                          </button>

                          <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }} />

                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
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

              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ padding: '36px 20px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                    No coupons found matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
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
            Showing 1-{Math.min(filteredCoupons.length, 10)} of {couponsList.length} coupons
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
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
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
              maxWidth: '620px',
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
        {/* Drawer Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>
            {drawerMode === 'edit' ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
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

        {/* Drawer Subtabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 24px',
          backgroundColor: '#ffffff',
          gap: '20px'
        }}>
          {['Details', 'Eligibility & Rules', 'Usage & Analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setDrawerActiveTab(tab)}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: drawerActiveTab === tab ? '700' : '500',
                color: drawerActiveTab === tab ? '#ff6600' : '#6b7280',
                borderBottom: drawerActiveTab === tab ? '2.5px solid #ff6600' : '2.5px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Drawer Body (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {drawerActiveTab === 'Details' && (
            <form onSubmit={handleSaveCoupon} id="coupon-drawer-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Coupon Code */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Coupon Code <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={currentCoupon.code}
                    onChange={e => setCurrentCoupon({ ...currentCoupon, code: e.target.value.slice(0, 6).toUpperCase() })}
                    placeholder="e.g. DZIR20"
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      letterSpacing: '0.04em',
                      border: currentCoupon.code.length === 6 ? '1.5px solid #10b981' : currentCoupon.code.length > 0 ? '1.5px solid #ff6600' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      boxShadow: currentCoupon.code.length === 6 ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    style={{
                      padding: '9px 14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#374151',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={14} color="#ff6600" />
                    Generate
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: '500',
                    color: currentCoupon.code.length === 6 ? '#059669' : currentCoupon.code.length > 0 ? '#d97706' : '#6b7280'
                  }}>
                    {currentCoupon.code.length === 6
                      ? '✓ Exactly 6 characters entered'
                      : currentCoupon.code.length > 0
                        ? `Total 6 characters required (${6 - currentCoupon.code.length} remaining)`
                        : 'Any characters allowed, total 6 characters.'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    fontFamily: 'monospace',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    backgroundColor: currentCoupon.code.length === 6 ? '#ecfdf5' : '#f3f4f6',
                    color: currentCoupon.code.length === 6 ? '#059669' : '#6b7280',
                    border: `1px solid ${currentCoupon.code.length === 6 ? '#a7f3d0' : '#e5e7eb'}`
                  }}>
                    {currentCoupon.code.length} / 6
                  </span>
                </div>
              </div>

              {/* Coupon Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Coupon Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentCoupon.name}
                  onChange={e => setCurrentCoupon({ ...currentCoupon, name: e.target.value })}
                  placeholder="e.g. Monsoon Sale"
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

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  maxLength="200"
                  value={currentCoupon.description}
                  onChange={e => setCurrentCoupon({ ...currentCoupon, description: e.target.value })}
                  placeholder="Write a brief description of the offer..."
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
                  {currentCoupon.description?.length || 0}/200
                </div>
              </div>

              {/* Discount Type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                  Discount Type
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'Percentage', label: 'Percentage Discount' },
                    { id: 'Flat Discount', label: 'Flat Discount' },
                    { id: 'Free Shipping', label: 'Free Shipping' }
                  ].map(dt => (
                    <label
                      key={dt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13.5px',
                        color: '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="discountType"
                        checked={currentCoupon.type === dt.id}
                        onChange={() => setCurrentCoupon({
                          ...currentCoupon,
                          type: dt.id,
                          unit: dt.id === 'Percentage' ? '%' : '₹'
                        })}
                        style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                      />
                      <span>{dt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount Value */}
              {currentCoupon.type !== 'Free Shipping' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Discount Value <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      required
                      min="1"
                      value={currentCoupon.discountValue}
                      onChange={e => setCurrentCoupon({ ...currentCoupon, discountValue: parseFloat(e.target.value) || 0 })}
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
                      value={currentCoupon.unit}
                      onChange={e => setCurrentCoupon({
                        ...currentCoupon,
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

              {/* Applies To (Unified with Single / Multiple User Email Selection) */}
              {renderAppliesToSection()}

              {/* Sales Channel */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                  Sales Channel <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#374151', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={currentCoupon.channel.includes('Online')}
                      onChange={() => handleToggleChannel('Online')}
                      style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                    />
                    <span>Online Store</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#374151', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={currentCoupon.channel.includes('Store')}
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
                      value={currentCoupon.startDate}
                      onChange={e => setCurrentCoupon({ ...currentCoupon, startDate: e.target.value })}
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
                      value={currentCoupon.endDate}
                      onChange={e => setCurrentCoupon({ ...currentCoupon, endDate: e.target.value })}
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

              {/* Usage Limit & Limit per Customer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={currentCoupon.usageLimit || ''}
                    onChange={e => setCurrentCoupon({ ...currentCoupon, usageLimit: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 500"
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
                    Limit per Customer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={currentCoupon.limitPerCustomer || ''}
                    onChange={e => setCurrentCoupon({ ...currentCoupon, limitPerCustomer: parseInt(e.target.value) || 1 })}
                    placeholder="1"
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
              </div>

              {/* Toggle 1: Minimum Order Value */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Switch button */}
                  <button
                    type="button"
                    onClick={() => setCurrentCoupon({ ...currentCoupon, hasMinOrder: !currentCoupon.hasMinOrder })}
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '12px',
                      backgroundColor: currentCoupon.hasMinOrder ? '#10b981' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      padding: 0
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '2px',
                      left: currentCoupon.hasMinOrder ? '20px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </button>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#374151' }}>
                    Minimum Order Value
                  </span>
                </div>

                <div style={{ position: 'relative', width: '120px' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '8px', color: '#9ca3af', fontSize: '13px' }}>₹</span>
                  <input
                    type="number"
                    disabled={!currentCoupon.hasMinOrder}
                    value={currentCoupon.minOrderValue}
                    onChange={e => setCurrentCoupon({ ...currentCoupon, minOrderValue: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '7px 8px 7px 24px',
                      fontSize: '13px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: currentCoupon.hasMinOrder ? '#ffffff' : '#f9fafb',
                      color: currentCoupon.hasMinOrder ? '#111827' : '#9ca3af'
                    }}
                  />
                </div>
              </div>

              {/* Toggle 2: Maximum Discount (Optional) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentCoupon({ ...currentCoupon, hasMaxDiscount: !currentCoupon.hasMaxDiscount })}
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '12px',
                      backgroundColor: currentCoupon.hasMaxDiscount ? '#10b981' : '#d1d5db',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      padding: 0
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '2px',
                      left: currentCoupon.hasMaxDiscount ? '20px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </button>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#374151' }}>
                    Maximum Discount (Optional)
                  </span>
                </div>

                <div style={{ position: 'relative', width: '120px' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '8px', color: '#9ca3af', fontSize: '13px' }}>₹</span>
                  <input
                    type="number"
                    disabled={!currentCoupon.hasMaxDiscount}
                    value={currentCoupon.maxDiscount}
                    onChange={e => setCurrentCoupon({ ...currentCoupon, maxDiscount: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '7px 8px 7px 24px',
                      fontSize: '13px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: currentCoupon.hasMaxDiscount ? '#ffffff' : '#f9fafb',
                      color: currentCoupon.hasMaxDiscount ? '#111827' : '#9ca3af'
                    }}
                  />
                </div>
              </div>
            </form>
          )}

          {/* Subtab 2: Eligibility & Rules */}
          {drawerActiveTab === 'Eligibility & Rules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Unified Applies To / Customer Selection Section */}
              {renderAppliesToSection()}

              {/* Minimum Item Quantity */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Minimum Item Quantity
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  defaultValue="1"
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

              {/* Exclude Discounted Items */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Exclude Discounted Items
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#374151', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#ff6600' }} />
                  <span>Do not apply if cart items are already on clearance / sale</span>
                </label>
              </div>
            </div>
          )}

          {/* Subtab 3: Usage & Analytics */}
          {drawerActiveTab === 'Usage & Analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Total Redemptions</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginTop: '4px' }}>
                  {currentCoupon.id ? (couponsList.find(c => c.id === currentCoupon.id)?.usageCount || 0) : 0} times
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Total Revenue Driven</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                  ₹{((currentCoupon.id ? (couponsList.find(c => c.id === currentCoupon.id)?.usageCount || 0) : 0) * 2450).toLocaleString()}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Total Discount Granted</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#ff6600', marginTop: '4px' }}>
                  ₹{((currentCoupon.id ? (couponsList.find(c => c.id === currentCoupon.id)?.usageCount || 0) : 0) * 450).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#ffffff'
        }}>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            style={{
              padding: '9px 18px',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveCoupon}
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
            {drawerMode === 'edit' ? 'Update Coupon' : 'Create Coupon'}
          </button>
          </div>
        </div>
      </div>
    )}

      {/* Popups for Product, Category, and Brand Selection */}
      {renderProductPickerModal()}
      {renderCategoryPickerModal()}
      {renderBrandPickerModal()}
    </div>
  );
});

export default AdminCouponsView;

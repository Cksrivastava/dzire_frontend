import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ExportDropdown from '../components/ExportDropdown';
import {
  Search, Plus, Filter, Image as ImageIcon, ChevronRight, ChevronLeft, Store, X,
  ArrowLeft, Package, Truck, Link as LinkIcon, Tag, Sliders,
  Calendar, Eye, EyeOff, FileText, Check, HelpCircle, Bold, Italic, List, ListOrdered,
  Quote, ChevronDown, ChevronUp, GripVertical, Layers, Trash2, Edit3,
  Lock, ExternalLink, Star, Send, Underline, Maximize2, RotateCw, Info, UploadCloud,
  CheckCircle2, ThumbsUp, MessageSquare
} from 'lucide-react';
import wsClient from '../../src/services/websocket';
import './AdminDashboard.css';

const InventoryModal = ({ title, onClose, onSubmit, submitText, submitColor, children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
      </div>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
        {children}
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
        <button onClick={onSubmit} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: submitColor || '#ff6600', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>{submitText || 'Save'}</button>
      </div>
    </div>
  </div>
);

const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [modalState, setModalState] = useState({ type: null, item: null });
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'web-info'
  const [webInfoItem, setWebInfoItem] = useState(null);
  const navigate = useNavigate();

  // Website Details State for "Add Product to Website"
  const [activeWebTab, setActiveWebTab] = useState('website-details');
  const [webTitle, setWebTitle] = useState('');
  const [webBrand, setWebBrand] = useState('');
  const [webCategory, setWebCategory] = useState('');
  const [webMrp, setWebMrp] = useState('');
  const [webSellingPrice, setWebSellingPrice] = useState('');
  const [webShortDesc, setWebShortDesc] = useState('');
  const [webLongDesc, setWebLongDesc] = useState('');
  const [publishOnWebsite, setPublishOnWebsite] = useState(false);
  const [previewImageIdx, setPreviewImageIdx] = useState(0);

  // SEO Meta State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoSlug, setSeoSlug] = useState('');
  const [seoKeywords, setSeoKeywords] = useState([]);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState('');
  const [seoOgImage, setSeoOgImage] = useState('');
  const [seoAllowRobots, setSeoAllowRobots] = useState(true);
  const [seoAllowSnippets, setSeoAllowSnippets] = useState(true);
  const [seoIncludeSitemap, setSeoIncludeSitemap] = useState(true);

  // Reviews Tab State & Handlers
  const [reviewsList, setReviewsList] = useState([]);

  // Helper to immediately persist reviews to localStorage and backend
  const persistReviews = (updated) => {
    if (!webInfoItem) return;
    const targetId = webInfoItem.id || webInfoItem._id;
    const slug = seoSlug || webInfoItem.seoSlug || webInfoItem.slug;
    const prodName = webInfoItem.name ? webInfoItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';

    if (targetId) {
      try {
        localStorage.setItem(`dzire_product_reviews_${targetId}`, JSON.stringify(updated));
      } catch (e) {}
    }
    if (slug) {
      try {
        localStorage.setItem(`dzire_product_reviews_${slug}`, JSON.stringify(updated));
      } catch (e) {}
    }
    if (prodName) {
      try {
        localStorage.setItem(`dzire_product_reviews_${prodName}`, JSON.stringify(updated));
      } catch (e) {}
    }

    if (targetId) {
      fetch(`https://dzire-backend.onrender.com/api/admin/products/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewsList: updated,
          reviews: String(updated.length),
        }),
      }).catch(() => {});
    }
  };

  const handleToggleHideReview = (id) => {
    setReviewsList(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r);
      persistReviews(updated);
      return updated;
    });
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      setReviewsList(prev => {
        const updated = prev.filter(r => r.id !== id);
        persistReviews(updated);
        return updated;
      });
    }
  };

  // Add / Edit Review Modal State & Handlers
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    date: '',
    title: '',
    comment: '',
    verified: true,
    hidden: false
  });

  const handleOpenAddReview = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setEditingReview(null);
    setReviewForm({
      name: '',
      rating: 5,
      date: todayStr,
      title: '',
      comment: '',
      verified: true,
      hidden: false
    });
    setShowReviewModal(true);
  };

  const handleOpenEditReview = (rev) => {
    setEditingReview(rev);
    setReviewForm({
      name: rev.name || '',
      rating: rev.rating || 5,
      date: rev.date || '',
      title: rev.title || '',
      comment: rev.comment || '',
      verified: rev.verified ?? true,
      hidden: rev.hidden ?? false
    });
    setShowReviewModal(true);
  };

  const handleSaveReview = () => {
    if (!reviewForm.name.trim()) {
      alert('Please enter reviewer name.');
      return;
    }
    if (!reviewForm.comment.trim()) {
      alert('Please enter review comment.');
      return;
    }

    const AVATAR_COLORS = ['#ea580c', '#2563eb', '#16a34a', '#9333ea', '#0284c7', '#db2777', '#d97706'];

    if (editingReview) {
      const updated = reviewsList.map(r => r.id === editingReview.id ? {
        ...r,
        ...reviewForm,
        name: reviewForm.name.trim(),
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
        rating: Number(reviewForm.rating)
      } : r);
      setReviewsList(updated);
      persistReviews(updated);
      alert('Review updated successfully!');
    } else {
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const newReviewItem = {
        id: Date.now(),
        ...reviewForm,
        name: reviewForm.name.trim(),
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
        rating: Number(reviewForm.rating),
        likes: 0,
        avatarColor: randomColor
      };
      const updated = [newReviewItem, ...reviewsList];
      setReviewsList(updated);
      persistReviews(updated);
      alert('New review added successfully!');
    }

    setShowReviewModal(false);
  };

  // Description Rich Text Editor Refs & Handlers
  const shortDescRef = useRef(null);
  const longDescRef = useRef(null);
  const fullscreenDescRef = useRef(null);
  const [shortHeadingVal, setShortHeadingVal] = useState('Paragraph');
  const [longHeadingVal, setLongHeadingVal] = useState('Paragraph');
  const [fullscreenEditor, setFullscreenEditor] = useState(null); // { isLong: boolean, title: string }

  const applyRichTextAction = (action, isLong = false, extraParam = '', isModal = false) => {
    let targetRef;
    if (isModal) {
      targetRef = fullscreenDescRef;
    } else {
      targetRef = isLong ? longDescRef : shortDescRef;
    }

    const value = isLong ? webLongDesc : webShortDesc;
    const setValue = isLong ? setWebLongDesc : setWebShortDesc;

    if (action === 'maximize') {
      setFullscreenEditor({
        title: isLong ? 'Long Description / Details' : 'Short Description',
        isLong
      });
      return;
    }

    const textarea = targetRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selectedText = value.substring(start, end);
    let replacement = '';
    let newCursorPos = start;

    switch (action) {
      case 'bold':
        if (selectedText) {
          replacement = `**${selectedText}**`;
          newCursorPos = start + replacement.length;
        } else {
          replacement = '**Bold Text**';
          newCursorPos = start + 2;
        }
        break;

      case 'italic':
        if (selectedText) {
          replacement = `*${selectedText}*`;
          newCursorPos = start + replacement.length;
        } else {
          replacement = '*Italic Text*';
          newCursorPos = start + 1;
        }
        break;

      case 'underline':
        if (selectedText) {
          replacement = `<u>${selectedText}</u>`;
          newCursorPos = start + replacement.length;
        } else {
          replacement = '<u>Underlined Text</u>';
          newCursorPos = start + 3;
        }
        break;

      case 'bullet':
        if (selectedText) {
          const lines = selectedText.split('\n');
          replacement = lines.map((l) => (l.startsWith('- ') ? l : `- ${l}`)).join('\n');
          newCursorPos = start + replacement.length;
        } else {
          replacement = '\n- Bullet Item 1\n- Bullet Item 2\n';
          newCursorPos = start + replacement.length;
        }
        break;

      case 'numbered':
        if (selectedText) {
          const lines = selectedText.split('\n');
          replacement = lines.map((l, i) => `${i + 1}. ${l.replace(/^\d+\.\s*/, '')}`).join('\n');
          newCursorPos = start + replacement.length;
        } else {
          replacement = '\n1. First Item\n2. Second Item\n';
          newCursorPos = start + replacement.length;
        }
        break;

      case 'link': {
        const url = window.prompt('Enter link URL (e.g. https://example.com):', 'https://');
        if (!url) return;
        const linkText = selectedText || 'Link Title';
        replacement = `[${linkText}](${url})`;
        newCursorPos = start + replacement.length;
        break;
      }

      case 'image': {
        const imgUrl = window.prompt('Enter image URL:', 'https://images.unsplash.com/');
        if (!imgUrl) return;
        const altText = selectedText || 'Product Image';
        replacement = `![${altText}](${imgUrl})`;
        newCursorPos = start + replacement.length;
        break;
      }

      case 'heading': {
        const hType = extraParam;
        if (isLong) setLongHeadingVal(hType);
        else setShortHeadingVal(hType);

        let prefix = '';
        if (hType === 'Heading 1') prefix = '# ';
        else if (hType === 'Heading 2') prefix = '## ';
        else if (hType === 'Heading 3') prefix = '### ';

        if (selectedText) {
          const cleanText = selectedText.replace(/^#{1,6}\s*/, '');
          replacement = prefix ? `${prefix}${cleanText}` : cleanText;
          newCursorPos = start + replacement.length;
        } else {
          const before = value.substring(0, start);
          const after = value.substring(start);
          const lastNewline = before.lastIndexOf('\n');
          const nextNewline = after.indexOf('\n') === -1 ? value.length : start + after.indexOf('\n');
          const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
          const currentLine = value.substring(lineStart, nextNewline);
          const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
          const newLine = prefix ? `${prefix}${cleanLine}` : cleanLine;

          const updated = value.substring(0, lineStart) + newLine + value.substring(nextNewline);
          setValue(updated);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(lineStart + newLine.length, lineStart + newLine.length);
          }, 0);
          return;
        }
        break;
      }

      default:
        return;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    setValue(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Web Variations State (Sizes stacked per color group)
  const [selectedWebVarIdx, setSelectedWebVarIdx] = useState(null);
  const [webVariations, setWebVariations] = useState([]);

  // Add Media to Variations Modal State
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedVarIdsForMedia, setSelectedVarIdsForMedia] = useState([]);
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [mediaFilterColor, setMediaFilterColor] = useState('All');
  const [mediaFilterSize, setMediaFilterSize] = useState('All');
  const [mediaUploadPreviews, setMediaUploadPreviews] = useState([]);

  const [editingVariation, setEditingVariation] = useState(null);

  // Table Multiple Selection and Bulk Edit State (all deselected on load)
  const [selectedTableVarIds, setSelectedTableVarIds] = useState([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditFields, setBulkEditFields] = useState({
    color: '',
    hex: '',
    size: '',
    status: 'Active',
    img: '',
    applyColor: false,
    applyHex: false,
    applySize: false,
    applyStatus: false,
    applyImg: false
  });

  const handleToggleSelectAllTableVars = () => {
    if (selectedTableVarIds.length === webVariations.length && webVariations.length > 0) {
      setSelectedTableVarIds([]);
    } else {
      setSelectedTableVarIds(webVariations.map(v => v.id));
    }
  };

  const handleToggleSelectTableVar = (id) => {
    setSelectedTableVarIds(prev =>
      prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
    );
  };

  const handleOpenBulkEdit = () => {
    if (selectedTableVarIds.length === 0) {
      alert('Please select at least one variation to edit.');
      return;
    }
    const firstSelected = webVariations.find(v => selectedTableVarIds.includes(v.id)) || {};
    setBulkEditFields({
      color: firstSelected.color || '',
      hex: firstSelected.hex || '#d62828',
      size: firstSelected.size || '',
      status: firstSelected.status || 'Active',
      img: firstSelected.img || '',
      applyColor: false,
      applyHex: false,
      applySize: false,
      applyStatus: false,
      applyImg: false
    });
    setShowBulkEditModal(true);
  };

  const handleApplyBulkEdit = () => {
    if (selectedTableVarIds.length === 0) return;
    setWebVariations(prev => prev.map(v => {
      if (selectedTableVarIds.includes(v.id)) {
        return {
          ...v,
          ...(bulkEditFields.applyColor && bulkEditFields.color ? { color: bulkEditFields.color } : {}),
          ...(bulkEditFields.applyHex && bulkEditFields.hex ? { hex: bulkEditFields.hex } : {}),
          ...(bulkEditFields.applySize && bulkEditFields.size ? { size: bulkEditFields.size } : {}),
          ...(bulkEditFields.applyStatus && bulkEditFields.status ? { status: bulkEditFields.status } : {}),
          ...(bulkEditFields.applyImg && bulkEditFields.img ? { img: bulkEditFields.img } : {})
        };
      }
      return v;
    }));
    alert(`Successfully updated ${selectedTableVarIds.length} selected variations!`);
    setShowBulkEditModal(false);
  };

  const toggleSelectVarForMedia = (id) => {
    setSelectedVarIdsForMedia(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFilteredVars = (filteredList) => {
    const allIds = filteredList.map(v => v.id);
    const isAllSelected = allIds.length > 0 && allIds.every(id => selectedVarIdsForMedia.includes(id));
    if (isAllSelected) {
      setSelectedVarIdsForMedia(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedVarIdsForMedia(prev => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const handleApplyMediaToVariations = () => {
    if (selectedVarIdsForMedia.length === 0) {
      alert('Please select at least one variation to apply media.');
      return;
    }
    const chosenImage = mediaUploadPreviews[0] || previewImages[0];
    setWebVariations(prev => prev.map(v => {
      if (selectedVarIdsForMedia.includes(v.id)) {
        return { ...v, img: chosenImage };
      }
      return v;
    }));
    alert(`Media successfully applied to ${selectedVarIdsForMedia.length} variations!`);
    setShowMediaModal(false);
  };

  const handleDeleteVariation = (id) => {
    if (window.confirm('Are you sure you want to delete this variation?')) {
      setWebVariations(prev => prev.filter(v => v.id !== id));
      setSelectedVarIdsForMedia(prev => prev.filter(vId => vId !== id));
      setSelectedTableVarIds(prev => prev.filter(vId => vId !== id));
    }
  };

  const availableColors = Array.from(new Set(webVariations.map(v => v.color)));
  const availableSizes = Array.from(new Set(webVariations.map(v => v.size)));

  const filteredModalVariations = webVariations.filter(v => {
    const matchesQuery = !mediaSearchQuery ||
      v.sku.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      v.color.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      v.size.toLowerCase().includes(mediaSearchQuery.toLowerCase());
    const matchesColor = mediaFilterColor === 'All' || v.color === mediaFilterColor;
    const matchesSize = mediaFilterSize === 'All' || v.size === mediaFilterSize;
    return matchesQuery && matchesColor && matchesSize;
  });

  // Specifications Tab State
  const [specifications, setSpecifications] = useState([]);

  // Additional Information State
  const [additionalInfo, setAdditionalInfo] = useState([]);

  // Gallery Images for Preview
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  const mediaFileInputRef = useRef(null);
  const variationFileInputRef = useRef(null);
  const seoOgFileInputRef = useRef(null);
  const singleVarFileInputRef = useRef(null);
  const [isUploadingSingleVar, setIsUploadingSingleVar] = useState(false);

  // Multer upload helper function
  const uploadFilesWithMulter = async (files) => {
    if (!files || files.length === 0) return [];
    setIsUploadingMedia(true);
    setUploadProgressText(`Uploading ${files.length} file(s) via Multer...`);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("https://dzire-backend.onrender.com/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setIsUploadingMedia(false);
        setUploadProgressText("");
        return data.urls || (data.url ? [data.url] : []);
      } else {
        alert(data.message || "Failed to upload file(s)");
      }
    } catch (err) {
      console.error("Multer upload error:", err);
      alert("Error uploading file(s) via Multer. Please check server connection.");
    } finally {
      setIsUploadingMedia(false);
      setUploadProgressText("");
    }
    return [];
  };

  const handleMediaFilesSelected = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadedUrls = await uploadFilesWithMulter(files);
    if (uploadedUrls.length > 0) {
      setPreviewImages((prev) => [...prev, ...uploadedUrls]);
    }
    e.target.value = "";
  };

  const handleMediaDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const uploadedUrls = await uploadFilesWithMulter(files);
    if (uploadedUrls.length > 0) {
      setPreviewImages((prev) => [...prev, ...uploadedUrls]);
    }
  };

  const handleVariationFilesSelected = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadedUrls = await uploadFilesWithMulter(files);
    if (uploadedUrls.length > 0) {
      setMediaUploadPreviews((prev) => [...prev, ...uploadedUrls]);
    }
    e.target.value = "";
  };

  const handleVariationDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const uploadedUrls = await uploadFilesWithMulter(files);
    if (uploadedUrls.length > 0) {
      setMediaUploadPreviews((prev) => [...prev, ...uploadedUrls]);
    }
  };

  const handleSeoOgFileSelected = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadedUrls = await uploadFilesWithMulter([files[0]]);
    if (uploadedUrls.length > 0) {
      setSeoOgImage(uploadedUrls[0]);
    }
    e.target.value = "";
  };

  const handleSingleVarFileSelected = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingSingleVar(true);
    const uploadedUrls = await uploadFilesWithMulter([files[0]]);
    setIsUploadingSingleVar(false);
    if (uploadedUrls && uploadedUrls.length > 0) {
      setEditingVariation(prev => prev ? ({ ...prev, img: uploadedUrls[0] }) : null);
    }
    e.target.value = "";
  };

  const handleSingleVarDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    setIsUploadingSingleVar(true);
    const uploadedUrls = await uploadFilesWithMulter([files[0]]);
    setIsUploadingSingleVar(false);
    if (uploadedUrls && uploadedUrls.length > 0) {
      setEditingVariation(prev => prev ? ({ ...prev, img: uploadedUrls[0] }) : null);
    }
  };

  const handleUploadNewImage = () => {
    if (mediaFileInputRef.current) {
      mediaFileInputRef.current.click();
    }
  };

  const handleDeleteGalleryImage = (index) => {
    if (previewImages.length <= 1) {
      alert("At least one product image is required.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this image?")) {
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
      if (previewImageIdx >= previewImages.length - 1) {
        setPreviewImageIdx(Math.max(0, previewImages.length - 2));
      }
    }
  };

  const INVENTORY_STORAGE_KEY = "dzire_admin_inventory_items";

  const INITIAL_INVENTORY_PRODUCTS = [];

  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return INITIAL_INVENTORY_PRODUCTS;
  });

  const [categoriesList, setCategoriesList] = useState([]);

  // Fetch live backend products and categories
  const reloadProducts = () => {
    fetch("https://dzire-backend.onrender.com/api/admin/products")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          const backendMapped = data.products.map(p => ({
            id: p.id || p._id,
            name: p.name,
            sku: p.sku || `DZR-${p.id}`,
            vendor: p.vendor || (p.brand ? `${p.brand} [PO]` : "Dzire Store [PO]"),
            stock: Number(p.stock) || 0,
            price: Number(p.price) || 0,
            mrp: Number(p.oldPrice || p.mrp || (p.price ? p.price * 1.25 : 0)),
            cost: Number(p.cost || (p.price ? p.price * 0.75 : 0)),
            visibility: (p.webStatus === "view_on_web" || p.visibility === "web") ? "web" : "in-store",
            action: (p.webStatus === "view_on_web" || p.visibility === "web") ? "View Web Listing" : "Add Web Info",
            category: p.category || "Trekking Gear",
            alert: Number(p.stock) <= 0
          }));
          setProductsList(backendMapped);
          try {
            localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(backendMapped));
          } catch (e) {}
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    reloadProducts();

    fetch("https://dzire-backend.onrender.com/api/admin/categories")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.categories)) {
          const active = data.categories.filter(c => c.status !== "Inactive");
          setCategoriesList(active);
        }
      })
      .catch(() => {});

    // Listen for live updates over WebSocket
    const unsubProduct = wsClient.on("PRODUCT_UPDATED", () => {
      reloadProducts();
    });

    return () => {
      unsubProduct();
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(productsList));
    } catch (e) {}
  }, [productsList]);

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Purchase Order Form State
  const [poForm, setPoForm] = useState({
    vendor: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: ''
  });

  const handleCreatePurchaseOrder = () => {
    if (!poForm.vendor) {
      alert('Please select a vendor.');
      return;
    }
    const newPO = {
      id: `PO-${Date.now().toString().slice(-4)}`,
      vendor: poForm.vendor,
      orderDate: poForm.orderDate || new Date().toISOString().split('T')[0],
      expectedDelivery: poForm.expectedDelivery,
      notes: poForm.notes,
      status: 'Ordered',
      itemsCount: 1,
      totalAmount: 12500,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('dzire_admin_purchase_orders') || '[]');
      localStorage.setItem('dzire_admin_purchase_orders', JSON.stringify([newPO, ...existing]));
    } catch (e) {}

    alert(`Purchase Order ${newPO.id} for "${poForm.vendor}" created successfully!`);
    closeModal();
  };

  // Filters State
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStockStatus, setFilterStockStatus] = useState({
    inStock: true,
    lowStock: true,
    outOfStock: true
  });
  const [filterVendor, setFilterVendor] = useState('All Vendors');

  const [appliedFilters, setAppliedFilters] = useState({
    category: 'All Categories',
    stockStatus: { inStock: true, lowStock: true, outOfStock: true },
    vendor: 'All Vendors'
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      category: filterCategory,
      stockStatus: { ...filterStockStatus },
      vendor: filterVendor
    });
    setCurrentPage(1);
    alert('Filters applied to inventory table!');
    closeModal();
  };

  // Filtered & Paginated Products calculation
  const filteredProducts = productsList.filter(item => {
    // 1. Tab filter
    if (activeTab === 'instore' && item.visibility !== 'in-store') return false;
    if (activeTab === 'web' && item.visibility !== 'web') return false;

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchSku = item.sku?.toLowerCase().includes(q);
      const matchVendor = item.vendor?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchVendor) return false;
    }

    // 3. Category filter
    if (appliedFilters.category !== 'All Categories') {
      if (item.category && !item.category.toLowerCase().includes(appliedFilters.category.toLowerCase())) {
        return false;
      }
    }

    // 4. Vendor filter
    if (appliedFilters.vendor !== 'All Vendors') {
      if (!item.vendor?.toLowerCase().includes(appliedFilters.vendor.toLowerCase())) {
        return false;
      }
    }

    // 5. Stock status filter
    const stock = Number(item.stock) || 0;
    const isOut = stock <= 0;
    const isLow = stock > 0 && stock <= 5;
    const isIn = stock > 5;

    if (isOut && !appliedFilters.stockStatus.outOfStock) return false;
    if (isLow && !appliedFilters.stockStatus.lowStock) return false;
    if (isIn && !appliedFilters.stockStatus.inStock) return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleSelectAll = () => {
    if (selectedProductIds.length === paginatedProducts.length && paginatedProducts.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(paginatedProducts.map(p => p.id));
    }
  };

  const handleToggleSelectProduct = (id) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const closeModal = () => setModalState({ type: null, item: null });

  // Edit Product Form State
  const [editProductForm, setEditProductForm] = useState({
    id: null,
    name: '',
    sku: '',
    vendor: '',
    stock: 0,
    price: 0,
    mrp: 0,
    cost: 0,
    visibility: 'in-store',
    category: ''
  });

  const handleActionClick = (type, item = null) => {
    if (type === 'edit-product' || type === 'edit-stock') {
      if (item) {
        setEditProductForm({
          id: item.id,
          name: item.name || '',
          sku: item.sku || '',
          vendor: item.vendor ? item.vendor.split(' [')[0] : '',
          stock: item.stock ?? 0,
          price: item.price ?? 0,
          mrp: item.mrp || (item.price ? item.price * 1.25 : 0),
          cost: item.cost || (item.price ? item.price * 0.75 : 0),
          visibility: item.visibility || 'in-store',
          category: item.category || ''
        });
      }
      setModalState({ type: 'edit-product', item });
    } else if (type === 'web-info') {
      setWebInfoItem(item);
      const targetId = item ? (item.id || item._id) : null;

      const populateWebFields = (prod) => {
        if (!prod) return;
        setWebTitle(prod.name || prod.title || '');
        setWebBrand(prod.vendor ? prod.vendor.split(' [')[0] : (prod.brand || ''));
        setWebCategory(prod.category || '');
        setWebMrp(prod.mrp ? String(prod.mrp) : (prod.oldPrice ? String(prod.oldPrice) : (prod.price ? String(Math.round(Number(prod.price) * 1.25)) : '')));
        setWebSellingPrice(prod.price ? String(prod.price) : (prod.sellingPrice ? String(prod.sellingPrice) : ''));
        setWebShortDesc(prod.shortDesc || '');
        setWebLongDesc(prod.longDesc || prod.description || '');
        setPublishOnWebsite(prod.webStatus === 'view_on_web' || prod.visibility === 'web');

        const imgs = Array.isArray(prod.images) && prod.images.length > 0
          ? prod.images
          : (prod.image ? [prod.image] : ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&auto=format&fit=crop&q=80"]);
        setPreviewImages(imgs);
        setPreviewImageIdx(0);

        if (Array.isArray(prod.specifications) && prod.specifications.length > 0) {
          setSpecifications(prod.specifications);
        } else if (prod.specs && typeof prod.specs === 'object' && Object.keys(prod.specs).length > 0) {
          setSpecifications(Object.entries(prod.specs).map(([key, value]) => ({ key, value: String(value) })));
        } else {
          setSpecifications([
            { key: 'Material', value: 'Ripstop Nylon & Polyester' },
            { key: 'Capacity', value: '55 Litres' },
            { key: 'Weight', value: '1.45 kg' },
            { key: 'Warranty', value: '2 Years Manufacturer Warranty' }
          ]);
        }

        if (Array.isArray(prod.additionalInfo) && prod.additionalInfo.length > 0) {
          setAdditionalInfo(prod.additionalInfo);
        } else {
          setAdditionalInfo([
            { title: 'Care Instructions', content: 'Clean with a damp cloth or soft sponge. Do not machine wash.' },
            { title: 'Shipping & Delivery', content: 'Dispatched within 24-48 hours. Free standard express delivery across India.' }
          ]);
        }

        if (Array.isArray(prod.variations) && prod.variations.length > 0) {
          setWebVariations(prod.variations);
        } else {
          setWebVariations([]);
        }

        setSeoTitle(prod.seoTitle || prod.name || prod.title || '');
        setSeoDescription(prod.seoDescription || prod.shortDesc || prod.description || '');
        setSeoSlug(prod.seoSlug || (prod.name ? prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ''));
        setSeoKeywords(Array.isArray(prod.seoKeywords) && prod.seoKeywords.length > 0 ? prod.seoKeywords : ['trekking', 'outdoor', 'sports', 'dzire']);
        setSeoCanonicalUrl(prod.seoCanonicalUrl || '');
        setSeoOgImage(prod.seoOgImage || prod.image || imgs[0] || '');
        setSeoAllowRobots(prod.seoAllowRobots !== undefined ? prod.seoAllowRobots : true);
        setSeoAllowSnippets(prod.seoAllowSnippets !== undefined ? prod.seoAllowSnippets : true);
        setSeoIncludeSitemap(prod.seoIncludeSitemap !== undefined ? prod.seoIncludeSitemap : true);

        if (Array.isArray(prod.reviewsList) && prod.reviewsList.length > 0) {
          setReviewsList(prod.reviewsList);
        } else {
          const targetId = prod.id || prod._id;
          const slug = prod.seoSlug || prod.slug;
          const prodName = prod.name ? prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
          const saved = (targetId && localStorage.getItem(`dzire_product_reviews_${targetId}`)) ||
                        (slug && localStorage.getItem(`dzire_product_reviews_${slug}`)) ||
                        (prodName && localStorage.getItem(`dzire_product_reviews_${prodName}`));
          let loaded = false;
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setReviewsList(parsed);
                loaded = true;
              }
            } catch (e) {}
          }
          if (!loaded) {
            setReviewsList([]);
          }
        }
      };

      if (item) {
        populateWebFields(item);
        if (targetId) {
          fetch(`https://dzire-backend.onrender.com/api/admin/products/${targetId}`)
            .then(res => res.json())
            .then(data => {
              const fullProd = data.product || data;
              if (fullProd && (fullProd.name || fullProd.title)) {
                populateWebFields(fullProd);
              }
            })
            .catch(() => {});
        }
      } else {
        setWebTitle('');
        setWebBrand('');
        setWebCategory('');
        setWebMrp('');
        setWebSellingPrice('');
        setWebShortDesc('');
        setWebLongDesc('');
        setPublishOnWebsite(false);
        setPreviewImages(["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&auto=format&fit=crop&q=80"]);
        setPreviewImageIdx(0);
        setSeoOgImage("");
      }
      setActiveWebTab('website-details');
      setViewMode('web-info');
    } else {
      setModalState({ type, item });
    }
  };

  const handleSaveProductEdit = async () => {
    if (!editProductForm.name.trim()) {
      alert('Please enter product name.');
      return;
    }

    const updatedItem = {
      name: editProductForm.name.trim(),
      sku: editProductForm.sku.trim(),
      vendor: editProductForm.vendor.includes('[PO]') ? editProductForm.vendor : `${editProductForm.vendor} [PO]`,
      stock: Number(editProductForm.stock) || 0,
      price: Number(editProductForm.price) || 0,
      mrp: Number(editProductForm.mrp) || 0,
      cost: Number(editProductForm.cost) || 0,
      visibility: editProductForm.visibility,
      category: editProductForm.category,
      action: editProductForm.visibility === 'web' ? 'View Web Listing' : 'Add Web Info',
      alert: Number(editProductForm.stock) <= 0
    };

    setProductsList(prev => prev.map(p => {
      if (p.id === editProductForm.id) {
        return { ...p, ...updatedItem };
      }
      return p;
    }));

    const selCatObj = categoriesList.find(
      c => (c.name || '').toLowerCase() === (updatedItem.category || '').toLowerCase()
    );

    try {
      await fetch(`https://dzire-backend.onrender.com/api/admin/products/${editProductForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedItem.name,
          sku: updatedItem.sku,
          stock: updatedItem.stock,
          price: updatedItem.price,
          oldPrice: updatedItem.mrp,
          category: updatedItem.category,
          categoryType: selCatObj ? selCatObj.type : undefined,
          visibility: updatedItem.visibility,
          productChannel: updatedItem.visibility === 'web' ? 'website + in-store' : 'in-store',
          webStatus: updatedItem.visibility === 'web' ? 'view_on_web' : 'in-store'
        })
      }).catch(() => {});
    } catch (e) {}

    alert(`Product "${editProductForm.name}" updated successfully!`);
    closeModal();
  };

  const handlePublishWebInfo = async (publish = true) => {
    if (!webInfoItem) return;

    const numericPrice = parseFloat(webSellingPrice.toString().replace(/,/g, '')) || Number(webInfoItem.price) || 0;
    const numericMrp = parseFloat(webMrp.toString().replace(/,/g, '')) || Number(webInfoItem.mrp) || Math.round(numericPrice * 1.25);
    const targetPublish = publish !== undefined ? Boolean(publish) : publishOnWebsite;
    const webStatusVal = targetPublish ? 'view_on_web' : 'in-store';
    const visibilityVal = targetPublish ? 'web' : 'in-store';
    const mainImg = previewImages[0] || webInfoItem.image || "";

    const selCatPublish = categoriesList.find(
      c => (c.name || '').toLowerCase() === (webCategory || webInfoItem.category || '').toLowerCase()
    );

    const fullPayload = {
      name: webTitle.trim() || webInfoItem.name,
      title: webTitle.trim() || webInfoItem.name,
      brand: webBrand || webInfoItem.brand || "DZIRE",
      category: webCategory || webInfoItem.category || "General",
      categoryType: selCatPublish ? selCatPublish.type : undefined,
      price: numericPrice,
      sellingPrice: numericPrice,
      oldPrice: numericMrp,
      mrp: numericMrp,
      shortDesc: webShortDesc,
      longDesc: webLongDesc,
      description: webLongDesc || webShortDesc,
      webStatus: webStatusVal,
      visibility: visibilityVal,
      productChannel: targetPublish ? 'website + in-store' : 'in-store',
      image: mainImg,
      images: previewImages,
      specifications: specifications.filter(s => s.key && s.key.trim()),
      specs: specifications.reduce((acc, s) => {
        if (s.key && s.key.trim()) acc[s.key.trim()] = s.value;
        return acc;
      }, {}),
      additionalInfo: additionalInfo.filter(a => a.title && a.title.trim()),
      variations: webVariations,
      seoTitle: seoTitle || webTitle,
      seoDescription: seoDescription || webShortDesc,
      seoSlug: seoSlug,
      seoKeywords: seoKeywords,
      seoCanonicalUrl: seoCanonicalUrl,
      seoOgImage: seoOgImage || mainImg,
      seoAllowRobots: seoAllowRobots,
      seoAllowSnippets: seoAllowSnippets,
      seoIncludeSitemap: seoIncludeSitemap,
      reviewsList: reviewsList,
      reviews: String(reviewsList.length > 0 ? reviewsList.length : (webInfoItem.reviews || "0")),
      status: "Active"
    };

    setProductsList(prev => prev.map(p => {
      if (String(p.id) === String(webInfoItem.id)) {
        return {
          ...p,
          ...fullPayload,
          action: targetPublish ? 'View Web Listing' : 'Add Web Info',
          alert: Number(p.stock) <= 0
        };
      }
      return p;
    }));

    try {
      const targetId = webInfoItem.id || webInfoItem._id;
      await fetch(`https://dzire-backend.onrender.com/api/admin/products/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload)
      });
    } catch (e) {
      console.error("Error updating product in backend:", e);
    }

    alert(`Product "${fullPayload.name}" ${targetPublish ? 'published to Dzire website' : 'draft saved'} successfully!`);
    setViewMode('list');
  };

  return (
    <AdminLayout>
      {viewMode === 'web-info' ? (
        /* ==================== MODERN ADD PRODUCT TO WEBSITE VIEW ==================== */
        <div style={{ fontFamily: "'Inter', sans-serif" }}>

          {/* Top Header & Breadcrumbs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
                {webInfoItem && (webInfoItem.action === 'View Web Listing' || webInfoItem.visibility === 'web') ? 'Product Web Listing' : 'Add Product to Website'}
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Configure overview, description, specifications, additional info, SEO and customer reviews.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {webInfoItem && (
                <button
                  type="button"
                  onClick={() => {
                    const slugOrId = seoSlug || webInfoItem.seoSlug || webInfoItem.slug || webInfoItem.id;
                    window.open(`/product/${slugOrId}`, '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff',
                    border: '1px solid #cbd5e1',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: '#ff6600',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fff8f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                >
                  <ExternalLink size={13} /> View Live Web Listing
                </button>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setViewMode('list')}>Products</span>
                <span>&gt;</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setViewMode('list')}>All Products</span>
                <span>&gt;</span>
                <span style={{ color: '#0f172a', fontWeight: '600' }}>Web Info</span>
              </div>
            </div>
          </div>

          {/* Top Horizontal Navigation Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '0 20px', borderRadius: '10px 10px 0 0', overflowX: 'auto' }}>
            {[
              { id: 'website-details', label: 'Website Details', icon: <FileText size={16} /> },
              { id: 'specifications', label: 'Specifications', icon: <Sliders size={16} /> },
              { id: 'additional-info', label: 'Additional Information', icon: <FileText size={16} /> },
              { id: 'variations', label: 'Variations', icon: <Layers size={16} /> },
              { id: 'seo', label: 'SEO', icon: <Search size={16} /> },
              { id: 'reviews', label: 'Reviews', icon: <Star size={16} /> },
              { id: 'media', label: 'Media', icon: <ImageIcon size={16} /> },
            ].map(tab => {
              const isActive = activeWebTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveWebTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 4px',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '3px solid #ff6600' : '3px solid transparent',
                    color: isActive ? '#ff6600' : '#475569',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Conditional Alert Banner */}
          {activeWebTab === 'variations' ? (
            <div style={{
              background: '#eff6ff',
              border: '1px solid #dbeafe',
              borderRadius: '8px',
              padding: '10px 16px',
              margin: '12px 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              color: '#1d4ed8'
            }}>
              <Info size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
              <span>Variations are fetched from the master product. You can only add website-specific information like color hex code and preview color.</span>
            </div>
          ) : (
            <div style={{
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: '8px',
              padding: '10px 16px',
              margin: '12px 0 16px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488', fontWeight: '600' }}>
                <LinkIcon size={16} />
                <span>Variations linked from Master Inventory — 20 variations (4 colors × 5 sizes)</span>
              </div>
              <div style={{ color: '#0f766e', fontSize: '12px' }}>
                Variations are automatically fetched from the existing product.
              </div>
            </div>
          )}

          {/* TAB 1: WEBSITE DETAILS (Main 2-Column Screen) */}
          {activeWebTab === 'website-details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }}>

              {/* LEFT COLUMN: Form Inputs */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Website Product Details</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                    This product is already created in your inventory. The basic details (title, brand, category, pricing, and variations) are linked from the master product. Add website-specific content below.
                  </p>
                </div>

                {/* Product Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Product Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={webTitle}
                    onChange={(e) => setWebTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#fff' }}
                  />
                  <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Master title: {webTitle}</span>
                </div>

                {/* Short Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Short Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>

                  {/* Rich Text Toolbar */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <select
                        value={shortHeadingVal}
                        onChange={(e) => applyRichTextAction('heading', false, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', color: '#334155', cursor: 'pointer' }}
                      >
                        <option value="Paragraph">Paragraph</option>
                        <option value="Heading 1">Heading 1</option>
                        <option value="Heading 2">Heading 2</option>
                        <option value="Heading 3">Heading 3</option>
                      </select>
                      <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />
                      <button
                        type="button"
                        title="Bold (Markdown **text**)"
                        onClick={() => applyRichTextAction('bold', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Bold size={15} />
                      </button>
                      <button
                        type="button"
                        title="Italic (Markdown *text*)"
                        onClick={() => applyRichTextAction('italic', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Italic size={15} />
                      </button>
                      <button
                        type="button"
                        title="Underline (<u>text</u>)"
                        onClick={() => applyRichTextAction('underline', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Underline size={15} />
                      </button>
                      <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />
                      <button
                        type="button"
                        title="Bullet List (- item)"
                        onClick={() => applyRichTextAction('bullet', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <List size={15} />
                      </button>
                      <button
                        type="button"
                        title="Numbered List (1. item)"
                        onClick={() => applyRichTextAction('numbered', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <ListOrdered size={15} />
                      </button>
                      <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />
                      <button
                        type="button"
                        title="Insert Link ([text](url))"
                        onClick={() => applyRichTextAction('link', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <LinkIcon size={15} />
                      </button>
                      <button
                        type="button"
                        title="Insert Image (![alt](url))"
                        onClick={() => applyRichTextAction('image', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <ImageIcon size={15} />
                      </button>
                      <button
                        type="button"
                        title="Expand / Fullscreen Editor"
                        onClick={() => applyRichTextAction('maximize', false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Maximize2 size={15} />
                      </button>
                    </div>
                    <textarea
                      ref={shortDescRef}
                      rows={3}
                      value={webShortDesc}
                      onChange={(e) => setWebShortDesc(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', border: 'none', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#fff', resize: 'vertical', lineHeight: '1.5', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                    <span>Write a brief, SEO-friendly description (1-2 lines).</span>
                    <span>{webShortDesc.length}/200</span>
                  </div>
                </div>

                {/* Long Description / Details */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Long Description / Details <span style={{ color: '#ef4444' }}>*</span>
                  </label>

                  {/* Rich Text Toolbar */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <select
                        value={longHeadingVal}
                        onChange={(e) => applyRichTextAction('heading', true, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', color: '#334155', cursor: 'pointer' }}
                      >
                        <option value="Paragraph">Paragraph</option>
                        <option value="Heading 1">Heading 1</option>
                        <option value="Heading 2">Heading 2</option>
                        <option value="Heading 3">Heading 3</option>
                      </select>
                      <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />
                      <button
                        type="button"
                        title="Bold (Markdown **text**)"
                        onClick={() => applyRichTextAction('bold', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Bold size={15} />
                      </button>
                      <button
                        type="button"
                        title="Italic (Markdown *text*)"
                        onClick={() => applyRichTextAction('italic', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Italic size={15} />
                      </button>
                      <button
                        type="button"
                        title="Underline (<u>text</u>)"
                        onClick={() => applyRichTextAction('underline', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Underline size={15} />
                      </button>
                      <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />
                      <button
                        type="button"
                        title="Bullet List (- item)"
                        onClick={() => applyRichTextAction('bullet', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <List size={15} />
                      </button>
                      <button
                        type="button"
                        title="Numbered List (1. item)"
                        onClick={() => applyRichTextAction('numbered', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <ListOrdered size={15} />
                      </button>
                      <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />
                      <button
                        type="button"
                        title="Insert Link ([text](url))"
                        onClick={() => applyRichTextAction('link', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <LinkIcon size={15} />
                      </button>
                      <button
                        type="button"
                        title="Insert Image (![alt](url))"
                        onClick={() => applyRichTextAction('image', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <ImageIcon size={15} />
                      </button>
                      <button
                        type="button"
                        title="Expand / Fullscreen Editor"
                        onClick={() => applyRichTextAction('maximize', true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '4px', color: '#334155', display: 'flex', alignItems: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <Maximize2 size={15} />
                      </button>
                    </div>
                    <textarea
                      ref={longDescRef}
                      rows={6}
                      value={webLongDesc}
                      onChange={(e) => setWebLongDesc(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', border: 'none', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#fff', resize: 'vertical', lineHeight: '1.6', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Master Specs & Live Product Preview Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Master Details Block */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Brand (Read-only) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>Brand</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        readOnly
                        value={webBrand}
                        style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#334155', fontWeight: '500' }}
                      />
                      <Lock size={15} style={{ position: 'absolute', right: '12px', top: '11px', color: '#94a3b8' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Linked from master product</span>
                  </div>

                  {/* Category (Read-only) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>Category</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        readOnly
                        value={webCategory}
                        style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#334155', fontWeight: '500' }}
                      />
                      <Lock size={15} style={{ position: 'absolute', right: '12px', top: '11px', color: '#94a3b8' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Linked from master product</span>
                  </div>

                  {/* Pricing (from Master Inventory) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Pricing (from Master Inventory)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: '500' }}>MRP</span>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>₹ {webMrp}</span>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: '500' }}>Selling Price</span>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>₹ {webSellingPrice}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#0284c7', marginTop: '8px', background: '#f0f9ff', padding: '6px 10px', borderRadius: '6px' }}>
                      <HelpCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <span>Pricing is managed from Master Inventory and cannot be edited here.</span>
                    </div>
                  </div>

                  {/* Website Status Toggle */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Website Status</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        onClick={() => setPublishOnWebsite(!publishOnWebsite)}
                        style={{
                          width: '44px',
                          height: '24px',
                          background: publishOnWebsite ? '#10b981' : '#cbd5e1',
                          borderRadius: '20px',
                          padding: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: publishOnWebsite ? 'flex-end' : 'flex-start',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Publish on Website</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Make this product visible on the Dzire website.</span>
                  </div>

                </div>

                {/* Product Live Preview Card */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Product Preview</h4>
                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View on Website <ExternalLink size={13} />
                    </span>
                  </div>

                  {/* Main Preview Image with Carousels */}
                  <div style={{ position: 'relative', height: '220px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <img
                      src={previewImages[previewImageIdx]}
                      alt="Product Preview"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    <button
                      onClick={() => setPreviewImageIdx(prev => (prev === 0 ? previewImages.length - 1 : prev - 1))}
                      style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setPreviewImageIdx(prev => (prev === previewImages.length - 1 ? 0 : prev + 1))}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Thumbnail Row */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    {previewImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewImageIdx(idx)}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '6px',
                          border: previewImageIdx === idx ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: '#f8fafc'
                        }}
                      >
                        <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    <div style={{ width: '48px', height: '48px', borderRadius: '6px', border: '1px dashed #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                      +2
                    </div>
                  </div>

                  {/* Product Details info in Preview */}
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{webTitle}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>{webBrand}</span>

                  {/* Star Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', color: '#f59e0b', fontSize: '13px' }}>★★★★★</div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>4.6 (124 reviews)</span>
                  </div>

                  {/* Price & Stock status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹ {webSellingPrice}</span>
                    <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>₹ {webMrp}</span>
                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', fontWeight: '700', padding: '3px 8px', borderRadius: '12px' }}>
                      ● In Stock
                    </span>
                  </div>

                  {/* Master Product variations info */}
                  <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                      <Package size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Master Product</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>SKU: TRP-BLK-S + 5 more</div>
                      <div style={{ fontSize: '11px', color: '#0d9488', fontWeight: '600' }}>🔗 20 variations (4 colors × 5 sizes)</div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB: SEO OPTIMIZATION */}
          {activeWebTab === 'seo' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>

              {/* LEFT COLUMN: SEO Fields & Meta Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Meta Configuration Card */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                        Search Engine Optimization (SEO)
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                        Optimize how this product appears on Google, Bing, and Social Media previews.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Meta Title */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                          Page Meta Title <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <span style={{ fontSize: '12px', color: seoTitle.length > 65 ? '#ef4444' : '#64748b', fontWeight: '500' }}>
                          {seoTitle.length} / 70 chars {seoTitle.length >= 50 && seoTitle.length <= 65 ? '✓ Optimal' : ''}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="e.g. Tripole Walker 55L Backpack - Buy Online | Dzire"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', color: '#0f172a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                      />
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                        Recommended length: 50–65 characters. Keep main keywords near the beginning.
                      </span>
                    </div>

                    {/* URL Handle / Slug */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                        URL Slug / Handle
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
                        <span style={{ padding: '10px 12px', fontSize: '13px', color: '#64748b', background: '#f1f5f9', borderRight: '1px solid #cbd5e1', whiteSpace: 'nowrap' }}>
                          https://dzire.com/products/
                        </span>
                        <input
                          type="text"
                          value={seoSlug}
                          onChange={(e) => setSeoSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                          placeholder="product-name-slug"
                          style={{ flex: 1, padding: '10px 12px', border: 'none', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#fff' }}
                        />
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                          Meta Description <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <span style={{ fontSize: '12px', color: seoDescription.length > 165 ? '#ef4444' : '#64748b', fontWeight: '500' }}>
                          {seoDescription.length} / 160 chars {seoDescription.length >= 120 && seoDescription.length <= 160 ? '✓ Optimal' : ''}
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Write a persuasive summary that entices clicks from search results..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#fff', resize: 'vertical', lineHeight: '1.5', boxSizing: 'border-box' }}
                      />
                      <span style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                        Recommended length: 120–160 characters. A strong meta description boosts organic click-through rates.
                      </span>
                    </div>

                    {/* Focus Keywords */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                        Focus Keywords & Tags
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', minHeight: '44px', alignItems: 'center' }}>
                        {seoKeywords.map((kw, idx) => (
                          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>
                            {kw}
                            <button
                              type="button"
                              onClick={() => setSeoKeywords(seoKeywords.filter((_, i) => i !== idx))}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0', fontSize: '13px', lineHeight: '1' }}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={newKeywordInput}
                          onChange={(e) => setNewKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newKeywordInput.trim()) {
                              e.preventDefault();
                              if (!seoKeywords.includes(newKeywordInput.trim())) {
                                setSeoKeywords([...seoKeywords, newKeywordInput.trim()]);
                              }
                              setNewKeywordInput('');
                            }
                          }}
                          placeholder="Type keyword & press Enter..."
                          style={{ border: 'none', outline: 'none', fontSize: '12.5px', color: '#0f172a', flex: 1, minWidth: '150px', padding: '4px' }}
                        />
                      </div>
                    </div>

                    {/* Canonical URL */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' }}>
                        Canonical URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={seoCanonicalUrl}
                        onChange={(e) => setSeoCanonicalUrl(e.target.value)}
                        placeholder="https://dzire.com/products/original-product"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Open Graph Social Share Image with Multer Upload */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                          Social Share Image (Open Graph)
                        </label>
                        <button
                          type="button"
                          onClick={() => seoOgFileInputRef.current?.click()}
                          style={{
                            background: '#fff7ed',
                            border: '1px solid #fed7aa',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#ea580c',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <UploadCloud size={14} /> Upload via Multer
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={seoOgFileInputRef}
                        accept="image/*,.avif,.webp,.png,.jpg,.jpeg,.gif,.svg"
                        style={{ display: 'none' }}
                        onChange={handleSeoOgFileSelected}
                      />
                      <input
                        type="text"
                        value={seoOgImage}
                        onChange={(e) => setSeoOgImage(e.target.value)}
                        placeholder="Image URL or upload from above"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>

                  </div>
                </div>

                {/* Indexing & Robot Controls Card */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Search Engine Indexing Directives</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" checked={seoAllowRobots} onChange={(e) => setSeoAllowRobots(e.target.checked)} style={{ accentColor: '#ff6600', width: '16px', height: '16px' }} />
                      <span><strong>Allow Indexing</strong> — Let search engines display this product in search results (index, follow)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" checked={seoAllowSnippets} onChange={(e) => setSeoAllowSnippets(e.target.checked)} style={{ accentColor: '#ff6600', width: '16px', height: '16px' }} />
                      <span><strong>Enable Rich Snippets</strong> — Include price, in-stock availability, and customer rating in JSON-LD Schema</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" checked={seoIncludeSitemap} onChange={(e) => setSeoIncludeSitemap(e.target.checked)} style={{ accentColor: '#ff6600', width: '16px', height: '16px' }} />
                      <span><strong>XML Sitemap</strong> — Include this product in <code>sitemap.xml</code> for search crawler indexing</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Live Google Search & Social Media Previews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Google Search Result Preview */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#4285F4', color: '#fff', fontSize: '11px', fontWeight: '800' }}>G</span>
                      <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Google Search Preview</h4>
                    </div>
                    <span style={{ fontSize: '11px', color: '#16a34a', background: '#dcfce7', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>Live Snippet</span>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', fontFamily: 'Arial, sans-serif' }}>
                    {/* URL Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#202124', marginBottom: '4px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ff6600', color: '#fff', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>D</div>
                      <span style={{ fontWeight: '500' }}>dzire.com</span>
                      <span style={{ color: '#5f6368' }}>› products › {seoSlug}</span>
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: '17px', color: '#1a0dab', fontWeight: '500', lineHeight: '1.3', marginBottom: '4px', cursor: 'pointer' }}>
                      {seoTitle}
                    </div>

                    {/* Star Rating Rich Snippet */}
                    {seoAllowSnippets && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4d5156', marginBottom: '6px' }}>
                        <span style={{ color: '#e37400' }}>★★★★★</span>
                        <span>Rating: 4.6 · 124 reviews · ₹{webSellingPrice} · In stock</span>
                      </div>
                    )}

                    {/* Description */}
                    <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: '1.45' }}>
                      {seoDescription}
                    </div>
                  </div>
                </div>

                {/* Social Media Share Preview (Open Graph) */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Social Media & WhatsApp Preview</h4>
                    <span style={{ fontSize: '11px', color: '#2563eb', background: '#eff6ff', fontWeight: '600', padding: '2px 8px', borderRadius: '10px' }}>OpenGraph</span>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#f8fafc' }}>
                    <img src={seoOgImage} alt="Social Share" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block', marginBottom: '2px' }}>DZIRE.COM</span>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px', lineHeight: '1.3' }}>{seoTitle}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{seoDescription}</div>
                    </div>
                  </div>
                </div>

                {/* SEO Health Score Indicator */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#166534' }}>SEO Optimization Health</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#15803d', background: '#dcfce7', padding: '3px 10px', borderRadius: '20px' }}>96 / 100</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#166534' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Title contains primary product keywords</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Description length within search crawler limits</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Clean search-friendly URL slug generated</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Schema.org structured data enabled</div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeWebTab === 'reviews' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* Header with Title & Add Review Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Customer Reviews & Feedback</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                    Manage customer reviews, toggle storefront visibility, and moderate feedback ratings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddReview}
                  style={{
                    background: '#ff6600',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(255, 102, 0, 0.25)'
                  }}
                >
                  <Plus size={16} /> Add Review
                </button>
              </div>

              {/* Reviews Summary Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                    <Star size={22} fill="#f59e0b" color="#d97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {reviewsList.length > 0 ? (reviewsList.reduce((acc, curr) => acc + curr.rating, 0) / reviewsList.length).toFixed(1) : '5.0'} <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>/ 5</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>Overall Rating</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{reviewsList.length}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>Total Reviews</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                    <Eye size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a' }}>
                      {reviewsList.filter(r => !r.hidden).length}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>Live on Website</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <EyeOff size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#64748b' }}>
                      {reviewsList.filter(r => r.hidden).length}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>Hidden / Draft</div>
                  </div>
                </div>
              </div>

              {/* Reviews Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviewsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>No customer reviews available for this product yet.</p>
                  </div>
                ) : (
                  reviewsList.map((rev) => {
                    const initials = rev.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
                    return (
                      <div
                        key={rev.id}
                        style={{
                          border: rev.hidden ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '18px 20px',
                          background: rev.hidden ? '#fafafa' : '#ffffff',
                          opacity: rev.hidden ? 0.78 : 1,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          boxShadow: rev.hidden ? 'none' : '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        {/* Top Row: User Avatar, Name, Verified Badge, Date, Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: rev.avatarColor || '#ea580c',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: '700',
                              flexShrink: 0
                            }}>
                              {initials}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '700', fontSize: '14.5px', color: '#0f172a' }}>{rev.name}</span>
                                {rev.verified && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: '#16a34a', background: '#dcfce7', padding: '2px 7px', borderRadius: '12px' }}>
                                    <CheckCircle2 size={12} /> Verified Buyer
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Reviewed on {rev.date}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {rev.hidden ? (
                              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#b45309', background: '#fef3c7', padding: '3px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <EyeOff size={13} /> Hidden from Store
                              </span>
                            ) : (
                              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#15803d', background: '#dcfce7', padding: '3px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Eye size={13} /> Live on Storefront
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle Row: Rating Stars & Headline */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                            {[1, 2, 3, 4, 5].map(starNum => (
                              <Star
                                key={starNum}
                                size={15}
                                fill={starNum <= rev.rating ? '#f59e0b' : 'none'}
                                color={starNum <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{rev.rating}.0</span>
                          {rev.title && (
                            <>
                              <span style={{ color: '#cbd5e1' }}>•</span>
                              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>{rev.title}</span>
                            </>
                          )}
                        </div>

                        {/* Bottom Row: Comment Body */}
                        <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                          {rev.comment}
                        </p>

                        {/* Action Buttons Bar */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '4px' }}>
                          {/* Edit Review Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditReview(rev)}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
                          >
                            <Edit3 size={14} color="#0284c7" /> Edit
                          </button>

                          {/* Hide / Unhide Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleHideReview(rev.id)}
                            style={{
                              background: rev.hidden ? '#eff6ff' : '#f8fafc',
                              border: rev.hidden ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                              color: rev.hidden ? '#2563eb' : '#475569',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            {rev.hidden ? (
                              <>
                                <Eye size={14} /> Unhide Review
                              </>
                            ) : (
                              <>
                                <EyeOff size={14} /> Hide from Store
                              </>
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            style={{
                              background: '#fff',
                              border: '1px solid #fee2e2',
                              color: '#ef4444',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* POPUP MODAL: Add / Edit Customer Review */}
              {showReviewModal && (
                <InventoryModal
                  title={editingReview ? `Edit Customer Review` : `Add New Customer Review`}
                  onClose={() => setShowReviewModal(false)}
                  onSubmit={handleSaveReview}
                  submitText={editingReview ? 'Save Changes' : 'Add Review'}
                  submitColor="#ff6600"
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Customer / Reviewer Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Rating (1 - 5 Stars)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            key={starNum}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: starNum })}
                            style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer' }}
                          >
                            <Star
                              size={22}
                              fill={starNum <= reviewForm.rating ? '#f59e0b' : 'none'}
                              color={starNum <= reviewForm.rating ? '#f59e0b' : '#cbd5e1'}
                            />
                          </button>
                        ))}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginLeft: '6px' }}>
                        {reviewForm.rating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Review Title / Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Extremely sturdy bag! Best for long treks"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Review Feedback / Comment <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write detailed customer feedback and experience..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                        Review Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 24 Sep 2026"
                        value={reviewForm.date}
                        onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                        Store Visibility
                      </label>
                      <select
                        value={reviewForm.hidden ? 'hidden' : 'live'}
                        onChange={(e) => setReviewForm({ ...reviewForm, hidden: e.target.value === 'hidden' })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                      >
                        <option value="live">Live on Storefront</option>
                        <option value="hidden">Hidden / Draft</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                    <input
                      type="checkbox"
                      id="verifiedBuyerCheck"
                      checked={reviewForm.verified}
                      onChange={(e) => setReviewForm({ ...reviewForm, verified: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                    />
                    <label htmlFor="verifiedBuyerCheck" style={{ fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                      Mark as Verified Buyer Badge
                    </label>
                  </div>
                </InventoryModal>
              )}

            </div>
          )}

          {/* TAB: MEDIA */}
          {activeWebTab === 'media' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Product Gallery & Media</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>High-resolution images and videos displayed on the online storefront. Uploaded via Multer.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="file"
                    ref={mediaFileInputRef}
                    accept="image/*,.avif,.webp,.png,.jpg,.jpeg,.gif,.svg,.mp4,.webm"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleMediaFilesSelected}
                  />
                  <button
                    type="button"
                    onClick={() => mediaFileInputRef.current?.click()}
                    disabled={isUploadingMedia}
                    style={{
                      background: '#ff6600',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: isUploadingMedia ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: isUploadingMedia ? 0.7 : 1,
                      boxShadow: '0 2px 4px rgba(255, 102, 0, 0.2)'
                    }}
                  >
                    <UploadCloud size={16} /> {isUploadingMedia ? "Uploading..." : "Upload Images (Multer)"}
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleMediaDrop}
                onClick={() => mediaFileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '10px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: isUploadingMedia ? '#fff7ed' : '#fafbfc',
                  cursor: isUploadingMedia ? 'not-allowed' : 'pointer',
                  marginBottom: '24px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { if (!isUploadingMedia) e.currentTarget.style.borderColor = '#ff6600'; }}
                onMouseLeave={(e) => { if (!isUploadingMedia) e.currentTarget.style.borderColor = '#cbd5e1'; }}
              >
                <UploadCloud size={40} style={{ color: '#ff6600', margin: '0 auto 10px auto', display: 'block' }} />
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', marginBottom: '4px' }}>
                  {isUploadingMedia ? uploadProgressText : "Drag & drop product images here, or browse from device"}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Supports AVIF, WEBP, JPG, PNG, GIF, SVG (Multer Multipart). Max 35 MB per file.
                </div>
              </div>

              {/* Previews Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {previewImages.map((img, i) => (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                    <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&auto=format&fit=crop&q=80"; }} />
                    <div style={{ padding: '8px 12px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <span style={{ fontWeight: '600', color: i === 0 ? '#ea580c' : '#475569' }}>
                        {i === 0 ? '★ Featured / Main' : `Angle ${i + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryImage(i)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                        title="Delete Image"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SPECIFICATIONS */}
          {activeWebTab === 'specifications' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Technical Specifications</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Add technical parameters, materials, dimensions, and warranty details.</p>
                </div>
                <button
                  onClick={() => setSpecifications([...specifications, { key: '', value: '' }])}
                  style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Specification
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {specifications.map((spec, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 40px', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Specification Key (e.g. Capacity)"
                      value={spec.key}
                      onChange={(e) => {
                        const newSpecs = [...specifications];
                        newSpecs[i].key = e.target.value;
                        setSpecifications(newSpecs);
                      }}
                      style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 55 Litres)"
                      value={spec.value}
                      onChange={(e) => {
                        const newSpecs = [...specifications];
                        newSpecs[i].value = e.target.value;
                        setSpecifications(newSpecs);
                      }}
                      style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                    <button
                      onClick={() => setSpecifications(specifications.filter((_, idx) => idx !== i))}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ADDITIONAL INFORMATION */}
          {activeWebTab === 'additional-info' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Additional Information</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Custom highlights, care guides, and usage recommendations.</p>
                </div>
                <button
                  onClick={() => setAdditionalInfo([...additionalInfo, { title: '', content: '' }])}
                  style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Section
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {additionalInfo.map((info, i) => (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="Section Title (e.g. Ideal For)"
                        value={info.title}
                        onChange={(e) => {
                          const updated = [...additionalInfo];
                          updated[i].title = e.target.value;
                          setAdditionalInfo(updated);
                        }}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '600', width: '300px' }}
                      />
                      <button
                        onClick={() => setAdditionalInfo(additionalInfo.filter((_, idx) => idx !== i))}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Content / description..."
                      value={info.content}
                      onChange={(e) => {
                        const updated = [...additionalInfo];
                        updated[i].content = e.target.value;
                        setAdditionalInfo(updated);
                      }}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: VARIATIONS (Matching Screenshot) */}
          {activeWebTab === 'variations' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', alignItems: 'start' }}>

                {/* LEFT COLUMN: Product Variations Table */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>

                  {/* Table Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: selectedTableVarIds.length > 0 ? '14px' : '20px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Product Variations</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Configure variation display details for the website.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setShowMediaModal(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#ff6600',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#fff',
                          cursor: 'pointer',
                          boxShadow: '0 2px 5px rgba(255, 102, 0, 0.3)'
                        }}
                      >
                        <Plus size={15} /> Add Media
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Variations re-synchronized from Master Inventory.')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#fff',
                          border: '1px solid #cbd5e1',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#334155',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                        }}
                      >
                        <RotateCw size={14} /> Refresh Variations
                      </button>
                    </div>
                  </div>

                  {/* Bulk Edit Option Bar Right Below Refresh Variations */}
                  {selectedTableVarIds.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#fff7ed',
                        border: '1.5px solid #fdba74',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        marginBottom: '16px',
                        boxShadow: '0 2px 5px rgba(234, 88, 12, 0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', height: '22px', background: '#ea580c', color: '#fff', borderRadius: '50%', fontSize: '11px', fontWeight: '700', padding: '0 6px' }}>
                          {selectedTableVarIds.length}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#9a3412' }}>
                          {selectedTableVarIds.length} variation{selectedTableVarIds.length > 1 ? 's' : ''} selected
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={handleOpenBulkEdit}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#ea580c',
                            color: '#ffffff',
                            border: 'none',
                            padding: '7px 16px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
                          }}
                        >
                          <Edit3 size={14} /> Edit Selected ({selectedTableVarIds.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${selectedTableVarIds.length} selected variations?`)) {
                              setWebVariations(prev => prev.filter(v => !selectedTableVarIds.includes(v.id)));
                              setSelectedTableVarIds([]);
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#ffffff',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            padding: '7px 12px',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTableVarIds([])}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: '4px 6px'
                          }}
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Variations Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#ea580c', borderBottom: '1px solid #c2410c', color: '#ffffff', fontSize: '12.5px', fontWeight: '700', textAlign: 'left' }}>
                          <th style={{ padding: '12px', width: '32px' }}>
                            <input
                              type="checkbox"
                              checked={selectedTableVarIds.length === webVariations.length && webVariations.length > 0}
                              onChange={handleToggleSelectAllTableVars}
                              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#ea580c' }}
                            />
                          </th>
                          <th style={{ padding: '12px', width: '30px', color: '#ffffff' }}>#</th>
                          <th style={{ padding: '12px 8px', width: '50px' }}></th>
                          <th style={{ padding: '12px', color: '#ffffff', minWidth: '110px' }}>Color</th>
                          <th style={{ padding: '12px', width: '150px', color: '#ffffff' }}>Hex Code (for website)</th>
                          <th style={{ padding: '12px', color: '#ffffff', minWidth: '80px' }}>Size</th>
                          <th style={{ padding: '12px', color: '#ffffff', minWidth: '110px' }}>SKU</th>
                          <th style={{ padding: '12px', textAlign: 'center', color: '#ffffff', width: '70px' }}>Preview</th>
                          <th style={{ padding: '12px', textAlign: 'center', color: '#ffffff', width: '80px' }}>Status</th>
                          <th style={{ padding: '12px', textAlign: 'center', color: '#ffffff', width: '80px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Group variations by color so Color, Image, and Hex code span across all sizes of that color
                          const colorGroups = [];
                          webVariations.forEach((v) => {
                            let grp = colorGroups.find(g => (g.color || '').toLowerCase() === (v.color || '').toLowerCase());
                            if (!grp) {
                              grp = { color: v.color, hex: v.hex, img: v.img, items: [] };
                              colorGroups.push(grp);
                            }
                            grp.items.push(v);
                          });

                          return colorGroups.map((group) => {
                            const groupColorLower = (group.color || '').toLowerCase();
                            const groupSpan = group.items.length;

                            return group.items.map((v, idx) => {
                              const isFirst = idx === 0;
                              const isLast = idx === group.items.length - 1;
                              const isRowSelected = selectedTableVarIds.includes(v.id);
                              const isFocused = selectedWebVarIdx === v.id;

                              return (
                                <tr
                                  key={v.id}
                                  onClick={() => setSelectedWebVarIdx(v.id)}
                                  style={{
                                    borderBottom: isLast ? '2px solid #cbd5e1' : '1px solid #f1f5f9',
                                    background: isRowSelected ? '#fff7ed' : (isFocused ? '#f0f9ff' : 'transparent'),
                                    cursor: 'pointer',
                                    transition: 'background 0.15s'
                                  }}
                                >
                                  {/* 1. Checkbox */}
                                  <td style={{ padding: '12px', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      checked={isRowSelected}
                                      onChange={() => handleToggleSelectTableVar(v.id)}
                                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#ea580c' }}
                                    />
                                  </td>

                                  {/* 2. Number # */}
                                  <td style={{ padding: '12px', color: '#64748b', fontWeight: '600', fontSize: '12px', verticalAlign: 'middle' }}>
                                    {v.id}
                                  </td>

                                  {/* 3. Image (Spanned once per color group) */}
                                  {isFirst && (
                                    <td
                                      rowSpan={groupSpan}
                                      style={{
                                        padding: '10px 8px',
                                        verticalAlign: 'middle',
                                        textAlign: 'center',
                                        background: '#ffffff',
                                        borderRight: '1px solid #f1f5f9',
                                        borderBottom: '2px solid #cbd5e1'
                                      }}
                                    >
                                      <img
                                        src={group.img || v.img}
                                        alt={group.color}
                                        style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block' }}
                                      />
                                    </td>
                                  )}

                                  {/* 4. Color (Spanned once per color group) */}
                                  {isFirst && (
                                    <td
                                      rowSpan={groupSpan}
                                      style={{
                                        padding: '12px',
                                        verticalAlign: 'middle',
                                        background: '#ffffff',
                                        borderRight: '1px solid #f1f5f9',
                                        borderBottom: '2px solid #cbd5e1'
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          background: groupColorLower === 'red' ? '#fef2f2' : groupColorLower === 'black' ? '#f8fafc' : groupColorLower === 'blue' ? '#eff6ff' : '#f8fafc',
                                          border: `1px solid ${groupColorLower === 'red' ? '#fca5a5' : groupColorLower === 'black' ? '#cbd5e1' : groupColorLower === 'blue' ? '#bfdbfe' : '#e2e8f0'}`,
                                          padding: '6px 12px',
                                          borderRadius: '20px'
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: group.hex || (groupColorLower === 'red' ? '#dc2626' : groupColorLower === 'blue' ? '#2563eb' : '#000000'),
                                            display: 'inline-block'
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            color: groupColorLower === 'red' ? '#dc2626' : groupColorLower === 'black' ? '#0f172a' : groupColorLower === 'blue' ? '#2563eb' : '#334155'
                                          }}
                                        >
                                          {group.color}
                                        </span>
                                      </div>
                                    </td>
                                  )}

                                  {/* 5. Hex Code (Spanned once per color group) */}
                                  {isFirst && (
                                    <td
                                      rowSpan={groupSpan}
                                      style={{
                                        padding: '12px',
                                        verticalAlign: 'middle',
                                        background: '#ffffff',
                                        borderRight: '1px solid #f1f5f9',
                                        borderBottom: '2px solid #cbd5e1'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span
                                          style={{
                                            fontSize: '12px',
                                            fontFamily: 'monospace',
                                            color: '#334155',
                                            fontWeight: '600',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            letterSpacing: '0.3px',
                                            display: 'inline-block',
                                            minWidth: '70px'
                                          }}
                                        >
                                          {group.hex}
                                        </span>
                                        <div
                                          style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '4px',
                                            background: group.hex,
                                            border: '1px solid #cbd5e1',
                                            flexShrink: 0
                                          }}
                                        />
                                      </div>
                                    </td>
                                  )}

                                  {/* 6. Size (Individual stacked size row: 7, 8, 9, 10) */}
                                  <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                    <span
                                      style={{
                                        background: '#f1f5f9',
                                        border: '1px solid #cbd5e1',
                                        color: '#0f172a',
                                        padding: '3px 10px',
                                        borderRadius: '6px',
                                        fontSize: '12.5px',
                                        fontWeight: '700',
                                        display: 'inline-block'
                                      }}
                                    >
                                      {v.size || (Array.isArray(v.sizes) ? v.sizes.join(', ') : '-')}
                                    </span>
                                  </td>

                                  {/* 7. SKU */}
                                  <td style={{ padding: '12px', color: '#475569', fontFamily: 'monospace', fontSize: '12px', fontWeight: '600', verticalAlign: 'middle' }}>
                                    {v.sku}
                                  </td>

                                  {/* 8. Preview Dot */}
                                  <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div
                                      style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: v.hex || group.hex,
                                        margin: '0 auto',
                                        border: '1px solid rgba(0,0,0,0.15)',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                      }}
                                    />
                                  </td>

                                  {/* 9. Status */}
                                  <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                                    <span
                                      onClick={() => {
                                        setWebVariations(prev => prev.map(item => item.id === v.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
                                      }}
                                      style={{
                                        display: 'inline-block',
                                        padding: '3px 10px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        background: v.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                                        color: v.status === 'Active' ? '#166534' : '#64748b'
                                      }}
                                    >
                                      {v.status}
                                    </span>
                                  </td>

                                  {/* 10. Actions (Edit / Delete) */}
                                  <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                      <button
                                        type="button"
                                        onClick={() => setEditingVariation({ ...v, originalColor: v.color, size: v.size || '' })}
                                        title="Edit Variation"
                                        style={{
                                          background: '#f8fafc',
                                          border: '1px solid #e2e8f0',
                                          borderRadius: '6px',
                                          padding: '5px',
                                          cursor: 'pointer',
                                          color: '#0284c7',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                      >
                                        <Edit3 size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteVariation(v.id)}
                                        title="Delete Variation"
                                        style={{
                                          background: '#fef2f2',
                                          border: '1px solid #fee2e2',
                                          borderRadius: '6px',
                                          padding: '5px',
                                          cursor: 'pointer',
                                          color: '#ef4444',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* RIGHT COLUMN: Variation Preview & Need Help card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Variation Preview Card */}
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Variation Preview</h4>

                    {/* Main Product Image with arrows */}
                    {(() => {
                      const activeVar = (selectedWebVarIdx !== null ? webVariations.find(v => v.id === selectedWebVarIdx) : null) || webVariations[0] || {};
                      return (
                        <>
                          <div style={{ position: 'relative', height: '200px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <img
                              src={activeVar.img || previewImages[0]}
                              alt="Variation Preview"
                              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const currentIdx = webVariations.findIndex(v => v.id === activeVar.id);
                                const nextIdx = currentIdx <= 0 ? webVariations.length - 1 : currentIdx - 1;
                                setSelectedWebVarIdx(webVariations[nextIdx]?.id);
                              }}
                              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const currentIdx = webVariations.findIndex(v => v.id === activeVar.id);
                                const nextIdx = currentIdx >= webVariations.length - 1 ? 0 : currentIdx + 1;
                                setSelectedWebVarIdx(webVariations[nextIdx]?.id);
                              }}
                              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>

                          {/* Selected Variation Details */}
                          <div>
                            <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Selected Variation</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                              <div style={{ display: 'flex' }}>
                                <span style={{ width: '70px', color: '#64748b' }}>Color</span>
                                <span style={{ color: '#0f172a', fontWeight: '600' }}>: {activeVar.color || '-'}</span>
                              </div>
                              <div style={{ display: 'flex' }}>
                                <span style={{ width: '70px', color: '#64748b' }}>Size</span>
                                <span style={{ color: '#0f172a', fontWeight: '600' }}>
                                  : {activeVar.size || (Array.isArray(activeVar.sizes) ? activeVar.sizes.join(', ') : '-')}
                                </span>
                              </div>
                              <div style={{ display: 'flex' }}>
                                <span style={{ width: '70px', color: '#64748b' }}>SKU</span>
                                <span style={{ color: '#0f172a', fontWeight: '600', fontFamily: 'monospace' }}>: {activeVar.sku || '-'}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '70px', color: '#64748b' }}>Hex</span>
                                <span style={{ color: '#0f172a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  : {activeVar.hex || '-'}
                                  {activeVar.hex && (
                                    <div
                                      style={{
                                        width: '14px',
                                        height: '14px',
                                        borderRadius: '3px',
                                        background: activeVar.hex,
                                        border: '1px solid #cbd5e1'
                                      }}
                                    />
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                  </div>

                  {/* Need Help? Info Card */}
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '16px' }}>💡</span>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Need Help?</h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.5' }}>
                      <li>Variations are fetched from the master product.</li>
                      <li>Add hex code for each color to show accurate color on the website.</li>
                      <li>Use "+ Add Media" to bulk-assign images to variations.</li>
                      <li>Use Edit or Delete actions to manage individual variations.</li>
                    </ul>
                  </div>

                </div>

              </div>

              {/* POPUP MODAL: Add Media to Variations */}
              {showMediaModal && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}>
                  <div style={{
                    background: '#fff',
                    width: '100%',
                    maxWidth: '860px',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '90vh'
                  }}>
                    {/* Modal Header */}
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Add Media to Variations</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Select one or multiple variations and upload images. The same images will be assigned to all selected variations.</p>
                      </div>
                      <button
                        onClick={() => setShowMediaModal(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '6px' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Filter / Search Bar */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', background: '#fafbfc' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                          type="text"
                          placeholder="Search by SKU, color or size..."
                          value={mediaSearchQuery}
                          onChange={(e) => setMediaSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px 8px 36px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            outline: 'none',
                            background: '#fff'
                          }}
                        />
                      </div>
                      <select
                        value={mediaFilterColor}
                        onChange={(e) => setMediaFilterColor(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', color: '#334155', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="All">All Colors</option>
                        {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select
                        value={mediaFilterSize}
                        onChange={(e) => setMediaFilterSize(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', color: '#334155', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="All">All Sizes</option>
                        {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Modal Body: 2 Columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr', gap: '24px', padding: '24px', overflowY: 'auto', flex: 1 }}>
                      {/* Left Column: Variations Checkbox List */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {/* Subheader */}
                        <div style={{
                          padding: '10px 14px',
                          background: '#f8fafc',
                          borderBottom: '1px solid #e2e8f0',
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr 1fr 1.5fr',
                          gap: '12px',
                          alignItems: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#475569'
                        }}>
                          <input
                            type="checkbox"
                            checked={filteredModalVariations.length > 0 && filteredModalVariations.every(v => selectedVarIdsForMedia.includes(v.id))}
                            onChange={() => handleSelectAllFilteredVars(filteredModalVariations)}
                            style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                          />
                          <span style={{ color: '#ea580c', fontWeight: '700' }}>
                            {selectedVarIdsForMedia.length} variations selected
                          </span>
                          <span>Sizes</span>
                          <span>SKU</span>
                        </div>

                        {/* List Items */}
                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                          {filteredModalVariations.map(v => {
                            const isChecked = selectedVarIdsForMedia.includes(v.id);
                            return (
                              <div
                                key={v.id}
                                onClick={() => toggleSelectVarForMedia(v.id)}
                                style={{
                                  padding: '10px 14px',
                                  borderBottom: '1px solid #f1f5f9',
                                  display: 'grid',
                                  gridTemplateColumns: 'auto 1fr 1fr 1.5fr',
                                  gap: '12px',
                                  alignItems: 'center',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  background: isChecked ? '#fff7ed' : '#fff',
                                  transition: 'background 0.15s'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => { }}
                                  style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: v.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{v.color}</span>
                                </div>
                                <span style={{ color: '#475569', fontSize: '12px' }}>
                                  {Array.isArray(v.sizes) ? v.sizes.join(', ') : (v.size || '-')}
                                </span>
                                <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{v.sku}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Column: Upload Box & Previews */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Upload Images (Multer)</h4>
                          <input
                            type="file"
                            ref={variationFileInputRef}
                            accept="image/*,.avif,.webp,.png,.jpg,.jpeg,.gif,.svg"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleVariationFilesSelected}
                          />
                          {/* Drag and Drop Zone */}
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleVariationDrop}
                            onClick={() => variationFileInputRef.current?.click()}
                            style={{
                              border: '2px dashed #cbd5e1',
                              borderRadius: '10px',
                              padding: '28px 20px',
                              textAlign: 'center',
                              background: '#fafbfc',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff6600'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; }}
                          >
                            <UploadCloud size={36} style={{ color: '#ff6600', margin: '0 auto 10px auto', display: 'block' }} />
                            <div style={{ fontSize: '13px', color: '#334155', fontWeight: '500', marginBottom: '4px' }}>
                              Drag & drop images here or <span style={{ color: '#ff6600', fontWeight: '600' }}>Browse</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                              Upload images (JPG, PNG, WebP, AVIF). Multer storage active.
                            </div>
                          </div>
                        </div>

                        {/* Info Banner */}
                        <div style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '12px 14px',
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'flex-start'
                        }}>
                          <Info size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '12px', color: '#1e40af', lineHeight: '1.5' }}>
                            These images will be applied to all selected variations ({selectedVarIdsForMedia.length} selected).
                          </span>
                        </div>

                        {/* Preview list */}
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                            Preview ({mediaUploadPreviews.length} images)
                          </div>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {mediaUploadPreviews.map((pImg, pIdx) => (
                              <div key={pIdx} style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <img src={pImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                  type="button"
                                  onClick={() => setMediaUploadPreviews(prev => prev.filter((_, idx) => idx !== pIdx))}
                                  style={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                    background: 'rgba(15, 23, 42, 0.75)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '10px'
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <div
                              onClick={() => variationFileInputRef.current?.click()}
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '8px',
                                border: '1.5px dashed #cbd5e1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '10px',
                                color: '#64748b',
                                background: '#f8fafc',
                                gap: '2px'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff6600'; e.currentTarget.style.color = '#ff6600'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
                            >
                              <Plus size={14} />
                              <span>Add</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setShowMediaModal(false)}
                        style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyMediaToVariations}
                        style={{
                          padding: '9px 22px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#ff6600',
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(255, 102, 0, 0.3)'
                        }}
                      >
                        <span>↑</span> Apply Media ({selectedVarIdsForMedia.length})
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* POPUP MODAL: Edit Variation */}
              {editingVariation && (
                <InventoryModal
                  title={`Edit Variation (${editingVariation.color} - Size ${editingVariation.size || ''} - ${editingVariation.sku})`}
                  onClose={() => setEditingVariation(null)}
                  onSubmit={() => {
                    setWebVariations(prev => prev.map(v => {
                      if (v.id === editingVariation.id) {
                        return {
                          ...editingVariation,
                          size: editingVariation.size || editingVariation.sizesStr || v.size,
                          color: editingVariation.color,
                          hex: editingVariation.hex,
                          sku: editingVariation.sku,
                          img: editingVariation.img,
                          status: editingVariation.status
                        };
                      }
                      // If color or hex code was changed, sync hex to other sizes in the same color group
                      if (editingVariation.originalColor && (v.color === editingVariation.originalColor || v.color === editingVariation.color)) {
                        return {
                          ...v,
                          color: editingVariation.color || v.color,
                          hex: editingVariation.hex || v.hex
                        };
                      }
                      return v;
                    }));
                    setEditingVariation(null);
                    alert('Variation updated successfully!');
                  }}
                  submitText="Update Variation"
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Color Name</label>
                    <input
                      type="text"
                      value={editingVariation.color}
                      onChange={(e) => setEditingVariation({ ...editingVariation, color: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Hex Code (for website)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={editingVariation.hex}
                        onChange={(e) => setEditingVariation({ ...editingVariation, hex: e.target.value })}
                        style={{ width: '120px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'monospace' }}
                      />
                      <input
                        type="color"
                        value={editingVariation.hex && editingVariation.hex.startsWith('#') && editingVariation.hex.length === 7 ? editingVariation.hex : '#d62828'}
                        onChange={(e) => setEditingVariation({ ...editingVariation, hex: e.target.value })}
                        style={{ width: '38px', height: '38px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0, background: 'none' }}
                        title="Pick Color"
                      />
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: editingVariation.hex || '#cbd5e1', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 7"
                      value={editingVariation.size ?? (editingVariation.sizesStr || '')}
                      onChange={(e) => setEditingVariation({ ...editingVariation, size: e.target.value, sizesStr: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>SKU</label>
                    <input
                      type="text"
                      value={editingVariation.sku}
                      onChange={(e) => setEditingVariation({ ...editingVariation, sku: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Variation Image</label>
                      <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>Multer Storage</span>
                    </div>

                    <input
                      type="file"
                      ref={singleVarFileInputRef}
                      accept="image/*,.avif,.webp,.png,.jpg,.jpeg,.gif,.svg"
                      style={{ display: 'none' }}
                      onChange={handleSingleVarFileSelected}
                    />

                    {editingVariation.img ? (
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', background: '#f8fafc', display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={editingVariation.img}
                            alt="Variation Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&auto=format&fit=crop&q=80"; }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {editingVariation.img.split('/').pop() || 'Uploaded Image'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '8px', fontFamily: 'monospace' }}>
                            {editingVariation.img}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => singleVarFileInputRef.current?.click()}
                              disabled={isUploadingSingleVar || isUploadingMedia}
                              style={{
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#ff6600',
                                background: '#fff',
                                border: '1px solid #ff6600',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <UploadCloud size={14} /> Replace Image
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingVariation({ ...editingVariation, img: '' })}
                              style={{
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#ef4444',
                                background: '#fff',
                                border: '1px solid #fecaca',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleSingleVarDrop}
                        onClick={() => singleVarFileInputRef.current?.click()}
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '10px',
                          padding: '24px 16px',
                          textAlign: 'center',
                          background: '#fafbfc',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff6600'; e.currentTarget.style.background = '#fff7ed'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#fafbfc'; }}
                      >
                        <UploadCloud size={32} style={{ color: '#ff6600', margin: '0 auto 8px auto', display: 'block' }} />
                        <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600', marginBottom: '2px' }}>
                          Upload Variation Image <span style={{ color: '#ff6600' }}>(Click to Browse)</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Drag & drop image here or browse. Directly stored on server via Multer.
                        </div>
                      </div>
                    )}

                    {(isUploadingSingleVar || isUploadingMedia) && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#ea580c', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #ea580c', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                        Uploading image to server via Multer...
                      </div>
                    )}

                    {/* Manual URL input fallback if needed */}
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
                        Or enter / edit Image URL manually:
                      </label>
                      <input
                        type="text"
                        placeholder="https://dzire-backend.onrender.com/uploads/products/..."
                        value={editingVariation.img || ''}
                        onChange={(e) => setEditingVariation({ ...editingVariation, img: e.target.value })}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box', color: '#334155' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Status</label>
                    <select
                      value={editingVariation.status}
                      onChange={(e) => setEditingVariation({ ...editingVariation, status: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </InventoryModal>
              )}

              {/* POPUP MODAL: Bulk Edit Multiple Selected Variations */}
              {showBulkEditModal && (
                <InventoryModal
                  title={`Bulk Edit Variations (${selectedTableVarIds.length} Selected)`}
                  onClose={() => setShowBulkEditModal(false)}
                  onSubmit={handleApplyBulkEdit}
                  submitText={`Update ${selectedTableVarIds.length} Variations`}
                  submitColor="#ea580c"
                >
                  <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '8px', padding: '10px 14px', fontSize: '12.5px', color: '#9a3412', lineHeight: '1.4' }}>
                    Select the fields you wish to update across all <strong>{selectedTableVarIds.length}</strong> selected variations. Unchecked fields will remain unchanged.
                  </div>

                  {/* Field 1: Color Name */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: bulkEditFields.applyColor ? '#fafafa' : '#fff' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bulkEditFields.applyColor}
                        onChange={(e) => setBulkEditFields({ ...bulkEditFields, applyColor: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#ea580c', cursor: 'pointer' }}
                      />
                      <span>Update Color Name</span>
                    </label>
                    <input
                      type="text"
                      disabled={!bulkEditFields.applyColor}
                      value={bulkEditFields.color}
                      onChange={(e) => setBulkEditFields({ ...bulkEditFields, color: e.target.value })}
                      placeholder="e.g. Navy Blue, Crimson Red"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        background: bulkEditFields.applyColor ? '#fff' : '#f1f5f9',
                        color: bulkEditFields.applyColor ? '#111827' : '#94a3b8',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Field 2: Hex Code */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: bulkEditFields.applyHex ? '#fafafa' : '#fff' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bulkEditFields.applyHex}
                        onChange={(e) => setBulkEditFields({ ...bulkEditFields, applyHex: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#ea580c', cursor: 'pointer' }}
                      />
                      <span>Update Hex Code (for website)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        disabled={!bulkEditFields.applyHex}
                        value={bulkEditFields.hex}
                        onChange={(e) => setBulkEditFields({ ...bulkEditFields, hex: e.target.value })}
                        placeholder="#d62828"
                        style={{
                          width: '120px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          background: bulkEditFields.applyHex ? '#fff' : '#f1f5f9',
                          color: bulkEditFields.applyHex ? '#111827' : '#94a3b8'
                        }}
                      />
                      <input
                        type="color"
                        disabled={!bulkEditFields.applyHex}
                        value={bulkEditFields.hex && bulkEditFields.hex.startsWith('#') && bulkEditFields.hex.length === 7 ? bulkEditFields.hex : '#d62828'}
                        onChange={(e) => setBulkEditFields({ ...bulkEditFields, hex: e.target.value })}
                        style={{
                          width: '38px',
                          height: '38px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          cursor: bulkEditFields.applyHex ? 'pointer' : 'not-allowed',
                          padding: 0,
                          background: 'none'
                        }}
                      />
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: bulkEditFields.hex || '#cbd5e1', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>

                  {/* Field 3: Sizes */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: bulkEditFields.applySizes ? '#fafafa' : '#fff' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bulkEditFields.applySizes}
                        onChange={(e) => setBulkEditFields({ ...bulkEditFields, applySizes: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#ea580c', cursor: 'pointer' }}
                      />
                      <span>Update Sizes (comma separated)</span>
                    </label>
                    <input
                      type="text"
                      disabled={!bulkEditFields.applySizes}
                      value={bulkEditFields.sizes}
                      onChange={(e) => setBulkEditFields({ ...bulkEditFields, sizes: e.target.value })}
                      placeholder="e.g. 7, 8, 9, 10"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        background: bulkEditFields.applySizes ? '#fff' : '#f1f5f9',
                        color: bulkEditFields.applySizes ? '#111827' : '#94a3b8',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Field 4: Status */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: bulkEditFields.applyStatus ? '#fafafa' : '#fff' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bulkEditFields.applyStatus}
                        onChange={(e) => setBulkEditFields({ ...bulkEditFields, applyStatus: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#ea580c', cursor: 'pointer' }}
                      />
                      <span>Update Status</span>
                    </label>
                    <select
                      disabled={!bulkEditFields.applyStatus}
                      value={bulkEditFields.status}
                      onChange={(e) => setBulkEditFields({ ...bulkEditFields, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        background: bulkEditFields.applyStatus ? '#fff' : '#f1f5f9',
                        color: bulkEditFields.applyStatus ? '#111827' : '#94a3b8'
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Field 5: Image URL */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: bulkEditFields.applyImg ? '#fafafa' : '#fff' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={bulkEditFields.applyImg}
                        onChange={(e) => setBulkEditFields({ ...bulkEditFields, applyImg: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#ea580c', cursor: 'pointer' }}
                      />
                      <span>Update Image URL</span>
                    </label>
                    <input
                      type="text"
                      disabled={!bulkEditFields.applyImg}
                      value={bulkEditFields.img}
                      onChange={(e) => setBulkEditFields({ ...bulkEditFields, img: e.target.value })}
                      placeholder="https://..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        background: bulkEditFields.applyImg ? '#fff' : '#f1f5f9',
                        color: bulkEditFields.applyImg ? '#111827' : '#94a3b8',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </InventoryModal>
              )}
            </div>
          )}

          {/* Bottom Sticky Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                color: '#334155',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handlePublishWebInfo(false)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  color: '#334155',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handlePublishWebInfo(true)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ff6600',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(255, 102, 0, 0.3)'
                }}
              >
                <Send size={15} /> Save & Publish
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* ==================== INVENTORY TABLE LIST VIEW ==================== */
        <div className="dashboard-wrapper">
          <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6', padding: '0 20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '32px' }}>
                <button onClick={() => setActiveTab('all')} style={{ background: 'none', border: 'none', padding: '18px 0', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', color: activeTab === 'all' ? '#ff6600' : '#000000', borderBottom: activeTab === 'all' ? '3px solid #ff6600' : '3px solid transparent' }}>All Products ({productsList.length})</button>
                <button onClick={() => setActiveTab('instore')} style={{ background: 'none', border: 'none', padding: '18px 0', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', color: activeTab === 'instore' ? '#ff6600' : '#000000', borderBottom: activeTab === 'instore' ? '3px solid #ff6600' : '3px solid transparent' }}>In-Store Only ({productsList.filter(p => p.visibility === 'in-store').length})</button>
                <button onClick={() => setActiveTab('web')} style={{ background: 'none', border: 'none', padding: '18px 0', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', color: activeTab === 'web' ? '#ff6600' : '#000000', borderBottom: activeTab === 'web' ? '3px solid #ff6600' : '3px solid transparent' }}>Published on Web ({productsList.filter(p => p.visibility === 'web').length})</button>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate('/admin/attributes')}
                  style={{
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#f8fafc')}
                >
                  <Tag size={15} color="#ff6600" /> Attribute Names
                </button>
                <button
                  onClick={() => navigate('/admin/products/add')}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#059669')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#10b981')}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>
            </div>

            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
              <div style={{ position: 'relative', width: '350px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search SKU, Product Name, Barcode, or Vendor..."
                  style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <ExportDropdown
                  fileName="Inventory_Stock_Report"
                  title="Inventory & Stock Overview Report"
                  headers={['SKU', 'Product Name', 'Vendor', 'Stock Qty', 'Selling Price', 'MRP', 'Purchase Cost', 'Visibility']}
                  rows={filteredProducts.map((item) => [
                    item.sku || '',
                    item.name || '',
                    item.vendor || '',
                    String(item.stock || 0),
                    `₹${Number(item.price || 0).toFixed(2)}`,
                    `₹${Number(item.mrp || item.price * 1.25).toFixed(2)}`,
                    `₹${Number(item.cost || item.price * 0.75).toFixed(2)}`,
                    item.visibility === 'in-store' ? 'In-Store Only' : 'Website + Store'
                  ])}
                />
                <button onClick={() => handleActionClick('purchase-order')} style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)', transition: 'background 0.2s' }}>
                  <Plus size={18} /> Create Purchase Order
                </button>
              </div>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '700' }}>
                Unified Stock List ({filteredProducts.length} items)
              </h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button onClick={() => handleActionClick('filters')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Filter size={14} /> Advanced Filters
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={handleToggleSelectAll}
                      />
                    </th>
                    <th>Product Name & SKU</th>
                    <th>Vendor</th>
                    <th>Stock</th>
                    <th>Sell Price</th>
                    <th>MRP</th>
                    <th>Purchase Price</th>
                    <th>Channel Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '14px' }}>
                        No inventory products found matching your current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((item, i) => (
                      <tr key={item.id || i} style={{ background: item.alert ? '#fffbeb' : 'transparent' }}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(item.id)}
                            onChange={() => handleToggleSelectProduct(item.id)}
                          />
                        </td>
                        <td>
                          <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.name}</p>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>(SKU: {item.sku})</span>
                        </td>
                        <td>
                          <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.vendor ? item.vendor.split(' [')[0] : 'Dzire Store'}</p>
                          <span style={{ fontSize: '11px', color: '#ff6600', fontWeight: '600' }}>[PO]</span>
                        </td>
                        <td><p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.stock}</p></td>
                        <td><p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>₹{Number(item.price || 0).toFixed(2)}</p></td>
                        <td><p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>₹{(item.mrp || (item.price ? item.price * 1.25 : 0)).toFixed(2)}</p></td>
                        <td><p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>₹{(item.cost || (item.price ? item.price * 0.75 : 0)).toFixed(2)}</p></td>
                        <td>
                          {item.visibility === 'in-store' ? (
                            <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Store size={12} /> In-Store Only
                            </span>
                          ) : (
                            <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Store size={12} /> + <ImageIcon size={12} /> Website
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleActionClick('edit-product', item)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#334155',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                            >
                              <Edit3 size={13} color="#ff6600" /> Edit Product
                            </button>
                            <button onClick={() => handleActionClick('web-info', item)} style={{ background: item.action === 'Add Web Info' ? '#2563eb' : '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                              {item.action}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{ background: '#fff', border: '1px solid #cbd5e1', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.2s' }}
                  >
                    <ChevronLeft size={16} color="#64748b" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          background: isCurrent ? '#ff6600' : '#fff',
                          border: isCurrent ? '1px solid #ff6600' : '1px solid #cbd5e1',
                          color: isCurrent ? '#ffffff' : '#64748b',
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: isCurrent ? '700' : '500',
                          cursor: 'pointer'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{ background: '#fff', border: '1px solid #cbd5e1', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, transition: 'all 0.2s' }}
                  >
                    <ChevronRight size={16} color="#64748b" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {modalState.type === 'purchase-order' && (
            <InventoryModal title="Create Purchase Order" onClose={closeModal} submitText="Create PO" onSubmit={handleCreatePurchaseOrder}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Select Vendor</label>
                <select
                  value={poForm.vendor}
                  onChange={(e) => setPoForm({ ...poForm, vendor: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="Rocksport Supplies">Rocksport Supplies</option>
                  <option value="Outdoor Gear Co.">Outdoor Gear Co.</option>
                  <option value="Tripole Gears">Tripole Gears</option>
                  <option value="Wildcraft Distro">Wildcraft Distro</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Order Date</label>
                  <input
                    type="date"
                    value={poForm.orderDate}
                    onChange={(e) => setPoForm({ ...poForm, orderDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Expected Delivery</label>
                  <input
                    type="date"
                    value={poForm.expectedDelivery}
                    onChange={(e) => setPoForm({ ...poForm, expectedDelivery: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Notes</label>
                <textarea
                  value={poForm.notes}
                  onChange={(e) => setPoForm({ ...poForm, notes: e.target.value })}
                  placeholder="Any specific instructions..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', minHeight: '60px' }}
                ></textarea>
              </div>
            </InventoryModal>
          )}

          {modalState.type === 'filters' && (
            <InventoryModal title="Advanced Filters" onClose={closeModal} submitText="Apply Filters" onSubmit={handleApplyFilters}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Product Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="All Categories">All Categories</option>
                  {(() => {
                    const outdoor = categoriesList.filter(c => (c.type || "").toLowerCase().includes("outdoor"));
                    const product = categoriesList.filter(c => !(c.type || "").toLowerCase().includes("outdoor"));
                    return (
                      <>
                        {outdoor.length > 0 && (
                          <optgroup label="Outdoor Categories">
                            {outdoor.map(cat => (
                              <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                          </optgroup>
                        )}
                        {product.length > 0 && (
                          <optgroup label="Product Categories">
                            {product.map(cat => (
                              <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                          </optgroup>
                        )}
                        {outdoor.length === 0 && product.length === 0 && categoriesList.map(cat => (
                          <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </>
                    );
                  })()}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Stock Status</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filterStockStatus.inStock}
                      onChange={(e) => setFilterStockStatus({ ...filterStockStatus, inStock: e.target.checked })}
                    /> In Stock (&gt; 5)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filterStockStatus.lowStock}
                      onChange={(e) => setFilterStockStatus({ ...filterStockStatus, lowStock: e.target.checked })}
                    /> Low Stock (1 - 5)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filterStockStatus.outOfStock}
                      onChange={(e) => setFilterStockStatus({ ...filterStockStatus, outOfStock: e.target.checked })}
                    /> Out of Stock (0)
                  </label>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Vendor</label>
                <select
                  value={filterVendor}
                  onChange={(e) => setFilterVendor(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="All Vendors">All Vendors</option>
                  <option value="Rocksport Supplies">Rocksport Supplies</option>
                  <option value="Outdoor Gear Co.">Outdoor Gear Co.</option>
                  <option value="Tripole Gears">Tripole Gears</option>
                  <option value="Wildcraft Distro">Wildcraft Distro</option>
                </select>
              </div>
            </InventoryModal>
          )}

          {(modalState.type === 'edit-product' || modalState.type === 'edit-stock') && modalState.item && (
            <InventoryModal
              title={`Edit Product: ${modalState.item.name}`}
              onClose={closeModal}
              submitText="Save & Update Product"
              submitColor="#ff6600"
              onSubmit={handleSaveProductEdit}
            >
              {/* Product Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Product Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editProductForm.name}
                  onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* SKU & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={editProductForm.sku}
                    onChange={(e) => setEditProductForm({ ...editProductForm, sku: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Category <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={editProductForm.category}
                    onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Category</option>
                    {editProductForm.category && !categoriesList.some(c => (c.name || '').toLowerCase() === editProductForm.category.toLowerCase()) && (
                      <option value={editProductForm.category}>{editProductForm.category}</option>
                    )}
                    {(() => {
                      const outdoor = categoriesList.filter(c => (c.type || "").toLowerCase().includes("outdoor"));
                      const product = categoriesList.filter(c => !(c.type || "").toLowerCase().includes("outdoor"));
                      return (
                        <>
                          {outdoor.length > 0 && (
                            <optgroup label="Outdoor Categories">
                              {outdoor.map(cat => (
                                <option key={cat.id || cat._id} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {product.length > 0 && (
                            <optgroup label="Product Categories">
                              {product.map(cat => (
                                <option key={cat.id || cat._id} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {outdoor.length === 0 && product.length === 0 && categoriesList.map(cat => (
                            <option key={cat.id || cat._id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </>
                      );
                    })()}
                  </select>

                  {/* Selected Category Image & Type Preview Badge */}
                  {(() => {
                    const selCat = categoriesList.find(
                      c => (c.name || '').toLowerCase() === (editProductForm.category || '').toLowerCase()
                    );
                    if (!selCat) return null;
                    const isOutdoor = (selCat.type || '').toLowerCase().includes('outdoor');
                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '6px',
                          padding: '4px 8px',
                          background: isOutdoor ? '#fff7ed' : '#f0f9ff',
                          borderRadius: '6px',
                          border: `1px solid ${isOutdoor ? '#fed7aa' : '#bae6fd'}`
                        }}
                      >
                        {selCat.image ? (
                          <img
                            src={selCat.image}
                            alt={selCat.name}
                            style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <Tag size={13} color={isOutdoor ? '#ea580c' : '#0284c7'} />
                        )}
                        <span style={{ fontSize: '12px', fontWeight: '600', color: isOutdoor ? '#9a3412' : '#0369a1' }}>
                          {selCat.name}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: '#ffffff',
                            color: isOutdoor ? '#ea580c' : '#0284c7',
                            fontWeight: '700',
                            marginLeft: 'auto'
                          }}
                        >
                          {isOutdoor ? 'Outdoor' : 'Product'}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Vendor & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Vendor / Supplier
                  </label>
                  <select
                    value={editProductForm.vendor}
                    onChange={(e) => setEditProductForm({ ...editProductForm, vendor: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="Tripole Gears">Tripole Gears</option>
                    <option value="Rocksport Supplies">Rocksport Supplies</option>
                    <option value="Outdoor Gear Co.">Outdoor Gear Co.</option>
                    <option value="Wildcraft Distro">Wildcraft Distro</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editProductForm.stock}
                    onChange={(e) => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Pricing: Selling Price, MRP, Purchase Cost */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Sell Price (₹) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={editProductForm.price}
                    onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editProductForm.mrp}
                    onChange={(e) => setEditProductForm({ ...editProductForm, mrp: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Purchase Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={editProductForm.cost}
                    onChange={(e) => setEditProductForm({ ...editProductForm, cost: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Channel Visibility */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Channel Visibility
                </label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="editVisibility"
                      checked={editProductForm.visibility === 'web'}
                      onChange={() => setEditProductForm({ ...editProductForm, visibility: 'web' })}
                      style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                    />
                    <span>Website + In-Store</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="editVisibility"
                      checked={editProductForm.visibility === 'in-store'}
                      onChange={() => setEditProductForm({ ...editProductForm, visibility: 'in-store' })}
                      style={{ accentColor: '#ff6600', cursor: 'pointer' }}
                    />
                    <span>In-Store Only</span>
                  </label>
                </div>
              </div>

              {/* Advanced Editor Link */}
              <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Need to edit media gallery, rich description or SEO?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    handleActionClick('web-info', modalState.item);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff6600',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Full Web Details ↗
                </button>
              </div>
            </InventoryModal>
          )}

          {/* Fullscreen Rich Text Editor Modal */}
          {fullscreenEditor && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(3px)' }}>
              <div style={{ background: '#fff', width: '100%', maxWidth: '840px', height: '85vh', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Maximize2 size={16} color="#ff6600" />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                      Expanded Editor — {fullscreenEditor.title}
                    </h3>
                  </div>
                  <button onClick={() => setFullscreenEditor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                </div>

                {/* Toolbar */}
                <div style={{ background: '#f8fafc', padding: '10px 16px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <select
                    value={fullscreenEditor.isLong ? longHeadingVal : shortHeadingVal}
                    onChange={(e) => applyRichTextAction('heading', fullscreenEditor.isLong, e.target.value, true)}
                    style={{ padding: '5px 10px', fontSize: '13px', fontWeight: '600', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', color: '#334155', cursor: 'pointer' }}
                  >
                    <option value="Paragraph">Paragraph</option>
                    <option value="Heading 1">Heading 1</option>
                    <option value="Heading 2">Heading 2</option>
                    <option value="Heading 3">Heading 3</option>
                  </select>
                  <div style={{ width: '1px', height: '18px', background: '#cbd5e1' }} />
                  <button
                    type="button"
                    title="Bold"
                    onClick={() => applyRichTextAction('bold', fullscreenEditor.isLong, '', true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: '4px', color: '#334155' }}
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    onClick={() => applyRichTextAction('italic', fullscreenEditor.isLong, '', true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: '4px', color: '#334155' }}
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    title="Underline"
                    onClick={() => applyRichTextAction('underline', fullscreenEditor.isLong, '', true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: '4px', color: '#334155' }}
                  >
                    <Underline size={16} />
                  </button>
                  <div style={{ width: '1px', height: '18px', background: '#cbd5e1' }} />
                  <button
                    type="button"
                    title="Bullet List"
                    onClick={() => applyRichTextAction('bullet', fullscreenEditor.isLong, '', true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: '4px', color: '#334155' }}
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    title="Numbered List"
                    onClick={() => applyRichTextAction('numbered', fullscreenEditor.isLong, '', true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: '4px', color: '#334155' }}
                  >
                    <ListOrdered size={16} />
                  </button>
                  <div style={{ width: '1px', height: '18px', background: '#cbd5e1' }} />
                  <button
                    type="button"
                    title="Insert Link"
                    onClick={() => applyRichTextAction('link', fullscreenEditor.isLong, '', true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: '4px', color: '#334155' }}
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button
                    type="button"
                    title="Insert Image"
                    onClick={() => applyRichTextAction('image', fullscreenEditor.isLong, '', true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: '4px', color: '#334155' }}
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>

                {/* Textarea Area */}
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <textarea
                    ref={fullscreenDescRef}
                    value={fullscreenEditor.isLong ? webLongDesc : webShortDesc}
                    onChange={(e) => {
                      if (fullscreenEditor.isLong) setWebLongDesc(e.target.value);
                      else setWebShortDesc(e.target.value);
                    }}
                    placeholder="Write details here..."
                    style={{ width: '100%', flex: 1, padding: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#0f172a', outline: 'none', resize: 'none', lineHeight: '1.6', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setFullscreenEditor(null)}
                    style={{ padding: '8px 20px', background: '#ff6600', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminInventory;

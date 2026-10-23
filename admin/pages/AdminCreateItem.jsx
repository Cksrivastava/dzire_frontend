import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Info,
  Settings2,
  Eye,
  X,
  Upload,
  Download,
  SlidersHorizontal,
  HelpCircle,
  Barcode as BarcodeIcon,
  QrCode,
  Printer,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Tag
} from "lucide-react";
import { toast, apiUrl } from "../AdminShims";

// Color swatches mapping
const COLOR_HEX_MAP = {
  red: "#DC2626",
  black: "#000000",
  blue: "#2563EB",
  "olive green": "#4D7C0F",
  green: "#16A34A",
  white: "#F8FAFC",
  grey: "#64748B",
  gray: "#64748B",
  yellow: "#EAB308",
  orange: "#EA580C",
  navy: "#1E3A8A",
  brown: "#78350F"
};

const getColorHex = (name) => {
  const clean = String(name || "").trim().toLowerCase();
  return COLOR_HEX_MAP[clean] || "#64748B";
};

// Helper to load stored or preset attribute names dynamically
const getStoredAttributeNames = () => {
  try {
    const raw = localStorage.getItem("dzire_admin_attributes");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((a) => a.name);
      }
    }
  } catch (e) {
    // fallback
  }
  return ["Color", "Size", "Capacity", "Material", "Style", "Weight", "Flavor", "Pattern", "Fit"];
};

// Helper to build initial form data from incoming product or empty defaults
const buildInitialFormData = (item) => {
  if (!item) {
    return {
      title: "",
      sku: "",
      category: "",
      mrp: "",
      sellingPrice: "",
      purchasePrice: "",
      gstRate: "18",
      hasVariations: true,
      attributes: [
        {
          id: 1,
          name: "Color",
          isCustom: false,
          values: [],
          inputValue: ""
        }
      ],
      isGenerated: false,
      showGeneratedModal: false,
      variations: [],
      primaryBarcode: "",
      barcodeFormat: "EAN-13",
      autoGenerateBarcodes: true,
      hsnCode: "",
      posDepartment: "",
      enableInPOS: true,
      quickBillingTile: true,
      allowManualPriceAtPOS: false,
      showBulkModal: false,
      bulkMrp: "",
      bulkSellingPrice: "",
      bulkStock: "",
      previewBarcodeItem: null
    };
  }

  const name = item.name || item.title || "Product";
  const numPrice = Number(item.price || item.sellingPrice || 4999);
  const numMrp = Number(item.mrp || Math.round(numPrice * 1.25));
  const numCost = Number(item.cost || item.purchasePrice || Math.round(numPrice * 0.7));
  const formattedSellingPrice = numPrice.toLocaleString("en-IN");
  const formattedMrp = numMrp.toLocaleString("en-IN");
  const sku = item.sku || "CTR-" + String(item.id || "01").padStart(2, "0");
  const stockStr = String(item.stock ?? 10);

  let category = "backpacks";
  const lowerName = name.toLowerCase();
  const lowerCat = String(item.category || "").toLowerCase();
  if (lowerCat.includes("footwear") || lowerName.includes("boot") || lowerName.includes("shoe")) category = "footwear";
  else if (lowerCat.includes("tent") || lowerName.includes("tent")) category = "tents";
  else if (lowerCat.includes("sleeping") || lowerName.includes("sleeping")) category = "sleeping bags";
  else if (lowerCat.includes("trek") || lowerName.includes("pole") || lowerName.includes("trekking")) category = "trekking gear";
  else if (lowerCat.includes("access") || lowerName.includes("headlamp") || lowerName.includes("bottle")) category = "accessories";
  else if (lowerCat) category = lowerCat;

  let extractedColor = "Black";
  if (lowerName.includes("red")) extractedColor = "Red";
  else if (lowerName.includes("brown")) extractedColor = "Brown";
  else if (lowerName.includes("blue") || lowerName.includes("navy")) extractedColor = "Blue";
  else if (lowerName.includes("green") || lowerName.includes("olive")) extractedColor = "Green";
  else if (lowerName.includes("grey") || lowerName.includes("gray")) extractedColor = "Grey";

  let extractedSize = "Standard";
  if (lowerName.includes("10")) extractedSize = "10";
  else if (lowerName.includes("8")) extractedSize = "8";
  else if (lowerName.includes("9")) extractedSize = "9";
  else if (lowerName.includes("7")) extractedSize = "7";
  else if (lowerName.includes("55l")) extractedSize = "55L";
  else if (lowerName.includes("4 person") || lowerName.includes("4p")) extractedSize = "4 Person";

  const colorHex = getColorHex(extractedColor);

  return {
    title: name,
    sku: sku,
    category: category,
    mrp: String(numMrp),
    sellingPrice: String(numPrice),
    purchasePrice: String(numCost),
    gstRate: String(item.gstRate || "18"),
    hasVariations: true,
    attributes: [
      {
        id: 1,
        name: "Color",
        isCustom: false,
        values: [extractedColor, extractedColor === "Black" ? "Navy" : "Black", "Grey"].filter((v, i, a) => a.indexOf(v) === i),
        inputValue: ""
      },
      {
        id: 2,
        name: category === "footwear" ? "Size" : (category === "backpacks" ? "Capacity" : "Size"),
        isCustom: false,
        values: [extractedSize, "M", "L", "XL"].filter((v, i, a) => a.indexOf(v) === i),
        inputValue: ""
      }
    ],
    isGenerated: true,
    showGeneratedModal: false,
    variations: [
      {
        id: 1,
        color: extractedColor,
        colorHex: colorHex,
        size: extractedSize,
        sku: sku,
        mrp: formattedMrp,
        sellingPrice: formattedSellingPrice,
        stock: stockStr,
        barcode: item.barcode || ("890" + Math.floor(1000000000 + Math.random() * 9000000000)),
        remarks: "-"
      },
      {
        id: 2,
        color: extractedColor === "Black" ? "Navy" : "Black",
        colorHex: getColorHex(extractedColor === "Black" ? "Navy" : "Black"),
        size: extractedSize,
        sku: `${sku}-02`,
        mrp: formattedMrp,
        sellingPrice: formattedSellingPrice,
        stock: String(Math.max(1, Math.floor(Number(stockStr) * 0.7))),
        barcode: "890" + Math.floor(1000000000 + Math.random() * 9000000000),
        remarks: "-"
      }
    ],
    primaryBarcode: item.barcode || "8904581290340",
    barcodeFormat: "EAN-13",
    autoGenerateBarcodes: true,
    hsnCode: item.hsnCode || (category === "footwear" ? "640319" : "420212"),
    posDepartment: item.vendor ? item.vendor.split(" [")[0] : "Luggage & Travel Gear",
    enableInPOS: true,
    quickBillingTile: true,
    allowManualPriceAtPOS: false,
    showBulkModal: false,
    bulkMrp: formattedMrp,
    bulkSellingPrice: formattedSellingPrice,
    bulkStock: stockStr,
    previewBarcodeItem: null
  };
};

const AdminCreateItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const incomingItem = location.state?.product || location.state?.item || location.state?.editItem || null;
  const isEditMode = Boolean(params.id || location.state?.isEdit || incomingItem);

  const [currentStep, setCurrentStep] = useState(1);
  const [presetAttributes, setPresetAttributes] = useState(getStoredAttributeNames);
  const [backendCategories, setBackendCategories] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const categorySliderRef = React.useRef(null);
  const categoryDropdownRef = React.useRef(null);

  const slideCategories = (direction) => {
    if (categorySliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      categorySliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fetch dynamic categories from backend
  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.success && Array.isArray(data.categories)) {
          const active = data.categories.filter((c) => c.status !== "Inactive");
          setBackendCategories(active);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));

    return () => {
      mounted = false;
    };
  }, []);

  // Form State initialized with incoming product or default
  const [formData, setFormData] = useState(() => buildInitialFormData(incomingItem));

  // Sync when incoming item, params, or location path change
  useEffect(() => {
    if (incomingItem) {
      setFormData(buildInitialFormData(incomingItem));
    } else if (params.id) {
      fetch(apiUrl(`/products/${params.id}`))
        .then((res) => res.json())
        .then((data) => {
          if (data && (data.name || data.title)) {
            setFormData(buildInitialFormData(data));
          }
        })
        .catch((err) => console.error("Error fetching product details:", err));
    } else {
      setFormData(buildInitialFormData(null));
      setSelectedStep3VarIds([]);
    }
  }, [incomingItem, params.id, location.pathname]);

  // Keep preset attributes synchronized with any changes from the Attribute Names page and fetch from backend on mount
  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/admin/attributes")
      .then(res => res.json())
      .then(data => {
        if (mounted && data.success && Array.isArray(data.attributes) && data.attributes.length > 0) {
          const names = data.attributes.map(a => a.name);
          setPresetAttributes(names);
        }
      })
      .catch(() => { });

    const handleAttrSync = () => {
      setPresetAttributes(getStoredAttributeNames());
    };
    window.addEventListener("dzire_attributes_updated", handleAttrSync);
    window.addEventListener("storage", handleAttrSync);
    return () => {
      mounted = false;
      window.removeEventListener("dzire_attributes_updated", handleAttrSync);
      window.removeEventListener("storage", handleAttrSync);
    };
  }, []);

  // Calculate combinations count
  const attributeValueCounts = formData.attributes
    .filter((a) => a.name && a.name.trim() && a.values.length > 0)
    .map((a) => ({ name: a.name.trim(), count: a.values.length }));

  const totalPossibleVariations = attributeValueCounts.reduce(
    (acc, curr) => acc * curr.count,
    attributeValueCounts.length > 0 ? 1 : 0
  );

  // Generate cartesian product across all attributes
  const generateVariationsList = () => {
    const validAttrs = formData.attributes.filter((a) => a.name && a.name.trim() && a.values.length > 0);
    if (validAttrs.length === 0) return [];

    const cartesian = (arrays) => {
      return arrays.reduce((acc, curr) => {
        return acc.flatMap((a) => curr.map((c) => [...a, c]));
      }, [[]]);
    };

    const combinations = cartesian(validAttrs.map((a) => a.values));

    const colorAttrIdx = validAttrs.findIndex((a) => a.name.toLowerCase() === "color");
    const sizeAttrIdx = validAttrs.findIndex((a) => a.name.toLowerCase() === "size");

    const list = [];
    let idCounter = 1;

    combinations.forEach((combo) => {
      const col = colorAttrIdx !== -1 ? combo[colorAttrIdx] : combo[0];
      const sz = sizeAttrIdx !== -1 ? combo[sizeAttrIdx] : (combo.length > 1 ? combo[1] : (validAttrs[0] ? combo[0] : "Standard"));
      const colHex = getColorHex(col);
      const skuParts = combo.map((val) => String(val).replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase());
      const basePrefix = (formData.sku && formData.sku.trim()) ? formData.sku.trim() : "CTR";
      const sku = skuParts.length > 0 ? `${basePrefix}-${skuParts.join("-")}` : basePrefix;

      const varItem = {
        id: idCounter,
        color: col || "Default",
        colorHex: colHex,
        size: sz || "-",
        sku: sku,
        mrp: formData.mrp || "5,999",
        sellingPrice: formData.sellingPrice || "4,999",
        stock: "10",
        barcode: "890" + Math.floor(1000000000 + Math.random() * 9000000000),
        remarks: "-"
      };

      validAttrs.forEach((attr, idx) => {
        varItem[attr.name] = combo[idx];
      });

      list.push(varItem);
      idCounter++;
    });

    return list;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step 2 Attribute Handlers
  const handleAddAttribute = (asCustom = false) => {
    const newId = Date.now();
    const usedNames = formData.attributes.map((a) => a.name.toLowerCase());
    const nextPreset = presetAttributes.find((p) => !usedNames.includes(p.toLowerCase()));

    setFormData((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          id: newId,
          name: asCustom ? "" : (nextPreset || "Material"),
          isCustom: asCustom || !nextPreset,
          values: [],
          inputValue: ""
        }
      ],
      isGenerated: false
    }));
  };

  const handleToggleCustomAttribute = (id, forceCustomState) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a) => {
        if (a.id !== id) return a;
        const newIsCustom = forceCustomState !== undefined ? forceCustomState : !a.isCustom;
        return {
          ...a,
          isCustom: newIsCustom,
          name: newIsCustom ? (presetAttributes.includes(a.name) ? "" : a.name) : (a.name || "Material")
        };
      }),
      isGenerated: false
    }));
  };

  const handleRemoveAttribute = (id) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((a) => a.id !== id),
      isGenerated: false
    }));
  };

  const handleAttributeNameChange = (id, newName) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a) =>
        a.id === id ? { ...a, name: newName } : a
      ),
      isGenerated: false
    }));
  };

  const handleAddTag = (attrId) => {
    const attr = formData.attributes.find((a) => a.id === attrId);
    if (!attr || !attr.inputValue.trim()) return;

    const val = attr.inputValue.trim();
    if (attr.values.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        attributes: prev.attributes.map((a) =>
          a.id === attrId ? { ...a, inputValue: "" } : a
        )
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a) =>
        a.id === attrId
          ? { ...a, values: [...a.values, val], inputValue: "" }
          : a
      ),
      isGenerated: false
    }));
  };

  const handleRemoveTag = (attrId, tagVal) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a) =>
        a.id === attrId
          ? { ...a, values: a.values.filter((v) => v !== tagVal) }
          : a
      ),
      isGenerated: false
    }));
  };

  const handleGenerateVariations = () => {
    const list = generateVariationsList();
    setFormData((prev) => ({
      ...prev,
      isGenerated: true,
      variations: list
    }));
    toast?.success?.(`${list.length} variations generated successfully!`) ||
      alert(`${list.length} variations generated!`);
  };

  // Step 3 Variation Table Selection & Bulk Edit State
  const [selectedStep3VarIds, setSelectedStep3VarIds] = useState([]);
  const [showStep3BulkModal, setShowStep3BulkModal] = useState(false);
  const [editingStep3Var, setEditingStep3Var] = useState(null);
  const [step3BulkData, setStep3BulkData] = useState({
    color: "",
    colorHex: "#ea580c",
    mrp: "",
    sellingPrice: "",
    stock: "",
    remarks: "-",
    applyColor: false,
    applyMrp: true,
    applySellingPrice: true,
    applyStock: true,
    applyRemarks: false
  });

  const handleToggleSelectAllStep3Vars = () => {
    if (selectedStep3VarIds.length === formData.variations.length && formData.variations.length > 0) {
      setSelectedStep3VarIds([]);
    } else {
      setSelectedStep3VarIds(formData.variations.map((v) => v.id));
    }
  };

  const handleToggleSelectStep3Var = (id) => {
    setSelectedStep3VarIds((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
    );
  };

  const handleOpenStep3BulkModal = () => {
    if (selectedStep3VarIds.length === 0) {
      toast?.error?.("Please select at least one variation to edit") || alert("Please select at least one variation to edit");
      return;
    }
    const firstSelected = formData.variations.find((v) => selectedStep3VarIds.includes(v.id)) || {};
    const firstColor = firstSelected.color || "";
    setStep3BulkData({
      color: firstColor,
      colorHex: firstSelected.colorHex || (firstColor ? getColorHex(firstColor) : "#ea580c") || "#ea580c",
      mrp: firstSelected.mrp || formData.bulkMrp || "5,999",
      sellingPrice: firstSelected.sellingPrice || formData.bulkSellingPrice || "4,999",
      stock: firstSelected.stock || formData.bulkStock || "10",
      remarks: firstSelected.remarks || "-",
      applyColor: false,
      applyMrp: true,
      applySellingPrice: true,
      applyStock: true,
      applyRemarks: false
    });
    setShowStep3BulkModal(true);
  };

  const handleApplyStep3BulkModal = () => {
    if (selectedStep3VarIds.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((item) => {
        if (selectedStep3VarIds.includes(item.id)) {
          return {
            ...item,
            ...(step3BulkData.applyColor && step3BulkData.color ? {
              color: step3BulkData.color,
              colorHex: step3BulkData.colorHex || getColorHex(step3BulkData.color)
            } : {}),
            ...(step3BulkData.applyMrp && step3BulkData.mrp ? { mrp: step3BulkData.mrp } : {}),
            ...(step3BulkData.applySellingPrice && step3BulkData.sellingPrice ? { sellingPrice: step3BulkData.sellingPrice } : {}),
            ...(step3BulkData.applyStock && step3BulkData.stock ? { stock: step3BulkData.stock } : {}),
            ...(step3BulkData.applyRemarks ? { remarks: step3BulkData.remarks } : {})
          };
        }
        return item;
      })
    }));
    toast?.success?.(`Updated ${selectedStep3VarIds.length} variations successfully!`) ||
      alert(`Updated ${selectedStep3VarIds.length} variations successfully!`);
    setShowStep3BulkModal(false);
  };

  const handleDeleteStep3Var = (id) => {
    if (window.confirm("Are you sure you want to delete this variation?")) {
      setFormData((prev) => ({
        ...prev,
        variations: prev.variations.filter((v) => v.id !== id)
      }));
      setSelectedStep3VarIds((prev) => prev.filter((vId) => vId !== id));
    }
  };

  const handleSaveSingleStep3Var = (updatedItem) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((v) => (v.id === updatedItem.id ? updatedItem : v))
    }));
    toast?.success?.("Variation updated successfully!") || alert("Variation updated!");
    setEditingStep3Var(null);
  };

  // Step 3 Variation Table Handlers
  const handleVariationFieldChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleApplyBulkUpdate = () => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((item) => ({
        ...item,
        ...(prev.bulkMrp ? { mrp: prev.bulkMrp } : {}),
        ...(prev.bulkSellingPrice ? { sellingPrice: prev.bulkSellingPrice } : {}),
        ...(prev.bulkStock ? { stock: prev.bulkStock } : {})
      })),
      showBulkModal: false
    }));
    toast?.success?.("Bulk update applied to all variations!") ||
      alert("Bulk update applied!");
  };

  // Step 4 Barcode Generation Handlers
  const handleGenerateSingleBarcode = (id) => {
    const newBarcode = "890" + Math.floor(1000000000 + Math.random() * 9000000000);
    handleVariationFieldChange(id, "barcode", newBarcode);
    toast?.success?.("New unique barcode assigned!") || alert("Barcode generated!");
  };

  const handleBulkGenerateAllBarcodes = () => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((v) => ({
        ...v,
        barcode: "890" + Math.floor(1000000000 + Math.random() * 9000000000)
      }))
    }));
    toast?.success?.("Assigned new barcodes to all variations!") ||
      alert("Barcodes generated for all items!");
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        toast?.error?.("Please enter a product title") || alert("Please enter a product title");
        return;
      }
      if (!formData.category) {
        toast?.error?.("Please select a category") || alert("Please select a category");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (formData.hasVariations && formData.variations.length === 0) {
        const list = generateVariationsList();
        if (list.length > 0) {
          setFormData((prev) => ({ ...prev, variations: list, isGenerated: true }));
        } else {
          const singleVar = [
            {
              id: 1,
              color: "Standard",
              colorHex: "#64748B",
              size: "Standard",
              sku: (formData.sku && formData.sku.trim()) || ("SKU-" + Math.floor(1000 + Math.random() * 9000)),
              mrp: formData.mrp ? Number(formData.mrp).toLocaleString("en-IN") : "0",
              sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice).toLocaleString("en-IN") : "0",
              stock: "10",
              barcode: "890" + Math.floor(1000000000 + Math.random() * 9000000000),
              remarks: "-"
            }
          ];
          setFormData((prev) => ({ ...prev, variations: singleVar, isGenerated: true }));
        }
      } else if (!formData.hasVariations && formData.variations.length === 0) {
        const singleVar = [
          {
            id: 1,
            color: "Standard",
            colorHex: "#64748B",
            size: "Standard",
            sku: (formData.sku && formData.sku.trim()) || ("SKU-" + Math.floor(1000 + Math.random() * 9000)),
            mrp: formData.mrp ? Number(formData.mrp).toLocaleString("en-IN") : "0",
            sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice).toLocaleString("en-IN") : "0",
            stock: "10",
            barcode: "890" + Math.floor(1000000000 + Math.random() * 9000000000),
            remarks: "-"
          }
        ];
        setFormData((prev) => ({ ...prev, variations: singleVar, isGenerated: true }));
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate("/admin/inventory");
    }
  };

  const handleSave = async () => {
    try {
      const priceVal = Number(String(formData.sellingPrice).replace(/[^0-9.]/g, "")) || 999;
      const mrpVal = Number(String(formData.mrp).replace(/[^0-9.]/g, "")) || 1499;
      const costVal = Number(String(formData.purchasePrice).replace(/[^0-9.]/g, "")) || Math.round(priceVal * 0.7);
      const totalStock = formData.variations?.reduce((acc, v) => acc + (Number(String(v.stock).replace(/[^0-9]/g, "")) || 0), 0) || 10;
      const skuVal = formData.sku || formData.variations?.[0]?.sku || `DZR-${Date.now()}`;

      const targetId = params.id || incomingItem?.id || incomingItem?._id;
      const endpoint = isEditMode && targetId ? `https://dzire-backend.onrender.com/api/admin/products/${targetId}` : "https://dzire-backend.onrender.com/api/admin/products";
      const method = isEditMode && targetId ? "PUT" : "POST";

      const payload = {
        name: formData.title || "New Outdoor Product",
        brand: formData.posDepartment ? formData.posDepartment.split(" [")[0] : "DZIRE",
        category: formData.category || "General",
        price: priceVal,
        oldPrice: mrpVal,
        cost: costVal,
        stock: totalStock,
        sku: skuVal,
        gstRate: formData.gstRate,
        hasVariations: Boolean(formData.hasVariations),
        attributes: formData.attributes,
        variations: formData.variations,
        primaryBarcode: formData.primaryBarcode,
        barcodeFormat: formData.barcodeFormat,
        hsnCode: formData.hsnCode,
        posDepartment: formData.posDepartment,
        enableInPOS: formData.enableInPOS,
        quickBillingTile: formData.quickBillingTile,
        allowManualPriceAtPOS: formData.allowManualPriceAtPOS,
        description: formData.description || "High performance outdoor equipment designed for endurance.",
        webStatus: "view_on_web",
        visibility: "web",
        vendor: formData.posDepartment ? `${formData.posDepartment} [PO]` : "DZIRE Supplies [PO]"
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => null);

      let savedProduct = null;
      if (res && res.ok) {
        const json = await res.json().catch(() => null);
        savedProduct = json?.product;
      }

      // Also persist to local storage inventory items so it immediately shows up in /admin/inventory
      try {
        const INVENTORY_STORAGE_KEY = "dzire_admin_inventory_items";
        const existingRaw = localStorage.getItem(INVENTORY_STORAGE_KEY);
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const localItem = {
          id: savedProduct?.id || targetId || Date.now(),
          name: formData.title || "New Outdoor Product",
          sku: skuVal,
          vendor: payload.vendor,
          stock: totalStock,
          price: priceVal,
          mrp: mrpVal,
          cost: costVal,
          visibility: "web",
          action: "View Web Listing",
          category: formData.category || "General",
          alert: totalStock <= 0,
          variations: formData.variations,
          attributes: formData.attributes
        };

        let updatedInventory;
        if (isEditMode && targetId) {
          updatedInventory = existingList.map(item => String(item.id) === String(targetId) ? { ...item, ...localItem } : item);
        } else {
          updatedInventory = [localItem, ...existingList.filter(item => String(item.id) !== String(localItem.id))];
        }
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
      } catch (err) { }

    } catch (e) {
      // ignore network errors
    }

    toast?.success?.(
      isEditMode
        ? `Product "${formData.title}" updated successfully in inventory!`
        : "Product created and added to inventory successfully!"
    ) || alert(isEditMode ? "Product updated successfully!" : "Product created successfully!");
    navigate("/admin/inventory");
  };

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Product Variations" },
    { number: 3, title: "Inventory" },
    { number: 4, title: "Barcode & POS" }
  ];

  const getSubtitle = () => {
    if (isEditMode) {
      switch (currentStep) {
        case 1:
          return "Edit product details, category, and pricing. All existing values are prefilled.";
        case 2:
          return "Review and modify product variations, color swatches, and size options.";
        case 3:
          return "Update inventory stocks, pricing per variation, and batch details.";
        case 4:
          return "Review barcodes, unique SKU codes, and POS billing terminal options.";
        default:
          return "Edit product in your inventory.";
      }
    }

    switch (currentStep) {
      case 1:
        return "Add product to your inventory. Fill in the basic information to get started.";
      case 2:
        return "Add product to your inventory. Set up product variations like size, color, etc.";
      case 3:
        return "Set initial inventory details for this product. You can also update inventory later through Purchase Orders.";
      case 4:
        return "Assign barcodes, unique SKU codes, and configure POS billing terminal options.";
      default:
        return "Add product to your inventory.";
    }
  };

  // Group variations by color for the clean UI table in Step 3
  const groupedByColor = formData.variations.reduce((acc, item) => {
    if (!acc[item.color]) {
      acc[item.color] = [];
    }
    acc[item.color].push(item);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 0 24px" }}>

        {/* Main Card Container */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #eef2f6",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
            padding: "22px 26px"
          }}
        >
          {/* Top Header with Breadcrumbs */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "16px"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 4px 0" }}>
                <h1
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#111827",
                    margin: 0,
                    fontFamily: "inherit"
                  }}
                >
                  {isEditMode ? `Edit Product: ${formData.title || "Product"}` : "Add New Product"}
                </h1>
                {isEditMode && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#ffedd5",
                      color: "#ea580c",
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      border: "1px solid #fed7aa"
                    }}
                  >
                    <Edit3 size={12} /> Edit Mode
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: "1.4"
                }}
              >
                {getSubtitle()}
              </p>
            </div>
          </div>

          {/* Stepper Progress Bar (4 Steps - Scrollable horizontally in responsive view) */}
          <div style={{ marginBottom: "22px" }}>
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingBottom: "4px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  width: "100%",
                  maxWidth: "820px",
                  minWidth: "560px",
                  margin: "0 auto",
                  padding: "4px 8px"
                }}
              >
                {steps.map((step, idx) => {
                  const isCompleted = currentStep > step.number;
                  const isActive = currentStep === step.number;

                  return (
                    <React.Fragment key={step.number}>
                      {/* Step Node */}
                      <div
                        onClick={() => setCurrentStep(step.number)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                          zIndex: 2,
                          minWidth: "110px",
                          flexShrink: 0
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: "700",
                            transition: "all 0.2s ease",
                            background: isCompleted
                              ? "#0d9488" // Teal checkmark
                              : isActive
                                ? "#ea580c" // Orange active circle
                                : "#ffffff",
                            color: isCompleted || isActive ? "#ffffff" : "#6b7280",
                            border: isCompleted || isActive ? "none" : "1.5px solid #d1d5db",
                            boxShadow: isActive ? "0 2px 8px rgba(234, 88, 12, 0.3)" : "none"
                          }}
                        >
                          {isCompleted ? <Check size={16} strokeWidth={2.8} /> : step.number}
                        </div>
                        <span
                          style={{
                            marginTop: "8px",
                            fontSize: "13px",
                            fontWeight: isActive ? "700" : "500",
                            color: isActive ? "#111827" : "#6b7280",
                            whiteSpace: "nowrap",
                            textAlign: "center"
                          }}
                        >
                          {step.title}
                        </span>
                      </div>

                      {/* Connecting Line between steps */}
                      {idx < steps.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            minWidth: "24px",
                            height: "2px",
                            background:
                              currentStep > idx + 1
                                ? "#0d9488"
                                : currentStep === idx + 1
                                  ? "#ea580c"
                                  : "#e5e7eb",
                            margin: "0 8px 24px 8px",
                            transition: "background 0.3s ease"
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Subtle Divider */}
            <div
              style={{
                height: "1px",
                background: "#f1f5f9",
                marginTop: "16px",
                width: "100%"
              }}
            />
          </div>

          {/* ================= STEP 1: Basic Information ================= */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>
                  Product Information
                </h2>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 18px 0" }}>
                  Add the basic details of the product.
                </p>

                {/* Product Title */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    Product Title <span style={{ color: "#ea580c" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g. Tripole Walker 55L Backpack"
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      fontSize: "14px",
                      color: "#111827",
                      background: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#ea580c")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                {/* Category */}
                <div ref={categoryDropdownRef} style={{ position: "relative" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    Category <span style={{ color: "#ea580c" }}>*</span>
                  </label>

                  {/* Fixed Category Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      fontSize: "14px",
                      color: formData.category ? "#111827" : "#6b7280",
                      background: "#ffffff",
                      border: `1px solid ${categoryDropdownOpen ? "#ea580c" : "#d1d5db"}`,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box",
                      boxShadow: categoryDropdownOpen ? "0 0 0 3px rgba(234, 88, 12, 0.15)" : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                      {(() => {
                        const sel = backendCategories.find(
                          (c) => (c.name || "").toLowerCase() === (formData.category || "").toLowerCase()
                        );
                        return (
                          <>
                            {sel?.image ? (
                              <img
                                src={sel.image}
                                alt={formData.category}
                                style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            ) : (
                              <Tag size={16} color="#ea580c" style={{ flexShrink: 0 }} />
                            )}
                            <span style={{ fontWeight: formData.category ? "600" : "400", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {formData.category || "Select Category"}
                            </span>
                            {sel && (
                              <span style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "4px", background: "#f3f4f6", color: "#4b5563", fontWeight: "600" }}>
                                {(sel.type || "").toLowerCase().includes("outdoor") ? "Outdoor" : "Product"}
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <ChevronDown
                      size={18}
                      color="#6b7280"
                      style={{
                        transform: categoryDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {/* Dropdown Menu below fixed button with scrollable slider */}
                  {categoryDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        zIndex: 60,
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                        maxHeight: "280px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                      }}
                    >
                      {/* Search box inside dropdown */}
                      <div style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                        <div style={{ position: "relative" }}>
                          <Search size={14} color="#9ca3af" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                          <input
                            type="text"
                            placeholder="Filter categories..."
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            style={{
                              width: "100%",
                              padding: "6px 10px 6px 30px",
                              fontSize: "12px",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              outline: "none",
                              boxSizing: "border-box"
                            }}
                          />
                        </div>
                      </div>

                      {/* Scrollable list */}
                      <div style={{ overflowY: "auto", flex: 1, padding: "6px" }}>
                        {(() => {
                          const filtered = backendCategories.filter((c) =>
                            (c.name || "").toLowerCase().includes(categorySearchQuery.toLowerCase())
                          );
                          const outdoor = filtered.filter((c) => (c.type || "").toLowerCase().includes("outdoor"));
                          const product = filtered.filter((c) => !(c.type || "").toLowerCase().includes("outdoor"));

                          if (filtered.length === 0) {
                            return (
                              <div style={{ padding: "12px", fontSize: "13px", color: "#6b7280", textAlign: "center" }}>
                                No categories found
                              </div>
                            );
                          }

                          return (
                            <>
                              {outdoor.length > 0 && (
                                <div style={{ marginBottom: "6px" }}>
                                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#ff6600", padding: "4px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Outdoor Categories
                                  </div>
                                  {outdoor.map((cat) => {
                                    const isSelected = (formData.category || "").toLowerCase() === cat.name.toLowerCase();
                                    return (
                                      <div
                                        key={cat.id || cat._id}
                                        onClick={() => {
                                          handleChange("category", cat.name);
                                          setCategoryDropdownOpen(false);
                                        }}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          padding: "8px 10px",
                                          borderRadius: "6px",
                                          cursor: "pointer",
                                          background: isSelected ? "#fff7ed" : "transparent",
                                          fontSize: "13px",
                                          color: isSelected ? "#ea580c" : "#1f2937",
                                          fontWeight: isSelected ? "600" : "500",
                                          transition: "background 0.15s ease"
                                        }}
                                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f9fafb"; }}
                                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                                      >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                          {cat.image ? (
                                            <img
                                              src={cat.image}
                                              alt={cat.name}
                                              style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover" }}
                                              onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                          ) : (
                                            <Tag size={14} color="#ff6600" />
                                          )}
                                          <span>{cat.name}</span>
                                        </div>
                                        {isSelected && <Check size={14} color="#ea580c" />}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {product.length > 0 && (
                                <div>
                                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#0284c7", padding: "4px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Product Categories
                                  </div>
                                  {product.map((cat) => {
                                    const isSelected = (formData.category || "").toLowerCase() === cat.name.toLowerCase();
                                    return (
                                      <div
                                        key={cat.id || cat._id}
                                        onClick={() => {
                                          handleChange("category", cat.name);
                                          setCategoryDropdownOpen(false);
                                        }}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          padding: "8px 10px",
                                          borderRadius: "6px",
                                          cursor: "pointer",
                                          background: isSelected ? "#f0f9ff" : "transparent",
                                          fontSize: "13px",
                                          color: isSelected ? "#0284c7" : "#1f2937",
                                          fontWeight: isSelected ? "600" : "500",
                                          transition: "background 0.15s ease"
                                        }}
                                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f9fafb"; }}
                                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                                      >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                          {cat.image ? (
                                            <img
                                              src={cat.image}
                                              alt={cat.name}
                                              style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover" }}
                                              onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                          ) : (
                                            <Tag size={14} color="#0284c7" />
                                          )}
                                          <span>{cat.name}</span>
                                        </div>
                                        {isSelected && <Check size={14} color="#0284c7" />}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Slider Below */}
              {/*  */}

              {/* Pricing Information Section */}
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 18px 0" }}>
                  Pricing Information
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
                  {/* MRP */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                      MRP <span style={{ color: "#ea580c" }}>*</span>
                    </label>
                    <div style={{ display: "flex", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px", background: "#f9fafb", border: "1px solid #d1d5db", borderRight: "none", borderRadius: "8px 0 0 8px", color: "#4b5563", fontSize: "14px", fontWeight: "500" }}>
                        ₹
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.mrp}
                        onChange={(e) => handleChange("mrp", e.target.value)}
                        placeholder="0.00"
                        style={{ flex: 1, height: "44px", padding: "0 12px", fontSize: "14px", color: "#111827", border: "1px solid #d1d5db", borderRadius: "0 8px 8px 0", outline: "none", width: "100%", boxSizing: "border-box" }}
                        onFocus={(e) => (e.target.style.borderColor = "#ea580c")}
                        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                      />
                    </div>
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                      Selling Price <span style={{ color: "#ea580c" }}>*</span>
                    </label>
                    <div style={{ display: "flex", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px", background: "#f9fafb", border: "1px solid #d1d5db", borderRight: "none", borderRadius: "8px 0 0 8px", color: "#4b5563", fontSize: "14px", fontWeight: "500" }}>
                        ₹
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.sellingPrice}
                        onChange={(e) => handleChange("sellingPrice", e.target.value)}
                        placeholder="0.00"
                        style={{ flex: 1, height: "44px", padding: "0 12px", fontSize: "14px", color: "#111827", border: "1px solid #d1d5db", borderRadius: "0 8px 8px 0", outline: "none", width: "100%", boxSizing: "border-box" }}
                        onFocus={(e) => (e.target.style.borderColor = "#ea580c")}
                        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                      />
                    </div>
                  </div>

                  {/* Purchase Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                      Purchase Price <span style={{ color: "#ea580c" }}>*</span>
                    </label>
                    <div style={{ display: "flex", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px", background: "#f9fafb", border: "1px solid #d1d5db", borderRight: "none", borderRadius: "8px 0 0 8px", color: "#4b5563", fontSize: "14px", fontWeight: "500" }}>
                        ₹
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.purchasePrice}
                        onChange={(e) => handleChange("purchasePrice", e.target.value)}
                        placeholder="0.00"
                        style={{ flex: 1, height: "44px", padding: "0 12px", fontSize: "14px", color: "#111827", border: "1px solid #d1d5db", borderRadius: "0 8px 8px 0", outline: "none", width: "100%", boxSizing: "border-box" }}
                        onFocus={(e) => (e.target.style.borderColor = "#ea580c")}
                        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                      />
                    </div>
                  </div>
                </div>

                {/* GST */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    GST <span style={{ color: "#ea580c" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={formData.gstRate}
                      onChange={(e) => handleChange("gstRate", e.target.value)}
                      style={{
                        width: "100%",
                        height: "44px",
                        padding: "0 38px 0 14px",
                        fontSize: "14px",
                        color: formData.gstRate ? "#111827" : "#6b7280",
                        background: "#ffffff",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        outline: "none",
                        boxSizing: "border-box",
                        appearance: "none",
                        cursor: "pointer"
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#ea580c")}
                      onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    >
                      <option value="" disabled>Select GST Rate</option>
                      <option value="0">0% (Nil Rated / Exempt)</option>
                      <option value="5">5% (Standard Essential)</option>
                      <option value="12">12% (Apparel / Adventure Gear)</option>
                      <option value="18">18% (Standard Rate)</option>
                      <option value="28">28% (Luxury Items)</option>
                    </select>
                    <ChevronDown
                      size={18}
                      color="#6b7280"
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    />
                  </div>
                </div>

                {/* SKU ID */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    SKU ID
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ""}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="e.g. CTR-OD4-BLK or DZR-SHOE-01"
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      fontSize: "14px",
                      color: "#111827",
                      background: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#ea580c")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "6px 0 0 0" }}>
                    Enter product SKU identifier (optional). If left empty, a SKU will be auto-generated for variations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: Product Variations ================= */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>
                  Product Variations
                </h2>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                  Add product attributes (e.g. size, color) and generate variations.
                </p>
              </div>

              {/* Does this product have variations? Toggle Box */}
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #f3f4f6",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px"
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                    Does this product have variations?
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                    Examples: Size, Color, Material, etc.
                  </p>
                </div>

                {/* Orange Toggle Switch */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                  onClick={() => handleChange("hasVariations", !formData.hasVariations)}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "26px",
                      borderRadius: "13px",
                      background: formData.hasVariations ? "#ea580c" : "#cbd5e1",
                      position: "relative",
                      transition: "background 0.2s ease"
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        position: "absolute",
                        top: "3px",
                        left: formData.hasVariations ? "25px" : "3px",
                        transition: "left 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                    {formData.hasVariations ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {formData.hasVariations && (
                <div>
                  {/* Product Attributes */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 14px 0" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>
                        Product Attributes
                      </h3>
                      <button
                        type="button"
                        onClick={() => window.open("/admin/attributes", "_blank")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff6600",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        Manage Attributes ↗
                      </button>
                    </div>

                    <div style={{ display: "grid", gap: "16px" }}>
                      {formData.attributes.map((attr) => (
                        <div
                          key={attr.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "220px 1fr 36px",
                            gap: "14px",
                            alignItems: "flex-start"
                          }}
                        >
                          <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                              Attribute Name
                            </label>

                            {attr.isCustom ? (
                              <div style={{ position: "relative" }}>
                                <input
                                  type="text"
                                  value={attr.name}
                                  onChange={(e) => handleAttributeNameChange(attr.id, e.target.value)}
                                  placeholder="e.g. Fabric, Weight, Style..."
                                  autoFocus
                                  style={{
                                    width: "100%",
                                    height: "42px",
                                    padding: "0 34px 0 12px",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    color: "#111827",
                                    background: "#ffffff",
                                    border: "1.5px solid #ea580c",
                                    borderRadius: "8px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleToggleCustomAttribute(attr.id, false)}
                                  title="Switch back to dropdown list"
                                  style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    color: "#9ca3af",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    padding: "4px"
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div style={{ position: "relative" }}>
                                <select
                                  value={presetAttributes.includes(attr.name) ? attr.name : "__custom__"}
                                  onChange={(e) => {
                                    if (e.target.value === "__custom__") {
                                      handleToggleCustomAttribute(attr.id, true);
                                    } else {
                                      handleAttributeNameChange(attr.id, e.target.value);
                                    }
                                  }}
                                  style={{
                                    width: "100%",
                                    height: "42px",
                                    padding: "0 32px 0 12px",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    color: "#111827",
                                    background: "#ffffff",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    outline: "none",
                                    appearance: "none",
                                    cursor: "pointer"
                                  }}
                                >
                                  {presetAttributes.map((preset) => (
                                    <option key={preset} value={preset}>
                                      {preset}
                                    </option>
                                  ))}
                                  <option value="__custom__">+ Custom (Type own name...)</option>
                                </select>
                                <ChevronDown size={16} color="#6b7280" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                              </div>
                            )}
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                              Attribute Values
                            </label>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "6px",
                                minHeight: "42px",
                                padding: "4px 10px",
                                background: "#ffffff",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                boxSizing: "border-box"
                              }}
                            >
                              {attr.values.map((val) => (
                                <span
                                  key={val}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "#f1f5f9",
                                    border: "1px solid #e2e8f0",
                                    color: "#334155",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    padding: "3px 8px",
                                    borderRadius: "6px"
                                  }}
                                >
                                  {val}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTag(attr.id, val)}
                                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0, fontSize: "11px", display: "flex", alignItems: "center" }}
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}

                              <input
                                type="text"
                                value={attr.inputValue}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    attributes: prev.attributes.map((a) =>
                                      a.id === attr.id ? { ...a, inputValue: e.target.value } : a
                                    )
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === ",") {
                                    e.preventDefault();
                                    handleAddTag(attr.id);
                                  }
                                }}
                                onBlur={() => handleAddTag(attr.id)}
                                placeholder="Add value and press Enter..."
                                style={{ border: "none", outline: "none", fontSize: "13px", color: "#111827", flex: 1, minWidth: "150px", padding: "4px 0" }}
                              />
                            </div>
                          </div>

                          <div style={{ paddingTop: "26px" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttribute(attr.id)}
                              disabled={formData.attributes.length === 1}
                              title="Delete attribute"
                              style={{ background: "none", border: "none", color: formData.attributes.length === 1 ? "#d1d5db" : "#9ca3af", cursor: formData.attributes.length === 1 ? "not-allowed" : "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              onMouseOver={(e) => { if (formData.attributes.length > 1) e.currentTarget.style.color = "#ef4444"; }}
                              onMouseOut={(e) => { if (formData.attributes.length > 1) e.currentTarget.style.color = "#9ca3af"; }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddAttribute(false)}
                      style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", background: "#ffffff", border: "1px solid #d1d5db", color: "#1f2937", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                    >
                      <Plus size={15} /> Add Another Attribute
                    </button>
                  </div>

                  {/* Generate Variations Section */}
                  <div style={{ marginTop: "28px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>
                      Generate Variations
                    </h3>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px 0" }}>
                      Click the button below to generate all possible combinations based on the attributes above.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", background: "#f0f9ff", border: "1px solid #e0f2fe", borderRadius: "8px", padding: "12px 16px" }}>
                        <Info size={18} color="#0284c7" />
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#0369a1" }}>
                          This will create {totalPossibleVariations} variations (
                          {attributeValueCounts.map((a) => `${a.count} ${a.name.toLowerCase()}s`).join(" × ")}
                          ).
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateVariations}
                        style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ea580c", color: "#ffffff", border: "none", padding: "12px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(234, 88, 12, 0.2)" }}
                      >
                        <Settings2 size={16} /> Generate Variations
                      </button>
                    </div>

                    {formData.isGenerated && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "12px" }}>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px", padding: "12px 16px" }}>
                          <CheckCircle2 size={22} color="#16a34a" />
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#15803d" }}>
                              {formData.variations.length || totalPossibleVariations} variations generated successfully!
                            </div>
                            <div style={{ fontSize: "12px", color: "#166534", marginTop: "1px" }}>
                              You can review and manage the variations in the next step (Inventory).
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleChange("showGeneratedModal", !formData.showGeneratedModal)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff", color: "#374151", border: "1px solid #d1d5db", padding: "12px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}
                        >
                          <Eye size={16} color="#64748b" /> View Generated Variations
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: Inventory ================= */}
          {currentStep === 3 && (
            <div>
              {/* Inventory Header */}
              <div style={{ marginBottom: "16px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>
                  Inventory
                </h2>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 16px 0" }}>
                  Set initial stock for each variation. You can update stock, MRP and selling price anytime later through Purchase Orders or from the Inventory section.
                </p>

                {/* Light Blue Info Box */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#f0f9ff",
                    border: "1px solid #e0f2fe",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "24px"
                  }}
                >
                  <Info size={18} color="#0284c7" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#0369a1", fontWeight: "500" }}>
                    Configure stock levels here. In the next step, assign barcodes and POS fast-billing codes.
                  </span>
                </div>
              </div>

              {/* Inventory by Variations Header & Bulk Update Button */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: selectedStep3VarIds.length > 0 ? "12px" : "16px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>
                    Inventory by Variations
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                    Update the opening stock, MRP and selling price for each variation.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={handleOpenStep3BulkModal}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#ea580c",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#ffffff",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(234, 88, 12, 0.25)"
                    }}
                  >
                    <Edit3 size={14} /> Edit Selected ({selectedStep3VarIds.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange("showBulkModal", true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1e293b",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#f8fafc")}
                    onMouseOut={(e) => (e.target.style.background = "#ffffff")}
                  >
                    <Download size={15} style={{ transform: "rotate(180deg)" }} /> Bulk Update All
                  </button>
                </div>
              </div>

              {/* Contextual Bulk Action Bar when Variations are Selected */}
              {selectedStep3VarIds.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff7ed",
                    border: "1.5px solid #fdba74",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 5px rgba(234, 88, 12, 0.08)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "22px", height: "22px", background: "#ea580c", color: "#fff", borderRadius: "50%", fontSize: "11px", fontWeight: "700", padding: "0 6px" }}>
                      {selectedStep3VarIds.length}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#9a3412" }}>
                      {selectedStep3VarIds.length} variation{selectedStep3VarIds.length > 1 ? "s" : ""} selected for editing
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={handleOpenStep3BulkModal}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#ea580c",
                        color: "#ffffff",
                        border: "none",
                        padding: "7px 16px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(234, 88, 12, 0.3)"
                      }}
                    >
                      <Edit3 size={14} /> Edit Selected ({selectedStep3VarIds.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${selectedStep3VarIds.length} selected variations?`)) {
                          setFormData((prev) => ({
                            ...prev,
                            variations: prev.variations.filter((v) => !selectedStep3VarIds.includes(v.id))
                          }));
                          setSelectedStep3VarIds([]);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "#ffffff",
                        color: "#dc2626",
                        border: "1px solid #fca5a5",
                        padding: "7px 12px",
                        borderRadius: "6px",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      <Trash2 size={13} /> Delete Selected
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedStep3VarIds([])}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#64748b",
                        fontSize: "12px",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: "4px 6px"
                      }}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              )}

              {/* Inventory Table matching exact image */}
              <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#1e293b", fontSize: "12.5px", fontWeight: "700" }}>
                        <th style={{ padding: "12px 14px", width: "32px" }}>
                          <input
                            type="checkbox"
                            checked={selectedStep3VarIds.length === formData.variations.length && formData.variations.length > 0}
                            onChange={handleToggleSelectAllStep3Vars}
                            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#ea580c" }}
                          />
                        </th>
                        <th style={{ padding: "12px 14px", width: "40px" }}>#</th>
                        <th style={{ padding: "12px 14px", width: "160px" }}>Color</th>
                        <th style={{ padding: "12px 14px", width: "80px" }}>Size</th>
                        <th style={{ padding: "12px 14px", width: "130px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            SKU <HelpCircle size={13} color="#94a3b8" />
                          </span>
                        </th>
                        <th style={{ padding: "12px 14px", width: "120px" }}>MRP (₹)</th>
                        <th style={{ padding: "12px 14px", width: "130px" }}>Selling Price (₹)</th>
                        <th style={{ padding: "12px 14px", width: "120px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            Initial Stock <HelpCircle size={13} color="#94a3b8" />
                          </span>
                        </th>
                        <th style={{ padding: "12px 14px", width: "90px" }}>Remarks</th>
                        <th style={{ padding: "12px 14px", width: "80px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.variations.length === 0 ? (
                        <tr>
                          <td colSpan={10} style={{ textAlign: "center", padding: "36px 20px", color: "#64748b" }}>
                            <p style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                              No variations generated yet
                            </p>
                            <p style={{ margin: 0, fontSize: "12.5px" }}>
                              You can go back to Step 2 to add attributes and generate variations, or continue with standard pricing.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        Object.keys(groupedByColor).map((colorName) => {
                          const items = groupedByColor[colorName];
                          return items.map((row, idx) => {
                            const isRowChecked = selectedStep3VarIds.includes(row.id);
                            return (
                              <tr
                                key={row.id}
                                style={{
                                  borderBottom: "1px solid #f1f5f9",
                                  fontSize: "13px",
                                  background: isRowChecked ? "#fff7ed" : "#ffffff"
                                }}
                                onMouseOver={(e) => {
                                  if (!isRowChecked) e.currentTarget.style.background = "#fafafa";
                                }}
                                onMouseOut={(e) => {
                                  if (!isRowChecked) e.currentTarget.style.background = "#ffffff";
                                }}
                              >
                                <td style={{ padding: "10px 14px" }} onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isRowChecked}
                                    onChange={() => handleToggleSelectStep3Var(row.id)}
                                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#ea580c" }}
                                  />
                                </td>

                                <td style={{ padding: "10px 14px", color: "#94a3b8", verticalAlign: "middle" }}>
                                  {idx === 0 ? <ChevronDown size={16} color="#475569" style={{ cursor: "pointer" }} /> : row.id}
                                </td>

                                {idx === 0 ? (
                                  <td rowSpan={items.length} style={{ padding: "10px 14px", verticalAlign: "middle", borderRight: "1px solid #f1f5f9" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: row.colorHex || "#DC2626", border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                                      <div style={{ fontWeight: "700", color: "#111827", fontSize: "13px" }}>{row.color}</div>
                                    </div>
                                  </td>
                                ) : null}

                                <td style={{ padding: "10px 14px", color: "#475569", fontWeight: "500" }}>{row.size}</td>
                                <td style={{ padding: "10px 14px", color: "#475569", fontSize: "12.5px" }}>{row.sku}</td>

                                <td style={{ padding: "8px 10px" }}>
                                  <input
                                    type="text"
                                    value={row.mrp}
                                    onChange={(e) => handleVariationFieldChange(row.id, "mrp", e.target.value)}
                                    style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", color: "#111827", border: "1px solid #d1d5db", borderRadius: "6px", outline: "none", boxSizing: "border-box", background: "#ffffff" }}
                                  />
                                </td>

                                <td style={{ padding: "8px 10px" }}>
                                  <input
                                    type="text"
                                    value={row.sellingPrice}
                                    onChange={(e) => handleVariationFieldChange(row.id, "sellingPrice", e.target.value)}
                                    style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", color: "#111827", border: "1px solid #d1d5db", borderRadius: "6px", outline: "none", boxSizing: "border-box", background: "#ffffff" }}
                                  />
                                </td>

                                <td style={{ padding: "8px 10px" }}>
                                  <input
                                    type="text"
                                    value={row.stock}
                                    onChange={(e) => handleVariationFieldChange(row.id, "stock", e.target.value)}
                                    style={{ width: "100%", height: "36px", padding: "0 10px", fontSize: "13px", color: "#111827", border: "1px solid #d1d5db", borderRadius: "6px", outline: "none", boxSizing: "border-box", background: "#ffffff" }}
                                  />
                                </td>

                                <td style={{ padding: "10px 14px", color: "#94a3b8" }}>{row.remarks || "-"}</td>

                                <td style={{ padding: "8px 10px", textAlign: "center" }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                    <button
                                      type="button"
                                      onClick={() => setEditingStep3Var({ ...row })}
                                      title="Edit this variation"
                                      style={{
                                        background: "#f0f9ff",
                                        border: "1px solid #bae6fd",
                                        borderRadius: "6px",
                                        padding: "5px",
                                        color: "#0284c7",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}
                                    >
                                      <Edit3 size={13} />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteStep3Var(row.id)}
                                      title="Delete this variation"
                                      style={{
                                        background: "#fef2f2",
                                        border: "1px solid #fee2e2",
                                        borderRadius: "6px",
                                        padding: "5px",
                                        color: "#ef4444",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* POPUP MODAL: Bulk Edit Selected Variations */}
              {showStep3BulkModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(2px)" }}>
                  <div style={{ background: "#ffffff", borderRadius: "12px", width: "100%", maxWidth: "460px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                        Bulk Edit Variations ({selectedStep3VarIds.length} Selected)
                      </h3>
                      <button onClick={() => setShowStep3BulkModal(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={18} /></button>
                    </div>

                    <div style={{ background: "#fff7ed", border: "1px solid #ffedd5", borderRadius: "8px", padding: "10px 12px", fontSize: "12.5px", color: "#9a3412", marginBottom: "16px" }}>
                      Update color, price, and stock for the <strong>{selectedStep3VarIds.length}</strong> selected variations at once.
                    </div>

                    <div style={{ display: "grid", gap: "14px", marginBottom: "20px" }}>
                      {/* Color Field */}
                      <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                          <input
                            type="checkbox"
                            checked={step3BulkData.applyColor}
                            onChange={(e) => setStep3BulkData({ ...step3BulkData, applyColor: e.target.checked })}
                            style={{ accentColor: "#ea580c" }}
                          />
                          <span>Color & Swatch</span>
                        </label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="text"
                            placeholder="e.g. Royal Blue, Crimson Red"
                            disabled={!step3BulkData.applyColor}
                            value={step3BulkData.color}
                            onChange={(e) => {
                              const col = e.target.value;
                              setStep3BulkData({
                                ...step3BulkData,
                                color: col,
                                colorHex: getColorHex(col) || step3BulkData.colorHex
                              });
                            }}
                            style={{ flex: 1, height: "40px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: step3BulkData.applyColor ? "#fff" : "#f1f5f9" }}
                          />
                          <input
                            type="color"
                            disabled={!step3BulkData.applyColor}
                            value={step3BulkData.colorHex || "#ea580c"}
                            onChange={(e) => setStep3BulkData({ ...step3BulkData, colorHex: e.target.value })}
                            style={{ width: "40px", height: "40px", padding: "2px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", background: step3BulkData.applyColor ? "#fff" : "#f1f5f9" }}
                            title="Choose color swatch"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                          <input
                            type="checkbox"
                            checked={step3BulkData.applyMrp}
                            onChange={(e) => setStep3BulkData({ ...step3BulkData, applyMrp: e.target.checked })}
                            style={{ accentColor: "#ea580c" }}
                          />
                          <span>MRP (₹)</span>
                        </label>
                        <input
                          type="text"
                          disabled={!step3BulkData.applyMrp}
                          value={step3BulkData.mrp}
                          onChange={(e) => setStep3BulkData({ ...step3BulkData, mrp: e.target.value })}
                          style={{ width: "100%", height: "40px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: step3BulkData.applyMrp ? "#fff" : "#f1f5f9" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                          <input
                            type="checkbox"
                            checked={step3BulkData.applySellingPrice}
                            onChange={(e) => setStep3BulkData({ ...step3BulkData, applySellingPrice: e.target.checked })}
                            style={{ accentColor: "#ea580c" }}
                          />
                          <span>Selling Price (₹)</span>
                        </label>
                        <input
                          type="text"
                          disabled={!step3BulkData.applySellingPrice}
                          value={step3BulkData.sellingPrice}
                          onChange={(e) => setStep3BulkData({ ...step3BulkData, sellingPrice: e.target.value })}
                          style={{ width: "100%", height: "40px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: step3BulkData.applySellingPrice ? "#fff" : "#f1f5f9" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                          <input
                            type="checkbox"
                            checked={step3BulkData.applyStock}
                            onChange={(e) => setStep3BulkData({ ...step3BulkData, applyStock: e.target.checked })}
                            style={{ accentColor: "#ea580c" }}
                          />
                          <span>Initial Stock (Qty)</span>
                        </label>
                        <input
                          type="text"
                          disabled={!step3BulkData.applyStock}
                          value={step3BulkData.stock}
                          onChange={(e) => setStep3BulkData({ ...step3BulkData, stock: e.target.value })}
                          style={{ width: "100%", height: "40px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", background: step3BulkData.applyStock ? "#fff" : "#f1f5f9" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button onClick={() => setShowStep3BulkModal(false)} style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                      <button onClick={handleApplyStep3BulkModal} style={{ padding: "8px 18px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        Update {selectedStep3VarIds.length} Variations
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* POPUP MODAL: Single Variation Edit */}
              {editingStep3Var && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(2px)" }}>
                  <div style={{ background: "#ffffff", borderRadius: "12px", width: "100%", maxWidth: "440px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                        Edit Variation ({editingStep3Var.sku})
                      </h3>
                      <button onClick={() => setEditingStep3Var(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={18} /></button>
                    </div>

                    <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Color & Swatch</label>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input
                              type="text"
                              value={editingStep3Var.color}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingStep3Var({
                                  ...editingStep3Var,
                                  color: val,
                                  colorHex: getColorHex(val) || editingStep3Var.colorHex
                                });
                              }}
                              style={{ flex: 1, height: "38px", padding: "0 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
                            />
                            <input
                              type="color"
                              value={editingStep3Var.colorHex || getColorHex(editingStep3Var.color) || "#ea580c"}
                              onChange={(e) => setEditingStep3Var({ ...editingStep3Var, colorHex: e.target.value })}
                              style={{ width: "38px", height: "38px", padding: "2px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer" }}
                              title="Choose color swatch"
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Size</label>
                          <input type="text" value={editingStep3Var.size} onChange={(e) => setEditingStep3Var({ ...editingStep3Var, size: e.target.value })} style={{ width: "100%", height: "38px", padding: "0 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>SKU Code</label>
                        <input type="text" value={editingStep3Var.sku} onChange={(e) => setEditingStep3Var({ ...editingStep3Var, sku: e.target.value })} style={{ width: "100%", height: "38px", padding: "0 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>MRP (₹)</label>
                          <input type="text" value={editingStep3Var.mrp} onChange={(e) => setEditingStep3Var({ ...editingStep3Var, mrp: e.target.value })} style={{ width: "100%", height: "38px", padding: "0 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Selling Price (₹)</label>
                          <input type="text" value={editingStep3Var.sellingPrice} onChange={(e) => setEditingStep3Var({ ...editingStep3Var, sellingPrice: e.target.value })} style={{ width: "100%", height: "38px", padding: "0 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Initial Stock (Qty)</label>
                        <input type="text" value={editingStep3Var.stock} onChange={(e) => setEditingStep3Var({ ...editingStep3Var, stock: e.target.value })} style={{ width: "100%", height: "38px", padding: "0 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Remarks</label>
                        <input type="text" value={editingStep3Var.remarks} onChange={(e) => setEditingStep3Var({ ...editingStep3Var, remarks: e.target.value })} style={{ width: "100%", height: "38px", padding: "0 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button onClick={() => setEditingStep3Var(null)} style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                      <button onClick={() => handleSaveSingleStep3Var(editingStep3Var)} style={{ padding: "8px 18px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Save Changes</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bulk Update All Modal */}
              {formData.showBulkModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(2px)" }}>
                  <div style={{ background: "#ffffff", borderRadius: "12px", width: "100%", maxWidth: "440px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>Bulk Update All Variations</h3>
                      <button onClick={() => handleChange("showBulkModal", false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={18} /></button>
                    </div>
                    <div style={{ display: "grid", gap: "14px", marginBottom: "20px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>MRP (₹)</label>
                        <input type="text" value={formData.bulkMrp} onChange={(e) => handleChange("bulkMrp", e.target.value)} style={{ width: "100%", height: "40px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Selling Price (₹)</label>
                        <input type="text" value={formData.bulkSellingPrice} onChange={(e) => handleChange("bulkSellingPrice", e.target.value)} style={{ width: "100%", height: "40px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Initial Stock (Qty)</label>
                        <input type="text" value={formData.bulkStock} onChange={(e) => handleChange("bulkStock", e.target.value)} style={{ width: "100%", height: "40px", padding: "0 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button onClick={() => handleChange("showBulkModal", false)} style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                      <button onClick={handleApplyBulkUpdate} style={{ padding: "8px 18px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Apply to All</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: Barcode & POS (Requested New Step!) ================= */}
          {currentStep === 4 && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>
                  Barcode & POS Configuration
                </h2>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                  Assign unique barcodes, SKU identifiers, and setup quick-billing options for retail POS terminals.
                </p>
              </div>

              {/* Primary Barcode & HSN Card */}
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "24px"
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px", alignItems: "flex-start" }}>
                  {/* Primary Barcode Code */}
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                      Master Product Barcode (EAN-13 / Code 128)
                    </label>
                    <div style={{ display: "flex" }}>
                      <input
                        type="text"
                        value={formData.primaryBarcode}
                        onChange={(e) => handleChange("primaryBarcode", e.target.value)}
                        placeholder="8904581290340"
                        style={{
                          flex: 1,
                          height: "40px",
                          padding: "0 12px",
                          fontSize: "13px",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px 0 0 8px",
                          outline: "none"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleChange(
                            "primaryBarcode",
                            "890" + Math.floor(1000000000 + Math.random() * 9000000000)
                          )
                        }
                        style={{
                          padding: "0 12px",
                          background: "#fff7ed",
                          color: "#ea580c",
                          border: "1px solid #fed7aa",
                          borderLeft: "none",
                          borderRadius: "0 8px 8px 0",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* HSN Code */}
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                      HSN / SAC Code
                    </label>
                    <input
                      type="text"
                      value={formData.hsnCode}
                      onChange={(e) => handleChange("hsnCode", e.target.value)}
                      placeholder="e.g. 420212"
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        fontSize: "13px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* POS Department */}
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
                      POS Department / Tile Group
                    </label>
                    <select
                      value={formData.posDepartment}
                      onChange={(e) => handleChange("posDepartment", e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        fontSize: "13px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        outline: "none",
                        background: "#fff",
                        boxSizing: "border-box"
                      }}
                    >
                      <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                      <option value="Footwear & Shoes">Footwear & Shoes</option>
                      <option value="Camping & Outdoor Gear">Camping & Outdoor Gear</option>
                      <option value="Apparel & Jackets">Apparel & Jackets</option>
                      <option value="Accessories & Hardware">Accessories & Hardware</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Variation Barcodes Assignment Table */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0" }}>
                      Assign Unique Barcodes & SKUs by Variation
                    </h3>
                    <p style={{ fontSize: "12.5px", color: "#6b7280", margin: 0 }}>
                      Each variant has its own unique scannable barcode for quick billing at cash counters.
                    </p>
                  </div>

                  {/* Bulk Generate Barcodes Button */}
                  <button
                    type="button"
                    onClick={handleBulkGenerateAllBarcodes}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      borderRadius: "6px",
                      color: "#ea580c",
                      fontSize: "12.5px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    <Sparkles size={15} /> Auto-Generate All Barcodes
                  </button>
                </div>

                {/* Table */}
                <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#1e293b", fontSize: "12px", fontWeight: "700" }}>
                        <th style={{ padding: "10px 14px", width: "40px" }}>#</th>
                        <th style={{ padding: "10px 14px", width: "150px" }}>Variation</th>
                        <th style={{ padding: "10px 14px", width: "150px" }}>Unique SKU Code</th>
                        <th style={{ padding: "10px 14px", minWidth: "220px" }}>Assigned Barcode (EAN-13)</th>
                        <th style={{ padding: "10px 14px", width: "100px" }}>Price</th>
                        <th style={{ padding: "10px 14px", width: "110px", textAlign: "center" }}>Preview / Print</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.variations.map((item, idx) => (
                        <tr
                          key={item.id}
                          style={{ borderBottom: "1px solid #f1f5f9", fontSize: "12.5px" }}
                          onMouseOver={(e) => (e.currentTarget.style.background = "#fafafa")}
                          onMouseOut={(e) => (e.currentTarget.style.background = "#ffffff")}
                        >
                          <td style={{ padding: "10px 14px", color: "#94a3b8" }}>{idx + 1}</td>

                          {/* Variation Name */}
                          <td style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: item.colorHex || "#DC2626" }} />
                              <span style={{ fontWeight: "600", color: "#111827" }}>
                                {item.color} / Size {item.size}
                              </span>
                            </div>
                          </td>

                          {/* SKU Input */}
                          <td style={{ padding: "6px 10px" }}>
                            <input
                              type="text"
                              value={item.sku}
                              onChange={(e) => handleVariationFieldChange(item.id, "sku", e.target.value)}
                              style={{ width: "100%", height: "34px", padding: "0 8px", fontSize: "12px", border: "1px solid #d1d5db", borderRadius: "6px", outline: "none" }}
                            />
                          </td>

                          {/* Barcode Input + Generate Button */}
                          <td style={{ padding: "6px 10px" }}>
                            <div style={{ display: "flex" }}>
                              <input
                                type="text"
                                value={item.barcode}
                                onChange={(e) => handleVariationFieldChange(item.id, "barcode", e.target.value)}
                                placeholder="8901234567890"
                                style={{
                                  flex: 1,
                                  height: "34px",
                                  padding: "0 8px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  letterSpacing: "0.5px",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "6px 0 0 6px",
                                  outline: "none"
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleGenerateSingleBarcode(item.id)}
                                title="Generate fresh unique barcode"
                                style={{
                                  padding: "0 8px",
                                  background: "#f1f5f9",
                                  color: "#334155",
                                  border: "1px solid #d1d5db",
                                  borderLeft: "none",
                                  borderRadius: "0 6px 6px 0",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  cursor: "pointer"
                                }}
                              >
                                Re-Gen
                              </button>
                            </div>
                          </td>

                          {/* Price */}
                          <td style={{ padding: "10px 14px", fontWeight: "600", color: "#ea580c" }}>
                            ₹{item.sellingPrice}
                          </td>

                          {/* Preview / Print Label */}
                          <td style={{ padding: "6px 10px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleChange("previewBarcodeItem", item)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "5px 10px",
                                background: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                fontSize: "11.5px",
                                fontWeight: "600",
                                color: "#374151",
                                cursor: "pointer"
                              }}
                            >
                              <BarcodeIcon size={14} color="#ea580c" /> Label
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* POS Terminal Toggles */}
              <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
                {/* Enable in POS */}
                <div
                  style={{
                    padding: "16px 20px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 2px 0", fontSize: "13.5px", fontWeight: "600", color: "#111827" }}>
                      Enable in Retail POS Billing Terminal
                    </h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                      Cashiers can scan barcodes or search this item at point-of-sale checkout counters.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.enableInPOS}
                    onChange={(e) => handleChange("enableInPOS", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#ea580c", cursor: "pointer" }}
                  />
                </div>

                {/* Quick Billing Tile */}
                <div
                  style={{
                    padding: "16px 20px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 2px 0", fontSize: "13.5px", fontWeight: "600", color: "#111827" }}>
                      Add to POS Quick-Select Favorites
                    </h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                      Show on the quick-touch grid for 1-tap billing on touchscreen POS registers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.quickBillingTile}
                    onChange={(e) => handleChange("quickBillingTile", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#ea580c", cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Barcode Label Thermal Preview Modal */}
              {formData.previewBarcodeItem && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(15, 23, 42, 0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    backdropFilter: "blur(2px)"
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      width: "100%",
                      maxWidth: "400px",
                      padding: "24px",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                        Barcode Thermal Label Preview
                      </h3>
                      <button
                        onClick={() => handleChange("previewBarcodeItem", null)}
                        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Sticker Label Look */}
                    <div
                      style={{
                        background: "#ffffff",
                        border: "2px solid #1e293b",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                        marginBottom: "20px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                      }}
                    >
                      <div style={{ fontWeight: "800", fontSize: "14px", color: "#000" }}>
                        DZIRE OUTDOORS
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "600", marginTop: "2px" }}>
                        {formData.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "1px" }}>
                        Color: {formData.previewBarcodeItem.color} | Size: {formData.previewBarcodeItem.size} | SKU: {formData.previewBarcodeItem.sku}
                      </div>

                      {/* Barcode Graphic */}
                      <div style={{ margin: "12px 0 6px" }}>
                        <BarcodeIcon size={56} color="#000" style={{ margin: "0 auto" }} />
                        <div style={{ fontWeight: "800", letterSpacing: "2.5px", fontSize: "13px", color: "#000" }}>
                          {formData.previewBarcodeItem.barcode}
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #000", paddingTop: "6px", marginTop: "8px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700" }}>MRP: ₹{formData.previewBarcodeItem.mrp}</span>
                        <span style={{ fontSize: "13px", fontWeight: "900", color: "#000" }}>OUR PRICE: ₹{formData.previewBarcodeItem.sellingPrice}</span>
                      </div>
                      <div style={{ fontSize: "9px", color: "#64748b", marginTop: "4px" }}>
                        Inclusive of all taxes • HSN: {formData.hsnCode}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button
                        onClick={() => handleChange("previewBarcodeItem", null)}
                        style={{ padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          toast?.success?.("Thermal label sent to printer!");
                          handleChange("previewBarcodeItem", null);
                        }}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                      >
                        <Printer size={15} /> Print Label
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1px solid #f1f5f9"
            }}
          >
            {/* Left Button: Cancel or Previous */}
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "10px 28px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseOver={(e) => (e.target.style.background = "#f9fafb")}
                onMouseOut={(e) => (e.target.style.background = "#ffffff")}
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseOver={(e) => (e.target.style.background = "#f9fafb")}
                onMouseOut={(e) => (e.target.style.background = "#ffffff")}
              >
                <ArrowLeft size={16} /> Previous
              </button>
            )}

            {/* Right Button: Continue or Create Product */}
            <button
              type="button"
              onClick={handleNext}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 28px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                background: "#ea580c",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(234, 88, 12, 0.25)",
                transition: "background 0.15s ease"
              }}
              onMouseOver={(e) => (e.target.style.background = "#c2410c")}
              onMouseOut={(e) => (e.target.style.background = "#ea580c")}
            >
              {currentStep === 4 ? (
                <>
                  <Check size={16} strokeWidth={2.8} /> {isEditMode ? "Save & Update Product" : "Create Product"}
                </>
              ) : (
                <>
                  Continue <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateItem;

import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Plus, RefreshCcw, Search, Upload } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import AdminLayout from "./AdminLayout";
const PRODUCTS_PER_PAGE = 8;
const SECTION_OPTIONS = [
	{
		value: "bestseller",
		label: "Bestseller"
	},
	{
		value: "premium",
		label: "Premium"
	},
	{
		value: "new",
		label: "New Arrival"
	}
];
const MIDDLE_EASTERN_CATEGORIES = new Set([
	"men",
	"women",
	"unisex",
	"oud",
	"attar",
	"bakhoor"
]);
const createInitialForm = (category = "bestseller") => ({
	category,
	audience: "",
	name: "",
	brand: "",
	price: "",
	old_price: "",
	image: "",
	second_image: "",
	description: "",
	stock: 0
});
const normalizeSection = (value) => SECTION_OPTIONS.some((option) => option.value === value) ? value : "all";
const formatCurrency = (value) => `${parsePriceInput(value).toLocaleString()} Rs`;
const getCategoryLabel = (category) => SECTION_OPTIONS.find((option) => option.value === category)?.label || category;
const isMiddleEasternCategoryProduct = (product) => MIDDLE_EASTERN_CATEGORIES.has(String(product.category || "").trim().toLowerCase());
const getProductSection = (product) => {
	const explicitSection = String(product.section || "").trim().toLowerCase();
	if (SECTION_OPTIONS.some((option) => option.value === explicitSection)) {
		return explicitSection;
	}
	const category = String(product.category || "").trim().toLowerCase();
	if (SECTION_OPTIONS.some((option) => option.value === category)) {
		return category;
	}
	return "";
};
const isHomepageSectionProduct = (product) => Boolean(getProductSection(product));
const isActionableAlert = (status) => status !== "notified";
const adminProductsStyles = `
.admin-products-page {
	width: 100%;
	max-width: 100%;
	min-width: 0;
	display: grid;
	gap: 24px;
	overflow: hidden;
}

.admin-products-stats {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 16px;
}

.admin-products-stat-card {
	min-width: 0;
	padding: 16px;
	border: 1px solid #e4ebf5;
	border-radius: 12px;
	background: #ffffff;
	box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.admin-products-stat-label {
	margin: 0;
	color: #64748b;
	font-size: 14px;
	font-weight: 500;
	line-height: 1.35;
}

.admin-products-stat-value {
	margin: 4px 0 0;
	color: #0f172a;
	font-size: 30px;
	line-height: 1.12;
	font-weight: 600;
}

.admin-products-stat-note {
	margin: 4px 0 0;
	color: #64748b;
	font-size: 14px;
	line-height: 1.35;
}

.admin-products-panel,
.admin-products-add-form {
	min-width: 0;
}

.admin-products-panel {
	overflow: hidden;
	border-radius: 16px;
}

.admin-products-toolbar {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20px;
}

.admin-products-toolbar-copy {
	min-width: 0;
	max-width: 560px;
}

.admin-products-actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 12px;
	min-width: min(100%, 680px);
}

.admin-products-search {
	position: relative;
	width: 260px;
	max-width: 100%;
}

.admin-products-search input {
	width: 100%;
	padding-left: 36px;
}

.admin-products-actions select {
	width: 220px;
	max-width: 100%;
}

.admin-products-actions button,
.admin-products-actions a {
	white-space: nowrap;
}

.admin-products-tabs {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 12px;
}

.admin-products-add-form {
	display: grid;
	grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
	gap: 20px;
}

.admin-products-form-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16px;
}

.admin-products-field-full {
	grid-column: 1 / -1;
}

.admin-products-field label,
.admin-products-upload span,
.admin-products-table td,
.admin-products-table th {
	overflow-wrap: anywhere;
}

.admin-products-field input,
.admin-products-field select,
.admin-products-field textarea,
.admin-products-media input {
	width: 100%;
}

.admin-products-upload-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16px;
}

.admin-products-upload {
	min-width: 0;
}

.admin-products-preview-card {
	min-width: 0;
}

.admin-products-price-preview {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.admin-products-price-copy {
	min-width: 0;
}

.admin-products-price-row {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 12px;
}

.admin-products-price-label {
	margin: 0;
	color: #64748b;
	font-size: 16px;
	font-weight: 500;
	line-height: 1.25;
}

.admin-products-preview-price {
	margin: 0;
	color: #0f172a;
	font-size: 26px;
	font-weight: 700;
	line-height: 1.15;
}

.admin-products-preview-discount {
	margin: 8px 0 0;
	color: #0f172a;
	font-size: 14px;
	font-weight: 500;
}

.admin-products-image-preview-grid {
	display: grid;
	grid-template-columns: repeat(2, 120px);
	gap: 12px;
}

.admin-products-preview-item {
	display: grid;
	gap: 8px;
	justify-items: center;
}

.admin-products-preview-image {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 120px;
	height: 120px;
	padding: 8px;
	overflow: hidden;
	border: 1px solid #edf2fa;
	border-radius: 10px;
	background: #f8fafc;
}

.admin-products-preview-image img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.admin-products-preview-empty {
	color: #94a3b8;
	font-size: 12px;
}

.admin-products-preview-label {
	margin: 0;
	color: #64748b;
	font-size: 13px;
	font-weight: 600;
	line-height: 1.3;
	text-align: center;
}

.admin-products-table-wrap {
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
}

.admin-products-table {
	width: 100%;
	min-width: 1120px;
	table-layout: fixed;
}

.admin-products-table thead {
	background: #ff6600 !important;
	color: #ffffff;
}

.admin-products-table thead th {
	background: transparent !important;
	color: #ffffff;
	font-size: 15px;
	font-weight: 700;
	letter-spacing: 0.01em;
	white-space: nowrap;
}

.admin-products-table th,
.admin-products-table td {
	vertical-align: top;
}

.admin-products-table th:nth-child(1),
.admin-products-table td:nth-child(1) {
	width: 35%;
}

.admin-products-table th:nth-child(2),
.admin-products-table td:nth-child(2) {
	width: 12%;
}

.admin-products-table th:nth-child(3),
.admin-products-table td:nth-child(3) {
	width: 12%;
}

.admin-products-table th:nth-child(4),
.admin-products-table td:nth-child(4) {
	width: 8%;
}

.admin-products-table th:nth-child(5),
.admin-products-table td:nth-child(5) {
	width: 11%;
}

.admin-products-table th:nth-child(6),
.admin-products-table td:nth-child(6) {
	width: 10%;
}

.admin-products-table th:nth-child(7),
.admin-products-table td:nth-child(7) {
	width: 12%;
}

.admin-products-table-image-wrap {
	width: 170px;
	height: 130px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border-radius: 8px;
	border: 1px solid #edf2fa;
	background: #f8fafc;
	padding: 4px;
	flex: 0 0 auto;
}

.admin-products-table-image-wrap img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.admin-products-table-product {
	display: flex;
	align-items: center;
	gap: 12px;
	min-width: 0;
}

.admin-products-table-product-copy {
	min-width: 0;
	max-width: 260px;
}

.admin-products-table-product-copy p {
	margin: 0;
}

.admin-products-row-actions {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	gap: 7px;
	width: 100%;
	min-width: 0;
	align-items: center;
	justify-content: center;
}

.admin-products-edit-button,
.admin-products-delete-button {
	width: 96px;
	min-width: 96px;
	flex: 0 0 auto;
	box-sizing: border-box;
}

.admin-products-add-button:disabled {
	background-color: #d35400 !important;
	border-color: #d35400 !important;
	color: #ffffff !important;
	opacity: 0.95 !important;
}

.admin-products-submit-button {
	background-color: #d35400 !important;
	color: #ffffff !important;
}

.admin-products-submit-button:hover:not(:disabled) {
	background-color: #b84600 !important;
}

.admin-products-submit-button:disabled {
	background-color: #d35400 !important;
	color: #ffffff !important;
	opacity: 0.65 !important;
}

.admin-products-delete-button {
	display: inline-flex;
	height: 40px;
	align-items: center;
	justify-content: center;
	border: 1px solid #dfe7f5 !important;
	background: #ffffff !important;
	padding: 0 16px;
	color: #334155 !important;
	font-size: 14px;
	font-weight: 500;
	transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}

.admin-products-delete-button:hover {
	border-color: #ff6600 !important;
	background: #f8fafc !important;
	color: #ff6600 !important;
}

.admin-products-id-cell {
	padding-left: 28px !important;
	padding-right: 22px !important;
}

.admin-products-pagination {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.admin-products-page-buttons {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 8px;
}

@media (max-width: 1180px) {
	.admin-products-stats {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.admin-products-toolbar {
		flex-direction: column;
	}

	.admin-products-actions {
		width: 100%;
		justify-content: flex-start;
		min-width: 0;
	}

	.admin-products-add-form {
		grid-template-columns: 1fr;
	}

	.admin-products-table-wrap {
		overflow-x: auto;
		overflow-y: hidden;
	}

	.admin-products-table {
		width: 1120px;
		min-width: 1120px;
	}
}

@media (max-width: 760px) {
	.admin-products-page {
		gap: 18px;
	}

	.admin-products-stats,
	.admin-products-form-grid,
	.admin-products-upload-grid {
		grid-template-columns: 1fr;
	}

	.admin-products-search,
	.admin-products-actions select,
	.admin-products-actions button {
		width: 100%;
	}

	.admin-products-price-preview {
		flex-direction: column;
		align-items: stretch;
	}

	.admin-products-image-preview-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.admin-products-preview-image {
		width: 100%;
	}

	.admin-products-pagination {
		align-items: flex-start;
		flex-direction: column;
	}

	.admin-products-page-buttons {
		justify-content: flex-start;
	}

	.admin-products-table {
		width: 1040px;
		min-width: 1040px;
	}
}
`;
const AdminProducts = ({ standaloneAllView = false }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeSub = searchParams.get("sub") || "All Products";
	const sectionFilter = standaloneAllView ? "all" : normalizeSection(searchParams.get("section"));
	const [products, setProducts] = useState([]);
	const [stockAlerts, setStockAlerts] = useState([]);
	const [form, setForm] = useState(createInitialForm());
	const [imageFileName, setImageFileName] = useState("");
	const [secondImageFileName, setSecondImageFileName] = useState("");
	const [brandQuery, setBrandQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [showAddForm, setShowAddForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (activeSub === "Add / Edit Product") {
			setShowAddForm(true);
			if (sectionFilter === "all") {
				// select bestseller by default when entering add form
				setSearchParams({ sub: "Add / Edit Product", section: "bestseller" });
			}
		}
	}, [activeSub, sectionFilter]);
	const fetchProducts = async () => {
		try {
			const res = await fetch(apiUrl("/products"));
			const data = await res.json();
			setProducts(Array.isArray(data) ? [...data].sort((a, b) => Number(b.id) - Number(a.id)) : []);
		} catch (error) {
			console.error(error);
		}
	};
	const fetchStockAlerts = async () => {
		try {
			const res = await fetch(apiUrl("/admin/stock-alerts"), { headers: getAuthHeaders(false, "admin") });
			const data = await res.json();
			setStockAlerts(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error(error);
			setStockAlerts([]);
		}
	};
	useEffect(() => {
		void fetchProducts();
		void fetchStockAlerts();
	}, []);
	useEffect(() => {
		setCurrentPage(1);
	}, [
		brandQuery,
		sectionFilter,
		products.length
	]);
	useEffect(() => {
		if (standaloneAllView) {
			setShowAddForm(false);
			return;
		}
		if (sectionFilter === "all") {
			setShowAddForm(false);
			return;
		}
		setForm((current) => ({
			...current,
			category: sectionFilter
		}));
	}, [sectionFilter, standaloneAllView]);
	const handleSetSection = (value) => {
		if (value === "all") {
			setSearchParams({});
			return;
		}
		setSearchParams({ section: value });
	};
	const handleOpenAddForm = () => {
		if (sectionFilter === "all") {
			return;
		}
		if (showAddForm) {
			setShowAddForm(false);
			return;
		}
		setForm(createInitialForm(sectionFilter));
		setImageFileName("");
		setSecondImageFileName("");
		setShowAddForm(true);
	};
	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((current) => ({
			...current,
			[name]: name === "stock" ? Number(value) : value
		}));
	};
	const uploadProductImage = async (file) => {
		const formData = new FormData();
		formData.append("image", file);
		const res = await fetch(apiUrl("/upload"), {
			method: "POST",
			body: formData
		});
		const data = await res.json();
		return data.imageUrl;
	};
	const handleImageUpload = async (event, field) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		if (field === "image") {
			setImageFileName(file.name);
		} else {
			setSecondImageFileName(file.name);
		}
		try {
			const imageUrl = await uploadProductImage(file);
			setForm((current) => ({
				...current,
				[field]: imageUrl
			}));
		} catch (error) {
			console.error(error);
			alert("Image upload failed");
		}
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			const res = await fetch(apiUrl("/products"), {
				method: "POST",
				headers: getAuthHeaders(true, "admin"),
				body: JSON.stringify({
					...form,
					section: form.category,
					price: parsePriceInput(form.price),
					old_price: parsePriceInput(form.old_price),
					images: [form.image, form.second_image].filter(Boolean),
					audience: form.audience || null
				})
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				alert(data?.message || "Add failed");
				return;
			}
			await fetchProducts();
			setForm(createInitialForm(sectionFilter === "all" ? "bestseller" : sectionFilter));
			setImageFileName("");
			setSecondImageFileName("");
			setShowAddForm(false);
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Delete this product from the catalog?")) {
			return;
		}
		try {
			const res = await fetch(apiUrl(`/products/${id}`), {
				method: "DELETE",
				headers: getAuthHeaders(false, "admin")
			});
			if (!res.ok) {
				alert("Delete failed");
				return;
			}
			await fetchProducts();
			await fetchStockAlerts();
		} catch (error) {
			console.error(error);
		}
	};
	const normalizedSearchQuery = brandQuery.trim().toLowerCase();
	const productsShownInProductsPage = products.filter((product) => !isMiddleEasternCategoryProduct(product) && isHomepageSectionProduct(product));
	const filteredProducts = productsShownInProductsPage.filter((product) => {
		const searchableText = [
			product.name,
			product.brand,
			product.description,
			product.category,
			getCategoryLabel(product.category),
			product.audience,
			getAudienceMeta(product.audience)?.navLabel,
			String(product.id)
		].filter(Boolean).join(" ").toLowerCase();
		const matchesSearch = !normalizedSearchQuery || searchableText.includes(normalizedSearchQuery);
		const matchesSection = sectionFilter === "all" || getProductSection(product) === sectionFilter;
		return matchesSearch && matchesSection;
	});
	const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
	const currentPageProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
	const pendingAlertCount = stockAlerts.filter((request) => isActionableAlert(request.status)).length;
	const pendingAlertsByProduct = useMemo(() => {
		const counts = new Map();
		stockAlerts.forEach((request) => {
			if (!isActionableAlert(request.status)) {
				return;
			}
			counts.set(request.product_id, (counts.get(request.product_id) || 0) + 1);
		});
		return counts;
	}, [stockAlerts]);
	const discount = parsePriceInput(form.old_price) > parsePriceInput(form.price) && parsePriceInput(form.price) > 0 ? Math.round((parsePriceInput(form.old_price) - parsePriceInput(form.price)) / parsePriceInput(form.old_price) * 100) : 0;
	const sectionCounts = useMemo(() => ({
		all: productsShownInProductsPage.length,
		bestseller: productsShownInProductsPage.filter((product) => getProductSection(product) === "bestseller").length,
		premium: productsShownInProductsPage.filter((product) => getProductSection(product) === "premium").length,
		new: productsShownInProductsPage.filter((product) => getProductSection(product) === "new").length
	}), [productsShownInProductsPage]);
	const statCards = [
		{
			label: "Total Products",
			value: productsShownInProductsPage.length,
			note: "Live catalog rows"
		},
		{
			label: "Categories Count",
			value: SECTION_OPTIONS.length,
			note: "Bestseller, Premium, New Arrival"
		},
		{
			label: "Notify Requests",
			value: pendingAlertCount,
			note: "Pending stock alerts"
		}
	];
	const renderOriginalContent = () => (
		<>
			<section className="admin-products-stats">
				{statCards.map((item) => <div key={item.label} className="admin-products-stat-card">
					<p className="admin-products-stat-label">{item.label}</p>
					<p className="admin-products-stat-value">{item.value}</p>
					<p className="admin-products-stat-note">{item.note}</p>
				</div>)}
			</section>

			<section className="admin-products-panel overflow-hidden rounded-xl border border-[#e4ebf5] bg-white shadow-sm">
				<div className="border-b border-[#edf2fa] px-6 py-5">
					<div className="admin-products-toolbar flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
						<div className="admin-products-toolbar-copy">
							<h2 className="text-xl font-semibold text-slate-900">Live Inventory</h2>
							<p className="mt-1 text-sm text-slate-500">
								Manage all products here.
							</p>
							<p className="mt-2 text-sm font-medium text-[#ff6600]">
								{sectionFilter === "all" ? `All Products: ${sectionCounts.all}` : `${getCategoryLabel(sectionFilter)} Products: ${sectionCounts[sectionFilter]}`}
							</p>
						</div>

						<div className="admin-products-actions flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="admin-products-search relative w-full sm:w-[260px]">
								<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input value={brandQuery} onChange={(event) => setBrandQuery(event.target.value)} placeholder="Search product, brand, audience..." className="h-11 rounded-xl border-[#e2e8f5] pl-9" />
							</div>

							<select value={sectionFilter === "all" ? "" : sectionFilter} onChange={(event) => handleSetSection(event.target.value || "all")} className="h-11 min-w-[220px] rounded-xl border border-[#dbe5f5] bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#ff6600]">
								<option value="">Select Category</option>
								{SECTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>
									{option.label}
								</option>)}
							</select>

							<Button type="button" onClick={handleOpenAddForm} disabled={sectionFilter === "all" || standaloneAllView} className="admin-products-add-button h-11 rounded-xl bg-[#ff6600] text-white hover:bg-[#e65c00] disabled:opacity-60">
								<Plus className="h-4 w-4" />
								{showAddForm ? "Close Form" : sectionFilter === "all" || standaloneAllView ? "Choose Category First" : "Add Product"}
							</Button>
						</div>
					</div>
				</div>

				{!standaloneAllView ? <div className="border-b border-[#edf2fa] bg-[#f8fafc] px-6 py-4">
					<div className="admin-products-tabs flex flex-wrap items-center gap-3 text-sm">
						<span className="font-medium text-slate-500">Categories:</span>

						<button type="button" onClick={() => handleSetSection("all")} className={`rounded-lg px-3 py-2 transition ${sectionFilter === "all" ? "bg-white text-[#ff6600] shadow-sm" : "text-slate-600 hover:bg-white"}`}>
							All Products ({sectionCounts.all})
						</button>

						{SECTION_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => handleSetSection(option.value)} className={`rounded-lg px-3 py-2 transition ${sectionFilter === option.value ? "bg-white text-[#ff6600] shadow-sm" : "text-slate-600 hover:bg-white"}`}>
							{option.label} ({sectionCounts[option.value]})
						</button>)}

						<span className="mx-1 hidden h-5 w-px bg-slate-200 lg:block" />

						<Link to="/admin/stock-alerts" className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-white hover:text-slate-900">
							Notify Customers
						</Link>

						<Link to="/admin/out-of-stock" className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-white hover:text-slate-900">
							Out of Stock
						</Link>
					</div>
				</div> : null}

				{showAddForm ? <form onSubmit={handleSubmit} className="border-b border-[#edf2fa] bg-[#fbfcfe] px-6 py-6">
					<div className="admin-products-add-form grid gap-4 xl:grid-cols-2">
						<div className="admin-products-form-grid grid gap-4 md:grid-cols-2">
							<div className="admin-products-field admin-products-field-full space-y-2 md:col-span-2">
								<label className="text-sm font-medium text-slate-700">Product name</label>
								<Input name="name" value={form.name} onChange={handleChange} required />
							</div>

							<div className="admin-products-field space-y-2">
								<label className="text-sm font-medium text-slate-700">Brand</label>
								<Input name="brand" value={form.brand} onChange={handleChange} required />
							</div>

							<div className="admin-products-field space-y-2">
								<label className="text-sm font-medium text-slate-700">Audience</label>
								<select name="audience" value={form.audience} onChange={(event) => setForm((current) => ({
									...current,
									audience: event.target.value
								}))} className="h-10 w-full rounded-xl border border-[#e2e8f5] bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#ff6600]" required>
									<option value="">Select audience</option>
									{PRODUCT_AUDIENCES.map((audience) => <option key={audience.value} value={audience.value}>
										{audience.navLabel}
									</option>)}
								</select>
							</div>

							<div className="admin-products-field space-y-2">
								<label className="text-sm font-medium text-slate-700">Current price</label>
								<Input name="price" value={form.price} onChange={handleChange} inputMode="decimal" required />
							</div>

							<div className="admin-products-field space-y-2">
								<label className="text-sm font-medium text-slate-700">Old price</label>
								<Input name="old_price" value={form.old_price} onChange={handleChange} inputMode="decimal" />
							</div>

							<div className="admin-products-field space-y-2">
								<label className="text-sm font-medium text-slate-700">Category</label>
								<Input value={getCategoryLabel(form.category)} readOnly />
							</div>

							<div className="admin-products-field space-y-2">
								<label className="text-sm font-medium text-slate-700">Stock</label>
								<Input type="number" min="0" name="stock" value={form.stock || ""} onChange={handleChange} required />
							</div>

							<div className="admin-products-field admin-products-field-full space-y-2 md:col-span-2">
								<label className="text-sm font-medium text-slate-700">Description</label>
								<textarea name="description" value={form.description} onChange={handleChange} className="min-h-32 w-full rounded-xl border border-[#e2e8f5] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#ff6600]" required />
							</div>
						</div>

						<div className="admin-products-media space-y-4">
							<div className="admin-products-upload-grid grid gap-4 md:grid-cols-2">
								<label className="admin-products-upload flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#d7e2f3] bg-white px-4 py-4 transition hover:border-[#ff6600]">
									<input type="file" accept="image/*" onChange={(event) => void handleImageUpload(event, "image")} className="hidden" />
									<ImagePlus className="h-5 w-5 text-[#ff6600]" />
									<span className="text-sm text-slate-700">{imageFileName || "Upload primary image"}</span>
								</label>

								<label className="admin-products-upload flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#d7e2f3] bg-white px-4 py-4 transition hover:border-[#ff6600]">
									<input type="file" accept="image/*" onChange={(event) => void handleImageUpload(event, "second_image")} className="hidden" />
									<ImagePlus className="h-5 w-5 text-[#ff6600]" />
									<span className="text-sm text-slate-700">{secondImageFileName || "Upload second image"}</span>
								</label>
							</div>

							<Input name="image" value={form.image} onChange={handleChange} placeholder="Primary image URL" required />
							<Input name="second_image" value={form.second_image} onChange={handleChange} placeholder="Second image URL" />

							<div className="rounded-xl border border-[#edf2fa] bg-white px-4 py-3 text-xs text-slate-500">{PRICE_INPUT_HINT}</div>

							<div className="admin-products-preview-card rounded-xl border border-[#edf2fa] bg-white px-4 py-4">
								<div className="admin-products-price-preview">
									<div className="admin-products-price-copy">
										<div className="admin-products-price-row">
											<p className="admin-products-price-label">Price preview</p>
											<p className="admin-products-preview-price">{formatCurrency(form.price)}</p>
										</div>
										<p className="admin-products-preview-discount">{discount > 0 ? `${discount}% off` : "No discount"}</p>
									</div>

									<div className="admin-products-image-preview-grid">
										<div className="admin-products-preview-item">
											<div className="admin-products-preview-image">
												{form.image ? <img src={getProductImage(form.image)} alt={form.name || "Primary preview"} /> : <span className="admin-products-preview-empty">No image</span>}
											</div>
											<p className="admin-products-preview-label">Primary Image</p>
										</div>
										<div className="admin-products-preview-item">
											<div className="admin-products-preview-image">
												{form.second_image ? <img src={getProductImage(form.second_image)} alt={form.name || "Second preview"} /> : <span className="admin-products-preview-empty">No image</span>}
											</div>
											<p className="admin-products-preview-label">Second Image</p>
										</div>
									</div>
								</div>
							</div>

							<div className="flex justify-end gap-3">
								<Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="rounded-xl border-[#dbe5f5] bg-white px-6">
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting} className="admin-products-submit-button rounded-xl px-6">
									{isSubmitting ? "Saving..." : "Save product"}
								</Button>
							</div>
						</div>
					</div>
				</form> : null}

				<div className="admin-products-table-wrap">
					<table className="admin-products-table">
						<thead>
							<tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
								<th className="admin-products-id-cell px-4 py-3">ID</th>
								<th className="px-4 py-3">Product details</th>
								<th className="px-4 py-3">Brand</th>
								<th className="px-4 py-3">Audience</th>
								<th className="px-4 py-3">Category</th>
								<th className="px-4 py-3">Price</th>
								<th className="px-4 py-3">Stock</th>
								<th className="px-4 py-3 text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{productsShownInProductsPage.length > 0 ? productsShownInProductsPage.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE).map((product) => <tr key={product.id} className="border-t border-[#edf2fa]">
								<td className="admin-products-id-cell px-4 py-4 text-sm font-semibold text-slate-900">{product.id}</td>
								<td className="px-4 py-4">
									<div className="admin-products-table-product">
										<div className="admin-products-table-image-wrap">
											<img src={getProductImage(product.image)} alt={product.name} />
										</div>
										<div className="admin-products-table-product-copy">
											<p className="text-sm font-semibold text-slate-950">{product.name}</p>
											<p className="mt-1 text-xs text-slate-500 line-clamp-2">{product.description}</p>
										</div>
									</div>
								</td>
								<td className="px-4 py-4 text-sm text-slate-600">{product.brand || "-"}</td>
								<td className="px-4 py-4">
									<span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getAudienceMeta(product.audience).badgeClassName}`}>
										{getAudienceMeta(product.audience).navLabel}
									</span>
								</td>
								<td className="px-4 py-4">
									<span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
										{getCategoryLabel(product.category)}
									</span>
								</td>
								<td className="px-4 py-4 text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</td>
								<td className="px-4 py-4 text-sm font-semibold text-slate-900">
									<p>{Number(product.stock) || 0}</p>
									{pendingAlertsByProduct.get(product.id) ? <p className="mt-1 text-xs text-[#ff6600]">{pendingAlertsByProduct.get(product.id)} notify request(s)</p> : null}
								</td>
								<td className="px-4 py-4">
									<div className="admin-products-row-actions flex gap-2">
										<Link to={`/admin/products/edit/${product.id}`} className="admin-products-edit-button inline-flex h-10 items-center justify-center rounded-lg border border-[#dfe7f5] bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-[#f8fafc]">
											Edit
										</Link>
										<Button type="button" variant="destructive" onClick={() => void handleDelete(product.id)} className="admin-products-delete-button rounded-lg">
											Delete
										</Button>
									</div>
								</td>
							</tr>) : <tr>
								<td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
									No products found.
								</td>
							</tr>}
						</tbody>
					</table>
				</div>

				<div className="admin-products-pagination flex flex-col gap-4 border-t border-[#edf2fa] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-slate-500">
						Page <span className="font-semibold text-slate-900">{currentPage}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
					</p>

					<div className="admin-products-page-buttons flex items-center gap-2">
						<Button type="button" variant="outline" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-lg border-[#e2e8f5] bg-white">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition ${currentPage === page ? "bg-[#ff6600] text-white" : "border border-[#e2e8f5] bg-white text-slate-700"}`}>
							{page}
						</button>)}
						<Button type="button" variant="outline" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-lg border-[#e2e8f5] bg-white">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</section>
		</>
	);

	const renderProductsSubContent = () => {
		switch (activeSub) {
			case "Add / Edit Product":
				return renderOriginalContent();
			case "Product Variants":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Variant Matrix Configurations</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
									<th style={{ padding: '12px 16px' }}>Master Product</th>
									<th style={{ padding: '12px 16px' }}>Variant SKU</th>
									<th style={{ padding: '12px 16px' }}>Color / Size</th>
									<th style={{ padding: '12px 16px' }}>Stock</th>
								</tr>
							</thead>
							<tbody>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 16px' }}>Air Zoom Running Shoes</td>
									<td style={{ padding: '16px 16px', color: '#667085' }}>SH-AZ-RED-8</td>
									<td style={{ padding: '16px 16px' }}>Red / Size 8</td>
									<td style={{ padding: '16px 16px', fontWeight: '600' }}>12 units</td>
								</tr>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 16px' }}>Air Zoom Running Shoes</td>
									<td style={{ padding: '16px 16px', color: '#667085' }}>SH-AZ-RED-9</td>
									<td style={{ padding: '16px 16px' }}>Red / Size 9</td>
									<td style={{ padding: '16px 16px', fontWeight: '600' }}>18 units</td>
								</tr>
							</tbody>
						</table>
					</div>
				);
			case "Product Specifications":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Add Specification Value</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Specification Name (e.g. Material, Weight)</label>
								<input type="text" placeholder="e.g. Weight" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Value</label>
								<input type="text" placeholder="e.g. 450 grams" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<button onClick={() => alert('Spec added.')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Add Specification
							</button>
						</div>
					</div>
				);
			case "Product Images & Videos":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Product Media Assets Gallery</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
							<div style={{ border: '2px dashed #ff6600', height: '140px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6600', fontWeight: '600' }}>
								+ Upload Asset
							</div>
						</div>
					</div>
				);
			case "Pricing Management":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Pricing Configurator</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Current Price (Rs)</label>
								<input type="number" defaultValue="2499" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Cost Price (Rs) - For Margin calculation</label>
								<input type="number" defaultValue="1400" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<button onClick={() => alert('Pricing updated.')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save Pricing Rules
							</button>
						</div>
					</div>
				);
			case "SEO Management":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Google Search Engine Snippet Preview</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Meta Title</label>
								<input type="text" placeholder="Buy Premium Backpack (Orange) | Dzire Store" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Meta Description</label>
								<textarea placeholder="Order our bestseller hiking backpack crafted with premium waterproof fabrics." style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '80px' }} />
							</div>
							<button onClick={() => alert('SEO Config saved.')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save SEO Meta Data
							</button>
						</div>
					</div>
				);
			case "Dzire Credits Eligibility":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Credits Spending Restrictions</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
								<input type="checkbox" defaultChecked />
								Allow Loyalty Points Redemption on this product
							</label>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
								<input type="checkbox" />
								Double credits reward (Earn 2x points on buying)
							</label>
							<button onClick={() => alert('Loyalty rules configured.')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save Credits Rules
							</button>
						</div>
					</div>
				);
			case "Purchase Restrictions":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Hype Drops Purchase Limits</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Maximum Allowed Qty Per Order</label>
								<input type="number" defaultValue="2" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<button onClick={() => alert('Restrictions configured.')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Apply Basket Limit
							</button>
						</div>
					</div>
				);
			case "Product Status (Draft/Active/Archived)":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Update Catalog Status</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Status</label>
								<select style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
									<option value="active">Active (Visible on Storefront)</option>
									<option value="draft">Draft (Admin eyes only)</option>
									<option value="archived">Archived (Delisted from catalog)</option>
								</select>
							</div>
							<button onClick={() => alert('Status updated.')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Apply Catalog Status
							</button>
						</div>
					</div>
				);
			case "Bulk Actions":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Bulk Products Operations</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
							<div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert('Category transferred.')}>
								<strong>Bulk Category Transfer</strong>
								<p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#667085' }}>Move multiple items to another segment</p>
							</div>
							<div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert('Price adjusted.')}>
								<strong>Bulk Price Adjustment (+/- %)</strong>
								<p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#667085' }}>Adjust price globally by a specific factor</p>
							</div>
						</div>
					</div>
				);

			/* ═══ ATTRIBUTES sub-options ═══════════════════ */
			case "All Attributes":
				return (
					<div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
						<div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<strong style={{ fontSize: '15px' }}>All Product Attributes</strong>
							<button onClick={() => alert('Add Attribute')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ New Attribute</button>
						</div>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase', textAlign: 'left' }}>
									<th style={{ padding: '12px 20px' }}>Attribute Name</th>
									<th style={{ padding: '12px 20px' }}>Type</th>
									<th style={{ padding: '12px 20px' }}>Values</th>
									<th style={{ padding: '12px 20px' }}>Group</th>
									<th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ name: 'Color', type: 'Color Swatch', values: 'Red, Blue, Black, Orange', group: 'Appearance' },
									{ name: 'Size', type: 'Text', values: 'XS, S, M, L, XL, XXL', group: 'Sizing' },
									{ name: 'Material', type: 'Text', values: 'Polyester, Nylon, Mesh', group: 'Construction' },
									{ name: 'Weight', type: 'Number', values: '150g – 2500g', group: 'Technical' },
								].map((a, i) => (
									<tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
										<td style={{ padding: '14px 20px', fontWeight: '500', fontSize: '14px' }}>{a.name}</td>
										<td style={{ padding: '14px 20px', fontSize: '13px' }}>
											<span style={{ padding: '3px 8px', background: '#f0f4ff', color: '#4f46e5', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{a.type}</span>
										</td>
										<td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{a.values}</td>
										<td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{a.group}</td>
										<td style={{ padding: '14px 20px', textAlign: 'right' }}>
											<button onClick={() => alert('Edit ' + a.name)} style={{ color: '#ff6600', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
			case "Add / Edit Attribute":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '560px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Create / Edit Attribute</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Attribute Name</label>
								<input type="text" placeholder="e.g. Color, Size, Material" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Attribute Type</label>
								<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
									<option>Text</option>
									<option>Color Swatch</option>
									<option>Image</option>
									<option>Number</option>
									<option>Boolean (Yes/No)</option>
								</select>
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Attribute Group</label>
								<input type="text" placeholder="e.g. Appearance, Sizing, Technical" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<button onClick={() => alert('Attribute saved!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Attribute</button>
						</div>
					</div>
				);
			case "Attribute Type (Text, Color, Size etc.)":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Attribute Input Types</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
							{[
								{ type: 'Text', desc: 'Free-form text values like "Cotton" or "Waterproof"', icon: '📝' },
								{ type: 'Color Swatch', desc: 'Color picker with hex code e.g. #FF6600', icon: '🎨' },
								{ type: 'Number', desc: 'Numeric values like weight (grams), length (cm)', icon: '🔢' },
								{ type: 'Image', desc: 'Icon or image thumbnail per option', icon: '🖼️' },
								{ type: 'Boolean', desc: 'Simple Yes / No toggle', icon: '☑️' },
								{ type: 'Dropdown', desc: 'Single-select from predefined list', icon: '▼' },
							].map((t, i) => (
								<div key={i} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px' }}>
									<div style={{ fontSize: '24px', marginBottom: '8px' }}>{t.icon}</div>
									<strong style={{ fontSize: '14px' }}>{t.type}</strong>
									<p style={{ margin: '4px 0 0', fontSize: '12px', color: '#667085' }}>{t.desc}</p>
								</div>
							))}
						</div>
					</div>
				);
			case "Attribute Values":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '560px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Manage Attribute Values</h3>
						<div style={{ marginBottom: '16px' }}>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Select Attribute</label>
							<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
								<option>Color</option>
								<option>Size</option>
								<option>Material</option>
							</select>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
							{['Red (#ff0000)', 'Blue (#0000ff)', 'Black (#000000)', 'Orange (#ff6600)'].map((v, i) => (
								<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
									<span style={{ flex: 1, fontSize: '14px' }}>{v}</span>
									<button onClick={() => alert('Remove ' + v)} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Remove</button>
								</div>
							))}
						</div>
						<div style={{ display: 'flex', gap: '8px' }}>
							<input type="text" placeholder="New value (e.g. Green)" style={{ flex: 1, padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
							<button onClick={() => alert('Value added!')} style={{ padding: '9px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
						</div>
					</div>
				);
			case "Attribute Group":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Attribute Groups</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
							{[
								{ name: 'Appearance', attrs: 'Color, Pattern, Finish' },
								{ name: 'Sizing', attrs: 'Size, Fit, Length' },
								{ name: 'Technical', attrs: 'Weight, Capacity, Material' },
							].map((g, i) => (
								<div key={i} style={{ padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div>
										<strong style={{ fontSize: '14px' }}>{g.name}</strong>
										<p style={{ margin: '2px 0 0', fontSize: '12px', color: '#667085' }}>{g.attrs}</p>
									</div>
									<button style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
								</div>
							))}
						</div>
						<button onClick={() => alert('New Group Added!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>+ New Group</button>
					</div>
				);
			case "Display Order":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Attribute Display Order on PDP</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
							{['Color', 'Size', 'Material', 'Weight'].map((a, i) => (
								<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' }}>
									<span style={{ color: '#94a3b8', cursor: 'grab', fontSize: '18px' }}>⠿</span>
									<span style={{ flex: 1, fontWeight: '500', fontSize: '14px' }}>{a}</span>
									<input type="number" defaultValue={i + 1} style={{ width: '60px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
								</div>
							))}
						</div>
						<button onClick={() => alert('Order saved!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Order</button>
					</div>
				);

			/* ═══ BUNDLES sub-options ═══════════════════════ */
			case "All Bundles":
				return (
					<div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
						<div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<strong style={{ fontSize: '15px' }}>All Bundles</strong>
							<button onClick={() => alert('Create new bundle')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ New Bundle</button>
						</div>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase', textAlign: 'left' }}>
									<th style={{ padding: '12px 20px' }}>Bundle Name</th>
									<th style={{ padding: '12px 20px' }}>Products</th>
									<th style={{ padding: '12px 20px' }}>Bundle Price</th>
									<th style={{ padding: '12px 20px' }}>Savings</th>
									<th style={{ padding: '12px 20px' }}>Status</th>
									<th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ name: 'Trail Running Starter Kit', count: 3, price: '₹4,499', savings: '₹800', status: 'Active' },
									{ name: 'Cycling Essentials Pack', count: 4, price: '₹6,799', savings: '₹1,200', status: 'Active' },
									{ name: 'Gym Starter Bundle', count: 5, price: '₹3,299', savings: '₹650', status: 'Draft' },
								].map((b, i) => (
									<tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
										<td style={{ padding: '14px 20px', fontWeight: '500', fontSize: '14px' }}>{b.name}</td>
										<td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{b.count} items</td>
										<td style={{ padding: '14px 20px', fontWeight: '600', fontSize: '14px', color: '#ff6600' }}>{b.price}</td>
										<td style={{ padding: '14px 20px', fontSize: '13px', color: '#12b76a' }}>{b.savings} off</td>
										<td style={{ padding: '14px 20px' }}>
											<span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: b.status === 'Active' ? '#e3fcef' : '#f8f9fa', color: b.status === 'Active' ? '#12b76a' : '#667085' }}>{b.status}</span>
										</td>
										<td style={{ padding: '14px 20px', textAlign: 'right' }}>
											<button onClick={() => alert('Edit ' + b.name)} style={{ color: '#ff6600', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
			case "Add / Edit Bundle":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '560px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Create / Edit Bundle</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Bundle Name</label>
								<input type="text" placeholder="e.g. Trail Running Starter Kit" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Bundle SKU</label>
								<input type="text" placeholder="BDL-TRL-KIT-01" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Discount Type</label>
								<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
									<option>Fixed Price Bundle</option>
									<option>Percentage Discount</option>
									<option>Buy X Get Y</option>
								</select>
							</div>
							<button onClick={() => alert('Bundle saved!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Bundle</button>
						</div>
					</div>
				);
			case "Bundle Products":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Products in Bundle</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
							{[
								{ name: 'Trail Running Vest', sku: 'RN-VS-BLU', price: '₹1,499', qty: 1 },
								{ name: 'Hydration Pack 5L', sku: 'HY-PK-5L', price: '₹1,799', qty: 1 },
								{ name: 'Anti-Blister Socks (2 pairs)', sku: 'SK-BS-2PK', price: '₹399', qty: 2 },
							].map((p, i) => (
								<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
									<div style={{ flex: 1 }}>
										<strong style={{ fontSize: '14px' }}>{p.name}</strong>
										<p style={{ margin: '2px 0 0', fontSize: '12px', color: '#667085' }}>{p.sku} · {p.price}</p>
									</div>
									<input type="number" defaultValue={p.qty} min={1} style={{ width: '60px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }} />
									<button style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
								</div>
							))}
						</div>
						<button onClick={() => alert('Add product to bundle')} style={{ padding: '8px 16px', background: 'white', border: '2px dashed #ff6600', color: '#ff6600', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', width: '100%' }}>+ Add Product</button>
					</div>
				);
			case "Bundle Pricing":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Bundle Pricing Configuration</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
								<p style={{ margin: '0 0 4px', fontSize: '13px', color: '#667085' }}>Total Individual Price</p>
								<h3 style={{ margin: 0, fontSize: '22px', color: '#111' }}>₹5,297</h3>
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Bundle Sale Price</label>
								<input type="number" defaultValue={4499} style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div style={{ padding: '12px 16px', background: '#e3fcef', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ fontSize: '14px', color: '#027a48' }}>Customer Saving</span>
								<strong style={{ color: '#027a48' }}>₹798 (15% off)</strong>
							</div>
							<button onClick={() => alert('Bundle price updated!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Pricing</button>
						</div>
					</div>
				);
			case "Bundle Images":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bundle Media Gallery</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
							<div style={{ border: '2px dashed #ff6600', height: '130px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6600', fontWeight: '600', flexDirection: 'column', gap: '6px' }}>
								<span style={{ fontSize: '22px' }}>+</span>
								<span style={{ fontSize: '12px' }}>Upload Image</span>
							</div>
						</div>
						<p style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>Recommended: 800×800px, PNG/WebP, max 2MB per image</p>
					</div>
				);
			case "Bundle Status":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Bundle Status & Visibility</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Catalog Status</label>
								<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
									<option>Active</option>
									<option>Draft</option>
									<option>Archived</option>
								</select>
							</div>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
								<input type="checkbox" defaultChecked /> Show on Homepage
							</label>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
								<input type="checkbox" defaultChecked /> Allow Dzire Credits Redemption on Bundle
							</label>
							<button onClick={() => alert('Bundle status updated!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Apply Status</button>
						</div>
					</div>
				);

			default:
				return renderOriginalContent();
		}
	};

	return <AdminLayout>
		<style>{adminProductsStyles}</style>
		<div className="admin-products-page space-y-6">

			<section className="admin-hero" style={{ marginBottom: '24px' }}>
				<div>
					<h1>{activeSub}</h1>
					<p>
						Manage all items, categories, and inventory sections
					</p>
				</div>
				{activeSub === "All Products" && (
					<button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
						<RefreshCcw size={18} />
						Refresh Data
					</button>
				)}
			</section>

			{renderProductsSubContent()}
		</div>
	</AdminLayout>;
};
export default AdminProducts;

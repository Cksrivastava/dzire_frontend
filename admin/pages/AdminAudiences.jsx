import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ImagePlus, Package, PencilLine, Plus, Save, Search, Sparkles, X } from "lucide-react";
import ExportDropdown from "../components/ExportDropdown";
import AdminLayout from "./AdminLayout";
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
const audienceIcons = {
	women: Heart,
	men: Package,
	unisex: Sparkles
};
const createInitialForm = (audience) => ({
	category: "bestseller",
	audience,
	name: "",
	brand: "",
	price: "",
	old_price: "",
	image: "",
	second_image: "",
	description: "",
	stock: 0
});
const formatCurrency = (value) => {
	const numericValue = parsePriceInput(value);
	return Number.isNaN(numericValue) ? "0 Rs" : `${numericValue.toLocaleString()} Rs`;
};
const normalizeAudience = (value) => {
	if (value === "men" || value === "women" || value === "unisex") {
		return value;
	}
	return null;
};
const AdminAudiences = () => {
	const [products, setProducts] = useState([]);
	const [selectedAudience, setSelectedAudience] = useState("women");
	const [form, setForm] = useState(createInitialForm("women"));
	const [showAddForm, setShowAddForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAssigning, setIsAssigning] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [imageFileName, setImageFileName] = useState("");
	const [secondImageFileName, setSecondImageFileName] = useState("");
	const fetchProducts = async () => {
		try {
			const res = await fetch(apiUrl("/products"));
			const data = await res.json();
			setProducts(Array.isArray(data) ? [...data].sort((a, b) => Number(b.id) - Number(a.id)) : []);
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		fetchProducts();
	}, []);
	useEffect(() => {
		setForm(createInitialForm(selectedAudience));
		setImageFileName("");
		setSecondImageFileName("");
		setShowAddForm(false);
	}, [selectedAudience]);
	const selectedAudienceMeta = getAudienceMeta(selectedAudience);
	const audienceCounts = useMemo(() => PRODUCT_AUDIENCES.map((audience) => ({
		...audience,
		count: products.filter((product) => normalizeAudience(product.audience) === audience.value).length
	})), [products]);
	const selectedProducts = useMemo(() => products.filter((product) => normalizeAudience(product.audience) === selectedAudience), [products, selectedAudience]);
	const catalogProducts = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return products.filter((product) => {
			if (!query) {
				return true;
			}
			return product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query) || (product.category || "").toLowerCase().includes(query);
		});
	}, [products, searchQuery]);
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
	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((currentForm) => ({
			...currentForm,
			[name]: name === "stock" ? Number(value) : value
		}));
	};
	const handleImageUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		setImageFileName(file.name);
		try {
			const imageUrl = await uploadProductImage(file);
			setForm((currentForm) => ({
				...currentForm,
				image: imageUrl
			}));
		} catch (err) {
			console.error(err);
			alert("Image upload failed");
		}
	};
	const handleSecondImageUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		setSecondImageFileName(file.name);
		try {
			const imageUrl = await uploadProductImage(file);
			setForm((currentForm) => ({
				...currentForm,
				second_image: imageUrl
			}));
		} catch (err) {
			console.error(err);
			alert("Image upload failed");
		}
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			const res = await fetch(apiUrl("/products"), {
				method: "POST",
				headers: getAuthHeaders(true),
				body: JSON.stringify({
					...form,
					price: parsePriceInput(form.price),
					old_price: parsePriceInput(form.old_price),
					audience: selectedAudience,
					images: [form.image, form.second_image].filter(Boolean)
				})
			});
			if (!res.ok) {
				alert("Add failed");
				return;
			}
			await fetchProducts();
			setForm(createInitialForm(selectedAudience));
			setImageFileName("");
			setSecondImageFileName("");
			setShowAddForm(false);
		} catch (err) {
			console.error(err);
			alert("Add failed");
		} finally {
			setIsSubmitting(false);
		}
	};
	const updateProductAudience = async (product, nextAudience) => {
		setIsAssigning(product.id);
		try {
			const res = await fetch(apiUrl(`/products/${product.id}`), {
				method: "PUT",
				headers: getAuthHeaders(true),
				body: JSON.stringify({
					name: product.name,
					brand: product.brand,
					price: Number(product.price || 0),
					old_price: Number(product.old_price || 0),
					image: product.image,
					images: Array.isArray(product.images) ? product.images : [product.image].filter(Boolean),
					category: product.category,
					description: product.description,
					rating: Number(product.rating || 0),
					stock: Number(product.stock || 0),
					audience: nextAudience
				})
			});
			if (!res.ok) {
				alert("Audience update failed");
				return;
			}
			await fetchProducts();
		} catch (err) {
			console.error(err);
			alert("Audience update failed");
		} finally {
			setIsAssigning(null);
		}
	};
	return <AdminLayout>
		<div className="dashboard-wrapper">
			<div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eef2f6' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
						<h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Categories / Audiences</h2>
					</div>
					<div style={{ display: 'flex', gap: '12px' }}>
						<Link to={`/shop?audience=${selectedAudience}`} style={{ background: '#ff6600', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
							Open {selectedAudienceMeta?.navLabel} page
						</Link>
					</div>
				</div>

				<div style={{ padding: '24px', background: '#fafafa' }}>
					<div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
						<section style={{ background: '#fff', border: '1px solid #eef2f6', borderRadius: '8px', padding: '20px' }}>
							<div className="mb-4">
								<h3 className="text-lg font-semibold text-slate-900">Manage Categories</h3>
								<p className="text-sm text-slate-500">Select which page you want to manage.</p>
							</div>

							<div className="space-y-2">
								{audienceCounts.map((audience) => {
									const Icon = audienceIcons[audience.value];
									const isActive = selectedAudience === audience.value;
									return <button key={audience.value} type="button" onClick={() => setSelectedAudience(audience.value)} className={`w-full rounded-2xl border px-4 py-4 text-left transition ${isActive ? "border-[#ff6600] bg-[linear-gradient(135deg,#fff7f1,#ffffff)]" : "border-[#ffe0cc] bg-[#fffcfb] hover:border-[#ff944d]"}`}>
										<div className="flex items-center gap-3">
											<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700">
												<Icon className="h-5 w-5" />
											</span>
											<div>
												<p className="text-sm font-semibold text-slate-900">{audience.navLabel}</p>
												<p className="text-xs text-slate-500">{audience.count} products assigned</p>
											</div>
										</div>
									</button>;
								})}
							</div>
						</section>

						<div className="space-y-5">
							<section className="rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
								<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6600]">
											{selectedAudienceMeta?.navLabel}
										</p>
										<h3 className="mt-2 text-xl font-semibold text-slate-900">Manual Product Add</h3>
										<p className="mt-1 text-sm text-slate-500">
											New products added here will appear directly on the `{selectedAudienceMeta?.navLabel}` page.
										</p>
									</div>
									<Button type="button" onClick={() => setShowAddForm((value) => !value)} className="rounded-full bg-[#ff6600] text-white hover:bg-[#e65c00] shadow-md">
										<Plus className="h-4 w-4" />
										{showAddForm ? "Close Form" : `Add Product in ${selectedAudienceMeta?.navLabel}`}
									</Button>
								</div>

								{showAddForm ? <form onSubmit={handleSubmit} className="mt-5 space-y-5 border-t border-[#edf2fa] pt-5">
									<div className="grid gap-3 lg:grid-cols-3">
										{SECTION_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => setForm((currentForm) => ({
											...currentForm,
											category: option.value
										}))} className={`rounded-2xl border px-4 py-3 text-left transition ${form.category === option.value ? "border-[#ff6600] bg-[linear-gradient(135deg,#fff7f1,#ffffff)]" : "border-[#ffe0cc] bg-white"}`}>
											<p className="text-sm font-semibold text-slate-900">{option.label}</p>
											<p className="mt-1 text-xs text-slate-500">Homepage row</p>
										</button>)}
									</div>

									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
										<div className="space-y-2 xl:col-span-2">
											<label className="text-sm font-medium text-slate-700">Product name</label>
											<Input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required />
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-slate-700">Brand</label>
											<Input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand name" required />
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-slate-700">Audience</label>
											<Input value={selectedAudienceMeta?.navLabel || ""} readOnly className="bg-[#f7faff]" />
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-slate-700">Stock</label>
											<Input type="number" min="0" name="stock" value={form.stock || ""} onChange={handleChange} placeholder="0" required />
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-slate-700">Current price</label>
											<Input name="price" value={form.price} onChange={handleChange} placeholder="1.2m or 1200000" inputMode="decimal" required />
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-slate-700">Old price</label>
											<Input name="old_price" value={form.old_price} onChange={handleChange} placeholder="1.4m optional" inputMode="decimal" />
										</div>
										<div className="xl:col-span-2">
											<p className="text-xs text-slate-500">{PRICE_INPUT_HINT}</p>
										</div>
										<div className="space-y-2 xl:col-span-4">
											<label className="text-sm font-medium text-slate-700">Description</label>
											<textarea name="description" value={form.description} onChange={handleChange} placeholder="Short product description" className="min-h-24 w-full rounded-2xl border border-[#e2e8f5] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition border-[#ff6600]" required />
										</div>
										<div className="space-y-2 xl:col-span-2">
											<label className="text-sm font-medium text-slate-700">Primary image</label>
											<label className="flex min-h-24 cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#d7e2f3] bg-white px-4 py-4 transition hover:border-[#ff6600]">
												<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
												<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7f1] text-[#ff6600]">
													<ImagePlus className="h-5 w-5" />
												</span>
												<span className="min-w-0 flex-1">
													<span className="block text-sm font-medium text-slate-900">{imageFileName ? "Replace image" : "Upload primary image"}</span>
													<span className="block truncate text-xs text-slate-500">{imageFileName || "PNG, JPG, WEBP supported"}</span>
												</span>
											</label>
										</div>
										<div className="space-y-2 xl:col-span-2">
											<label className="text-sm font-medium text-slate-700">Second image</label>
											<label className="flex min-h-24 cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#d7e2f3] bg-white px-4 py-4 transition hover:border-[#ff6600]">
												<input type="file" accept="image/*" onChange={handleSecondImageUpload} className="hidden" />
												<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7f1] text-[#ff6600]">
													<ImagePlus className="h-5 w-5" />
												</span>
												<span className="min-w-0 flex-1">
													<span className="block text-sm font-medium text-slate-900">{secondImageFileName ? "Replace second image" : "Upload second image"}</span>
													<span className="block truncate text-xs text-slate-500">{secondImageFileName || "Optional"}</span>
												</span>
											</label>
										</div>
										<div className="space-y-2 xl:col-span-2">
											<label className="text-sm font-medium text-slate-700">Primary image URL</label>
											<Input name="image" value={form.image} onChange={handleChange} placeholder="Uploaded primary image URL" required />
										</div>
										<div className="space-y-2 xl:col-span-2">
											<label className="text-sm font-medium text-slate-700">Second image URL</label>
											<Input name="second_image" value={form.second_image} onChange={handleChange} placeholder="Uploaded second image URL" />
										</div>
									</div>

									<div className="flex justify-end">
										<Button type="submit" disabled={isSubmitting || !form.image} className="rounded-full bg-[#ff6600] text-white hover:bg-[#e65c00]">
											<Save className="h-4 w-4" />
											{isSubmitting ? "Saving..." : `Add to ${selectedAudienceMeta?.navLabel}`}
										</Button>
									</div>
								</form> : null}
							</section>

							<section className="rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
								<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									<div>
										<h3 className="text-xl font-semibold text-slate-900">{selectedAudienceMeta?.navLabel} Products</h3>
										<p className="mt-1 text-sm text-slate-500">Currently assigned products for this audience page.</p>
									</div>
									<div className="flex items-center gap-3">
										<ExportDropdown
											fileName={`${selectedAudience || 'Audience'}_Products_Report`}
											title={`${selectedAudienceMeta?.navLabel || 'Audience'} Products Catalog`}
											headers={['Product Name', 'Brand', 'Category', 'Price']}
											rows={selectedProducts.map((p) => [
												p.name || '',
												p.brand || '',
												p.category || '',
												formatCurrency(p.price)
											])}
										/>
										<div className="rounded-full bg-[#f7faff] px-4 py-2 text-sm font-medium text-slate-700">
											{selectedProducts.length} products
										</div>
									</div>
								</div>

								{selectedProducts.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-[#ffe0cc] px-5 py-8 text-center">
									<h4 className="text-base font-semibold text-slate-900">No products assigned yet</h4>
									<p className="mt-2 text-sm text-slate-500">Assign products from the catalog below or add a new product here.</p>
								</div> : <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
									{selectedProducts.map((product) => <div key={product.id} className="rounded-2xl border border-[#e5ecff] bg-white p-4">
										<div className="flex gap-3">
											<div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f7faff] p-3">
												<img src={product.image} alt={product.name} className="h-full w-full object-contain" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{product.brand}</p>
												<p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
												<p className="mt-2 text-xs text-slate-500">{product.category}</p>
												<p className="mt-2 text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</p>
											</div>
										</div>
										<div className="mt-4 flex gap-2">
											<Button asChild type="button" variant="outline" className="flex-1 rounded-xl border-[#dfe7f5] bg-white">
												<Link to={`/admin/edit/${product.id}`}>
													<PencilLine className="h-4 w-4" />
													Edit
												</Link>
											</Button>
											<Button type="button" variant="outline" onClick={() => void updateProductAudience(product, null)} disabled={isAssigning === product.id} className="rounded-xl border-[#ffd5dd] text-[#e11d48] hover:bg-[#fff1f4] hover:text-[#e11d48]">
												<X className="h-4 w-4" />
												Remove
											</Button>
										</div>
									</div>)}
								</div>}
							</section>

							<section className="rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
								<div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
									<div>
										<h3 className="text-xl font-semibold text-slate-900">Assign Existing Products</h3>
										<p className="mt-1 text-sm text-slate-500">Choose a product from the catalog and assign it to the current audience page.</p>
									</div>
									<div className="relative w-full lg:max-w-sm">
										<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
										<Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search product or brand" className="pl-9" />
									</div>
								</div>

								<div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
									{catalogProducts.map((product) => {
										const currentAudienceMeta = getAudienceMeta(product.audience);
										const isCurrentAudience = normalizeAudience(product.audience) === selectedAudience;
										return <div key={product.id} className="rounded-2xl border border-[#e5ecff] bg-white p-4">
											<div className="flex gap-3">
												<div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7faff] p-2">
													<img src={product.image} alt={product.name} className="h-full w-full object-contain" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{product.brand}</p>
													<p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
													<p className="mt-1 text-[11px] text-slate-500">{product.category}</p>
													<p className="mt-2 text-xs text-slate-500">
														Current: <span className="font-semibold text-slate-900">{currentAudienceMeta?.navLabel || "Not set"}</span>
													</p>
												</div>
											</div>
											<div className="mt-4 flex gap-2">
												<Button type="button" onClick={() => void updateProductAudience(product, isCurrentAudience ? null : selectedAudience)} disabled={isAssigning === product.id} className="flex-1 rounded-xl bg-[#ff6600] text-white hover:bg-[#e65c00]">
													{isCurrentAudience ? "Remove from page" : `Assign to ${selectedAudienceMeta?.navLabel}`}
												</Button>
											</div>
										</div>;
									})}
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
		</div>
	</AdminLayout>;
};
export default AdminAudiences;

import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Gem, Package, Sparkles, ImagePlus, UploadCloud } from "lucide-react";





import AdminLayout from "./AdminLayout";
const SECTION_OPTIONS = [
	{
		value: "bestseller",
		label: "Bestseller",
		description: "Homepage bestseller row",
		icon: Package
	},
	{
		value: "premium",
		label: "Premium",
		description: "Luxury and premium picks",
		icon: Gem
	},
	{
		value: "new",
		label: "New Arrival",
		description: "Fresh launches section",
		icon: Sparkles
	}
];
const emptyForm = {
	name: "",
	brand: "",
	audience: "",
	price: "",
	old_price: "",
	image: "",
	second_image: "",
	category: "bestseller",
	description: "",
	rating: "0",
	stock: ""
};
const getCategoryLabel = (category) => SECTION_OPTIONS.find((option) => option.value === category)?.label || category;
const formatCurrency = (value) => {
	const numericValue = parsePriceInput(value);
	return Number.isNaN(numericValue) ? "0 Rs" : `${numericValue.toLocaleString()} Rs`;
};
const AdminEditProduct = () => {
	const { id } = useParams();
	const productId = id || "";
	const navigate = useNavigate();
	const [form, setForm] = useState(emptyForm);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [imageFileName, setImageFileName] = useState("");
	const [secondImageFileName, setSecondImageFileName] = useState("");
	useEffect(() => {
		fetch(apiUrl(`/products/${productId}`)).then((res) => res.json()).then((data) => {
			setForm({
				name: data?.name ?? "",
				brand: data?.brand ?? "",
				audience: data?.audience ?? "",
				price: data?.price?.toString?.() ?? "",
				old_price: data?.old_price?.toString?.() ?? "",
				image: data?.image ?? data?.images?.[0] ?? "",
				second_image: data?.images?.[1] ?? "",
				category: data?.section ?? data?.category ?? "bestseller",
				description: data?.description ?? "",
				rating: data?.rating?.toString?.() ?? "0",
				stock: data?.stock?.toString?.() ?? ""
			});
		}).catch((err) => console.error(err)).finally(() => setIsLoading(false));
	}, [productId]);
	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((currentForm) => ({
			...currentForm,
			[name]: value
		}));
	};
	const handleCategorySelect = (category) => {
		setForm((currentForm) => ({
			...currentForm,
			category
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
			console.error("Upload error:", err);
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
			console.error("Upload error:", err);
			alert("Image upload failed");
		}
	};
	const handleUpdate = async (event) => {
		event.preventDefault();
		setIsSaving(true);
		try {
			const payload = {
				...form,
				section: form.category,
				images: [form.image, form.second_image].filter(Boolean),
				audience: form.audience || null,
				price: parsePriceInput(form.price),
				old_price: parsePriceInput(form.old_price),
				rating: Number(form.rating || 0),
				stock: Number(form.stock || 0)
			};
			const res = await fetch(apiUrl(`/products/${productId}`), {
				method: "PUT",
				headers: getAuthHeaders(true, "admin"),
				body: JSON.stringify(payload)
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				alert(data?.message || "Update failed");
				return;
			}
			const autoNotifySummary = data?.stockAlertDelivery;
			const notifyErrorMessage = data?.stockAlertDeliveryError;
			const notificationMessage = notifyErrorMessage ? `Product updated successfully, but notification sending had an issue: ${notifyErrorMessage}` : autoNotifySummary && (autoNotifySummary.notified > 0 || autoNotifySummary.failed?.length > 0) ? `Product updated successfully. Auto notifications: ${autoNotifySummary.notified || 0} fully sent, ${autoNotifySummary.failed?.length || 0} need retry.` : "Product updated successfully";
			alert(notificationMessage);
			navigate("/admin/products");
		} catch (err) {
			console.error(err);
			alert("Could not update product");
		} finally {
			setIsSaving(false);
		}
	};
	const discount = parsePriceInput(form.old_price) > 0 && parsePriceInput(form.price) > 0 && parsePriceInput(form.old_price) > parsePriceInput(form.price) ? Math.round((parsePriceInput(form.old_price) - parsePriceInput(form.price)) / parsePriceInput(form.old_price) * 100) : 0;
	if (isLoading) {
		return <AdminLayout>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-stone-900">Loading product...</p>
          <p className="mt-2 text-sm text-stone-500">Fetching current product details for editing.</p>
        </div>
      </AdminLayout>;
	}
	return <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-[28px] border border-[#ffe0cc] bg-[linear-gradient(135deg,#ffffff,#fff7f1_62%,#fff4fa)] p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button type="button" onClick={() => navigate("/admin/products")} className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900">
                <ArrowLeft className="h-4 w-4" />
                Back to products
              </button>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
                Edit Workspace
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">Edit Product</h2>
              <p className="mt-2 max-w-2xl text-sm text-stone-600">
                Update section placement, pricing, stock, image and description without changing the
                rest of the admin flow.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ffe0cc] bg-white p-4 shadow-sm lg:min-w-[280px]">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Current section</p>
              <p className="mt-2 text-lg font-semibold text-stone-900">
                {getCategoryLabel(form.category)}
              </p>
              <p className="mt-4 text-sm text-stone-600">
                Live price:
                <span className="ml-2 font-semibold text-stone-900">{formatCurrency(form.price)}</span>
              </p>
              <p className="mt-2 text-sm text-stone-600">
                Discount:
                <span className="ml-2 font-semibold text-[#ff6600]">
                  {discount > 0 ? `${discount}% off` : "No discount"}
                </span>
              </p>
              <p className="mt-2 text-xs text-stone-500">
                Adding an old price will show the cut price and discount.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleUpdate} className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_380px]">
          <section className="rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
                Product Details
              </p>
              <h3 className="mt-2 text-xl font-semibold text-stone-900">Core information</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-stone-700">Product name</label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Perfume name" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Brand</label>
                <Input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand name" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Audience</label>
                <select name="audience" value={form.audience} onChange={(event) => setForm((currentForm) => ({
		...currentForm,
		audience: event.target.value
	}))} className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-stone-900" required>
                  <option value="">Select audience</option>
                  {PRODUCT_AUDIENCES.map((audience) => <option key={audience.value} value={audience.value}>
                      {audience.navLabel}
                    </option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Rating</label>
                <Input type="number" min="0" max="5" step="0.1" name="rating" value={form.rating} onChange={handleChange} placeholder="0" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Current price</label>
                <Input name="price" value={form.price} onChange={handleChange} placeholder="1.2m or 1200000" inputMode="decimal" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Old price (optional)</label>
                <Input name="old_price" value={form.old_price} onChange={handleChange} placeholder="1.4m optional" inputMode="decimal" />
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-stone-500">{PRICE_INPUT_HINT}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the fragrance, notes, bottle size and finish" className="min-h-36 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-900" required />
              </div>
            </div>
          </section>

          <section className="space-y-6 xl:sticky xl:top-6">
            <div className="rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
              <div className="mb-5">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
                  Section Control
                </p>
                <h3 className="mt-2 text-xl font-semibold text-stone-900">Placement</h3>
              </div>

              <div className="space-y-2">
                {SECTION_OPTIONS.map((option) => {
		const Icon = option.icon;
		const isActive = form.category === option.value;
		return <button key={option.value} type="button" onClick={() => handleCategorySelect(option.value)} className={`w-full rounded-xl border px-4 py-3 text-left transition ${isActive ? "border-[#ff6600] bg-[linear-gradient(135deg,#fff7f1,#fff1f8)] text-slate-900 shadow-sm" : "border-[#ffe0cc] bg-[#fffcfb] text-slate-900 hover:border-[#ff944d] hover:bg-white"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? "bg-white/15" : "bg-white"}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-base font-semibold">{option.label}</p>
                          <p className={`mt-1 text-sm ${isActive ? "text-stone-200" : "text-stone-600"}`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>;
	})}
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-stone-700">Stock</label>
                <Input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} placeholder="0" required />
                <p className="text-xs text-stone-500">You can enter 100, 500, or 999999 for practically unlimited stock.</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
              <div className="mb-5">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
                  Product Media
                </p>
                <h3 className="mt-2 text-xl font-semibold text-stone-900">Image preview</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Primary image</p>
                  <div className="mt-3 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-white p-4">
                    {form.image ? <img src={form.image} alt={form.name || "Primary product"} className="max-h-full w-auto object-contain" /> : <p className="text-sm text-stone-500">No primary image</p>}
                  </div>
                </div>
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Second image</p>
                  <div className="mt-3 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-white p-4">
                    {form.second_image ? <img src={form.second_image} alt={form.name || "Second product"} className="max-h-full w-auto object-contain" /> : <p className="text-sm text-stone-500">No second image</p>}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium text-stone-700">Upload primary image</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 transition hover:border-stone-500 hover:bg-stone-100">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-stone-700">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-stone-900">
                      {imageFileName ? "Change primary image" : "Click to upload primary image"}
                    </span>
                    <span className="block truncate text-xs text-stone-500">
                      {imageFileName || "PNG, JPG, WEBP supported"}
                    </span>
                  </span>
                </label>
              </div>

              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium text-stone-700">Upload second image</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 transition hover:border-stone-500 hover:bg-stone-100">
                  <input type="file" accept="image/*" onChange={handleSecondImageUpload} className="hidden" />
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-stone-700">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-stone-900">
                      {secondImageFileName ? "Change second image" : "Click to upload second image"}
                    </span>
                    <span className="block truncate text-xs text-stone-500">
                      {secondImageFileName || "Optional but recommended for hover gallery"}
                    </span>
                  </span>
                </label>
              </div>

              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium text-stone-700">Primary image URL</label>
                <Input name="image" value={form.image} onChange={handleChange} placeholder="Uploaded primary image URL" required />
              </div>

              <div className="mt-5 space-y-2">
                <label className="text-sm font-medium text-stone-700">Second image URL</label>
                <Input name="second_image" value={form.second_image} onChange={handleChange} placeholder="Uploaded second image URL" />
              </div>

              <Button type="submit" disabled={isSaving} className="mt-6 w-full rounded-xl bg-[#ff6600] text-white hover:bg-[#e65c00]">
                <UploadCloud className="h-4 w-4" />
                {isSaving ? "Saving changes..." : "Update Product"}
              </Button>
            </div>
          </section>
        </form>
      </div>
    </AdminLayout>;
};
export default AdminEditProduct;

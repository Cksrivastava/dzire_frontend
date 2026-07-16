import { cn, Button, Input, Switch, Textarea, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useState, useMemo } from "react";
import { ChevronDown, Image as ImageIcon, MoveDown, MoveUp, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";






const SECTIONS = [
	{
		key: "hero_slider",
		label: "Hero Slider"
	},
	{
		key: "brand_banners",
		label: "Brand Side-Banners"
	},
	{
		key: "explore_banner",
		label: "Wide Explore Banner"
	}
];
const SECTION_LIMITS = {
	hero_slider: 20,
	brand_banners: 2,
	explore_banner: 1
};
const createEmptyBlock = (sectionKey, sortOrder) => ({
	section_key: sectionKey,
	subtitle: "",
	title: "",
	description: "",
	cta_label: "",
	cta_href: "",
	image_url: "",
	sort_order: sortOrder,
	is_active: true
});
const normalizeBlocksForSection = (sectionKey, items) => {
	const normalized = items.map((item, index) => ({
		...createEmptyBlock(sectionKey, index),
		...item,
		section_key: sectionKey,
		sort_order: index
	}));
	if (sectionKey === "hero_slider") {
		return normalized;
	}
	const targetCount = SECTION_LIMITS[sectionKey] ?? normalized.length;
	const padded = [...normalized];
	while (padded.length < targetCount) {
		padded.push(createEmptyBlock(sectionKey, padded.length));
	}
	return padded;
};
export default function AdminSiteContent() {
	const [activeTab, setActiveTab] = useState("hero_slider");
	const [blocks, setBlocks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [savingIndex, setSavingIndex] = useState(null);
	const [uploadingIndex, setUploadingIndex] = useState(null);
	const [expandedIndex, setExpandedIndex] = useState(0);
	useEffect(() => {
		void fetchBlocks();
	}, [activeTab]);
	const fetchBlocks = async () => {
		try {
			setLoading(true);
			const token = getAuthToken("admin");
			const res = await fetch(apiUrl(`/api/site-content/${activeTab}`), { headers: token ? { Authorization: `Bearer ${token}` } : {} });
			if (!res.ok) {
				throw new Error("Failed to fetch");
			}
			const data = await res.json();
			const nextBlocks = normalizeBlocksForSection(activeTab, Array.isArray(data) ? data : []);
			setBlocks(nextBlocks);
			setExpandedIndex(nextBlocks.length > 0 ? 0 : null);
		} catch (error) {
			console.error(error);
			toast.error("Failed to load content blocks");
		} finally {
			setLoading(false);
		}
	};
	const handleAddBlock = () => {
		const maxItems = SECTION_LIMITS[activeTab] ?? 20;
		if (blocks.length >= maxItems) {
			toast.error(activeTab === "brand_banners" ? "Only left and right banner allowed" : "Only one wide banner allowed");
			return;
		}
		setBlocks((current) => {
			const next = normalizeBlocksForSection(activeTab, [...current, { ...createEmptyBlock(activeTab, current.length) }]);
			setExpandedIndex(next.length - 1);
			return next;
		});
	};
	const handleChange = (index, field, value) => {
		setBlocks((current) => {
			const next = [...current];
			next[index] = {
				...next[index],
				[field]: value
			};
			return next;
		});
	};
	const moveBlock = (index, direction) => {
		setBlocks((current) => {
			const next = [...current];
			let targetIndex = index;
			if (direction === "up" && index > 0) {
				[next[index], next[index - 1]] = [next[index - 1], next[index]];
				targetIndex = index - 1;
			}
			if (direction === "down" && index < next.length - 1) {
				[next[index], next[index + 1]] = [next[index + 1], next[index]];
				targetIndex = index + 1;
			}
			setExpandedIndex(targetIndex);
			return next.map((item, itemIndex) => ({
				...item,
				sort_order: itemIndex
			}));
		});
	};
	const uploadImage = async (file) => {
		const formData = new FormData();
		formData.append("image", file);
		const res = await fetch(apiUrl("/upload"), {
			method: "POST",
			body: formData
		});
		if (!res.ok) {
			throw new Error("Upload failed");
		}
		const data = await res.json();
		return data.imageUrl;
	};
	const handleImageUpload = async (index, event) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		try {
			setUploadingIndex(index);
			const imageUrl = await uploadImage(file);
			handleChange(index, "image_url", imageUrl);
			toast.success("Image uploaded");
		} catch (error) {
			console.error(error);
			toast.error("Image upload failed");
		} finally {
			setUploadingIndex(null);
			event.target.value = "";
		}
	};
	const handleSave = async (index) => {
		const token = getAuthToken("admin");
		try {
			setSavingIndex(index);
			const res = await fetch(apiUrl("/api/site-content"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(blocks[index])
			});
			if (!res.ok) {
				throw new Error("Failed to save");
			}
			const saved = await res.json();
			setBlocks((current) => {
				const next = [...current];
				next[index] = saved;
				return normalizeBlocksForSection(activeTab, next);
			});
			setExpandedIndex(index);
			toast.success("Saved");
		} catch (error) {
			console.error(error);
			toast.error("Save failed");
		} finally {
			setSavingIndex(null);
		}
	};
	const handleDelete = async (index) => {
		const block = blocks[index];
		if (!block.id) {
			setBlocks((current) => normalizeBlocksForSection(activeTab, current.filter((_, itemIndex) => itemIndex !== index)));
			setExpandedIndex((current) => {
				if (current === null) {
					return null;
				}
				if (current === index) {
					return index > 0 ? index - 1 : null;
				}
				return current > index ? current - 1 : current;
			});
			return;
		}
		if (!confirm("Delete this item?")) {
			return;
		}
		try {
			const token = getAuthToken("admin");
			const res = await fetch(apiUrl(`/api/site-content/${block.id}`), {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!res.ok) {
				throw new Error("Failed to delete");
			}
			setBlocks((current) => normalizeBlocksForSection(activeTab, current.filter((_, itemIndex) => itemIndex !== index)));
			setExpandedIndex((current) => {
				if (current === null) {
					return null;
				}
				if (current === index) {
					return index > 0 ? index - 1 : null;
				}
				return current > index ? current - 1 : current;
			});
			toast.success("Deleted");
		} catch (error) {
			console.error(error);
			toast.error("Delete failed");
		}
	};
	const getImageName = (imageUrl) => {
		if (!imageUrl) {
			return "";
		}
		const normalized = imageUrl.split("?")[0];
		return normalized.split("/").pop() || "banner-image";
	};
	const getBlockLabel = (block, index) => {
		if (activeTab === "brand_banners") {
			return index === 0 ? "Left Banner" : "Right Banner";
		}
		if (activeTab === "explore_banner") {
			return "Wide Explore Banner";
		}
		if (block.title?.trim()) {
			return block.title;
		}
		if (block.subtitle?.trim()) {
			return block.subtitle;
		}
		return `Item ${index + 1}`;
	};
	const location = useLocation();
	const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
	const activeMenu = searchParams.get("menu") || "";
	const activeSub = searchParams.get("sub") || "All Categories";

	const renderCategoriesContent = () => {
		switch (activeSub) {
			case "Add / Edit Category":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Create Category</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Category Name</label>
								<input type="text" placeholder="e.g. Hiking Gear" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Parent Category</label>
								<select style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
									<option value="">None (Top Level Category)</option>
									<option value="running">Running</option>
									<option value="cycling">Cycling</option>
								</select>
							</div>
							<button onClick={() => alert('Category created!')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save Category
							</button>
						</div>
					</div>
				);
			case "Parent Categories":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Main Parent Categories</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							<div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>Running (Products: 14)</div>
							<div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>Cycling (Products: 8)</div>
						</div>
					</div>
				);
			case "Sub Categories":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Child Sub-Categories</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							<div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>Running Shoes (Parent: Running)</div>
							<div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>Running Jackets (Parent: Running)</div>
						</div>
					</div>
				);
			case "Category Image":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Category Banners</h3>
						<div style={{ border: '2px dashed #ff6600', height: '140px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6600', fontWeight: '600' }}>
							+ Upload Banner
						</div>
					</div>
				);
			case "Category Description":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Category Page Description</h3>
						<textarea placeholder="Write category details here..." style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '120px' }} />
						<button onClick={() => alert('Description updated')} style={{ marginTop: '16px', padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
							Save Description
						</button>
					</div>
				);
			case "Category SEO":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>SEO Meta Data</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<input type="text" placeholder="Meta Title" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							<textarea placeholder="Meta Description" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							<button onClick={() => alert('SEO Saved')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save Meta Tags
							</button>
						</div>
					</div>
				);
			case "Display Settings":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Category Display Settings</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<input type="checkbox" defaultChecked />
								Visible on Storefront Nav Menu
							</label>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<input type="checkbox" />
								Show in Homepage Sections Grid
							</label>
							<button onClick={() => alert('Settings applied')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save Settings
							</button>
						</div>
					</div>
				);
			case "Bulk Actions":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bulk Categories Management</h3>
						<button onClick={() => alert('Categories Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
							Export All Categories (CSV)
						</button>
					</div>
				);
			case "All Categories":
			default:
				return (
					<div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
									<th style={{ padding: '12px 20px' }}>Category Name</th>
									<th style={{ padding: '12px 20px' }}>Type</th>
									<th style={{ padding: '12px 20px' }}>Product Count</th>
									<th style={{ padding: '12px 20px' }}>Status</th>
								</tr>
							</thead>
							<tbody>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 20px' }}><strong>Running</strong></td>
									<td style={{ padding: '16px 20px', color: '#667085' }}>Parent Category</td>
									<td style={{ padding: '16px 20px' }}>14 Products</td>
									<td style={{ padding: '16px 20px' }}><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f0fdf4', color: '#15803d' }}>Active</span></td>
								</tr>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 20px' }}><strong>Cycling</strong></td>
									<td style={{ padding: '16px 20px', color: '#667085' }}>Parent Category</td>
									<td style={{ padding: '16px 20px' }}>8 Products</td>
									<td style={{ padding: '16px 20px' }}><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f0fdf4', color: '#15803d' }}>Active</span></td>
								</tr>
							</tbody>
						</table>
					</div>
				);
		}
	};

	const renderCollectionsContent = () => {
		switch (activeSub) {
			case "Add / Edit Collection":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '560px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Create / Edit Collection</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Collection Name</label>
								<input type="text" placeholder="e.g. Summer Essentials" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>URL Slug</label>
								<input type="text" placeholder="summer-essentials" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Short Description</label>
								<textarea placeholder="Brief description of this collection..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box' }} />
							</div>
							<button onClick={() => alert('Collection saved!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Collection</button>
						</div>
					</div>
				);
			case "Collection Products":
				return (
					<div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
						<div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<strong style={{ fontSize: '15px' }}>Products in Collection</strong>
							<button onClick={() => alert('Add Product to Collection')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ Add Product</button>
						</div>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
									<th style={{ padding: '12px 20px', textAlign: 'left' }}>Product Name</th>
									<th style={{ padding: '12px 20px', textAlign: 'left' }}>SKU</th>
									<th style={{ padding: '12px 20px', textAlign: 'left' }}>Sort Order</th>
									<th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ name: 'Trail Running Vest', sku: 'RN-VS-BLU', order: 1 },
									{ name: 'Hydration Pack 5L', sku: 'HY-PK-5L', order: 2 },
									{ name: 'Sports Sunscreen SPF70', sku: 'SK-SC-70', order: 3 },
								].map((p, i) => (
									<tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
										<td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500' }}>{p.name}</td>
										<td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085' }}>{p.sku}</td>
										<td style={{ padding: '14px 20px' }}>
											<input type="number" defaultValue={p.order} style={{ width: '60px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
										</td>
										<td style={{ padding: '14px 20px', textAlign: 'right' }}>
											<button onClick={() => alert('Removed')} style={{ color: '#f04438', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Remove</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
			case "Collection Banners":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Collection Banner Images</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
							<div style={{ border: '2px dashed #ff6600', height: '140px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6600', fontWeight: '600', flexDirection: 'column', gap: '8px' }}>
								<span style={{ fontSize: '24px' }}>+</span>
								<span style={{ fontSize: '13px' }}>Upload Desktop Banner</span>
							</div>
							<div style={{ border: '2px dashed #d1d5db', height: '140px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', flexDirection: 'column', gap: '8px' }}>
								<span style={{ fontSize: '24px' }}>+</span>
								<span style={{ fontSize: '13px' }}>Upload Mobile Banner</span>
							</div>
						</div>
					</div>
				);
			case "Display Settings":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Collection Display Settings</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
								<input type="checkbox" defaultChecked /> Show on Homepage
							</label>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer' }}>
								<input type="checkbox" /> Feature in Navigation Menu
							</label>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Grid Layout</label>
								<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
									<option>4-Column Grid</option>
									<option>3-Column Grid</option>
									<option>Horizontal Scroll</option>
								</select>
							</div>
							<button onClick={() => alert('Display Settings saved')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>Save Settings</button>
						</div>
					</div>
				);
			case "Priority & Sorting":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '560px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Collection Priority & Sort Order</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
							{[
								{ name: 'Summer Essentials', priority: 1 },
								{ name: 'New Arrivals', priority: 2 },
								{ name: 'Trail Running Bundle', priority: 3 },
								{ name: 'Cycling Gear Pack', priority: 4 },
							].map((c, i) => (
								<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' }}>
									<span style={{ fontSize: '14px', flex: 1, fontWeight: '500' }}>{c.name}</span>
									<input type="number" defaultValue={c.priority} style={{ width: '60px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }} />
								</div>
							))}
							<button onClick={() => alert('Order saved!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>Save Order</button>
						</div>
					</div>
				);
			case "Scheduling":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Collection Scheduling</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Go-Live Date & Time</label>
								<input type="datetime-local" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Expire / End Date (optional)</label>
								<input type="datetime-local" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Target Audience</label>
								<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
									<option>All Customers</option>
									<option>Men Only</option>
									<option>Women Only</option>
									<option>Loyalty Members</option>
								</select>
							</div>
							<button onClick={() => alert('Schedule saved!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Schedule</button>
						</div>
					</div>
				);
			case "Bulk Actions":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bulk Collections Operations</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
							{[
								{ label: 'Export All Collections', note: 'Download as CSV' },
								{ label: 'Activate All', note: 'Mark all collections visible' },
								{ label: 'Deactivate All', note: 'Hide all from storefront' },
							].map((a, i) => (
								<div key={i} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert(a.label)}>
									<strong style={{ fontSize: '14px' }}>{a.label}</strong>
									<p style={{ margin: '4px 0 0', fontSize: '12px', color: '#667085' }}>{a.note}</p>
								</div>
							))}
						</div>
					</div>
				);
			case "All Collections":
			default:
				return (
					<div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
						<div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<strong style={{ fontSize: '15px' }}>All Collections</strong>
							<button onClick={() => alert('Create new collection')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>+ New Collection</button>
						</div>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
									<th style={{ padding: '12px 20px', textAlign: 'left' }}>Collection Name</th>
									<th style={{ padding: '12px 20px', textAlign: 'left' }}>Products</th>
									<th style={{ padding: '12px 20px', textAlign: 'left' }}>Status</th>
									<th style={{ padding: '12px 20px', textAlign: 'left' }}>Live Date</th>
									<th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ name: 'Summer Essentials', count: 12, status: 'Active', date: '01 Jun 2025' },
									{ name: 'New Arrivals', count: 8, status: 'Active', date: '15 Jun 2025' },
									{ name: 'Trail Running Bundle', count: 5, status: 'Draft', date: '—' },
								].map((c, i) => (
									<tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
										<td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500' }}>{c.name}</td>
										<td style={{ padding: '14px 20px', fontSize: '14px', color: '#667085' }}>{c.count} products</td>
										<td style={{ padding: '14px 20px' }}>
											<span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: c.status === 'Active' ? '#e3fcef' : '#f8f9fa', color: c.status === 'Active' ? '#12b76a' : '#667085' }}>{c.status}</span>
										</td>
										<td style={{ padding: '14px 20px', fontSize: '14px', color: '#667085' }}>{c.date}</td>
										<td style={{ padding: '14px 20px', textAlign: 'right' }}>
											<button onClick={() => alert('Edit ' + c.name)} style={{ color: '#ff6600', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer' }}>Edit</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
		}
	};

	const renderCustomPagesContent = () => {
		return (
			<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
				{/* Custom Pages List */}
				<div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
					<div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<strong style={{ fontSize: '15px' }}>Storefront Pages</strong>
						<button onClick={() => alert('New Custom Page form')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>+ New Page</button>
					</div>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={{ background: '#f9fafb', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
								<th style={{ padding: '12px 20px', textAlign: 'left' }}>Page Title</th>
								<th style={{ padding: '12px 20px', textAlign: 'left' }}>Slug</th>
								<th style={{ padding: '12px 20px', textAlign: 'left' }}>Status</th>
								<th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{[
								{ title: 'About Us', slug: 'about-us', status: 'Published' },
								{ title: 'Privacy Policy', slug: 'privacy-policy', status: 'Published' },
								{ title: 'Refunds & Returns', slug: 'refunds-returns', status: 'Draft' }
							].map((p, i) => (
								<tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
									<td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500' }}>{p.title}</td>
									<td style={{ padding: '14px 20px', fontSize: '13px', color: '#667085', fontFamily: 'monospace' }}>/{p.slug}</td>
									<td style={{ padding: '14px 20px' }}>
										<span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: p.status === 'Published' ? '#e3fcef' : '#f3f4f6', color: p.status === 'Published' ? '#12b76a' : '#667085' }}>{p.status}</span>
									</td>
									<td style={{ padding: '14px 20px', textAlign: 'right' }}>
										<button onClick={() => alert('Editing: ' + p.title)} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Create/Edit Page form */}
				<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
					<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Page Details Editor</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
						<div>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Page Title</label>
							<input type="text" placeholder="e.g. Terms of Service" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
						</div>
						<div>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>URL Path Slug</label>
							<input type="text" placeholder="terms-of-service" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
						</div>
						<div>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Page Content Markdown / HTML</label>
							<textarea placeholder="Write rich text markup copy..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', minHeight: '180px', boxSizing: 'border-box' }} />
						</div>
						<button onClick={() => alert('Custom storefront page saved successfully')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Publish Page</button>
					</div>
				</div>
			</div>
		);
	};

	const renderMenuNavigationContent = () => {
		return (
			<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
				{/* Navigation Menus List */}
				<div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
					<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Storefront Navigation Menu Link List</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
						{[
							{ title: 'Header Navbar Link Menu', links: 'Home, Shop, Brands, Categories, Contact Us' },
							{ title: 'Footer Info Column Menu', links: 'About Us, Privacy Policy, Terms, Return Guidelines' },
							{ title: 'Mobile Menu Extra', links: 'Track Order, Support Chat, Gift Cards' }
						].map((m, idx) => (
							<div key={idx} style={{ padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<div>
									<strong style={{ fontSize: '14px' }}>{m.title}</strong>
									<p style={{ margin: '4px 0 0', fontSize: '12px', color: '#667085' }}>Links: {m.links}</p>
								</div>
								<button onClick={() => alert('Editing link lists...')} style={{ color: '#ff6600', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Configure</button>
							</div>
						))}
					</div>
				</div>

				{/* Add Menu Link Form */}
				<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
					<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Configure Menu Item Link</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
						<div>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Select Navigation Target Menu</label>
							<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
								<option>Header Navbar Link Menu</option>
								<option>Footer Info Column Menu</option>
								<option>Mobile Menu Extra</option>
							</select>
						</div>
						<div>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Menu Label text</label>
							<input type="text" placeholder="e.g. Hiking gear" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
						</div>
						<div>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Target Destination Route</label>
							<select style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
								<option>All Category page</option>
								<option>All Collections page</option>
								<option>Custom URL / Redirect</option>
							</select>
						</div>
						<div>
							<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Link URL Path</label>
							<input type="text" placeholder="e.g. /shop/camping" style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
						</div>
						<button onClick={() => alert('New link item added successfully to the menu!')} style={{ padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Add Link Item</button>
					</div>
				</div>
			</div>
		);
	};

	const renderContentBody = () => {
		if (activeMenu === "Categories" || (activeMenu === "Content" && activeSub === "Categories")) {
			return renderCategoriesContent();
		}
		if (activeMenu === "Collections" || (activeMenu === "Content" && activeSub === "Collections")) {
			return renderCollectionsContent();
		}
		if (activeMenu === "Content" && activeSub === "Custom Pages") {
			return renderCustomPagesContent();
		}
		if (activeMenu === "Content" && activeSub === "Menu Navigation") {
			return renderMenuNavigationContent();
		}

		return (
			<div className="space-y-4">
				<div className="border border-slate-200 bg-white p-3">
					<div className="flex flex-wrap items-center gap-2">
						{SECTIONS.map((section) => <button key={section.key} type="button" onClick={() => setActiveTab(section.key)} className={`px-3 py-2 text-sm font-medium ${activeTab === section.key ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
								{section.label}
							</button>)}
					</div>
				</div>

				<div className="flex items-center justify-between border border-slate-200 bg-white px-4 py-3">
					<div>
						<h2 className="text-base font-semibold text-slate-900">Manage Sections</h2>
						<p className="text-sm text-slate-500">
							{activeTab === "hero_slider" ? "Edit hero slider banners." : activeTab === "brand_banners" ? "Edit left and right side banners." : "Edit the wide explore banner."}
						</p>
					</div>
					{activeTab === "hero_slider" ? <Button onClick={handleAddBlock} variant="outline" className="h-9 gap-2 rounded-none border-slate-300 text-slate-700">
							<Plus className="h-4 w-4" />
							Add Slide
						</Button> : null}
				</div>

				{loading ? <div className="border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading...</div> : <div className="space-y-4">
						{blocks.map((block, index) => <div key={index} className="border border-slate-200 bg-white shadow-sm">
								<div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-4 py-3">
									<button type="button" onClick={() => setExpandedIndex((current) => current === index ? null : index)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
										<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white">
											{block.image_url ? <img src={block.image_url} alt="Preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4 text-slate-300" />}
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-semibold text-slate-800">
												{activeTab === "hero_slider" ? `#${index + 1}` : getBlockLabel(block, index)}
											</p>
											<p className="mt-0.5 truncate text-xs text-slate-500">
												{activeTab === "hero_slider" ? getBlockLabel(block, index) : block.title?.trim() || "No title added"}
											</p>
										</div>
									</button>

									<div className="flex items-center gap-2">
										<Button onClick={() => void moveBlock(index, "up")} disabled={index === 0} variant="outline" size="icon" className="h-8 w-8 rounded-none border-slate-300 text-slate-500 disabled:opacity-50">
											<MoveUp className="h-4 w-4" />
										</Button>
										<Button onClick={() => void moveBlock(index, "down")} disabled={index === blocks.length - 1} variant="outline" size="icon" className="h-8 w-8 rounded-none border-slate-300 text-slate-500 disabled:opacity-50">
											<MoveDown className="h-4 w-4" />
										</Button>
										<Button onClick={() => void handleDelete(index)} variant="outline" size="icon" className="h-8 w-8 rounded-none border-red-200 text-red-500 hover:bg-red-50">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>

								{expandedIndex === index ? <>
										<div className="grid gap-6 border-t border-slate-200 p-4 xl:grid-cols-2">
											<div className="space-y-4">
												<div className="grid gap-4 sm:grid-cols-2">
													<div className="space-y-1.5">
														<label className="text-xs font-medium uppercase tracking-wide text-slate-500">Title</label>
														<Input value={block.title || ""} onChange={(e) => handleChange(index, "title", e.target.value)} className="h-10 rounded-none" />
													</div>
													<div className="space-y-1.5">
														<label className="text-xs font-medium uppercase tracking-wide text-slate-500">Subtitle</label>
														<Input value={block.subtitle || ""} onChange={(e) => handleChange(index, "subtitle", e.target.value)} className="h-10 rounded-none" />
													</div>
												</div>

												<div className="space-y-1.5">
													<label className="text-xs font-medium uppercase tracking-wide text-slate-500">Description</label>
													<Textarea value={block.description || ""} onChange={(e) => handleChange(index, "description", e.target.value)} className="min-h-20 rounded-none" />
												</div>

												<div className="grid gap-4 sm:grid-cols-2">
													<div className="space-y-1.5">
														<label className="text-xs font-medium uppercase tracking-wide text-slate-500">CTA Label</label>
														<Input value={block.cta_label || ""} onChange={(e) => handleChange(index, "cta_label", e.target.value)} className="h-10 rounded-none" />
													</div>
													<div className="space-y-1.5">
														<label className="text-xs font-medium uppercase tracking-wide text-slate-500">CTA Link</label>
														<Input value={block.cta_href || ""} onChange={(e) => handleChange(index, "cta_href", e.target.value)} className="h-10 rounded-none" />
													</div>
												</div>

												<div className="space-y-1.5">
													<label className="text-xs font-medium uppercase tracking-wide text-slate-500">Image URL</label>
													<Input value={block.image_url || ""} onChange={(e) => handleChange(index, "image_url", e.target.value)} className="h-10 rounded-none" />
												</div>
											</div>

											<div className="space-y-3">
												<div className="border border-slate-200 bg-slate-50 p-3">
													<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
														<ImageIcon className="h-4 w-4" />
														Image Upload
													</div>

													<div className="space-y-3">
														<div className="flex items-center gap-2">
															<label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
																<Upload className="h-4 w-4" />
																{uploadingIndex === index ? "Uploading..." : "Upload Image"}
																<input type="file" accept="image/*" className="hidden" onChange={(event) => void handleImageUpload(index, event)} disabled={uploadingIndex === index} />
															</label>

															{block.image_url ? <button type="button" onClick={() => handleChange(index, "image_url", "")} className="inline-flex h-10 items-center gap-2 border border-slate-300 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50">
																	<X className="h-4 w-4" />
																	Remove
																</button> : null}
														</div>

														<div className="flex items-start gap-3 border border-slate-200 bg-white p-3">
															<div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-50">
																{block.image_url ? <img src={block.image_url} alt="Preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-slate-300" />}
															</div>

															<div className="min-w-0 flex-1">
																<p className="text-xs font-medium uppercase tracking-wide text-slate-500">Preview</p>
																<p className="mt-1 truncate text-sm font-medium text-slate-800">
																	{block.image_url ? getImageName(block.image_url) : "No image selected"}
																</p>
																<p className="mt-1 text-xs text-slate-500">
																	{block.image_url ? "Image ready for this banner." : "Upload an image or paste URL above."}
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div className="flex justify-end border-t border-slate-200 px-4 py-3">
											<Button onClick={() => handleSave(index)} disabled={savingIndex === index} className="h-10 gap-2 rounded-none">
												<Save className="h-4 w-4" />
												{savingIndex === index ? "Saving..." : "Save Changes"}
											</Button>
										</div>
									</> : null}
							</div>)}
					</div>}
			</div>
		);
	};

	return (
		<AdminLayout>
			<div className="admin-page-container">
				<section className="admin-hero" style={{ marginBottom: '24px' }}>
					<div>
						<h1>{
							(activeMenu === "Categories" || (activeMenu === "Content" && activeSub === "Categories")) ? "Categories" :
							(activeMenu === "Collections" || (activeMenu === "Content" && activeSub === "Collections")) ? "Collections" :
							(activeMenu === "Content" && activeSub === "Custom Pages") ? "Custom Pages" :
							(activeMenu === "Content" && activeSub === "Menu Navigation") ? "Menu Navigation" :
							"Homepage Builder"
						}</h1>
						<p>{
							(activeMenu === "Categories" || (activeMenu === "Content" && activeSub === "Categories")) ? "Manage categories and navigation settings" :
							(activeMenu === "Collections" || (activeMenu === "Content" && activeSub === "Collections")) ? "Manage curated product collections and their settings" :
							(activeMenu === "Content" && activeSub === "Custom Pages") ? "Create and manage custom storefront pages" :
							(activeMenu === "Content" && activeSub === "Menu Navigation") ? "Manage navigation menu link lists" :
							"Edit homepage slides and promotional banners"
						}</p>
					</div>
				</section>

				{renderContentBody()}
			</div>
		</AdminLayout>
	);
}

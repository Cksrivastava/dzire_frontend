import { cn, Button, Input, Switch, Textarea, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth } from "../AdminShims";
import { useEffect, useState } from "react";
import { Image as ImageIcon, MoveDown, MoveUp, Plus, Save, Trash2, Upload, X, RefreshCw } from "lucide-react";
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

export default function AdminHomepageBuilder() {
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
				if (current === null) return null;
				if (current === index) return index > 0 ? index - 1 : null;
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
				if (current === null) return null;
				if (current === index) return index > 0 ? index - 1 : null;
				return current > index ? current - 1 : current;
			});
			toast.success("Deleted");
		} catch (error) {
			console.error(error);
			toast.error("Delete failed");
		}
	};

	const getImageName = (imageUrl) => {
		if (!imageUrl) return "";
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

	return (
		<AdminLayout>
			<div className="admin-page-container">
				<section className="admin-hero" style={{ marginBottom: '24px' }}>
					<div>
						<h1>Homepage Builder</h1>
						<p>Edit homepage slides, promotional banners and featured sections</p>
					</div>
				</section>

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
			</div>
		</AdminLayout>
	);
}

import { cn, Button, Input, formatCurrency, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";



import AdminLayout from "./AdminLayout";
const inventoryFilters = [
	{
		value: "all",
		label: "All stock"
	},
	{
		value: "healthy",
		label: "Healthy"
	},
	{
		value: "low_stock",
		label: "Low stock"
	},
	{
		value: "out_of_stock",
		label: "Out of stock"
	}
];
const alphabetFilters = ["all", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const sortOptions = [
	{
		value: "az",
		label: "A to Z"
	},
	{
		value: "za",
		label: "Z to A"
	},
	{
		value: "catalog",
		label: "Most products"
	},
	{
		value: "stock",
		label: "Most stock"
	},
	{
		value: "updated",
		label: "Recently updated"
	}
];

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-GB", {
	day: "2-digit",
	month: "short",
	year: "numeric"
}) : "-";
const normalizeBrandName = (value) => {
	const cleaned = String(value || "").trim().replace(/\s+/g, " ");
	return cleaned || "Unknown";
};
const toNumber = (value) => Number(value || 0);
const getProductChangedAt = (product) => product.updated_at || product.created_at || null;
const getStatusMeta = (brand) => {
	if (brand.out_of_stock_products === brand.product_count && brand.product_count > 0) {
		return {
			label: "Out of stock",
			className: "text-rose-600"
		};
	}
	if (brand.low_stock_products > 0) {
		return {
			label: `Low stock (${brand.low_stock_products})`,
			className: "text-amber-600"
		};
	}
	return {
		label: "Healthy",
		className: "text-emerald-600"
	};
};
const getAudienceSummary = (brand) => {
	const parts = [
		brand.men_count > 0 ? `Men ${brand.men_count}` : "",
		brand.women_count > 0 ? `Women ${brand.women_count}` : "",
		brand.unisex_count > 0 ? `Unisex ${brand.unisex_count}` : ""
	].filter(Boolean);
	return parts.length > 0 ? parts.join(" | ") : "-";
};
const getCatalogMixSummary = (brand) => {
	const parts = [
		brand.bestseller_count > 0 ? `Bestseller ${brand.bestseller_count}` : "",
		brand.premium_count > 0 ? `Premium ${brand.premium_count}` : "",
		brand.new_count > 0 ? `New ${brand.new_count}` : ""
	].filter(Boolean);
	return parts.length > 0 ? parts.join(" | ") : "-";
};
const getFeaturedNames = (brand) => {
	if (brand.featured_products.length === 0) {
		return "-";
	}
	return brand.featured_products.map((product) => product.name).join(", ");
};
const buildBrandRecords = (products) => {
	const groupedProducts = new Map();
	products.forEach((product) => {
		const brand = normalizeBrandName(product.brand);
		const key = brand.toLowerCase();
		const existingGroup = groupedProducts.get(key);
		if (existingGroup) {
			existingGroup.items.push(product);
			return;
		}
		groupedProducts.set(key, {
			brand,
			items: [product]
		});
	});
	return Array.from(groupedProducts.values()).map(({ brand, items }) => {
		const sortedItems = [...items].sort((left, right) => {
			const rightTime = new Date(getProductChangedAt(right) || 0).getTime();
			const leftTime = new Date(getProductChangedAt(left) || 0).getTime();
			return rightTime - leftTime || right.id - left.id;
		});
		const prices = sortedItems.map((product) => toNumber(product.price));
		const totalPrice = prices.reduce((sum, value) => sum + value, 0);
		const latestSource = sortedItems[0];
		const latestUpdatedAt = latestSource ? getProductChangedAt(latestSource) : null;
		return {
			brand,
			product_count: sortedItems.length,
			in_stock_products: sortedItems.filter((product) => toNumber(product.stock) > 0).length,
			low_stock_products: sortedItems.filter((product) => {
				const stock = toNumber(product.stock);
				return stock > 0 && stock <= 5;
			}).length,
			out_of_stock_products: sortedItems.filter((product) => toNumber(product.stock) <= 0).length,
			total_stock_units: sortedItems.reduce((sum, product) => sum + toNumber(product.stock), 0),
			average_price: prices.length > 0 ? Math.round(totalPrice / prices.length) : 0,
			min_price: prices.length > 0 ? Math.min(...prices) : 0,
			max_price: prices.length > 0 ? Math.max(...prices) : 0,
			bestseller_count: sortedItems.filter((product) => String(product.category || "").toLowerCase() === "bestseller").length,
			premium_count: sortedItems.filter((product) => String(product.category || "").toLowerCase() === "premium").length,
			new_count: sortedItems.filter((product) => String(product.category || "").toLowerCase() === "new").length,
			men_count: sortedItems.filter((product) => String(product.audience || "").toLowerCase() === "men").length,
			women_count: sortedItems.filter((product) => String(product.audience || "").toLowerCase() === "women").length,
			unisex_count: sortedItems.filter((product) => String(product.audience || "").toLowerCase() === "unisex").length,
			latest_updated_at: latestUpdatedAt,
			featured_products: sortedItems.slice(0, 3).map((product) => ({
				id: product.id,
				name: product.name,
				image: String(product.image || ""),
				price: toNumber(product.price),
				stock: toNumber(product.stock),
				category: String(product.category || "uncategorized")
			}))
		};
	});
};
const adminBrandsStyles = `
.admin-brands-page {
	width: 100%;
	max-width: 100%;
	min-width: 0;
}

.admin-brands-panel {
	overflow: hidden;
	border-radius: 16px;
}

.admin-brands-filters {
	align-items: center;
}

.admin-brands-filters input,
.admin-brands-filters select {
	width: 100%;
	min-width: 0;
}

.admin-brands-table-wrap {
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
}

.admin-brands-table {
	width: max-content;
	min-width: 1780px;
	table-layout: auto;
}

.admin-brands-table thead {
	background: #ff6600 !important;
	color: #ffffff;
}

.admin-brands-table thead th {
	background: transparent !important;
	color: #ffffff !important;
	font-size: 16px;
	font-weight: 700;
	letter-spacing: 0.01em;
	white-space: nowrap;
}

.admin-brands-table th,
.admin-brands-table td {
	vertical-align: top;
	overflow-wrap: anywhere;
	padding: 14px 16px !important;
}

.admin-brands-table th:nth-child(1),
.admin-brands-table td:nth-child(1) {
	min-width: 90px;
}

.admin-brands-table th:nth-child(2),
.admin-brands-table td:nth-child(2) {
	min-width: 190px;
}

.admin-brands-table th:nth-child(3),
.admin-brands-table td:nth-child(3),
.admin-brands-table th:nth-child(4),
.admin-brands-table td:nth-child(4),
.admin-brands-table th:nth-child(5),
.admin-brands-table td:nth-child(5),
.admin-brands-table th:nth-child(7),
.admin-brands-table td:nth-child(7) {
	min-width: 130px;
}

.admin-brands-table th:nth-child(6),
.admin-brands-table td:nth-child(6) {
	min-width: 170px;
}

.admin-brands-table th:nth-child(8),
.admin-brands-table td:nth-child(8),
.admin-brands-table th:nth-child(9),
.admin-brands-table td:nth-child(9) {
	min-width: 170px;
}

.admin-brands-table th:nth-child(10),
.admin-brands-table td:nth-child(10) {
	min-width: 270px;
}

.admin-brands-table th:nth-child(11),
.admin-brands-table td:nth-child(11) {
	min-width: 170px;
}

.admin-brands-table th:nth-child(12),
.admin-brands-table td:nth-child(12) {
	min-width: 150px;
}

@media (max-width: 1180px) {
	.admin-brands-table-wrap {
		overflow-x: auto;
	}
}

@media (max-width: 760px) {
	.admin-brands-filters {
		grid-template-columns: 1fr;
	}
}
`;
const AdminBrands = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeSub = searchParams.get("sub") || "All Brands";
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [alphabetFilter, setAlphabetFilter] = useState("all");
	const [inventoryFilter, setInventoryFilter] = useState("all");
	const [sortBy, setSortBy] = useState("az");
	const deferredSearchQuery = useDeferredValue(searchQuery);
	const fetchBrands = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch(apiUrl("/admin/brands"), { headers: getAuthHeaders(false, "admin") });
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.message || "Failed to load brands");
			}
			setBrands(Array.isArray(data) ? data : []);
		} catch (fetchError) {
			console.error(fetchError);
			try {
				const fallbackRes = await fetch(apiUrl("/products"));
				const fallbackData = await fallbackRes.json();
				if (!fallbackRes.ok) {
					throw new Error(fallbackData?.message || "Failed to load products");
				}
				setBrands(buildBrandRecords(Array.isArray(fallbackData) ? fallbackData : []));
			} catch (fallbackError) {
				console.error(fallbackError);
				setBrands([]);
				setError("Error fetching brands");
			}
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		void fetchBrands();
	}, []);
	const filteredBrands = useMemo(() => {
		const query = deferredSearchQuery.trim().toLowerCase();
		const nextBrands = brands.filter((brand) => {
			const firstLetter = brand.brand.trim().charAt(0).toUpperCase();
			const matchesQuery = !query || brand.brand.toLowerCase().includes(query) || brand.featured_products.some((product) => product.name.toLowerCase().includes(query));
			const matchesAlphabet = alphabetFilter === "all" || firstLetter === alphabetFilter;
			const matchesInventory = inventoryFilter === "all" || inventoryFilter === "healthy" && brand.low_stock_products === 0 && brand.out_of_stock_products < brand.product_count || inventoryFilter === "low_stock" && brand.low_stock_products > 0 || inventoryFilter === "out_of_stock" && brand.out_of_stock_products === brand.product_count && brand.product_count > 0;
			return matchesQuery && matchesAlphabet && matchesInventory;
		});
		return [...nextBrands].sort((left, right) => {
			if (sortBy === "az") {
				return left.brand.localeCompare(right.brand);
			}
			if (sortBy === "za") {
				return right.brand.localeCompare(left.brand);
			}
			if (sortBy === "stock") {
				return right.total_stock_units - left.total_stock_units || left.brand.localeCompare(right.brand);
			}
			if (sortBy === "updated") {
				return new Date(right.latest_updated_at || 0).getTime() - new Date(left.latest_updated_at || 0).getTime() || left.brand.localeCompare(right.brand);
			}
			return right.product_count - left.product_count || left.brand.localeCompare(right.brand);
		});
	}, [
		alphabetFilter,
		brands,
		deferredSearchQuery,
		inventoryFilter,
		sortBy
	]);
	const renderOriginalContent = () => (
		<section className="admin-brands-panel border border-[#dfe7f3] bg-white">
			<div className="admin-brands-filters grid gap-3 border-b border-[#e7edf7] p-4 xl:grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_auto]">
				<Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search brand or product" className="h-10 rounded-md border-[#d6dfed] bg-white text-slate-900 placeholder:text-slate-400" />

				<select value={alphabetFilter} onChange={(event) => setAlphabetFilter(event.target.value)} className="h-10 rounded-md border border-[#d6dfed] bg-white px-3 text-sm text-slate-700 outline-none">
					<option value="all">All letters</option>
					{alphabetFilters.filter((letter) => letter !== "all").map((letter) => <option key={letter} value={letter}>
								{letter}
							</option>)}
				</select>

				<select value={inventoryFilter} onChange={(event) => setInventoryFilter(event.target.value)} className="h-10 rounded-md border border-[#d6dfed] bg-white px-3 text-sm text-slate-700 outline-none">
					{inventoryFilters.map((filter) => <option key={filter.value} value={filter.value}>
							{filter.label}
						</option>)}
				</select>

				<select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-10 rounded-md border border-[#d6dfed] bg-white px-3 text-sm text-slate-700 outline-none">
					{sortOptions.map((option) => <option key={option.value} value={option.value}>
							{option.label}
						</option>)}
				</select>

				<div className="flex items-center justify-end text-sm text-slate-500">
					{loading ? "Loading..." : `${filteredBrands.length} brands`}
				</div>
			</div>

			{error ? <div className="border-b border-[#f3d2d2] bg-[#fff7f7] px-4 py-3 text-sm text-rose-700">{error}</div> : null}

			{loading ? <div className="px-4 py-8 text-sm text-slate-500">Loading brands...</div> : filteredBrands.length === 0 ? <div className="px-4 py-8 text-sm text-slate-500">No brands found for the selected filters.</div> : <div className="admin-table-scroll admin-brands-table-wrap overflow-x-auto">
					<table className="admin-brands-table min-w-[1200px] w-full text-left text-sm text-slate-700">
						<thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.12em] text-slate-500">
							<tr>
								<th className="px-4 py-3 font-semibold">Sr No</th>
								<th className="px-4 py-3 font-semibold">Brand</th>
								<th className="px-4 py-3 font-semibold">Products</th>
								<th className="px-4 py-3 font-semibold">In Stock</th>
								<th className="px-4 py-3 font-semibold">Stock Units</th>
								<th className="px-4 py-3 font-semibold">Price Range</th>
								<th className="px-4 py-3 font-semibold">Average</th>
								<th className="px-4 py-3 font-semibold">Audience</th>
								<th className="px-4 py-3 font-semibold">Catalog Mix</th>
								<th className="px-4 py-3 font-semibold">Latest Products</th>
								<th className="px-4 py-3 font-semibold">Status</th>
								<th className="px-4 py-3 font-semibold">Updated</th>
							</tr>
						</thead>

						<tbody>
							{filteredBrands.map((brand, index) => {
					const status = getStatusMeta(brand);
					return <tr key={brand.brand} className="border-t border-[#e7edf7] align-top">
									<td className="px-4 py-3 text-slate-500">{index + 1}</td>
									<td className="px-4 py-3 font-medium text-slate-900">{brand.brand}</td>
									<td className="px-4 py-3">{brand.product_count}</td>
									<td className="px-4 py-3">{brand.in_stock_products}</td>
									<td className="px-4 py-3">{brand.total_stock_units}</td>
									<td className="px-4 py-3">
										{formatCurrency(brand.min_price)} - {formatCurrency(brand.max_price)}
									</td>
									<td className="px-4 py-3">{formatCurrency(brand.average_price)}</td>
									<td className="px-4 py-3">{getAudienceSummary(brand)}</td>
									<td className="px-4 py-3">{getCatalogMixSummary(brand)}</td>
									<td className="px-4 py-3 text-slate-600">{getFeaturedNames(brand)}</td>
									<td className={`px-4 py-3 font-medium ${status.className}`}>{status.label}</td>
									<td className="px-4 py-3">{formatDate(brand.latest_updated_at)}</td>
								</tr>;
				})}
						</tbody>
					</table>
				</div>}
		</section>
	);

	const renderBrandsSubContent = () => {
		switch (activeSub) {
			case "Add / Edit Brand":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Add New Brand</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Brand Name</label>
								<input type="text" placeholder="e.g. Nike" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Official Website</label>
								<input type="text" placeholder="e.g. https://nike.com" style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
							</div>
							<button onClick={() => alert('Brand registered!')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save Brand
							</button>
						</div>
					</div>
				);
			case "Brand Logo":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Brand Logo Upload</h3>
						<div style={{ border: '2px dashed #ff6600', padding: '40px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
							<p style={{ margin: 0, color: '#ff6600', fontWeight: '600' }}>Click to Upload Brand Logo</p>
							<p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#667085' }}>Recommended format: PNG / SVG, square aspect ratio</p>
						</div>
					</div>
				);
			case "Brand Description":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Brand Description / Profile</h3>
						<textarea placeholder="Provide details about the brand's history, catalog focus..." style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '120px' }} />
						<button onClick={() => alert('Brand Profile saved')} style={{ marginTop: '16px', padding: '10px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
							Save Bio
						</button>
					</div>
				);
			case "Brand SEO":
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
			case "Brand Products":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Linked Catalog Items</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
									<th style={{ padding: '12px 16px' }}>Product</th>
									<th style={{ padding: '12px 16px' }}>SKU</th>
									<th style={{ padding: '12px 16px' }}>Stock</th>
								</tr>
							</thead>
							<tbody>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 16px' }}>Hiker Pro Backpack</td>
									<td style={{ padding: '16px 16px', color: '#667085' }}>BP-HK-PRO</td>
									<td style={{ padding: '16px 16px' }}>32 units</td>
								</tr>
							</tbody>
						</table>
					</div>
				);
			case "Display Settings":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Brand Display Settings</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<input type="checkbox" defaultChecked />
								Show in Homepage Brands Slider
							</label>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<input type="checkbox" />
								Mark as Featured Brand
							</label>
							<button onClick={() => alert('Display updated')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Save Settings
							</button>
						</div>
					</div>
				);
			case "Bulk Actions":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Bulk Brand Actions</h3>
						<button onClick={() => alert('Brands Exported')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
							Export All Brands Catalog (CSV)
						</button>
					</div>
				);
			case "All Brands":
			default:
				return renderOriginalContent();
		}
	};

	return <AdminLayout>
		<style>{adminBrandsStyles}</style>
		<div className="admin-brands-page space-y-6">

			<section className="admin-hero">
				<div>
					<h1>{activeSub}</h1>
					<p>
						Performance insights and inventory status per brand
					</p>
				</div>
				{activeSub === "All Brands" && (
					<button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
						<RefreshCcw size={18} />
						Refresh Data
					</button>
				)}
			</section>

			{renderBrandsSubContent()}
		</div>
	</AdminLayout>;
};
export default AdminBrands;

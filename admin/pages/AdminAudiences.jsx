import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, ImagePlus, Package, PencilLine, Plus, Save, Search, Sparkles, X, User, Phone, Mail, MapPin, ClipboardList, CheckCircle, RefreshCcw, Download } from "lucide-react";
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

/* ── Mock data for Customer views ─────────────────────── */
const mockCustomers = [
  { id: 'CUST-001', name: 'Amit Sharma', email: 'amit.sharma@example.com', phone: '+91 98765 43210', joined: '12 Jan 2025', orders: 15, spent: '₹24,500', segment: 'VIP', status: 'Active' },
  { id: 'CUST-002', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 87654 32109', joined: '05 Feb 2025', orders: 8, spent: '₹12,800', segment: 'Regular', status: 'Active' },
  { id: 'CUST-003', name: 'Rohan Verma', email: 'rohan.verma@example.com', phone: '+91 76543 21098', joined: '20 Mar 2025', orders: 1, spent: '₹1,500', segment: 'New', status: 'Active' },
  { id: 'CUST-004', name: 'Anjali Desai', email: 'anjali.desai@example.com', phone: '+91 65432 10987', joined: '15 Apr 2025', orders: 0, spent: '₹0', segment: 'Inactive', status: 'Suspended' }
];

const mockOrders = [
  { id: 'ORD-2026-901', date: '08 Jul 2026', items: '2 items', status: 'Delivered', total: '₹3,299' },
  { id: 'ORD-2026-874', date: '28 Jun 2026', items: '1 item', status: 'Shipped', total: '₹1,499' },
  { id: 'ORD-2026-512', date: '12 May 2026', items: '4 items', status: 'Delivered', total: '₹8,500' }
];

const mockReturns = [
  { id: 'RET-2026-08', date: '30 Jun 2026', product: 'Premium Backpack (Orange)', reason: 'Size too large', status: 'Completed', amount: '₹2,499' }
];

const mockWishlist = [
  { id: 1, name: 'Premium Backpack (Orange)', price: '₹2,499', sku: 'BAG-PREM-ORG', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100' },
  { id: 2, name: 'Trekking Shoes', price: '₹3,299', sku: 'SHOE-TRK-001', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' }
];

const mockAddresses = [
  { id: 1, label: 'Home (Default)', name: 'Amit Sharma', phone: '+91 98765 43210', address: 'Flat 402, Sunshine Apartments, MG Road, Pune, Maharashtra - 411001' },
  { id: 2, label: 'Office', name: 'Amit Sharma', phone: '+91 98765 43210', address: 'Tech Park Phase 2, Hinjewadi, Pune, Maharashtra - 411057' }
];

const mockSegments = [
  { name: 'VIP Customers', members: 24, criteria: 'Lifetime spend > ₹20,000' },
  { name: 'Regular Shoppers', members: 142, criteria: 'Placed 3+ orders in last 90 days' },
  { name: 'New Signups', members: 58, criteria: 'Joined in last 30 days' },
  { name: 'Inactive / Churn Risk', members: 95, criteria: 'No purchase in last 180 days' }
];

const mockNotes = [
  { date: '08 Jul 2026', note: 'Customer called to change delivery address for ORD-901. Updated address to Office.', by: 'Pooja (Support)' },
  { date: '15 Jun 2026', note: 'VIP gift box sent for crossing ₹20,000 milestone.', by: 'Rahul (Marketing)' }
];

const S = {
  card: { background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #ffe0cc', boxShadow: '0 8px 30px rgba(255,102,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 20px', fontWeight: '600', textAlign: 'left', background: '#fff9f5', fontSize: '13px', color: '#ff6600', textTransform: 'uppercase', borderBottom: '1px solid #ffe0cc' },
  td: { padding: '16px 20px', fontSize: '14px', borderBottom: '1px solid #fcf6f2' },
  badge: (bg, col) => ({ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: bg, color: col, display: 'inline-block' }),
  inp: { width: '100%', padding: '10px 14px', border: '1px solid #ffe0cc', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }
};

const AdminAudiences = () => {
	const [searchParams] = useSearchParams();
	const activeMenu = searchParams.get("menu") || "Customers";
	const activeSub = searchParams.get("sub") || "All Customers";

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

	/* ── Customer modules rendering logic ────────────────── */
	const renderCustomerContent = () => {
		switch (activeSub) {
			case "All Customers":
			default:
				return (
					<div style={S.panel}>
						<div style={{ padding: '16px 20px', borderBottom: '1px solid #ffe0cc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
							<div style={{ position: 'relative' }}>
								<Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#ff6600' }} />
								<input type="text" placeholder="Search customer name, email..." style={{ padding: '8px 12px 8px 36px', border: '1px solid #ffe0cc', borderRadius: '6px', fontSize: '14px', width: '250px', outline: 'none' }} />
							</div>
							<button style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }} onClick={() => alert('Add Customer')}>+ Add Customer</button>
						</div>
						<table style={S.table}>
							<thead>
								<tr>
									{['Customer Info', 'Joined', 'Orders', 'Total Spent', 'Segment', 'Status', 'Action'].map(h => <th key={h} style={S.th}>{h}</th>)}
								</tr>
							</thead>
							<tbody>
								{mockCustomers.map(c => (
									<tr key={c.id}>
										<td style={S.td}>
											<strong style={{ display: 'block', color: '#111' }}>{c.name}</strong>
											<span style={{ fontSize: '12px', color: '#667085' }}>{c.email} · {c.phone}</span>
										</td>
										<td style={{ ...S.td, color: '#667085' }}>{c.joined}</td>
										<td style={{ ...S.td, fontWeight: '600' }}>{c.orders} Orders</td>
										<td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{c.spent}</td>
										<td style={S.td}><span style={S.badge(c.segment === 'VIP' ? '#fef0c7' : '#e0f2fe', c.segment === 'VIP' ? '#b54708' : '#0369a1')}>{c.segment}</span></td>
										<td style={S.td}><span style={S.badge(c.status === 'Active' ? '#dcfce7' : '#fee2e2', c.status === 'Active' ? '#15803d' : '#b91c1c')}>{c.status}</span></td>
										<td style={S.td}>
											<Link to={`/admin/audiences?menu=Customers&sub=Customer%20Profile`} style={{ color: '#ff6600', fontWeight: '600', fontSize: '13px' }}>View Profile</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);

			case "Customer Profile":
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '20px' }}>
							{/* Left Card: Customer Meta */}
							<div style={S.card}>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid #ffe0cc', paddingBottom: '20px', marginBottom: '20px' }}>
									<div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff7f1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ff6600', marginBottom: '12px' }}>
										<User size={36} color="#ff6600" />
									</div>
									<h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>Amit Sharma</h3>
									<p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Customer ID: CUST-001</p>
									<span style={{ ...S.badge('#fef0c7', '#b54708'), marginTop: '8px' }}>VIP Member</span>
								</div>

								<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
										<Mail size={16} color="#ff6600" />
										<span>amit.sharma@example.com</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
										<Phone size={16} color="#ff6600" />
										<span>+91 98765 43210</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
										<MapPin size={16} color="#ff6600" />
										<span>Pune, Maharashtra</span>
									</div>
								</div>
							</div>

							{/* Right Card: Statistics Summary */}
							<div style={S.card}>
								<h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600' }}>Lifetime Value & Engagement</h3>
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
									{[
										{ label: 'Total Spent', val: '₹24,500', note: 'All-time purchase' },
										{ label: 'Orders Placed', val: '15', note: 'Avg frequency: 12 days' },
										{ label: 'Credits Balance', val: '450 pts', note: 'Dzire credits' }
									].map((k, i) => (
										<div key={i} style={{ padding: '16px', background: '#fffbf9', border: '1px solid #ffe0cc', borderRadius: '12px' }}>
											<span style={{ fontSize: '12px', color: '#667085', display: 'block', marginBottom: '6px' }}>{k.label}</span>
											<strong style={{ fontSize: '20px', color: '#ff6600', display: 'block', marginBottom: '4px' }}>{k.val}</strong>
											<span style={{ fontSize: '11px', color: '#94a3b8' }}>{k.note}</span>
										</div>
									))}
								</div>

								<div style={{ borderTop: '1px solid #ffe0cc', paddingTop: '20px' }}>
									<h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600' }}>Buying Preferences</h4>
									<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
										{['Running Gear', 'Outdoor Bags', 'Activewear', 'Premium Brand Loyal'].map(tag => (
											<span key={tag} style={{ padding: '6px 12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '12px', color: '#4a5568' }}>{tag}</span>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				);

			case "Order History":
				return (
					<div style={S.panel}>
						<div style={{ padding: '16px 20px', borderBottom: '1px solid #ffe0cc' }}>
							<strong>Order Purchase Logs — Amit Sharma</strong>
						</div>
						<table style={S.table}>
							<thead>
								<tr>
									{['Order ID', 'Date', 'Items Purchased', 'Status', 'Total Value'].map(h => <th key={h} style={S.th}>{h}</th>)}
								</tr>
							</thead>
							<tbody>
								{mockOrders.map(o => (
									<tr key={o.id}>
										<td style={{ ...S.td, fontWeight: '700', color: '#ff6600' }}>{o.id}</td>
										<td style={{ ...S.td, color: '#667085' }}>{o.date}</td>
										<td style={S.td}>{o.items}</td>
										<td style={S.td}>
											<span style={S.badge(o.status === 'Delivered' ? '#dcfce7' : '#eff8ff', o.status === 'Delivered' ? '#15803d' : '#175cd3')}>{o.status}</span>
										</td>
										<td style={{ ...S.td, fontWeight: '700' }}>{o.total}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);

			case "Return History":
				return (
					<div style={S.panel}>
						<div style={{ padding: '16px 20px', borderBottom: '1px solid #ffe0cc' }}>
							<strong>Customer Returns & RMA History — Amit Sharma</strong>
						</div>
						<table style={S.table}>
							<thead>
								<tr>
									{['Return ID', 'Requested Date', 'Product Details', 'Reason', 'Status', 'Refund Amount'].map(h => <th key={h} style={S.th}>{h}</th>)}
								</tr>
							</thead>
							<tbody>
								{mockReturns.map(r => (
									<tr key={r.id}>
										<td style={{ ...S.td, fontWeight: '700', color: '#e11d48' }}>{r.id}</td>
										<td style={{ ...S.td, color: '#667085' }}>{r.date}</td>
										<td style={S.td}><strong>{r.product}</strong></td>
										<td style={{ ...S.td, color: '#667085' }}>{r.reason}</td>
										<td style={S.td}><span style={S.badge('#dcfce7', '#15803d')}>{r.status}</span></td>
										<td style={{ ...S.td, fontWeight: '700', color: '#e11d48' }}>{r.amount}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);

			case "Wishlist":
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Customer Wishlist Items — Amit Sharma</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
							{mockWishlist.map(item => (
								<div key={item.id} style={S.card}>
									<div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#fcf6f2', borderRadius: '12px', marginBottom: '12px' }}>
										<img src={item.image} alt={item.name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
									</div>
									<strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>{item.name}</strong>
									<span style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>SKU: {item.sku}</span>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span style={{ fontWeight: '700', color: '#ff6600' }}>{item.price}</span>
										<button onClick={() => alert('Moved to cart')} style={{ padding: '6px 12px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Add to Cart</button>
									</div>
								</div>
							))}
						</div>
					</div>
				);

			case "Saved Addresses":
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Saved Delivery Addresses — Amit Sharma</h3>
							<button onClick={() => alert('New Address')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Address</button>
						</div>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
							{mockAddresses.map(addr => (
								<div key={addr.id} style={{ ...S.card, borderLeft: '4px solid #ff6600' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
										<span style={{ fontWeight: '700', fontSize: '14px', color: '#ff6600' }}>{addr.label}</span>
										<button onClick={() => alert('Deleted')} style={{ color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
									</div>
									<p style={{ margin: '0 0 6px', fontWeight: '600' }}>{addr.name}</p>
									<p style={{ margin: '0 0 10px', fontSize: '13px', color: '#4a5568', lineHeight: '1.4' }}>{addr.address}</p>
									<span style={{ fontSize: '12px', color: '#667085' }}>📞 Contact: {addr.phone}</span>
								</div>
							))}
						</div>
					</div>
				);

			case "Customer Segments":
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Smart Customer Segments</h3>
								<p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085' }}>Create dynamic customer cohorts based on shopping rules</p>
							</div>
							<button onClick={() => alert('New Segment')} style={{ padding: '8px 16px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Create Segment</button>
						</div>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
							{mockSegments.map((s, i) => (
								<div key={i} style={S.card}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
										<strong style={{ fontSize: '15px', color: '#111' }}>{s.name}</strong>
										<span style={S.badge('#fff7f1', '#ff6600')}>{s.members} active users</span>
									</div>
									<div style={{ background: '#fcf6f2', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#667085' }}>
										<strong>Rules:</strong> {s.criteria}
									</div>
									<div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
										<button onClick={() => alert('Syncing Segment members')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #ffe0cc', borderRadius: '6px', fontSize: '12px', color: '#ff6600', cursor: 'pointer' }}>Sync Members</button>
										<button onClick={() => alert('Exporting Segment')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #ffe0cc', borderRadius: '6px', fontSize: '12px', color: '#ff6600', cursor: 'pointer' }}>Export List</button>
									</div>
								</div>
							))}
						</div>
					</div>
				);

			case "Customer Notes":
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
						<div style={{ ...S.card }}>
							<h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600' }}>Add Internal Note — Amit Sharma</h3>
							<textarea placeholder="Write a note visible only to admins and support agents..." style={{ width: '100%', padding: '12px', border: '1px solid #ffe0cc', borderRadius: '8px', minHeight: '80px', resize: 'vertical', fontSize: '13px', outline: 'none' }} />
							<button onClick={() => alert('Note Added')} style={{ ...S.saveBtn, marginTop: '12px' }}>Add Note</button>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
							{mockNotes.map((n, i) => (
								<div key={i} style={{ ...S.card, borderLeft: '4px solid #ff6600' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
										<span style={{ fontSize: '12px', color: '#9ca3af' }}>{n.date}</span>
										<strong style={{ fontSize: '12px', color: '#ff6600' }}>By: {n.by}</strong>
									</div>
									<p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.4' }}>{n.note}</p>
								</div>
							))}
						</div>
					</div>
				);

			case "Customer Export":
				return (
					<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
						<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
							{/* Configuration Card */}
							<div style={S.card}>
								<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Export Configuration</h3>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
									<div>
										<label style={S.label}>Select Segment Filter</label>
										<select style={S.inp}>
											<option>All Customers</option>
											<option>VIP Customers Only</option>
											<option>New Signups Only</option>
											<option>Inactive / Churn Risk</option>
										</select>
									</div>
									<div>
										<label style={S.label}>Export Format</label>
										<select style={S.inp}>
											<option>Excel Worksheet (.xlsx)</option>
											<option>Comma-separated Values (.csv)</option>
											<option>JSON Document (.json)</option>
											<option>Portable Document Format (.pdf)</option>
										</select>
									</div>
									<div>
										<label style={S.label}>Joined Date Range</label>
										<div style={{ display: 'flex', gap: '10px' }}>
											<input type="date" style={S.inp} />
											<input type="date" style={S.inp} />
										</div>
									</div>
									<div>
										<label style={S.label}>Fields to Include</label>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
											{['Full Name', 'Email Address', 'Phone Number', 'Lifetime Order Count', 'Lifetime Spend Value', 'Joined Date', 'Customer Segment', 'Account Status'].map(f => (
												<label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
													<input type="checkbox" defaultChecked /> {f}
												</label>
											))}
										</div>
									</div>
									<Button onClick={() => alert('Download Initiated!')} className="rounded-xl bg-[#ff6600] text-white hover:bg-[#e65c00] py-3 font-semibold shadow-md flex items-center justify-center gap-2">
										<Download size={16} /> Start Customer Export
									</Button>
								</div>
							</div>

							{/* Export Live Preview */}
							<div style={S.card}>
								<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Live Export Preview (Sample Data)</h3>
								<div style={{ background: '#fafafa', border: '1px solid #ffe0cc', borderRadius: '12px', overflow: 'hidden' }}>
									<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
										<thead>
											<tr style={{ background: '#fff7f1', borderBottom: '1px solid #ffe0cc' }}>
												{['Name', 'Email', 'Joined', 'Spent'].map(h => <th key={h} style={{ padding: '10px 14px', fontWeight: '600', textAlign: 'left', color: '#ff6600' }}>{h}</th>)}
											</tr>
										</thead>
										<tbody>
											{mockCustomers.slice(0, 3).map((c, i) => (
												<tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
													<td style={{ padding: '10px 14px', fontWeight: '500' }}>{c.name}</td>
													<td style={{ padding: '10px 14px', color: '#667085' }}>{c.email}</td>
													<td style={{ padding: '10px 14px', color: '#667085' }}>{c.joined}</td>
													<td style={{ padding: '10px 14px', fontWeight: '600', color: '#ff6600' }}>{c.spent}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								
								<div style={{ marginTop: '24px', borderTop: '1px solid #ffe0cc', paddingTop: '20px' }}>
									<h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Recent Exports Logs</h4>
									<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
										{[
											{ name: 'customers_vip_july2026.csv', size: '24 KB', count: '24 records', date: '08 Jul 2026' },
											{ name: 'all_customers_june2026.xlsx', size: '142 KB', count: '215 records', date: '30 Jun 2026' }
										].map((e, idx) => (
											<div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid #ffe0cc', borderRadius: '8px', background: '#fafafa' }}>
												<div>
													<strong style={{ fontSize: '13px', display: 'block' }}>{e.name}</strong>
													<span style={{ fontSize: '11px', color: '#9ca3af' }}>{e.size} · {e.count} · {e.date}</span>
												</div>
												<button onClick={() => alert('Downloading file')} style={{ background: 'none', border: 'none', color: '#ff6600', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>Download</button>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				);
		}
	};

	/* ── Check if Customer view needs to be rendered ───────── */
	if (activeMenu === "Customers") {
		return (
			<AdminLayout>
				<div className="admin-page-container">
					<section className="admin-hero" style={{ marginBottom: '24px' }}>
						<div>
							<h1>{activeSub}</h1>
							<p>Manage store customers, guest users, segments, and wishlist profiles</p>
						</div>
						{activeSub === "All Customers" && (
							<button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
								<RefreshCcw size={18} />
								Refresh Data
							</button>
						)}
					</section>
					{renderCustomerContent()}
				</div>
			</AdminLayout>
		);
	}

	/* ── Otherwise fall back to the original Audience Pages Layout ── */
	return <AdminLayout>
      <div className="space-y-5">
        <section className="rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff6600]">Audience Pages</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">For Him, For Her & Unisex</h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage audience pages here. You can assign existing products and manually add new products to the
                selected audience page.
              </p>
            </div>
            <Link to={`/shop?audience=${selectedAudience}`} className="inline-flex items-center rounded-full border border-[#ffe0cc] px-4 py-2 text-sm font-medium text-[#ff6600]">
              Open {selectedAudienceMeta?.navLabel} page
            </Link>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <section className="rounded-[28px] border border-[#ffe0cc] bg-white p-4 shadow-[0_10px_35px_rgba(255,102,0,0.08)]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Audience Pages</h3>
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
                <div className="rounded-full bg-[#f7faff] px-4 py-2 text-sm font-medium text-slate-700">
                  {selectedProducts.length} products
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
    </AdminLayout>;
};

export default AdminAudiences;

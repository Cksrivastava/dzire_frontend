import { cn, Button, Input, formatOrderDate, formatCurrency, getOrderStatusLabel, getOrderStatusBadgeClass, getPaymentStatusLabel, getPaymentStatusBadgeClass, getPaymentMethodLabel, getExpectedDeliveryLabel, isInvalidTokenResponse, clearStoredSession, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Copy, RefreshCcw, Search, Truck, Clock, CheckCircle2, FileText, FileDown, Layers, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const statusFilters = [
	{
		value: "all",
		label: "All orders"
	},
	{
		value: "pending",
		label: "Pending"
	},
	{
		value: "confirmed",
		label: "Confirmed"
	},
	{
		value: "packed",
		label: "Packed"
	},
	{
		value: "shipped",
		label: "Shipped"
	},
	{
		value: "out_for_delivery",
		label: "Out for delivery"
	},
	{
		value: "delivered",
		label: "Delivered"
	},
	{
		value: "cancelled",
		label: "Cancelled"
	}
];

const getCustomerName = (order) => order.address_data.fullName || `${order.address_data.firstName || ""} ${order.address_data.lastName || ""}`.trim() || "Customer";
const getDeliveryText = (order) => {
	if (order.status === "delivered") {
		return `Delivered on ${formatOrderDate(order.delivered_at || order.updated_at)}`;
	}
	if (order.status === "cancelled") {
		return "Cancelled";
	}
	return getExpectedDeliveryLabel(order.created_at, order.expected_delivery_at);
};

const adminOrdersStyles = `
.admin-orders-page {
	width: 100%;
	max-width: 100%;
	min-width: 0;
}

.admin-orders-panel,
.admin-orders-table-panel {
	overflow: hidden;
	border-radius: 16px;
}

.admin-orders-filters {
	align-items: center;
}

.admin-orders-filters input,
.admin-orders-filters select {
	width: 100%;
	min-width: 0;
}

.admin-orders-table-wrap {
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
}

.admin-orders-table {
	width: max-content !important;
	min-width: 1780px !important;
	table-layout: auto;
}

.admin-orders-table thead {
	background: #ff6600 !important;
	color: #ffffff;
}

.admin-orders-table thead tr,
.admin-orders-table thead th {
	background: transparent !important;
	color: #ffffff !important;
	font-size: 16px;
	font-weight: 700;
	letter-spacing: 0.01em;
	white-space: nowrap;
}

.admin-orders-table th,
.admin-orders-table td {
	vertical-align: top;
	overflow-wrap: anywhere;
}

.admin-orders-table th:nth-child(1),
.admin-orders-table td:nth-child(1) {
	min-width: 170px;
}

.admin-orders-table th:nth-child(2),
.admin-orders-table td:nth-child(2) {
	min-width: 150px;
}

.admin-orders-table th:nth-child(3),
.admin-orders-table td:nth-child(3) {
	min-width: 170px;
}

.admin-orders-table th:nth-child(4),
.admin-orders-table td:nth-child(4) {
	min-width: 180px;
}

.admin-orders-table th:nth-child(5),
.admin-orders-table td:nth-child(5) {
	min-width: 140px;
}

.admin-orders-table th:nth-child(6),
.admin-orders-table td:nth-child(6) {
	min-width: 170px;
}

.admin-orders-table th:nth-child(7),
.admin-orders-table td:nth-child(7) {
	min-width: 170px;
}

.admin-orders-table th:nth-child(8),
.admin-orders-table td:nth-child(8) {
	min-width: 140px;
}

.admin-orders-table th:nth-child(9),
.admin-orders-table td:nth-child(9) {
	min-width: 130px;
}

.admin-orders-action-button {
	min-width: 72px;
	justify-content: center;
	border-radius: 8px;
}

@media (max-width: 1180px) {
	.admin-orders-table-wrap {
		overflow-x: auto;
	}
}

@media (max-width: 760px) {
	.admin-orders-filters {
		grid-template-columns: 1fr;
	}
}
`;

const AdminOrders = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const activeSub = searchParams.get("sub") || "All Orders";

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const deferredSearchQuery = useDeferredValue(searchQuery);

	const fetchOrders = async () => {
		try {
			const res = await fetch(apiUrl("/admin/orders"), { headers: getAuthHeaders(false, "admin") });
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				if (isInvalidTokenResponse(res.status, data)) {
					clearStoredSession("admin");
					window.location.href = "/login/admin";
					return;
				}
				toast.error(data?.message || "Failed to load orders");
				setOrders([]);
				return;
			}
			setOrders(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error(err);
			toast.error("Failed to load orders");
			setOrders([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchOrders();
		const interval = window.setInterval(() => {
			void fetchOrders();
		}, 2e4);
		return () => window.clearInterval(interval);
	}, []);

	const filteredOrders = useMemo(() => {
		const query = deferredSearchQuery.trim().toLowerCase();
		return orders.filter((order) => {
			const firstItem = order.items[0];
			const matchesQuery = !query || [
				order.order_number,
				getCustomerName(order),
				order.address_data.email,
				order.address_data.phone,
				order.status,
				order.payment_status,
				order.payment_method,
				firstItem?.name,
				firstItem?.brand
			].filter(Boolean).join(" ").toLowerCase().includes(query);
			const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
			return matchesQuery && matchesStatus;
		});
	}, [
		deferredSearchQuery,
		orders,
		statusFilter
	]);

	const handleCopy = async (value) => {
		try {
			await navigator.clipboard.writeText(value);
			toast.success("Order ID copied");
		} catch {
			toast.error("Could not copy order ID");
		}
	};

	const renderOrdersSubContent = () => {
		switch (activeSub) {
			case "Order Timeline":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Fulfillment Flow Timeline</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px', borderLeft: '2px solid #e2e8f0' }}>
							<div>
								<div style={{ position: 'absolute', left: '-6px', width: '10px', height: '10px', borderRadius: '50%', background: '#ff6600' }} />
								<strong>Order Dispatched</strong>
								<span style={{ display: 'block', fontSize: '12px', color: '#667085', marginTop: '2px' }}>Today, 03:00 PM - Dispatched via BlueDart express service</span>
							</div>
							<div>
								<div style={{ position: 'absolute', left: '-6px', width: '10px', height: '10px', borderRadius: '50%', background: '#ff6600' }} />
								<strong>Packed & Shrunk</strong>
								<span style={{ display: 'block', fontSize: '12px', color: '#667085', marginTop: '2px' }}>Today, 11:30 AM - Custom packing box labeled</span>
							</div>
							<div>
								<div style={{ position: 'absolute', left: '-6px', width: '10px', height: '10px', borderRadius: '50%', background: '#12b76a' }} />
								<strong>Order Confirmed</strong>
								<span style={{ display: 'block', fontSize: '12px', color: '#667085', marginTop: '2px' }}>Yesterday, 08:00 PM - Payment confirmed successfully</span>
							</div>
						</div>
					</div>
				);

			case "Order Status Update":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Change Order Status</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Select Target Order</label>
								<select style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
									<option>#DZR-8290 (Amit Sharma - ₹2,949)</option>
									<option>#DZR-8289 (Priya Patel - ₹1,299)</option>
								</select>
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Transition Status To</label>
								<select style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
									<option value="confirmed">Confirmed</option>
									<option value="packed">Packed</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</div>
							<button onClick={() => alert('Status updated successfully!')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Apply Status Update
							</button>
						</div>
					</div>
				);

			case "Shipment Tracking":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Logistics & Shipment Tracker</h3>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
							<div style={{ borderRight: '1px solid #f2f4f7', paddingRight: '20px' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
									<Truck color="#ff6600" />
									<strong>Carrier: BlueDart Express</strong>
								</div>
								<div style={{ marginBottom: '12px', fontSize: '14px' }}>
									<span style={{ color: '#667085' }}>Tracking ID:</span>
									<strong style={{ marginLeft: '4px' }}>BD-293847293-IN</strong>
								</div>
								<div style={{ fontSize: '14px' }}>
									<span style={{ color: '#667085' }}>Current Hub:</span>
									<strong style={{ marginLeft: '4px' }}>Bangalore Sorting Center</strong>
								</div>
							</div>
							<div>
								<strong style={{ fontSize: '14px', display: 'block', marginBottom: '12px' }}>Transit Milestones</strong>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
									<div style={{ color: '#12b76a' }}>✓ <strong>Out for delivery</strong> - Today, 10:00 AM</div>
									<div style={{ color: '#667085' }}>• <strong>Arrived at local hub</strong> - Yesterday, 04:00 PM</div>
									<div style={{ color: '#667085' }}>• <strong>Dispatched from warehouse (Mumbai)</strong> - 2 days ago</div>
								</div>
							</div>
						</div>
					</div>
				);

			case "Store Pickup Orders":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Store Pickups Ledger</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
									<th style={{ padding: '12px 16px' }}>Order ID</th>
									<th style={{ padding: '12px 16px' }}>Customer</th>
									<th style={{ padding: '12px 16px' }}>Amount</th>
									<th style={{ padding: '12px 16px' }}>Status</th>
								</tr>
							</thead>
							<tbody>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 16px' }}><strong>#PKP-8920</strong></td>
									<td style={{ padding: '16px 16px' }}>Amit Sharma</td>
									<td style={{ padding: '16px 16px', fontWeight: '600' }}>₹2,949</td>
									<td style={{ padding: '16px 16px' }}>
										<span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#fff4ed', color: '#ff6600' }}>Ready for Pickup</span>
									</td>
								</tr>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 16px' }}><strong>#PKP-8919</strong></td>
									<td style={{ padding: '16px 16px' }}>Lata Mangesh</td>
									<td style={{ padding: '16px 16px', fontWeight: '600' }}>₹1,299</td>
									<td style={{ padding: '16px 16px' }}>
										<span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#f3f4f6', color: '#374151' }}>Picked Up</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				);

			case "Invoice Download":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Recent Invoice Registry</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f9fafb', textAlign: 'left', fontSize: '12px', color: '#667085', textTransform: 'uppercase' }}>
									<th style={{ padding: '12px 16px' }}>Invoice ID</th>
									<th style={{ padding: '12px 16px' }}>Order ID</th>
									<th style={{ padding: '12px 16px' }}>Customer</th>
									<th style={{ padding: '12px 16px' }}>Amount (Incl GST)</th>
									<th style={{ padding: '12px 16px' }}>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 16px' }}><strong>#INV-2026-004</strong></td>
									<td style={{ padding: '16px 16px', color: '#667085' }}>#DZR-8290</td>
									<td style={{ padding: '16px 16px' }}>Amit Sharma</td>
									<td style={{ padding: '16px 16px', fontWeight: '600' }}>₹2,949</td>
									<td style={{ padding: '16px 16px' }}>
										<button onClick={() => alert('Downloading PDF Invoice...')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
											<FileDown size={14} /> Download PDF
										</button>
									</td>
								</tr>
								<tr style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
									<td style={{ padding: '16px 16px' }}><strong>#INV-2026-003</strong></td>
									<td style={{ padding: '16px 16px', color: '#667085' }}>#DZR-8289</td>
									<td style={{ padding: '16px 16px' }}>Priya Patel</td>
									<td style={{ padding: '16px 16px', fontWeight: '600' }}>₹1,299</td>
									<td style={{ padding: '16px 16px' }}>
										<button onClick={() => alert('Downloading PDF Invoice...')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
											<FileDown size={14} /> Download PDF
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				);

			case "Order Notes":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Fulfillment & Customer Notes</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
							<div style={{ border: '1px solid #f2f4f7', padding: '16px', borderRadius: '8px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#667085', marginBottom: '6px' }}>
									<strong>Order #DZR-8290 (Amit Sharma)</strong>
									<span>10:45 AM</span>
								</div>
								<p style={{ margin: 0, fontSize: '14px', color: '#111' }}>"Please deliver after 6 PM. Gate code is 4920."</p>
							</div>
							<div style={{ border: '1px solid #f2f4f7', padding: '16px', borderRadius: '8px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#667085', marginBottom: '6px' }}>
									<strong>Order #DZR-8289 (Internal Staff Note)</strong>
									<span>09:30 AM</span>
								</div>
								<p style={{ margin: 0, fontSize: '14px', color: '#111' }}>"Customer requested red color instead of orange. Updated SKU."</p>
							</div>
						</div>
					</div>
				);

			case "Bulk Actions":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
						<h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Bulk Orders Operations</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
							<div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert('Slips created.')}>
								<Layers color="#ff6600" size={24} style={{ margin: '0 auto 12px auto' }} />
								<strong>Print Packing Slips</strong>
								<p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#667085' }}>Bulk print for 14 pending orders</p>
							</div>
							<div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert('Bulk shipped.')}>
								<Truck color="#ff6600" size={24} style={{ margin: '0 auto 12px auto' }} />
								<strong>Mark as Shipped</strong>
								<p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#667085' }}>Update 8 packed orders to Shipped</p>
							</div>
						</div>
					</div>
				);

			case "Order Export":
				return (
					<div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px' }}>
						<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Export Orders Log</h3>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Select Date Range</label>
								<select style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
									<option>This Month (July 2026)</option>
									<option>Last Month (June 2026)</option>
									<option>Custom Range</option>
								</select>
							</div>
							<div>
								<label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Export Format</label>
								<select style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
									<option>Excel Workbook (.xlsx)</option>
									<option>CSV Comma Separated (.csv)</option>
								</select>
							</div>
							<button onClick={() => alert('Orders exported successfully!')} style={{ padding: '10px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
								Download Orders Data
							</button>
						</div>
					</div>
				);

			case "All Orders":
			default:
				return (
					<div>
						<section className="admin-orders-panel border border-[#dfe7f3] bg-white rounded-xl overflow-hidden">
							<div className="admin-orders-filters grid gap-3 border-b border-[#e7edf7] p-4 xl:grid-cols-[1.4fr_0.8fr_auto_auto]">
								<div className="relative flex-1">
									<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by order ID, customer, item or payment" className="h-10 border-[#d6dfed] bg-white pl-11 pr-4 text-sm text-slate-900" />
								</div>

								<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 border border-[#d6dfed] bg-white px-3 text-sm text-slate-700 outline-none">
									{statusFilters.map((filter) => <option key={filter.value} value={filter.value}>
										{filter.label}
									</option>)}
								</select>

								<div className="flex items-center text-sm text-slate-500">{loading ? "Loading..." : `${filteredOrders.length} orders`}</div>

								<button type="button" onClick={() => void fetchOrders()} className="admin-primary-button">
									<RefreshCcw size={18} />
									Refresh Data
								</button>
							</div>
						</section>

						{loading ? <div className="border border-[#dfe7f3] bg-white p-8 text-center text-sm text-slate-500">
							Loading orders...
						</div> : filteredOrders.length === 0 ? <div className="border border-[#dfe7f3] bg-white p-8 text-center text-sm text-slate-500">
							No matching orders found.
						</div> : <section className="admin-orders-table-panel overflow-hidden border border-[#dfe7f3] bg-white mt-6">
							<div className="admin-orders-table-wrap overflow-x-auto">
								<table className="admin-orders-table">
									<thead className="bg-[#f8fafc]">
										<tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
											<th className="px-4 py-3">Order</th>
											<th className="px-4 py-3">Placed</th>
											<th className="px-4 py-3">Customer</th>
											<th className="px-4 py-3">Product</th>
											<th className="px-4 py-3">Amount</th>
											<th className="px-4 py-3">Payment</th>
											<th className="px-4 py-3">Delivery</th>
											<th className="px-4 py-3">Status</th>
											<th className="px-4 py-3">Action</th>
										</tr>
									</thead>
									<tbody>
										{filteredOrders.map((order, index) => {
											const firstItem = order.items[0];
											return <tr key={order.id} className={cn("border-t border-[#e7edf7] align-top transition hover:bg-[#fbfdff]", index === 0 && "border-t-0")}>
												<td className="px-4 py-3">
													<div className="flex items-center gap-2">
														<button type="button" onClick={() => void handleCopy(order.order_number)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff6600]">
															{order.order_number}
															<Copy className="h-3.5 w-3.5" />
														</button>
													</div>
												</td>
												<td className="px-4 py-3 text-sm text-slate-600">{formatOrderDate(order.created_at, true)}</td>
												<td className="px-4 py-3">
													<p className="text-sm font-semibold text-slate-950">{getCustomerName(order)}</p>
													<p className="mt-1 text-sm text-slate-500">{order.address_data.phone || order.address_data.email || "-"}</p>
												</td>
												<td className="px-4 py-3">
													<div className="min-w-0">
														<p className="text-sm font-semibold text-slate-950">{firstItem?.name || "Order item"}</p>
														<p className="mt-1 text-sm text-slate-500">
															{firstItem?.brand || "Product"}
															{order.items.length > 1 ? ` and ${order.items.length - 1} more item${order.items.length > 2 ? "s" : ""}` : ""}
														</p>
													</div>
												</td>
												<td className="px-4 py-3">
													<p className="text-sm font-semibold text-slate-950">{Number(order.total_price || 0).toLocaleString()} Rs</p>
												</td>
												<td className="px-4 py-3">
													<p className="text-sm font-medium text-slate-800">{getPaymentMethodLabel(order.payment_method)}</p>
													<span className={`mt-2 inline-flex border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPaymentStatusBadgeClass(order.payment_status)}`}>
														{getPaymentStatusLabel(order.payment_status)}
													</span>
												</td>
												<td className="px-4 py-3 text-sm text-slate-600">{getDeliveryText(order)}</td>
												<td className="px-4 py-3">
													<span className={`inline-flex border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getOrderStatusBadgeClass(order.status)}`}>
														{getOrderStatusLabel(order.status)}
													</span>
												</td>
												<td className="px-4 py-3">
													<button type="button" onClick={() => navigate(`/admin/orders/${order.id}`)} className="admin-orders-action-button inline-flex border border-[#d6dfed] bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#ff6600] hover:text-[#ff6600]">
														Open
													</button>
												</td>
											</tr>;
										})}
									</tbody>
								</table>
							</div>
						</section>}
					</div>
				);
		}
	};

	return <AdminLayout>
		<style>{adminOrdersStyles}</style>
		<section className="admin-orders-page space-y-6">
			<section className="admin-hero" style={{ marginBottom: '24px' }}>
				<div>
					<h1>{activeSub}</h1>
					<p>View and manage customer orders and fulfillment</p>
				</div>
				{activeSub === "All Orders" && (
					<button className="admin-primary-button" type="button" onClick={() => void fetchOrders()}>
						<RefreshCcw size={18} />
						Refresh Data
					</button>
				)}
			</section>

			{renderOrdersSubContent()}
		</section>
	</AdminLayout>;
};

export default AdminOrders;

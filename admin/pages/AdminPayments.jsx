import {
	cn,
	Button,
	Input,
	formatOrderDate,
	getPaymentStatusLabel,
	getPaymentMethodLabel,
	getPaymentStatusBadgeClass,
	toast,
	apiUrl,
	getAuthHeaders,
} from "../AdminShims";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
	Copy,
	RefreshCcw,
	Search,
	ExternalLink,
	MoreHorizontal,
	CheckCircle,
	XCircle,
	Undo,
	CreditCard,
	DollarSign,
	Clock,
	AlertCircle,
	X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import ExportDropdown from "../components/ExportDropdown";
import AdminLayout from "./AdminLayout";
import "./AdminDashboard.css";

const statusFilters = [
	{ value: "all", label: "All Statuses" },
	{ value: "pending", label: "Pending" },
	{ value: "paid", label: "Paid" },
	{ value: "failed", label: "Failed" },
	{ value: "refunded", label: "Refunded" },
];

const methodFilters = [
	{ value: "all", label: "All Methods" },
	{ value: "cash_on_delivery", label: "Cash on Delivery" },
	{ value: "pesapal", label: "Pesapal" },
	{ value: "razorpay", label: "Razorpay" },
	{ value: "upi", label: "UPI" },
	{ value: "card", label: "Card" },
];

const getCustomerName = (order) =>
	order.address_data?.fullName ||
	`${order.address_data?.firstName || ""} ${order.address_data?.lastName || ""}`.trim() ||
	"Customer";

const adminPaymentsStyles = `
.admin-payments-section {
	width: 100%;
	max-width: 100%;
	min-width: 0;
}

.admin-payments-table-wrap {
	display: block;
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
}

.admin-payments-table {
	width: 100%;
	min-width: 960px;
	border-collapse: collapse;
}

.admin-payments-table thead {
	background: #f8fafc;
	border-bottom: 1px solid #e2e8f0;
	color: #475569;
}

.admin-payments-table th {
	font-size: 13px;
	font-weight: 700;
	padding: 14px 16px;
	text-align: left;
}

.admin-payments-table td {
	padding: 14px 16px;
	font-size: 13px;
	line-height: 1.45;
	vertical-align: middle;
	border-bottom: 1px solid #f1f5f9;
}

.payment-action-wrap {
	display: flex;
	align-items: center;
	gap: 6px;
	position: relative;
}

.payment-action-wrap > button,
.payment-menu-trigger {
	display: inline-flex;
	min-width: 32px;
	height: 32px;
	align-items: center;
	justify-content: center;
	border: 1px solid #d6dfed;
	border-radius: 6px;
	background: #ffffff;
	color: #334155;
	cursor: pointer;
	transition: all 0.15s ease;
}

.payment-action-wrap > button:hover,
.payment-menu-trigger:hover {
	border-color: #ff6600;
	color: #ff6600;
	background: #fff7ed;
}

.payment-status-menu {
	position: absolute;
	top: 38px;
	right: 0;
	z-index: 50;
	width: 150px;
	border: 1px solid #cbd5e1;
	border-radius: 8px;
	background: #ffffff;
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
	padding: 4px;
}

.payment-status-menu.is-above {
	top: auto;
	bottom: 38px;
}

.payment-status-menu button {
	width: 100%;
	border: none;
	background: transparent;
	padding: 8px 10px;
	border-radius: 6px;
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	font-weight: 500;
	color: #334155;
	cursor: pointer;
	text-align: left;
}

.payment-status-menu button:hover {
	background: #f1f5f9;
	color: #0f172a;
}
`;

const AdminPayments = () => {
	const navigate = useNavigate();

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [methodFilter, setMethodFilter] = useState("all");
	const [openMenuId, setOpenMenuId] = useState(null);

	const deferredSearchQuery = useDeferredValue(searchQuery);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const res = await fetch(apiUrl("/admin/orders"), {
				headers: getAuthHeaders(),
			});
			const data = await res.json();

			if (!res.ok) {
				toast.error(data?.message || "Failed to load payments");
				setOrders([]);
				return;
			}

			setOrders(Array.isArray(data) ? data : []);
		} catch {
			toast.error("Error loading payments data");
			setOrders([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const filteredOrders = useMemo(() => {
		const q = deferredSearchQuery.toLowerCase();

		return orders.filter((o) => {
			const matchQuery =
				!q ||
				[
					o.order_number,
					o.payment_reference,
					getCustomerName(o),
					o.address_data?.email,
				]
					.join(" ")
					.toLowerCase()
					.includes(q);

			const matchStatus =
				statusFilter === "all" || o.payment_status === statusFilter;

			const matchMethod =
				methodFilter === "all" || o.payment_method === methodFilter;

			return matchQuery && matchStatus && matchMethod;
		});
	}, [orders, deferredSearchQuery, statusFilter, methodFilter]);

	const totalVolume = useMemo(() => {
		return orders.reduce((sum, o) => sum + Number(o.total_price || o.total_amount || 0), 0);
	}, [orders]);

	const paidCount = useMemo(() => {
		return orders.filter(o => o.payment_status === 'paid').length;
	}, [orders]);

	const pendingFailedCount = useMemo(() => {
		return orders.filter(o => o.payment_status !== 'paid').length;
	}, [orders]);

	const handleUpdateStatus = async (order, status) => {
		setUpdatingId(order.id);
		setOpenMenuId(null);

		try {
			await fetch(apiUrl(`/admin/orders/${order.id}`), {
				method: "PUT",
				headers: getAuthHeaders(true),
				body: JSON.stringify({ payment_status: status }),
			});

			toast.success(`Payment status updated to ${status}`);
			fetchOrders();
		} catch {
			toast.error("Failed to update payment status");
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<AdminLayout>
			<style>{adminPaymentsStyles}</style>

			<div className="dashboard-wrapper">
				{/* Unified Card Container */}
				<div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
					
					{/* Header Row */}
					<div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6', gap: '16px', flexWrap: 'wrap' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
							<div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '8px', background: '#fff0e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6600' }}>
								<CreditCard size={20} />
							</div>
							<div>
								<h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Payment Transactions</h4>
								<p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>Track customer payments, transaction gateway references, and settlements</p>
							</div>
						</div>

						<div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
							<ExportDropdown
								fileName="Payments_Report"
								title="Payment Transactions & Status"
								buttonLabel="Export Payments"
								headers={['Order No', 'Customer', 'Email', 'Payment Ref', 'Payment Method', 'Amount', 'Payment Status', 'Date']}
								rows={filteredOrders.map((o) => [
									o.order_number || '',
									getCustomerName(o),
									o.address_data?.email || '',
									o.payment_reference || '-',
									getPaymentMethodLabel(o.payment_method) || o.payment_method || '',
									`₹${Number(o.total_price || o.total_amount || 0).toLocaleString()}`,
									getPaymentStatusLabel(o.payment_status) || o.payment_status || '',
									formatOrderDate(o.created_at, true) || ''
								])}
							/>
							<button
								type="button"
								onClick={fetchOrders}
								style={{
									background: '#ff6600',
									color: '#fff',
									border: 'none',
									padding: '8px 16px',
									borderRadius: '6px',
									fontSize: '13px',
									fontWeight: '600',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									gap: '6px',
									boxShadow: '0 2px 6px rgba(255, 102, 0, 0.25)'
								}}
							>
								<RefreshCcw size={15} /> Refresh Data
							</button>
						</div>
					</div>

					{/* 4 KPI Summary Bar */}
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#eef2f6', borderBottom: '1px solid #eef2f6' }}>
						<div style={{ padding: '16px 24px', background: '#fff' }}>
							<span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Total Transactions</span>
							<h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#111' }}>{orders.length}</h3>
						</div>
						<div style={{ padding: '16px 24px', background: '#fff' }}>
							<span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Total Volume</span>
							<h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#2563eb' }}>₹ {totalVolume.toLocaleString()}</h3>
						</div>
						<div style={{ padding: '16px 24px', background: '#fff' }}>
							<span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
								<div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> Paid Transactions
							</span>
							<h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#16a34a' }}>{paidCount}</h3>
						</div>
						<div style={{ padding: '16px 24px', background: '#fff' }}>
							<span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
								<div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></div> Pending / Failed
							</span>
							<h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '700', color: '#dc2626' }}>{pendingFailedCount}</h3>
						</div>
					</div>

					{/* Search & Filter Controls Bar */}
					<div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid #eef2f6', flexWrap: 'wrap', gap: '12px' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
							{/* Search Box */}
							<div style={{ position: 'relative', width: '280px' }}>
								<Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search order, customer, ref..."
									style={{
										width: '100%',
										padding: '7px 12px 7px 32px',
										borderRadius: '6px',
										border: '1px solid #cbd5e1',
										fontSize: '13px',
										outline: 'none',
										background: '#fff',
										boxSizing: 'border-box'
									}}
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
									>
										<X size={14} />
									</button>
								)}
							</div>

							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								style={{ padding: '7px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', color: '#334155', cursor: 'pointer' }}
							>
								{statusFilters.map((s) => (
									<option key={s.value} value={s.value}>
										{s.label}
									</option>
								))}
							</select>

							<select
								value={methodFilter}
								onChange={(e) => setMethodFilter(e.target.value)}
								style={{ padding: '7px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', color: '#334155', cursor: 'pointer' }}
							>
								{methodFilters.map((m) => (
									<option key={m.value} value={m.value}>
										{m.label}
									</option>
								))}
							</select>

							{(searchQuery || statusFilter !== "all" || methodFilter !== "all") && (
								<button
									type="button"
									onClick={() => {
										setSearchQuery("");
										setStatusFilter("all");
										setMethodFilter("all");
									}}
									style={{
										background: 'none',
										border: 'none',
										color: '#dc2626',
										fontSize: '12px',
										fontWeight: '600',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										gap: '4px'
									}}
								>
									<X size={13} /> Reset Filters
								</button>
							)}
						</div>

						<div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
							Showing <strong style={{ color: '#0f172a' }}>{filteredOrders.length}</strong> of {orders.length} transactions
						</div>
					</div>

					{/* Payments Table */}
					<div className="admin-payments-table-wrap">
						<table className="admin-payments-table">
							<thead>
								<tr>
									<th>Order ID</th>
									<th>Date</th>
									<th>Customer</th>
									<th>Amount</th>
									<th>Method</th>
									<th>Status</th>
									<th>Gateway Ref</th>
									<th style={{ textAlign: 'center' }}>Actions</th>
								</tr>
							</thead>

							<tbody>
								{loading ? (
									<tr>
										<td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
											Loading payment records...
										</td>
									</tr>
								) : filteredOrders.length === 0 ? (
									<tr>
										<td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
											No payment transactions found.
										</td>
									</tr>
								) : (
									filteredOrders.map((o, index) => (
										<tr key={o.id} style={{ transition: 'background 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fcfdfd'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
											<td>
												<button
													onClick={() => navigate(`/admin/orders/${o.id}`)}
													style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '13px', padding: 0, cursor: 'pointer' }}
												>
													{o.order_number || `#${o.id}`}
												</button>
											</td>
											<td style={{ color: '#64748b' }}>{formatOrderDate(o.created_at)}</td>
											<td>
												<div style={{ fontWeight: '600', color: '#1e293b' }}>{getCustomerName(o)}</div>
												<div style={{ color: '#64748b', fontSize: '11px' }}>{o.address_data?.email || '-'}</div>
											</td>
											<td style={{ fontWeight: '700', color: '#0f172a' }}>
												₹{Number(o.total_price || o.total_amount || 0).toLocaleString()}
											</td>
											<td>
												<span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
													{getPaymentMethodLabel(o.payment_method) || o.payment_method || 'Online'}
												</span>
											</td>

											<td>
												<span className={getPaymentStatusBadgeClass(o.payment_status)}>
													{getPaymentStatusLabel(o.payment_status)}
												</span>
											</td>

											<td style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>
												{o.payment_reference || "-"}
											</td>

											<td style={{ textAlign: 'center' }}>
												<div className="payment-action-wrap" style={{ justifyContent: 'center' }}>
													<button
														onClick={() => navigate(`/admin/orders/${o.id}`)}
														title="View Order Details"
													>
														<ExternalLink size={14} />
													</button>

													<div className="relative">
														<button
															type="button"
															className="payment-menu-trigger"
															title="Update Status"
															onClick={() => setOpenMenuId((current) => current === o.id ? null : o.id)}
														>
															<MoreHorizontal size={15} />
														</button>

														{openMenuId === o.id && (
															<div className={`payment-status-menu ${index >= filteredOrders.length - 2 ? "is-above" : ""}`}>
																<button
																	type="button"
																	onClick={() => handleUpdateStatus(o, "paid")}
																>
																	<CheckCircle size={14} style={{ color: '#16a34a' }} />
																	Mark as Paid
																</button>

																<button
																	type="button"
																	onClick={() => handleUpdateStatus(o, "failed")}
																>
																	<XCircle size={14} style={{ color: '#dc2626' }} />
																	Mark as Failed
																</button>

																<button
																	type="button"
																	onClick={() => handleUpdateStatus(o, "refunded")}
																>
																	<Undo size={14} style={{ color: '#ea580c' }} />
																	Refunded
																</button>
															</div>
														)}
													</div>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default AdminPayments;

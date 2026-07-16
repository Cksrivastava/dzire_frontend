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
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const statusFilters = [
	{ value: "all", label: "All payments" },
	{ value: "pending", label: "Pending" },
	{ value: "paid", label: "Paid" },
	{ value: "failed", label: "Failed" },
	{ value: "refunded", label: "Refunded" },
];

const methodFilters = [
	{ value: "all", label: "All methods" },
	{ value: "cash_on_delivery", label: "Cash on Delivery" },
	{ value: "pesapal", label: "Pesapal" },
	{ value: "razorpay", label: "Razorpay" },
];

const getCustomerName = (order) =>
	order.address_data.fullName ||
	`${order.address_data.firstName || ""} ${order.address_data.lastName || ""}`.trim() ||
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
	width: max-content !important;
	min-width: 1500px !important;
	max-width: none !important;
	border-collapse: collapse;
	table-layout: auto !important;
}

.admin-payments-table thead {
	background: #ff6600;
	color: #ffffff;
}

.admin-payments-table th {
	font-size: 15px;
	font-weight: 700;
	letter-spacing: 0.01em;
}

.admin-payments-table th,
.admin-payments-table td {
	padding: 14px 16px;
	font-size: 14px;
	line-height: 1.45;
	vertical-align: middle;
	white-space: nowrap;
	border-bottom: 1px solid #edf2fa;
}

.admin-payments-table td:nth-child(3),
.admin-payments-table td:nth-child(7){
	white-space: normal;
	overflow-wrap: anywhere;
}

.admin-payments-table th:nth-child(1),
.admin-payments-table td:nth-child(1){min-width:180px;}

.admin-payments-table th:nth-child(2),
.admin-payments-table td:nth-child(2){min-width:170px;}

.admin-payments-table th:nth-child(3),
.admin-payments-table td:nth-child(3){min-width:240px;}

.admin-payments-table th:nth-child(4),
.admin-payments-table td:nth-child(4){min-width:150px;}

.admin-payments-table th:nth-child(5),
.admin-payments-table td:nth-child(5){min-width:190px;}

.admin-payments-table th:nth-child(6),
.admin-payments-table td:nth-child(6){min-width:160px;}

.admin-payments-table th:nth-child(7),
.admin-payments-table td:nth-child(7){min-width:320px;}

.admin-payments-table th:nth-child(8),
.admin-payments-table td:nth-child(8){min-width:190px;}

.admin-payments-toolbar {
	display: flex;
	gap: 10px;
	align-items: center;
	flex-wrap: wrap;
}

.admin-payments-toolbar input {
	min-width: 260px;
	flex: 1 1 300px;
}

.admin-payments-toolbar select,
.admin-payments-toolbar button:not(.admin-primary-button) {
	min-height: 40px;
	border: 1px solid #d6dfed;
	border-radius: 8px;
	background: #ffffff;
	padding: 0 12px;
	font-size: 14px;
	color: #334155;
}

.payment-action-wrap{
	display:flex;
	align-items:center;
	gap:6px;
	position: relative;
}

.payment-action-wrap > button,
.payment-menu-trigger {
	display: inline-flex;
	min-width: 36px;
	height: 36px;
	align-items: center;
	justify-content: center;
	border: 1px solid #d6dfed;
	border-radius: 8px;
	background: #ffffff;
	color: #334155;
}

.payment-action-wrap > button:hover,
.payment-menu-trigger:hover {
	border-color: #ff6600;
	color: #ff6600;
}

.payment-status-menu {
	position: absolute;
	top: 42px;
	right: 0;
	z-index: 50;
	width: 170px;
	border: 1px solid #ff6600;
	border-radius: 6px;
	background: #ffffff;
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
	padding: 4px;
}

.payment-status-menu.is-above {
	top: auto;
	bottom: 42px;
}

.payment-status-menu button {
	width: 100%;
	border-color: transparent;
	justify-content: flex-start;
}

.payment-status-menu button:hover {
	border-color: rgba(255, 102, 0, 0.25);
	color: #ff6600;
}

@media (max-width: 860px) {
	.admin-payments-table {
		min-width: 1450px !important;
	}

	.admin-payments-toolbar {
		align-items: stretch;
		flex-direction: column;
	}

	.admin-payments-toolbar input,
	.admin-payments-toolbar select,
	.admin-payments-toolbar button:not(.admin-primary-button) {
		width: 100%;
		min-width: 0;
	}
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
			const res = await fetch(apiUrl("/admin/orders"), {
				headers: getAuthHeaders(),
			});
			const data = await res.json();

			if (!res.ok) {
				toast.error(data?.message || "Failed");
				setOrders([]);
				return;
			}

			setOrders(Array.isArray(data) ? data : []);
		} catch {
			toast.error("Error loading");
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
					o.address_data.email,
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

	const handleUpdateStatus = async (order, status) => {
		setUpdatingId(order.id);
		setOpenMenuId(null);

		try {
			await fetch(apiUrl(`/admin/orders/${order.id}`), {
				method: "PUT",
				headers: getAuthHeaders(true),
				body: JSON.stringify({ payment_status: status }),
			});

			toast.success("Updated");
			fetchOrders();
		} catch {
			toast.error("Failed");
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<AdminLayout>
			<style>{adminPaymentsStyles}</style>

			<section className="admin-payments-section space-y-6">
				<section className="admin-hero" style={{ marginBottom: '24px' }}>
					<div>
						<h1>Payments</h1>
						<p>Track transactions, failed payments, and refunds</p>
					</div>
					<button
						className="admin-primary-button"
						type="button"
						onClick={fetchOrders}
					>
						<RefreshCcw size={18} />
						Refresh Data
					</button>
				</section>

				<div className="bg-white p-4 rounded-xl border">

					<div className="admin-payments-toolbar">
						<Input
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search"
						/>

						<select onChange={(e) => setStatusFilter(e.target.value)}>
							{statusFilters.map((s) => (
								<option key={s.value} value={s.value}>
									{s.label}
								</option>
							))}
						</select>

						<select onChange={(e) => setMethodFilter(e.target.value)}>
							{methodFilters.map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</select>

						<Button type="button" onClick={fetchOrders} className="admin-primary-button">
							<RefreshCcw size={18} />
							Refresh Data
						</Button>
					</div>
				</div>

				<div className="bg-white border rounded-xl">
					<div className="admin-payments-table-wrap">
						<table className="admin-payments-table">
							<thead>
								<tr>
									<th>Order</th>
									<th>Date</th>
									<th>Customer</th>
									<th>Amount</th>
									<th>Method</th>
									<th>Status</th>
									<th>Txn</th>
									<th>Action</th>
								</tr>
							</thead>

							<tbody>
								{filteredOrders.map((o, index) => (
									<tr key={o.id}>
										<td>{o.order_number}</td>
										<td>{formatOrderDate(o.created_at)}</td>
										<td>{getCustomerName(o)}</td>
										<td>{o.total_price} Rs</td>
										<td>{getPaymentMethodLabel(o.payment_method)}</td>

										<td>
											<span className={getPaymentStatusBadgeClass(o.payment_status)}>
												{getPaymentStatusLabel(o.payment_status)}
											</span>
										</td>

										<td>{o.payment_reference || "-"}</td>

										<td>
											<div className="payment-action-wrap">

												<button onClick={() => navigate(`/admin/orders/${o.id}`)}>
													<ExternalLink size={14} />
												</button>

												<div className="relative">
													<button
														type="button"
														className="payment-menu-trigger"
														onClick={() => setOpenMenuId((current) => current === o.id ? null : o.id)}
													>
														<MoreHorizontal size={16} />
													</button>

													{openMenuId === o.id ? <div className={`payment-status-menu ${index >= filteredOrders.length - 2 ? "is-above" : ""}`}>
														<button
															type="button"
															onClick={() => handleUpdateStatus(o, "paid")}
															className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
														>
															<CheckCircle size={14} className="text-green-600" />
															Paid
														</button>

														<button
															type="button"
															onClick={() => handleUpdateStatus(o, "failed")}
															className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
														>
															<XCircle size={14} className="text-red-600" />
															Failed
														</button>

														<button
															type="button"
															onClick={() => handleUpdateStatus(o, "refunded")}
															className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
														>
															<Undo size={14} className="text-orange-600" />
															Refunded
														</button>
													</div> : null}
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</AdminLayout>
	);
};

export default AdminPayments;

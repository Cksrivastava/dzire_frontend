import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useMemo, useState } from "react";
import { BellRing, RefreshCcw, Send, ShieldAlert } from "lucide-react";
import ExportDropdown from "../components/ExportDropdown";
import AdminLayout from "./AdminLayout";
const normalizeStockAlertRequest = (item) => {
	const product = item?.product_id && typeof item.product_id === "object" ? item.product_id : null;
	return {
		id: String(item?.id || item?._id || ""),
		product_id: String(item?.product_id?._id || item?.product_id || ""),
		product_name: String(item?.product_name || product?.name || ""),
		product_brand: String(item?.product_brand || product?.brand || ""),
		product_image: String(item?.product_image || product?.image || ""),
		product_stock: Number(item?.product_stock ?? product?.stock ?? 0),
		user_id: item?.user_id ? String(item.user_id?._id || item.user_id) : null,
		name: String(item?.name || ""),
		email: String(item?.email || ""),
		phone: item?.phone ? String(item.phone) : null,
		status: item?.status || "pending",
		email_status: item?.email_status || "pending",
		sms_status: item?.sms_status || "pending",
		created_at: item?.created_at || item?.createdAt || "",
		updated_at: item?.updated_at || item?.updatedAt || "",
		notified_at: item?.notified_at || null,
		email_sent_at: item?.email_sent_at || null,
		sms_sent_at: item?.sms_sent_at || null
	};
};
const formatDateTime = (value) => value ? new Date(value).toLocaleString() : "-";
const isActionableStockAlert = (status) => status !== "notified";
const getRequestTimestamp = (request) => request.updated_at || request.created_at;
const markProductAlertsAsNotified = (alerts, productId) => alerts.map((request) => String(request.product_id) === String(productId) ? {
	...request,
	status: "notified",
	email_status: request.email_status === "pending" ? "sent" : request.email_status,
	updated_at: new Date().toISOString(),
	notified_at: request.notified_at || new Date().toISOString(),
	email_sent_at: request.email_sent_at || new Date().toISOString()
} : request);
const getAlertStatusClass = (status) => {
	if (status === "notified") {
		return "bg-[#eefbf3] text-[#22a35a]";
	}
	if (status === "partially_notified") {
		return "bg-[#fff8e7] text-[#a16207]";
	}
	if (status === "failed") {
		return "bg-[#fff4f4] text-[#e35d6a]";
	}
	return "bg-[#fff2f8] text-[#ec4899]";
};
const getDeliveryStatusClass = (status) => {
	if (status === "sent") {
		return "bg-[#eefbf3] text-[#22a35a]";
	}
	if (status === "failed") {
		return "bg-[#fff4f4] text-[#e35d6a]";
	}
	return "bg-[#fff8e7] text-[#a16207]";
};
const adminStockAlertsStyles = `
.admin-stock-table-wrap {
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
}

.admin-stock-table {
	width: max-content;
	min-width: 1780px;
	table-layout: auto;
}

.admin-stock-table thead {
	background: #ff6600 !important;
	color: #ffffff;
}

.admin-stock-table thead th {
	background: transparent !important;
	color: #ffffff !important;
	font-size: 16px;
	font-weight: 700;
	letter-spacing: 0.01em;
	white-space: nowrap;
}

.admin-stock-table th,
.admin-stock-table td {
	vertical-align: top;
	overflow-wrap: anywhere;
	padding: 14px 16px !important;
}

.admin-stock-table th:nth-child(1),
.admin-stock-table td:nth-child(1) {
	min-width: 190px;
}

.admin-stock-table th:nth-child(2),
.admin-stock-table td:nth-child(2) {
	min-width: 180px;
}

.admin-stock-table th:nth-child(3),
.admin-stock-table td:nth-child(3) {
	min-width: 260px;
}

.admin-stock-table th:nth-child(4),
.admin-stock-table td:nth-child(4) {
	min-width: 170px;
}

.admin-stock-table th:nth-child(5),
.admin-stock-table td:nth-child(5),
.admin-stock-table th:nth-child(7),
.admin-stock-table td:nth-child(7),
.admin-stock-table th:nth-child(9),
.admin-stock-table td:nth-child(9),
.admin-stock-table th:nth-child(11),
.admin-stock-table td:nth-child(11) {
	min-width: 210px;
}

.admin-stock-table th:nth-child(6),
.admin-stock-table td:nth-child(6),
.admin-stock-table th:nth-child(8),
.admin-stock-table td:nth-child(8),
.admin-stock-table th:nth-child(10),
.admin-stock-table td:nth-child(10) {
	min-width: 150px;
}
`;
const NotifyActionCard = ({ group, alertSendingProductId, onNotify }) => {
	const [type, setType] = useState("back_in_stock");
	const [customSubject, setCustomSubject] = useState("");
	const [customMessage, setCustomMessage] = useState("");
	const isSending = alertSendingProductId === group.productId;
	const isBackInStock = type === "back_in_stock";
	const disabled = group.pendingCount === 0 || isBackInStock && group.productStock <= 0 || isSending;
	return <div className="admin-stock-action-card rounded-[24px] border border-[#edf2fa] bg-[#fbfdff] p-4 xl:w-[330px] shrink-0">
		<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Notification Action</p>

		<div className="mt-4 space-y-3">
			<select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-[#ffe0cc] bg-white px-3 py-2.5 text-sm text-slate-700 outline-none border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]">
				<option value="back_in_stock">Back In Stock Alert</option>
				<option value="price_drop">Price Drop Alert</option>
				<option value="custom">Custom Update</option>
			</select>

			{type === "custom" && <>
				<input type="text" placeholder="Email subject line" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} className="w-full rounded-xl border border-[#ffe0cc] bg-white px-3 py-2.5 text-sm text-slate-700 outline-none border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]" />
				<textarea placeholder="What do you want to tell them?" value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} rows={4} className="w-full rounded-xl border border-[#ffe0cc] bg-white px-3 py-2.5 text-sm text-slate-700 outline-none border-[#ff6600] focus:ring-1 focus:ring-[#ff6600]" />
			</>}
		</div>

		<Button type="button" onClick={() => onNotify(group.productId, {
			type,
			customSubject,
			customMessage
		})} disabled={disabled} className="mt-4 h-11 w-full rounded-2xl bg-[#ff6600] text-white hover:bg-[#e65c00] disabled:opacity-60 shadow-lg shadow-orange-100">
			<Send className="h-4 w-4" />
			{isSending ? "Sending..." : `Notify Customers (${group.pendingCount})`}
		</Button>
		{isBackInStock && group.productStock <= 0 && group.pendingCount > 0 ? <p className="mt-3 text-xs text-slate-500">Restock this product first to send Back-In-Stock alerts.</p> : null}
		{type === "custom" && <p className="mt-3 text-[11px] text-slate-400">Custom updates notify anyone tracking this product regardless of current stock.</p>}
	</div>;
};
const AdminStockAlerts = () => {
	const [stockAlerts, setStockAlerts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [alertSendingProductId, setAlertSendingProductId] = useState(null);
	const fetchStockAlerts = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch(apiUrl("/admin/stock-alerts"), { headers: getAuthHeaders(false, "admin") });
			const data = await res.json().catch(() => []);
			const nextAlerts = Array.isArray(data) ? data.map(normalizeStockAlertRequest) : [];
			if (!res.ok) {
				setStockAlerts([]);
				setError(data?.message || "Failed to load stock requests");
				return [];
			}
			setStockAlerts(nextAlerts);
			return nextAlerts;
		} catch (err) {
			console.error(err);
			setStockAlerts([]);
			setError("Failed to load stock requests");
			return [];
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		void fetchStockAlerts();
	}, []);
	const stockAlertGroups = useMemo(() => {
		const groups = new Map();
		stockAlerts.forEach((request) => {
			const existing = groups.get(request.product_id);
			if (existing) {
				existing.requests.push(request);
				existing.pendingCount += isActionableStockAlert(request.status) ? 1 : 0;
				existing.notifiedCount += request.status === "notified" ? 1 : 0;
				existing.failedCount += request.status === "failed" ? 1 : 0;
				existing.productStock = Number(request.product_stock || 0);
				return;
			}
			groups.set(request.product_id, {
				productId: request.product_id,
				productName: request.product_name,
				productBrand: request.product_brand,
				productImage: request.product_image,
				productStock: Number(request.product_stock || 0),
				requests: [request],
				pendingCount: isActionableStockAlert(request.status) ? 1 : 0,
				notifiedCount: request.status === "notified" ? 1 : 0,
				failedCount: request.status === "failed" ? 1 : 0
			});
		});
		return Array.from(groups.values()).sort((a, b) => b.pendingCount - a.pendingCount || b.productId - a.productId);
	}, [stockAlerts]);
	const actionableStockAlertGroups = useMemo(() => stockAlertGroups.filter((group) => group.pendingCount > 0), [stockAlertGroups]);
	const metrics = useMemo(() => ({
		trackedProducts: actionableStockAlertGroups.length,
		pendingRequests: stockAlerts.filter((request) => isActionableStockAlert(request.status)).length,
		notifiedRequests: stockAlerts.filter((request) => request.status === "notified").length,
		failedRequests: stockAlerts.filter((request) => request.status === "failed").length
	}), [actionableStockAlertGroups.length, stockAlerts]);
	const handleNotifyRequests = async (productId, payload = {}) => {
		const normalizedProductId = String(productId);
		setAlertSendingProductId(normalizedProductId);
		try {
			const res = await fetch(apiUrl(`/admin/products/${normalizedProductId}/stock-alerts/notify`), {
				method: "POST",
				headers: getAuthHeaders(true, "admin"),
				body: JSON.stringify(payload)
			});
			const data = await res.json().catch(() => ({}));
			const latestAlerts = await fetchStockAlerts();
			const stillPending = latestAlerts.some((request) => String(request.product_id) === normalizedProductId && isActionableStockAlert(request.status));
			const noPendingMessage = String(data?.message || "").toLowerCase().includes("no pending stock notifications");
			const failedSummary = Array.isArray(data?.failed) ? data.failed.map((item) => {
				const parts = [
					item?.email,
					item?.email_error,
					item?.sms_error
				].filter(Boolean);
				return parts.join(" | ");
			}).filter(Boolean).join("\n") : "";
			if (!res.ok && res.status !== 207) {
				if (noPendingMessage) {
					setStockAlerts((prev) => markProductAlertsAsNotified(prev, normalizedProductId));
					alert("Notifications already sent");
					return;
				}
				if (!stillPending) {
					setStockAlerts((prev) => markProductAlertsAsNotified(prev, normalizedProductId));
					alert(data?.message || "Notifications sent");
					return;
				}
				alert([data?.message || "Could not send stock notifications", failedSummary].filter(Boolean).join("\n\n"));
				return;
			}
			if (!stillPending) {
				setStockAlerts((prev) => markProductAlertsAsNotified(prev, normalizedProductId));
				alert(data?.message || "Notifications sent");
				return;
			}
			alert([data?.message || "Notifications sent", failedSummary].filter(Boolean).join("\n\n"));
		} catch (err) {
			console.error(err);
			alert("Could not send stock notifications");
		} finally {
			setAlertSendingProductId(null);
		}
	};
	return <AdminLayout>
		<style>{adminStockAlertsStyles}</style>
		<div className="admin-stock-alerts-page">
			<section className="admin-hero">
				<div>
					<h1>Notify customers</h1>
					<p>
						Separate workspace for saved stock alerts. Review pending requests, check delivery status, and notify customers once products are restocked.
					</p>
				</div>
				<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
					<ExportDropdown
						fileName="Stock_Alerts_Report"
						title="Customer Stock Notification Requests"
						headers={['Product Name', 'Brand', 'Current Stock', 'Customer Name', 'Customer Email', 'Status', 'Requested At']}
						rows={stockAlerts.map((req) => [
							req.product_name || '',
							req.product_brand || '',
							String(req.product_stock || 0),
							req.name || '',
							req.email || '',
							req.status || '',
							formatDateTime(req.created_at)
						])}
					/>
					<button className="admin-primary-button" type="button" onClick={() => window.location.reload()}>
						<RefreshCcw size={18} />
						Refresh Data
					</button>
				</div>
			</section>

			<section className="admin-stock-metrics grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
				{[
					[
						"Tracked Products",
						metrics.trackedProducts,
						"Products with at least one request",
						"bg-[#fff7f1] text-[#ff6600]"
					],
					[
						"Pending Requests",
						metrics.pendingRequests,
						"Waiting for restock notification",
						"bg-[#fff2f8] text-[#ec4899]"
					],
					[
						"Notified",
						metrics.notifiedRequests,
						"Successfully completed requests",
						"bg-[#eefbf3] text-[#22a35a]"
					],
					[
						"Failed",
						metrics.failedRequests,
						"Need retry or channel fix",
						"bg-[#fff8e7] text-[#a16207]"
					]
				].map(([label, value, hint, accent]) => <div key={String(label)} className="rounded-[26px] border border-[#ffe0cc] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
							<p className="mt-3 text-3xl font-semibold text-slate-900">{Number(value)}</p>
						</div>
						<span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${String(accent)}`}>
							<BellRing className="h-5 w-5" />
						</span>
					</div>
					<p className="mt-4 text-sm text-slate-500">{String(hint)}</p>
				</div>)}
			</section>

			{loading ? <div className="rounded-[26px] border border-[#ffe0cc] bg-white px-5 py-14 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
				Loading stock requests...
			</div> : error ? <div className="rounded-[26px] border border-[#ffd8d8] bg-[#fff8f8] px-5 py-6 text-sm text-rose-700 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
				{error}
			</div> : actionableStockAlertGroups.length === 0 ? <div className="rounded-[26px] border border-dashed border-[#d7e2f3] bg-white px-5 py-16 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
				<ShieldAlert className="mx-auto h-8 w-8 text-slate-300" />
				<p className="mt-4 text-lg font-semibold text-slate-900">No pending stock alert requests</p>
				<p className="mt-2 text-sm text-slate-500">Once new notify requests come in, they will appear here in grouped product cards.</p>
			</div> : <div className="admin-stock-groups space-y-5">
				{actionableStockAlertGroups.map((group) => <section key={group.productId} className="admin-stock-card rounded-[28px] border border-[#ffe0cc] bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
					<div className="admin-stock-card-head flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
						<div className="admin-stock-product flex items-start gap-4">
							<div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-[#edf2fa] bg-[#f8fbff] p-3">
								<img src={getProductImage(group.productImage)} alt={group.productName} className="h-full w-full object-contain" />
							</div>
							<div className="admin-stock-product-copy">
								<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff6600]">Product #{group.productId}</p>
								<h3 className="mt-2 text-2xl font-semibold text-slate-950">{group.productName}</h3>
								<p className="mt-1 text-sm text-slate-500">{group.productBrand}</p>
								<div className="mt-4 flex flex-wrap gap-2">
									<span className={`rounded-full px-3 py-1 text-xs font-semibold ${group.productStock > 0 ? "bg-[#eefbf3] text-[#22a35a]" : "bg-[#fff7f1] text-[#ff6600]"}`}>
										{group.productStock > 0 ? `${group.productStock} in stock` : "Out of stock"}
									</span>
									<span className="rounded-full bg-[#fff7f1] px-3 py-1 text-xs font-semibold text-[#ff6600]">{group.pendingCount} pending</span>
									<span className="rounded-full bg-[#eefbf3] px-3 py-1 text-xs font-semibold text-[#22a35a]">{group.notifiedCount} notified</span>
									{group.failedCount > 0 ? <span className="rounded-full bg-[#fff8e7] px-3 py-1 text-xs font-semibold text-[#a16207]">{group.failedCount} failed</span> : null}
								</div>
							</div>
						</div>

						<NotifyActionCard group={group} alertSendingProductId={alertSendingProductId} onNotify={handleNotifyRequests} />
					</div>

					<div className="admin-table-scroll admin-stock-table-wrap mt-5 overflow-x-auto rounded-[24px] border border-[#edf2fa]">
						<table className="admin-stock-table min-w-full bg-white text-sm">
							<thead className="bg-[#fafcff] text-left text-slate-500">
								<tr>
									<th className="px-4 py-3 font-medium">Customer</th>
									<th className="px-4 py-3 font-medium">DB User ID</th>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Phone</th>
									<th className="px-4 py-3 font-medium">Latest Request</th>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Email Sent At</th>
									<th className="px-4 py-3 font-medium">SMS</th>
									<th className="px-4 py-3 font-medium">SMS Sent At</th>
									<th className="px-4 py-3 font-medium">Status</th>
									<th className="px-4 py-3 font-medium">Notified At</th>
								</tr>
							</thead>
							<tbody>
								{group.requests.map((request) => <tr key={request.id} className="border-t border-[#edf2fa]">
									<td className="px-4 py-3 font-medium text-slate-900">{request.name}</td>
									<td className="px-4 py-3 text-slate-500">{request.user_id ?? "-"}</td>
									<td className="px-4 py-3 text-slate-600">{request.email}</td>
									<td className="px-4 py-3 text-slate-600">{request.phone || "-"}</td>
									<td className="px-4 py-3 text-slate-500">{formatDateTime(getRequestTimestamp(request))}</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getDeliveryStatusClass(request.email_status)}`}>
											{request.email_status}
										</span>
									</td>
									<td className="px-4 py-3 text-slate-500">{formatDateTime(request.email_sent_at)}</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getDeliveryStatusClass(request.sms_status)}`}>
											{request.sms_status}
										</span>
									</td>
									<td className="px-4 py-3 text-slate-500">{formatDateTime(request.sms_sent_at)}</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getAlertStatusClass(request.status)}`}>
											{request.status}
										</span>
									</td>
									<td className="px-4 py-3 text-slate-500">{formatDateTime(request.notified_at)}</td>
								</tr>)}
							</tbody>
						</table>
					</div>
				</section>)}
			</div>}
		</div>
	</AdminLayout>;
};
export default AdminStockAlerts;

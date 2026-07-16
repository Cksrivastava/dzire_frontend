import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Download, Mail, Phone, RefreshCcw, Search, ShieldCheck, SlidersHorizontal, UserPlus, Users2, Trash2, Ban } from "lucide-react";
import AdminLayout from "./AdminLayout";

const USERS_PER_PAGE = 10;

const formatDate = (value) => {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
};

const formatDateTime = (value) => {
	if (!value) return { date: "-", time: "" };
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return { date: "-", time: "" };

	return {
		date: date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		}),
		time: date.toLocaleTimeString("en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false
		})
	};
};

const getDisplayName = (user) => (user.name || user.email || "Unknown").trim();

const isInCurrentMonth = (value) => {
	if (!value) return false;
	const date = new Date(value);
	const now = new Date();
	return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
};

const escapeCsvValue = (value) => {
	const normalized = String(value ?? "");
	return `"${normalized.replace(/"/g, "\"\"")}"`;
};

const formatDateTimeLabel = (value) => {
	const { date, time } = formatDateTime(value);
	return time ? `${date} ${time}` : date;
};

const downloadUsersCsv = (users) => {
	const headers = [
		"Sr No",
		"Registered Date",
		"DB ID",
		"Name",
		"Email",
		"Phone",
		"Role",
		"Gender",
		"City",
		"Verification Status",
		"Deleted At",
		"Email Verified",
		"Phone Verified",
		"Updated At"
	];

	const rows = users.map((user, index) => [
		index + 1,
		formatDateTimeLabel(user.created_at),
		user.id,
		getDisplayName(user),
		user.email || "-",
		user.phone || "-",
		user.role,
		user.gender || "-",
		user.city || "-",
		user.deleted_at ? "Deleted" : user.is_verified ? "Verified" : "Pending",
		formatDateTimeLabel(user.deleted_at),
		user.email_verified ? "Yes" : "No",
		user.phone_verified ? "Yes" : "No",
		formatDate(user.updated_at)
	]);

	const csv = [headers, ...rows].map((row) => row.map((value) => escapeCsvValue(value)).join(",")).join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	const today = new Date().toISOString().slice(0, 10);
	link.href = url;
	link.download = `customers-${today}.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
};

const adminUsersStyles = `
.admin-users-table-wrap {
	display: block;
	width: 100%;
	max-width: 100%;
	overflow-x: auto !important;
	overflow-y: hidden !important;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: thin;
}

.admin-users-table-wrap::-webkit-scrollbar {
	height: 8px;
}

.admin-users-table-wrap::-webkit-scrollbar-thumb {
	background: #cbd5e1;
	border-radius: 999px;
}

.admin-users-table {
	width: 2400px !important;
	min-width: 2400px !important;
	max-width: none !important;
	table-layout: fixed !important;
	border-collapse: collapse;
}

.admin-users-table thead {
	background: #ff6600 !important;
	color: #ffffff;
}

.admin-users-table thead th {
	background: #ff6600 !important;
	color: #ffffff !important;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 0.01em;
	white-space: nowrap;
}

.admin-users-table th,
.admin-users-table td {
	vertical-align: middle;
	white-space: nowrap;
	padding: 11px 12px !important;
	font-size: 13px;
	line-height: 1.35;
	border-bottom: 1px solid #edf2fa;
}

.admin-users-table td:nth-child(4),
.admin-users-table td:nth-child(5),
.admin-users-table td:nth-child(12) {
	white-space: normal;
	overflow-wrap: anywhere;
}

.admin-users-table th:nth-child(1),
.admin-users-table td:nth-child(1) {
	min-width: 75px;
}

.admin-users-table th:nth-child(2),
.admin-users-table td:nth-child(2) {
	min-width: 150px;
}

.admin-users-table th:nth-child(3),
.admin-users-table td:nth-child(3) {
	min-width: 90px;
}

.admin-users-table th:nth-child(4),
.admin-users-table td:nth-child(4) {
	min-width: 180px;
}

.admin-users-table th:nth-child(5),
.admin-users-table td:nth-child(5) {
	min-width: 210px;
}

.admin-users-table th:nth-child(6),
.admin-users-table td:nth-child(6) {
	min-width: 135px;
}

.admin-users-table th:nth-child(7),
.admin-users-table td:nth-child(7),
.admin-users-table th:nth-child(8),
.admin-users-table td:nth-child(8),
.admin-users-table th:nth-child(9),
.admin-users-table td:nth-child(9),
.admin-users-table th:nth-child(10),
.admin-users-table td:nth-child(10) {
	min-width: 115px;
}

.admin-users-table th:nth-child(11),
.admin-users-table td:nth-child(11) {
	min-width: 140px;
}

.admin-users-table th:nth-child(12),
.admin-users-table td:nth-child(12) {
	min-width: 210px;
}

.admin-users-table th:nth-child(13),
.admin-users-table td:nth-child(13) {
	min-width: 120px;
}

.admin-users-table th:nth-child(14),
.admin-users-table td:nth-child(14) {
	min-width: 185px;
}

.admin-users-table .min-w-\\[180px\\] {
	min-width: 150px !important;
}

.admin-users-table .min-w-\\[220px\\] {
	min-width: 180px !important;
}

.admin-users-table .min-w-\\[120px\\] {
	min-width: 100px !important;
}

.admin-users-table td .flex.items-center.gap-2 {
	flex-wrap: nowrap;
	gap: 6px;
}

.admin-users-table td button {
	flex: 0 0 auto;
	border: 1px solid #d6dfed !important;
	background: #ffffff !important;
	color: #334155 !important;
}

.admin-users-table td button:hover:not(:disabled) {
	border-color: #ff6600 !important;
	color: #ff6600 !important;
	background: #fff7f1 !important;
}

@media (max-width: 860px) {
	.admin-users-table {
		width: max-content !important;
		min-width: 2400px !important;
	}

	.admin-users-table {
		width: 2400px !important;
		min-width: 2400px !important;
	}

	.admin-users-table thead th {
		font-size: 12px;
	}

	.admin-users-table th,
	.admin-users-table td {
		padding: 10px 11px !important;
		font-size: 12.5px;
	}
}
`;

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState("customer");
	const [verificationFilter, setVerificationFilter] = useState("all");
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const fetchUsers = async () => {
		setLoading(true);
		setError("");

		try {
			const res = await fetch(apiUrl("/admin/users"), { headers: getAuthHeaders(false, "admin") });
			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				if (isInvalidTokenResponse(res.status, data)) {
					clearStoredSession("admin");
					window.location.href = "/login/admin";
					return;
				}

				setUsers([]);
				setError(data?.message || "Failed to load customers");
				return;
			}

			setUsers(Array.isArray(data) ? data : []);
		} catch (fetchError) {
			console.error(fetchError);
			setUsers([]);
			setError("Failed to load customers");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchUsers();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, roleFilter, verificationFilter]);

	const filteredUsers = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return users.filter((user) => {
			const matchesSearch =
				!query ||
				getDisplayName(user).toLowerCase().includes(query) ||
				(user.email || "").toLowerCase().includes(query) ||
				(user.phone || "").toLowerCase().includes(query) ||
				(user.city || "").toLowerCase().includes(query) ||
				String(user.id).includes(query);

			const matchesRole = roleFilter === "all" || user.role === roleFilter;

			const matchesVerification =
				verificationFilter === "all" ||
				(verificationFilter === "verified" && !user.deleted_at && user.is_verified) ||
				(verificationFilter === "pending" && !user.deleted_at && !user.is_verified) ||
				(verificationFilter === "deleted" && Boolean(user.deleted_at));

			return matchesSearch && matchesRole && matchesVerification;
		});
	}, [roleFilter, searchQuery, users, verificationFilter]);

	const summary = useMemo(() => {
		const customerCount = users.filter((user) => user.role === "customer").length;
		const verifiedCount = users.filter((user) => user.role === "customer" && user.is_verified).length;
		const joinedThisMonth = users.filter((user) => user.role === "customer" && isInCurrentMonth(user.created_at)).length;

		return {
			totalAccounts: users.length,
			customerCount,
			verifiedCount,
			joinedThisMonth
		};
	}, [users]);

	const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
	const currentUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

	const handleBlockUser = async (user) => {
		if (!window.confirm(`Are you sure you want to ${user.is_blocked ? "unblock" : "block"} ${getDisplayName(user)}?`)) return;

		try {
			const res = await fetch(apiUrl(`/admin/users/${user.id}/block`), {
				method: "POST",
				headers: getAuthHeaders(true, "admin"),
				body: JSON.stringify({ action: user.is_blocked ? "unblock" : "block" })
			});

			if (!res.ok) throw new Error("Failed to block/unblock user");

			toast.success(`User ${user.is_blocked ? "unblocked" : "blocked"} successfully`);
			void fetchUsers();
		} catch (e) {
			toast.error("Error updating user status");
		}
	};

	const handleDeleteUser = async (user) => {
		if (!window.confirm(`Are you sure you want to delete ${getDisplayName(user)}?`)) return;

		try {
			const res = await fetch(apiUrl(`/admin/users/${user.id}`), {
				method: "DELETE",
				headers: getAuthHeaders(false, "admin")
			});

			if (!res.ok) throw new Error("Failed to delete user");

			toast.success("User deleted successfully");
			void fetchUsers();
		} catch (e) {
			toast.error("Error deleting user");
		}
	};

	const handleCopy = async (value, label) => {
		if (!value) {
			toast.error(`${label} is not available`);
			return;
		}

		try {
			await navigator.clipboard.writeText(value);
			toast.success(`${label} copied`);
		} catch (copyError) {
			console.error(copyError);
			toast.error(`Could not copy ${label.toLowerCase()}`);
		}
	};

	return (
		<AdminLayout>
			<style>{adminUsersStyles}</style>

			<div className="space-y-6">
				<section className="admin-hero" style={{ marginBottom: '24px' }}>
					<div>
						<div>
							<h1>Customers</h1>
							<p>View and manage registered customer accounts</p>
						</div>
					</div>
					<button type="button" onClick={() => void fetchUsers()} className="admin-primary-button">
						<RefreshCcw size={18} />
						Refresh Data
					</button>
				</section>

				<section className="grid gap-4 xl:grid-cols-4">
					{[
						["All Accounts", summary.totalAccounts, "Every user record", Users2, "bg-[#fff7f1] text-[#ff6600]"],
						["Customers", summary.customerCount, "Customer role only", UserPlus, "bg-[#eefbf3] text-[#22a35a]"],
						["Verified", summary.verifiedCount, "Active customer accounts", ShieldCheck, "bg-[#fff7f1] text-[#ff6600]"],
						["Joined This Month", summary.joinedThisMonth, "New registrations", CalendarDays, "bg-[#fff8eb] text-[#d97706]"]
					].map(([label, value, hint, Icon, accent]) => (
						<div key={String(label)} className="rounded-[26px] border border-[#ffe0cc] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
									<p className="mt-3 text-3xl font-semibold text-slate-900">{Number(value)}</p>
								</div>
								<span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${String(accent)}`}>
									<Icon className="h-5 w-5" />
								</span>
							</div>
							<p className="mt-4 text-sm text-slate-500">{String(hint)}</p>
						</div>
					))}
				</section>

				<section className="overflow-hidden rounded-[28px] border border-[#ffe0cc] bg-white text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.08)] admin-users-table-section">
					<div className="border-b border-[#edf2fa] px-4 py-4 sm:px-5">
						<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6600]">User List</p>
								<h2 className="mt-2 text-2xl font-semibold text-slate-900">Customers</h2>
								<p className="mt-2 text-sm text-slate-500">
									Filtered customer records, registration dates, deleted-account history, status, and contact actions are all served from the live API.
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<Button type="button" variant="outline" onClick={() => setShowFilters((value) => !value)} className="h-11 rounded-2xl border-[#dbe6f6] bg-white px-4 text-slate-700 hover:bg-[#f7fbff]">
									<SlidersHorizontal className="h-4 w-4" />
									Filters
								</Button>

								<Button type="button" onClick={() => downloadUsersCsv(filteredUsers)} disabled={filteredUsers.length === 0} className="h-11 rounded-2xl bg-[#16a34a] px-4 text-white hover:bg-[#15803d] disabled:opacity-60">
									<Download className="h-4 w-4" />
									Export CSV
								</Button>
							</div>
						</div>

						{showFilters ? (
							<div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_220px_220px]">
								<div className="relative">
									<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search customer, email, mobile, city or database ID" className="h-11 border-[#e2e8f5] bg-white pl-9 text-slate-900 placeholder:text-slate-400" />
								</div>

								<select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-11 rounded-2xl border border-[#e2e8f5] bg-white px-3 text-sm text-slate-700 outline-none">
									<option value="customer">Customers</option>
									<option value="all">All roles</option>
									<option value="admin">Admins</option>
								</select>

								<select value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value)} className="h-11 rounded-2xl border border-[#e2e8f5] bg-white px-3 text-sm text-slate-700 outline-none">
									<option value="all">All statuses</option>
									<option value="verified">Verified</option>
									<option value="pending">Pending</option>
									<option value="deleted">Deleted</option>
								</select>
							</div>
						) : null}
					</div>

					{loading ? (
						<div className="grid gap-4 p-5 md:grid-cols-2">
							{Array.from({ length: 4 }).map((_, index) => (
								<div key={index} className="h-28 animate-pulse rounded-[22px] border border-[#edf2fa] bg-[#fafcff]" />
							))}
						</div>
					) : error ? (
						<div className="p-5">
							<div className="rounded-[22px] border border-[#ffd8d8] bg-[#fff8f8] px-5 py-6 text-sm text-rose-700">{error}</div>
						</div>
					) : currentUsers.length === 0 ? (
						<div className="px-5 py-16 text-center">
							<Users2 className="mx-auto h-8 w-8 text-slate-300" />
							<p className="mt-4 text-lg font-semibold text-slate-900">No customers found</p>
							<p className="mt-2 text-sm text-slate-500">Try another filter or search keyword.</p>
						</div>
					) : (
						<>
							<div className="admin-users-table-wrap overflow-x-auto">
								<table className="admin-users-table text-left text-sm">
									<thead className="bg-[#fafcff] text-slate-500">
										<tr>
											<th className="px-4 py-4 font-medium">Sr.No.</th>
											<th className="px-4 py-4 font-medium">Reg. Date & Time</th>
											<th className="px-4 py-4 font-medium">DB ID</th>
											<th className="px-4 py-4 font-medium">Customer</th>
											<th className="px-4 py-4 font-medium">Email ID</th>
											<th className="px-4 py-4 font-medium">Mobile</th>
											<th className="px-4 py-4 font-medium">Role</th>
											<th className="px-4 py-4 font-medium">Gender</th>
											<th className="px-4 py-4 font-medium">City</th>
											<th className="px-4 py-4 font-medium">Status</th>
											<th className="px-4 py-4 font-medium">Deleted At</th>
											<th className="px-4 py-4 font-medium">Verification</th>
											<th className="px-4 py-4 font-medium">Updated</th>
											<th className="px-4 py-4 font-medium">Action</th>
										</tr>
									</thead>

									<tbody>
										{currentUsers.map((user, index) => (
											<tr key={user.id} className="border-t border-[#edf2fa] bg-white transition hover:bg-[#fafcff]">
												<td className="px-4 py-4 text-slate-500">{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>

												<td className="px-4 py-4 font-medium text-slate-900">
													{(() => {
														const registeredAt = formatDateTime(user.created_at);
														return (
															<div className="min-w-[110px]">
																<p>{registeredAt.date}</p>
																<p className="mt-1 text-xs font-normal tracking-[0.14em] text-slate-400">{registeredAt.time || "-"}</p>
															</div>
														);
													})()}
												</td>

												<td className="px-4 py-4 text-[#ff6600]">{user.id}</td>

												<td className="px-4 py-4">
													<div className="min-w-[180px]">
														<p className="font-medium text-slate-900">{getDisplayName(user)}</p>
														<p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{user.role}</p>
													</div>
												</td>

												<td className="px-4 py-4 text-slate-700">{user.email || "-"}</td>
												<td className="px-4 py-4 text-slate-700">{user.phone || "-"}</td>

												<td className="px-4 py-4">
													<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.role === "admin" ? "bg-[#fff7f1] text-[#ff6600]" : "bg-[#fff1f4] text-[#a21caf]"}`}>
														{user.role}
													</span>
												</td>

												<td className="px-4 py-4 text-slate-600">{user.gender || "-"}</td>
												<td className="px-4 py-4 text-slate-600">{user.city || "-"}</td>

												<td className="px-4 py-4">
													<div className="min-w-[120px]">
														<span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.deleted_at ? "bg-[#eef2f7] text-slate-600" : user.is_blocked ? "bg-[#fff4f4] text-[#e35d6a]" : user.is_verified ? "bg-[#eefbf3] text-[#22a35a]" : "bg-[#fff8e7] text-[#a16207]"}`}>
															{user.deleted_at ? "Deleted" : user.is_blocked ? "Blocked" : user.is_verified ? "Active" : "Pending"}
														</span>
													</div>
												</td>

												<td className="px-4 py-4 text-slate-500">{formatDateTimeLabel(user.deleted_at)}</td>

												<td className="px-4 py-4">
													<div className="flex min-w-[220px] flex-wrap gap-2">
														{user.deleted_at ? (
															<span className="rounded-full bg-[#eef2f7] px-2.5 py-1 text-xs font-medium text-slate-600">Not applicable</span>
														) : (
															<>
																<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.email_verified ? "bg-[#eefbf3] text-[#22a35a]" : "bg-[#fff4f4] text-[#e35d6a]"}`}>
																	Email {user.email_verified ? "Yes" : "No"}
																</span>
																<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.phone_verified ? "bg-[#eefbf3] text-[#22a35a]" : "bg-[#fff4f4] text-[#e35d6a]"}`}>
																	Phone {user.phone_verified ? "Yes" : "No"}
																</span>
															</>
														)}
													</div>
												</td>

												<td className="px-4 py-4 text-slate-500">{formatDate(user.updated_at)}</td>

												<td className="px-4 py-4">
													<div className="flex items-center gap-2">
														<button type="button" onClick={() => void handleCopy(user.email, "Email")} disabled={Boolean(user.deleted_at)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6600] text-white transition hover:bg-[#e65c00] disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Copy email for ${getDisplayName(user)}`}>
															<Mail className="h-4 w-4" />
														</button>

														<button type="button" onClick={() => void handleCopy(user.phone, "Phone")} disabled={Boolean(user.deleted_at)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f766e] text-white transition hover:bg-[#0d5f59] disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Copy phone for ${getDisplayName(user)}`}>
															<Phone className="h-4 w-4" />
														</button>

														<button type="button" onClick={() => void handleBlockUser(user)} disabled={Boolean(user.deleted_at) || user.role === "admin"} className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${user.is_blocked ? "bg-[#10b981] hover:bg-[#059669]" : "bg-[#f59e0b] hover:bg-[#d97706]"}`} aria-label={`${user.is_blocked ? "Unblock" : "Block"} ${getDisplayName(user)}`} title={user.is_blocked ? "Unblock user" : "Block user"}>
															<Ban className="h-4 w-4" />
														</button>

														<button type="button" onClick={() => void handleDeleteUser(user)} disabled={Boolean(user.deleted_at) || user.role === "admin"} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef4444] text-white transition hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Delete ${getDisplayName(user)}`} title="Delete user">
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div className="flex flex-col gap-4 border-t border-[#edf2fa] px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
								<p>
									Showing <span className="font-semibold text-slate-900">{currentUsers.length}</span> of{" "}
									<span className="font-semibold text-slate-900">{filteredUsers.length}</span> filtered records
								</p>

								<div className="flex items-center gap-2">
									<Button type="button" variant="outline" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-xl border-[#e2e8f5] bg-white text-slate-700 hover:bg-[#f7fbff]">
										<ChevronLeft className="h-4 w-4" />
									</Button>

									{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
										<button key={page} type="button" onClick={() => setCurrentPage(page)} className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition ${currentPage === page ? "bg-[#ff6600] text-white" : "border border-[#e2e8f5] bg-white text-slate-700"}`}>
											{page}
										</button>
									))}

									<Button type="button" variant="outline" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-xl border-[#e2e8f5] bg-white text-slate-700 hover:bg-[#f7fbff]">
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</>
					)}
				</section>
			</div>
		</AdminLayout>
	);
};

export default AdminUsers;

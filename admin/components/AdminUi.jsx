import { cn, Button, Input, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { Search } from "lucide-react";


const metricToneStyles = {
	ink: "border-[#11181f]/10 bg-[#11181f] text-white",
	gold: "border-[#c7982f]/20 bg-[#f7e6b3] text-[#5c3f05]",
	sage: "border-emerald-200/80 bg-emerald-50 text-emerald-950",
	sky: "border-sky-200/80 bg-sky-50 text-sky-950",
	rose: "border-rose-200/80 bg-rose-50 text-rose-950"
};
const statusToneStyles = {
	success: "border-emerald-200 bg-emerald-50 text-emerald-700",
	warning: "border-amber-200 bg-amber-50 text-amber-700",
	danger: "border-rose-200 bg-rose-50 text-rose-700",
	info: "border-sky-200 bg-sky-50 text-sky-700",
	neutral: "border-stone-200 bg-stone-100 text-stone-700"
};
const inferStatusTone = (value) => {
	const normalized = value.trim().toLowerCase();
	if (normalized.includes("paid") || normalized.includes("published") || normalized.includes("completed") || normalized.includes("delivered") || normalized.includes("confirmed") || normalized.includes("verified") || normalized.includes("default")) {
		return "success";
	}
	if (normalized.includes("pending") || normalized.includes("draft") || normalized.includes("processing") || normalized.includes("hold")) {
		return "warning";
	}
	if (normalized.includes("cancelled") || normalized.includes("inactive") || normalized.includes("failed") || normalized.includes("low")) {
		return "danger";
	}
	if (normalized.includes("admin") || normalized.includes("shipped") || normalized.includes("new")) {
		return "info";
	}
	return "neutral";
};
export const formatAdminCurrency = (value) => {
	const numericValue = Number(value || 0);
	return `${numericValue.toLocaleString()} Rs`;
};
export const formatAdminNumber = (value) => value.toLocaleString();
export const formatAdminDate = (value) => {
	if (!value) {
		return "-";
	}
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(new Date(value));
};
export const formatAdminDateTime = (value) => {
	if (!value) {
		return "-";
	}
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(new Date(value));
};
export const getInitials = (value) => {
	const words = value.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) {
		return "AD";
	}
	return words.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
};
export const safeJsonParse = (value, fallback) => {
	try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
};
export const AdminPanel = ({ children, className }) => <section className={cn("overflow-hidden rounded-[28px] border border-black/5 bg-[#fffdf8]/95 shadow-[0_18px_45px_rgba(56,34,10,0.08)] backdrop-blur", className)}>
    {children}
  </section>;
export const AdminSectionHeading = ({ eyebrow, title, description, action, className }) => <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", className)}>
    <div>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.34em] text-stone-500">{eyebrow}</p> : null}
      <h2 className="mt-2 text-[clamp(1.6rem,2vw,2.45rem)] font-semibold leading-tight text-stone-950">
        {title}
      </h2>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p> : null}
    </div>
    {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
  </div>;
export const AdminMetricCard = ({ label, value, caption, icon: Icon, tone = "ink", className }) => <AdminPanel className={cn("p-5", className)}>
    <div className={cn("rounded-[22px] border p-5", metricToneStyles[tone])}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] opacity-80">{label}</p>
          <p className="mt-4 text-3xl font-semibold">{value}</p>
          {caption ? <p className="mt-3 text-sm leading-6 opacity-80">{caption}</p> : null}
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  </AdminPanel>;
export const AdminStatusBadge = ({ children, tone, className }) => {
	const content = typeof children === "string" ? children : String(children);
	const resolvedTone = tone || inferStatusTone(content);
	return <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize tracking-[0.12em]", statusToneStyles[resolvedTone], className)}>
      {children}
    </span>;
};
export const AdminEmptyState = ({ icon: Icon, title, description, action, className }) => <AdminPanel className={cn("p-8 text-center", className)}>
    <div className="mx-auto flex max-w-md flex-col items-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-stone-100 text-stone-700">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-5 text-xl font-semibold text-stone-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  </AdminPanel>;
export const AdminSearchField = ({ value, onChange, placeholder, className }) => <label className={cn("relative block", className)}>
    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
    <Input value={value} onChange={onChange} placeholder={placeholder} className="h-12 rounded-2xl border-stone-200 bg-white pl-11 text-stone-900 placeholder:text-stone-400" />
  </label>;
export const AdminAvatar = ({ name, subtitle, image, className }) => <div className={cn("flex items-center gap-3", className)}>
    {image ? <img src={image} alt={name} className="h-12 w-12 rounded-2xl border border-black/5 object-cover shadow-sm" /> : <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#11181f] text-sm font-semibold text-white shadow-sm">
        {getInitials(name)}
      </span>}
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-stone-950">{name}</p>
      {subtitle ? <p className="truncate text-xs text-stone-500">{subtitle}</p> : null}
    </div>
  </div>;
export const AdminMiniStat = ({ label, value, icon: Icon, className }) => <div className={cn("rounded-[22px] border border-stone-200 bg-stone-50 px-4 py-4", className)}>
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">{label}</p>
        <p className="mt-2 text-lg font-semibold text-stone-950">{value}</p>
      </div>
      {Icon ? <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-stone-700">
          <Icon className="h-4 w-4" />
        </span> : null}
    </div>
  </div>;
export const adminTableHeaderClass = "whitespace-nowrap px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500";
export const adminTableCellClass = "px-5 py-4 align-top text-sm text-stone-700";

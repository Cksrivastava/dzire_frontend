import { cn, Button, Input, getOrderStatusLabel, getOrderStatusMessage, getOrderStatusBadgeClass, getPaymentStatusLabel, getPaymentStatusBadgeClass, getPaymentMethodLabel, formatOrderDate, AuthShell, toast, apiUrl, getAuthHeaders, getAuthToken, getAuthUser, useAuth, getProductImage, getAudienceMeta, PRODUCT_AUDIENCES, parsePriceInput, PRICE_INPUT_HINT } from "../AdminShims";
import { useEffect, useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";




import AdminLayout from "./AdminLayout";
const statusOptions = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled"
];
const paymentStatusOptions = [
  "pending",
  "paid",
  "failed",
  "refunded"
];
const inputClass = "h-11 w-full rounded-sm border border-[#d7e3f7] bg-white px-3 font-sans text-sm tracking-normal text-slate-900 outline-none focus:border-[#ff6600]";
const textareaClass = "w-full rounded-sm border border-[#d7e3f7] bg-white px-3 py-3 font-sans text-sm tracking-normal text-slate-900 outline-none focus:border-[#ff6600]";
const getCustomerName = (order) => order.address_data.fullName || `${order.address_data.firstName || ""} ${order.address_data.lastName || ""}`.trim() || "Customer";
const getCustomerPhone = (order) => order.address_data.phone || [order.address_data.phoneCode, order.address_data.phoneNumber].filter(Boolean).join(" ") || "-";
const formatMoney = (amount, currency = "Rs") => `${Number(amount || 0).toLocaleString()} ${currency}`;
const toDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 6e4);
  return local.toISOString().slice(0, 16);
};
const toCurrentDateTimeLocal = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 6e4);
  return local.toISOString().slice(0, 16);
};
const getSuggestedUpdateStatus = (value) => statusOptions.includes(String(value || "").trim().toLowerCase()) ? String(value).trim().toLowerCase() : "confirmed";
const createUpdateForm = (status = "confirmed", paymentMethod = "cash_on_delivery") => ({
  status,
  title: status === "custom" ? "" : getOrderStatusLabel(status),
  message: status === "custom" ? "" : getOrderStatusMessage(status, paymentMethod),
  created_at: toCurrentDateTimeLocal(),
  visible_to_customer: true
});
const Section = ({ title, description, children }) => <section className="border border-[#dfe7f3] bg-white">
  <div className="border-b border-[#e7edf7] px-5 py-4">
    <h2 className="font-sans text-[1.05rem] font-semibold tracking-normal text-slate-950">{title}</h2>
    {description ? <p className="mt-1 font-sans text-sm tracking-normal text-slate-500">{description}</p> : null}
  </div>
  <div className="p-5">{children}</div>
</section>;
const AdminOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [metaForm, setMetaForm] = useState({
    status: "confirmed",
    payment_status: "pending",
    confirmed_at: "",
    expected_ship_at: "",
    shipped_at: "",
    expected_delivery_at: "",
    delivered_at: "",
    cancelled_at: "",
    payment_reference: ""
  });
  const [updateForm, setUpdateForm] = useState(createUpdateForm());
  const updateMetaDate = (field, value) => {
    setMetaForm((prev) => {
      const next = {
        ...prev,
        [field]: value
      };
      if (field === "shipped_at" && value && [
        "pending",
        "confirmed",
        "packed"
      ].includes(next.status)) {
        next.status = "shipped";
      } else if (field === "delivered_at" && value && next.status !== "delivered") {
        next.status = "delivered";
      } else if (field === "cancelled_at" && value && next.status !== "cancelled") {
        next.status = "cancelled";
      }
      return next;
    });
  };
  const fetchOrder = async () => {
    if (!id) {
      return;
    }
    try {
      const res = await fetch(apiUrl(`/admin/orders/${id}`), { headers: getAuthHeaders(false, "admin") });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (isInvalidTokenResponse(res.status, data)) {
          clearStoredSession("admin");
          window.location.href = "/login/admin";
          return;
        }
        toast.error(data?.message || "Failed to load order");
        navigate("/admin/orders");
        return;
      }
      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void fetchOrder();
  }, [id]);
  useEffect(() => {
    if (!order) {
      return;
    }
    setMetaForm({
      status: order.status,
      payment_status: order.payment_status,
      confirmed_at: toDateTimeLocal(order.confirmed_at || order.created_at),
      expected_ship_at: toDateTimeLocal(order.expected_ship_at),
      shipped_at: toDateTimeLocal(order.shipped_at),
      expected_delivery_at: toDateTimeLocal(order.expected_delivery_at),
      delivered_at: toDateTimeLocal(order.delivered_at),
      cancelled_at: toDateTimeLocal(order.cancelled_at),
      payment_reference: order.payment_reference || ""
    });
    setUpdateForm(createUpdateForm(getSuggestedUpdateStatus(order.status), order.payment_method));
  }, [order]);
  const handleCopy = async () => {
    if (!order?.order_number) {
      return;
    }
    try {
      await navigator.clipboard.writeText(order.order_number);
      toast.success("Order ID copied");
    } catch {
      toast.error("Could not copy order ID");
    }
  };
  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    setSavingSettings(true);
    try {
      const payload = {
        ...metaForm,
        confirmed_at: metaForm.confirmed_at || null,
        expected_ship_at: metaForm.expected_ship_at || null,
        shipped_at: metaForm.shipped_at || null,
        expected_delivery_at: metaForm.expected_delivery_at || null,
        delivered_at: metaForm.delivered_at || null,
        cancelled_at: metaForm.cancelled_at || null,
        payment_reference: metaForm.payment_reference.trim()
      };
      const res = await fetch(apiUrl(`/admin/orders/${id}`), {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }
      if (!res.ok) {
        toast.error(data?.message || "Failed to update order");
        return;
      }
      await fetchOrder();
      toast.success("Order details updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order");
    } finally {
      setSavingSettings(false);
    }
  };
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!id || !order) {
      return;
    }
    const trimmedTitle = updateForm.title.trim();
    const trimmedMessage = updateForm.message.trim();
    if (updateForm.status === "custom" && !trimmedTitle) {
      toast.error("Please enter an update title");
      return;
    }
    if (updateForm.status === "custom" && !trimmedMessage) {
      toast.error("Please enter an update message");
      return;
    }
    setSavingUpdate(true);
    try {
      const res = await fetch(apiUrl(`/admin/orders/${id}/updates`), {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(updateForm)
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Failed to save order update");
        return;
      }
      await fetchOrder();
      setUpdateForm(createUpdateForm(getSuggestedUpdateStatus(metaForm.status), order.payment_method));
      toast.success("Order update added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order update");
    } finally {
      setSavingUpdate(false);
    }
  };
  const handleUpdateStatusChange = (nextStatus) => {
    const paymentMethod = order?.payment_method || "cash_on_delivery";
    const nextForm = createUpdateForm(nextStatus, paymentMethod);
    setUpdateForm((current) => ({
      ...current,
      status: nextForm.status,
      title: nextForm.title,
      message: nextForm.message,
      created_at: current.created_at || nextForm.created_at
    }));
  };
  if (loading) {
    return <AdminLayout>
      <div className="border border-[#dfe7f3] bg-white p-10 text-center font-sans text-sm text-slate-500">Loading order...</div>
    </AdminLayout>;
  }
  if (!order) {
    return <AdminLayout>
      <div className="border border-[#dfe7f3] bg-white p-10 text-center font-sans text-sm text-slate-500">Order not found.</div>
    </AdminLayout>;
  }
  const currency = order.currency || "Rs";
  const addressText = [
    order.address_data.addressLine,
    order.address_data.apartment,
    order.address_data.area,
    order.address_data.city,
    order.address_data.district,
    order.address_data.country
  ].filter(Boolean).join(", ") || order.address || "-";
  return <AdminLayout>
    <section className="space-y-5">
      <section className="border border-[#dfe7f3] bg-white p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => navigate("/admin/orders")} className="inline-flex items-center gap-2 rounded-sm border border-[#d6dfed] bg-white px-4 py-2 font-sans text-sm tracking-normal text-slate-700 transition hover:border-[#ff6600] hover:text-[#ff6600]">
              <ArrowLeft className="h-4 w-4" />
              Back to orders
            </button>

            <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 rounded-sm border border-[#d6dfed] bg-white px-4 py-2 font-sans text-sm tracking-normal text-slate-700 transition hover:border-[#ff6600] hover:text-[#ff6600]">
              Copy ID
              <Copy className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-sm border px-3 py-1 font-sans text-sm font-medium tracking-normal ${getOrderStatusBadgeClass(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </span>
            <span className={`rounded-sm border px-3 py-1 font-sans text-sm font-medium tracking-normal ${getPaymentStatusBadgeClass(order.payment_status)}`}>
              {getPaymentStatusLabel(order.payment_status)}
            </span>
          </div>

          <div className="overflow-x-auto pb-1">
            <p className="min-w-max whitespace-nowrap font-sans text-[2rem] font-semibold tracking-normal text-slate-900">
              {order.order_number}
            </p>
          </div>

          <p className="font-sans text-sm tracking-normal text-slate-500">
            {getCustomerName(order)} placed this order on {formatOrderDate(order.created_at, true)}.
          </p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <Section title="Order items" description={`${order.items.length} item${order.items.length === 1 ? "" : "s"} in this order`}>
          <div className="space-y-4">
            {order.items.map((item) => <div key={item.id} className="border border-[#e7edf7] bg-[#fbfdff] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-[#e2e8f0] bg-white p-2">
                    <img src={getProductImage(item.image || "")} alt={item.name} className="h-full w-full object-contain" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {item.brand || "Product"}
                    </p>
                    <p className="mt-1 font-sans text-base font-semibold tracking-normal text-slate-900">{item.name}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="font-sans text-xs uppercase tracking-[0.12em] text-slate-500">Qty</p>
                        <p className="mt-1 font-sans text-sm font-medium tracking-normal text-slate-900">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="font-sans text-xs uppercase tracking-[0.12em] text-slate-500">Unit price</p>
                        <p className="mt-1 font-sans text-sm font-medium tracking-normal text-slate-900">
                          {formatMoney(item.price, currency)}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-xs uppercase tracking-[0.12em] text-slate-500">Line total</p>
                        <p className="mt-1 font-sans text-sm font-medium tracking-normal text-slate-900">
                          {formatMoney(Number(item.price || 0) * Number(item.quantity || 0), currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-[#e2e8f0] bg-white px-4 py-3 lg:min-w-[190px]">
                  <p className="font-sans text-xs uppercase tracking-[0.12em] text-slate-500">Product summary</p>
                  <div className="mt-3 space-y-2 font-sans text-sm tracking-normal text-slate-700">
                    <p>
                      <span className="text-slate-500">Brand:</span> {item.brand || "-"}
                    </p>
                    <p>
                      <span className="text-slate-500">Price:</span> {formatMoney(item.price, currency)}
                    </p>
                    <p>
                      <span className="text-slate-500">Qty:</span> {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>)}
          </div>
        </Section>

        <Section title="Customer details" description="Delivery and payment information">
          <div className="divide-y divide-[#e7edf7] border border-[#e7edf7]">
            <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
              <div>
                <p className="font-sans text-sm tracking-normal text-slate-500">Customer</p>
                <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">{getCustomerName(order)}</p>
              </div>
              <div>
                <p className="font-sans text-sm tracking-normal text-slate-500">Phone</p>
                <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">{getCustomerPhone(order)}</p>
              </div>
            </div>

            {order.address_data.email ? <div className="px-4 py-4">
              <p className="font-sans text-sm tracking-normal text-slate-500">Email</p>
              <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">{order.address_data.email}</p>
            </div> : null}

            <div className="px-4 py-4">
              <p className="font-sans text-sm tracking-normal text-slate-500">Delivery address</p>
              <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">{addressText}</p>
            </div>

            <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
              <div>
                <p className="font-sans text-sm tracking-normal text-slate-500">Payment method</p>
                <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">
                  {getPaymentMethodLabel(order.payment_method)}
                </p>
              </div>
              <div>
                <p className="font-sans text-sm tracking-normal text-slate-500">Payment status</p>
                <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">
                  {getPaymentStatusLabel(order.payment_status)}
                </p>
              </div>
            </div>

            {order.payment_reference && <div className="px-4 pb-4">
              <p className="font-sans text-sm tracking-normal text-slate-500">Payment Reference</p>
              <p className="mt-1 font-sans text-sm font-medium tracking-normal text-slate-900 break-all">
                {order.payment_reference}
              </p>
            </div>}

            <div className="grid gap-4 px-4 py-4 sm:grid-cols-3">
              <div>
                <p className="font-sans text-sm tracking-normal text-slate-500">Subtotal</p>
                <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">{formatMoney(order.subtotal, currency)}</p>
              </div>
              <div>
                <p className="font-sans text-sm tracking-normal text-slate-500">Shipping</p>
                <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">
                  {formatMoney(order.shipping_fee, currency)}
                </p>
              </div>
              <div>
                <p className="font-sans text-sm tracking-normal text-slate-500">Total</p>
                <p className="mt-1 font-sans text-base font-medium tracking-normal text-slate-900">
                  {formatMoney(order.total_price, currency)}
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Order controls" description="Update status, payment state, and dates">
          <form className="space-y-4" onSubmit={handleSettingsSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Order status</span>
                <select value={metaForm.status} onChange={(event) => setMetaForm((prev) => ({
                  ...prev,
                  status: event.target.value
                }))} className={inputClass}>
                  {statusOptions.map((option) => <option key={option} value={option}>
                    {getOrderStatusLabel(option)}
                  </option>)}
                </select>
              </label>

              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Payment status</span>
                <select value={metaForm.payment_status} onChange={(event) => setMetaForm((prev) => ({
                  ...prev,
                  payment_status: event.target.value
                }))} className={inputClass}>
                  {paymentStatusOptions.map((option) => <option key={option} value={option}>
                    {getPaymentStatusLabel(option)}
                  </option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Payment Reference / Txn ID</span>
                <input type="text" value={metaForm.payment_reference} onChange={(event) => setMetaForm((prev) => ({
                  ...prev,
                  payment_reference: event.target.value
                }))} placeholder="E.g., RP_txn_92384" className={inputClass} />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Confirmed</span>
                <input type="datetime-local" value={metaForm.confirmed_at} onChange={(event) => updateMetaDate("confirmed_at", event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Expected ship</span>
                <input type="datetime-local" value={metaForm.expected_ship_at} onChange={(event) => updateMetaDate("expected_ship_at", event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Shipped</span>
                <input type="datetime-local" value={metaForm.shipped_at} onChange={(event) => updateMetaDate("shipped_at", event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Expected delivery</span>
                <input type="datetime-local" value={metaForm.expected_delivery_at} onChange={(event) => updateMetaDate("expected_delivery_at", event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Delivered</span>
                <input type="datetime-local" value={metaForm.delivered_at} onChange={(event) => updateMetaDate("delivered_at", event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Cancelled</span>
                <input type="datetime-local" value={metaForm.cancelled_at} onChange={(event) => updateMetaDate("cancelled_at", event.target.value)} className={inputClass} />
              </label>
            </div>

            <button type="submit" disabled={savingSettings} className="inline-flex h-11 w-full items-center justify-center rounded-sm bg-[#ff6600] px-4 font-sans text-sm font-semibold tracking-normal text-white transition hover:bg-[#e65c00] disabled:cursor-not-allowed disabled:opacity-70">
              {savingSettings ? "Saving..." : "Save order changes"}
            </button>
          </form>
        </Section>

        <Section title="Add order update" description="Share a status note for admin or customer view">
          <form className="space-y-3" onSubmit={handleUpdateSubmit}>
            <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
              <span>Update type</span>
              <select value={updateForm.status} onChange={(event) => handleUpdateStatusChange(event.target.value)} className={inputClass}>
                <option value="custom">Custom update</option>
                {statusOptions.map((option) => <option key={option} value={option}>
                  {getOrderStatusLabel(option)}
                </option>)}
              </select>
            </label>

            <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
              <span>Title</span>
              <input type="text" value={updateForm.title} onChange={(event) => setUpdateForm((prev) => ({
                ...prev,
                title: event.target.value
              }))} placeholder="Order packed" className={inputClass} />
            </label>

            <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
              <span>Message</span>
              <textarea value={updateForm.message} onChange={(event) => setUpdateForm((prev) => ({
                ...prev,
                message: event.target.value
              }))} rows={4} placeholder="Order packed and ready for dispatch." className={textareaClass} />
            </label>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
              <label className="space-y-1.5 font-sans text-sm tracking-normal text-slate-700">
                <span>Update date</span>
                <input type="datetime-local" value={updateForm.created_at} onChange={(event) => setUpdateForm((prev) => ({
                  ...prev,
                  created_at: event.target.value
                }))} className={inputClass} />
              </label>

              <label className="flex items-center gap-3 border border-[#d7e3f7] bg-white px-3 py-3 font-sans text-sm tracking-normal text-slate-700 sm:mt-[26px]">
                <input type="checkbox" checked={updateForm.visible_to_customer} onChange={(event) => setUpdateForm((prev) => ({
                  ...prev,
                  visible_to_customer: event.target.checked
                }))} className="h-4 w-4 rounded border-slate-300 text-[#ff6600] focus:ring-[#ff6600]" />
                Show this update to customer
              </label>
            </div>

          </form>
        </Section>
      </div>

      {order.updates && order.updates.length > 0 && <Section title="Order history" description="Timeline of updates and status changes on this order">
        <div className="space-y-4">
          {order.updates.map((update) => <div key={update.id} className="border-l-2 border-[#d7e3f7] pl-4 pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-sm font-semibold text-slate-900">{update.title}</p>
                {update.message && <p className="mt-1 font-sans text-sm text-slate-700">{update.message}</p>}
              </div>
              <p className="shrink-0 font-sans text-xs text-slate-500">{formatOrderDate(update.created_at, true)}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${getOrderStatusBadgeClass(update.status)}`}>
                {getOrderStatusLabel(update.status)}
              </span>
              {update.visible_to_customer ? <span className="inline-flex rounded-sm bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                Visible to customer
              </span> : <span className="inline-flex rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Hidden from customer
              </span>}
            </div>
          </div>)}
        </div>
      </Section>}
    </section>
  </AdminLayout>;
};
export default AdminOrderDetail;

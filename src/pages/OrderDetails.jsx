import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./OrderDetails.css";
import { orderAPI } from "../services/api";

import {
  DEFAULT_ORDER_ITEMS,
  RETURN_REASONS,
  getOrderStatusConfig,
} from "../data/orderDetailsDefaults";

import OrderHeroCard from "../components/order-details/OrderHeroCard";
import OrderMetaCard from "../components/order-details/OrderMetaCard";
import OrderItemsCard from "../components/order-details/OrderItemsCard";
import OrderRightCol from "../components/order-details/OrderRightCol";
import OrderTrackingCard from "../components/order-details/OrderTrackingCard";
import OrderSupportFooter from "../components/order-details/OrderSupportFooter";
import OrderReturnModal from "../components/order-details/OrderReturnModal";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [copied, setCopied] = useState(false);

  // Use passed state or fall back to exact default values
  const customerName = state?.customerName || "Ananya";
  const email = state?.email || "ananya.patil@email.com";
  const orderId = state?.orderId || "DZIRE2505181024";
  const orderDate = state?.orderDate || "18 May, 2025 • 10:24 AM";
  const paymentStatus = state?.paymentStatus || "Paid";
  const paymentMethod = state?.paymentMethod || "UPI – Google Pay";
  const initialOrderStatus = state?.orderStatus || "In Transit";
  const deliveryDate = state?.deliveryDate || "21 May, 2025";

  const [orderStatus, setOrderStatus] = useState(initialOrderStatus);

  const rawItems = state?.items && state.items.length > 0 ? state.items : DEFAULT_ORDER_ITEMS;

  const items = rawItems.map((item) => ({
    id: item.id || item.name,
    name: item.name,
    spec: item.spec || `${item.color || "Black"} – ${item.size || "Standard"}`,
    price: item.price,
    quantity: item.quantity || 1,
    image: item.image,
  }));

  const subtotal = state?.subtotal || items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = state?.discountAmount !== undefined ? state.discountAmount : 1100;
  const shippingFee = state?.shippingFee !== undefined ? state.shippingFee : 0;
  const grandTotal = state?.grandTotal || Math.max(0, subtotal + shippingFee - discountAmount);

  const address = state?.shippingAddress || {
    name: "Ananya Patil",
    address: "Flat 12, Sai Residency,\nBaner Road, Pune – 411045\nMaharashtra, India",
    phone: "+91 98765 43210",
  };

  const statusConfigs = getOrderStatusConfig(deliveryDate, grandTotal);
  const currentStatusConfig = statusConfigs[orderStatus] || statusConfigs.Delivered;

  const [trackingStage, setTrackingStage] = useState(() => {
    localStorage.removeItem(`dzire_tracking_stage_${orderId}`);
    return currentStatusConfig.stepIndex || 3;
  });

  const handleStepClick = (step) => {
    setTrackingStage(step.id);
    const stepStatusKey = step.title;
    if (statusConfigs[stepStatusKey]) {
      setOrderStatus(stepStatusKey);
    }
    localStorage.setItem(`dzire_tracking_stage_${orderId}`, step.id.toString());
    window.dispatchEvent(new Event("dzire_tracking_updated"));
  };

  useEffect(() => {
    const syncStage = () => {
      const saved = localStorage.getItem(`dzire_tracking_stage_${orderId}`);
      if (saved) {
        setTrackingStage(parseInt(saved, 10));
      }
    };
    syncStage();
    window.addEventListener("storage", syncStage);
    window.addEventListener("dzire_tracking_updated", syncStage);
    return () => {
      window.removeEventListener("storage", syncStage);
      window.removeEventListener("dzire_tracking_updated", syncStage);
    };
  }, [orderId]);

  // Return Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [returnSuccessData, setReturnSuccessData] = useState(null);

  const [returnSubmitted, setReturnSubmitted] = useState(() => {
    try {
      const saved = localStorage.getItem(`dzire_user_submitted_return_${orderId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed && Object.keys(parsed).length > 0;
      }
      return false;
    } catch (e) {
      return false;
    }
  });

  const [firstReturnRecord, setFirstReturnRecord] = useState(() => {
    try {
      const saved = localStorage.getItem(`dzire_user_submitted_return_${orderId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) {
          return Object.values(parsed)[0] || null;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [returnedItemsMap, setReturnedItemsMap] = useState(() => {
    try {
      const saved = localStorage.getItem(`dzire_user_submitted_return_${orderId}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const hasReturnedItems = returnSubmitted;

  useEffect(() => {
    const syncReturns = () => {
      try {
        const saved = localStorage.getItem(`dzire_user_submitted_return_${orderId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Object.keys(parsed).length > 0) {
            setReturnedItemsMap(parsed);
            setFirstReturnRecord(Object.values(parsed)[0] || null);
            setReturnSubmitted(true);
          }
        }
      } catch (e) {}
    };

    window.addEventListener("storage", syncReturns);
    window.addEventListener("dzire_return_submitted", syncReturns);
    return () => {
      window.removeEventListener("storage", syncReturns);
      window.removeEventListener("dzire_return_submitted", syncReturns);
    };
  }, [orderId]);

  const handleOpenReturnModal = (productId) => {
    const availableIds = items.filter((i) => !returnedItemsMap[i.id]).map((i) => i.id);
    if (productId && availableIds.includes(productId)) {
      setSelectedProductIds([productId]);
    } else {
      setSelectedProductIds(availableIds);
    }
    setSelectedReason("");
    setCustomReason("");
    setReturnSuccessData(null);
    setIsReturnModalOpen(true);
  };

  const handleToggleProduct = (id) => {
    if (returnedItemsMap[id]) return;
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const availableIds = items.filter((i) => !returnedItemsMap[i.id]).map((i) => i.id);
    if (selectedProductIds.length === availableIds.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(availableIds);
    }
  };

  const handleCloseReturnModal = () => {
    setIsReturnModalOpen(false);
    setReturnSuccessData(null);
  };

  const handleSubmitReturn = (e) => {
    e.preventDefault();
    if (!selectedProductIds || selectedProductIds.length === 0) {
      alert("Please select at least 1 product to return.");
      return;
    }
    if (!selectedReason) {
      alert("Please select a reason for your return.");
      return;
    }
    if (selectedReason === "other" && !customReason.trim()) {
      alert("Please enter details about your issue in the text box.");
      return;
    }

    const selectedItems = items.filter((i) => selectedProductIds.includes(i.id));
    const targetReasonObj = RETURN_REASONS.find((r) => r.id === selectedReason);

    const generatedReturnId = "RET-" + Math.floor(100000 + Math.random() * 900000);
    const returnRecord = {
      returnId: generatedReturnId,
      orderId,
      productIds: selectedProductIds,
      productNames: selectedItems.map((i) => i.name).join(", "),
      itemCount: selectedItems.length,
      reasonId: selectedReason,
      reasonLabel: targetReasonObj?.label || "Other",
      customReason: customReason.trim(),
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "Pending Approval",
    };

    try {
      const existingReturns = JSON.parse(localStorage.getItem("dzire_returns") || "[]");
      existingReturns.unshift(returnRecord);
      localStorage.setItem("dzire_returns", JSON.stringify(existingReturns));

      const updatedMap = { ...returnedItemsMap };
      selectedProductIds.forEach((id) => {
        updatedMap[id] = returnRecord;
      });
      localStorage.setItem(`dzire_user_submitted_return_${orderId}`, JSON.stringify(updatedMap));
      setReturnedItemsMap(updatedMap);
      setReturnSubmitted(true);
      setFirstReturnRecord(returnRecord);
      window.dispatchEvent(new Event("dzire_return_submitted"));

      // Send to backend
      orderAPI.requestReturn(orderId, {
        reason: returnRecord.reasonLabel,
        resolution: "Refund",
        itemDetails: returnRecord.productNames,
        comments: returnRecord.customReason,
      }).catch((apiErr) => {
        console.warn("Backend return request sync fallback:", apiErr);
      });
    } catch (err) {
      console.error("Error saving return request:", err);
    }

    setReturnSuccessData(returnRecord);
  };

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadInvoice = () => {
    const text = `
========================================
             DZIRE STORE
         OFFICIAL ORDER INVOICE
========================================
Order ID      : ${orderId}
Order Date    : ${orderDate}
Payment Status: ${paymentStatus} (${paymentMethod})
Order Status  : ${orderStatus}

CUSTOMER DETAILS:
Name   : ${address.name}
Phone  : ${address.phone}
Address: ${address.address.replace(/\\n/g, ", ")}

ORDER ITEMS:
${items.map((i) => `- ${i.name} (${i.spec}) x${i.quantity} : ₹${(i.price * i.quantity).toLocaleString("en-IN")}`).join("\n")}

SUMMARY:
Subtotal       : ₹${subtotal.toLocaleString("en-IN")}
Shipping       : ${shippingFee === 0 ? "FREE" : "₹" + shippingFee}
Discount       : -₹${discountAmount.toLocaleString("en-IN")}
----------------------------------------
Total Paid     : ₹${grandTotal.toLocaleString("en-IN")}
========================================
Thank you for shopping with Dzire!
    `;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dz-order-success-page">
      <Navbar />

      <main className="dz-order-success-container">
        {/* TOP HERO THANK YOU SECTION WITH MOUNTAIN ART */}
        <OrderHeroCard
          customerName={customerName}
          email={email}
          onNavigateOrders={() => navigate("/order-history")}
          onNavigateShop={() => navigate("/shop")}
        />

        {/* ORDER META INFO GRID (3 COLUMNS) */}
        <OrderMetaCard
          orderDate={orderDate}
          orderId={orderId}
          copied={copied}
          onCopyOrderId={handleCopyOrderId}
          orderStatus={orderStatus}
          currentStatusConfig={currentStatusConfig}
          paymentStatus={paymentStatus}
          paymentMethod={paymentMethod}
          onDownloadInvoice={handleDownloadInvoice}
        />

        {/* MAIN 2-COLUMN SECTION: ORDER ITEMS (LEFT) + ADDRESS & SUMMARY (RIGHT) */}
        <div className="dz-order-main-grid">
          <OrderItemsCard
            items={items}
            orderStatus={orderStatus}
            hasReturnedItems={hasReturnedItems}
            firstReturnRecord={firstReturnRecord}
            returnedItemsMap={returnedItemsMap}
            deliveryDate={deliveryDate}
            onReturnItemsClick={() => {
              if (hasReturnedItems) {
                navigate("/return-request", {
                  state: {
                    step: 3,
                    returnData: firstReturnRecord,
                  },
                });
              } else {
                navigate("/return-request", { state: { orderId, items } });
              }
            }}
          />

          <OrderRightCol
            address={address}
            itemsCount={items.length}
            subtotal={subtotal}
            shippingFee={shippingFee}
            discountAmount={discountAmount}
            grandTotal={grandTotal}
            onChangeAddress={() => navigate("/cart")}
          />
        </div>

        {/* FULL-WIDTH STEPPER CARD: ORDER STATUS & TRACKING */}
        <OrderTrackingCard
          orderStatus={orderStatus}
          currentStatusConfig={currentStatusConfig}
          trackingStage={trackingStage}
          orderId={orderId}
          hasReturnedItems={hasReturnedItems}
          firstReturnRecord={firstReturnRecord}
          returnedItemsMap={returnedItemsMap}
          items={items}
          address={address}
          grandTotal={grandTotal}
          onStepClick={handleStepClick}
          onTrackReturnClick={() =>
            navigate("/return-request", {
              state: {
                step: 3,
                returnData: firstReturnRecord || {
                  returnId: "RET-000128",
                  orderId: orderId,
                  itemCount: Object.keys(returnedItemsMap).length || 2,
                  date: "18 May, 2025 • 11:30 AM",
                  status: "Return Requested",
                },
              },
            })
          }
          onTrackShipmentClick={() =>
            navigate("/track-order", {
              state: { orderId, awbNumber: "123456789012", items, address, orderStatus },
            })
          }
          onRetryPayment={() => navigate("/cart")}
          onReorder={() => navigate("/shop")}
          onSupport={() => navigate("/support")}
          onViewRefund={() =>
            alert(`Refund Receipt for ${orderId}:\nAmount: ₹${grandTotal}\nProcessed to original payment mode.`)
          }
        />

        {/* FULL-WIDTH SUPPORT & NAVIGATION CARD */}
        <OrderSupportFooter />
      </main>

      {/* RETURN REQUEST POPUP MODAL */}
      <OrderReturnModal
        isOpen={isReturnModalOpen}
        orderId={orderId}
        items={items}
        returnedItemsMap={returnedItemsMap}
        selectedProductIds={selectedProductIds}
        selectedReason={selectedReason}
        customReason={customReason}
        returnSuccessData={returnSuccessData}
        onClose={handleCloseReturnModal}
        onToggleProduct={handleToggleProduct}
        onSelectAll={handleSelectAll}
        onSelectReason={setSelectedReason}
        onChangeCustomReason={setCustomReason}
        onSubmitReturn={handleSubmitReturn}
      />

      <Footer />
    </div>
  );
};

export default OrderDetails;
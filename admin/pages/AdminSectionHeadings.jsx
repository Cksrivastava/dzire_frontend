import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminSectionTitlesView from "../components/AdminSectionTitlesView";
import { CheckCircle2 } from "lucide-react";

const AdminSectionHeadings = () => {
  const [notification, setNotification] = useState("");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  return (
    <AdminLayout>
      <div style={{ padding: "24px 32px 48px 32px", width: "100%", boxSizing: "border-box" }}>
        {/* Floating Toast Notification */}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              backgroundColor: "#FF6600",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(255, 102, 0, 0.4)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              fontSize: "14px"
            }}
          >
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Dedicated Section Titles & Headings View */}
        <AdminSectionTitlesView showToast={showToast} />
      </div>
    </AdminLayout>
  );
};

export default AdminSectionHeadings;

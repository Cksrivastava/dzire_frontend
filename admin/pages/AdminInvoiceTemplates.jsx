import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, FileText } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const AdminInvoiceTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("Clean Minimalist");

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <section className="admin-hero" style={{ marginBottom: '24px' }}>
          <div>
            <h1>Invoice Layout Templates</h1>
            <p>Select print layout templates for automatic customer and POS invoice creations</p>
          </div>
          <button onClick={() => alert('Invoice template saved!')} className="admin-primary-button" style={{ background: '#ff6600' }}>
            <Save size={18} /> Save Template Choice
          </button>
        </section>

        <AdminPanel className="p-6 space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <FileText size={20} style={{ color: '#ff6600' }} />
            <strong>PDF/Print Layout Templates Selection</strong>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Clean Minimalist", "Professional Invoice Structure", "Compact Thermal POS"].map(template => (
              <div
                key={template}
                onClick={() => setSelectedTemplate(template)}
                className="border rounded-xl p-4 cursor-pointer hover:border-[#ff6600] transition flex flex-col justify-between"
                style={{
                  borderColor: selectedTemplate === template ? "#ff6600" : "#e2e8f0",
                  background: selectedTemplate === template ? "#fff8f3" : "transparent"
                }}
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{template}</h4>
                  <p className="text-xs text-slate-500 mt-1">Contains item descriptions, HSN tax breakdowns, CGST/SGST splits, store signature placeholders.</p>
                </div>
                <span className="text-xs font-bold text-[#ff6600] mt-4 block">
                  {selectedTemplate === template ? "✓ Selected Layout" : "Select Layout"}
                </span>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoiceTemplates;

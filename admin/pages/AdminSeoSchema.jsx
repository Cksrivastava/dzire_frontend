import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Terminal, ShieldCheck, CheckCircle2, Play, Code } from 'lucide-react';
import { AdminPanel } from '../components/AdminUi';

const sampleSchemas = [
  {
    id: 1,
    name: 'Organization Schema',
    desc: 'Company profile schema for corporate search results',
    code: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dzire Retail",
  "url": "https://dzire.in",
  "logo": "https://dzire.in/assets/logo.png",
  "sameAs": [
    "https://facebook.com/dzire",
    "https://instagram.com/dzire"
  ]
}`
  },
  {
    id: 2,
    name: 'Product Schema (Template)',
    desc: 'Dynamic template for product catalog listings',
    code: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{product.name}}",
  "image": "{{product.image}}",
  "description": "{{product.description}}",
  "sku": "{{product.sku}}",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "{{product.price}}",
    "availability": "https://schema.org/InStock"
  }
}`
  }
];

const AdminSeoSchema = () => {
  const [schemas, setSchemas] = useState(sampleSchemas);
  const [activeIndex, setActiveIndex] = useState(0);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const activeSchema = schemas[activeIndex];

  const handleValidate = () => {
    try {
      JSON.parse(activeSchema.code.replace(/\{\{[^}]+\}\}/g, 'sample'));
      setValidationSuccess(true);
      setTimeout(() => setValidationSuccess(false), 2000);
    } catch (e) {
      alert('Invalid JSON structure. Please check commas and matching curly braces.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px', alignItems: 'start' }}>
          {/* Schema Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>Structured Data Schemas</h3>
            {schemas.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setActiveIndex(idx)}
                style={{
                  background: activeIndex === idx ? '#eff8ff' : 'white',
                  border: `1px solid ${activeIndex === idx ? '#0284c7' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Code size={16} color={activeIndex === idx ? '#0284c7' : '#667085'} />
                  <strong style={{ fontSize: '14px', color: '#101828' }}>{s.name}</strong>
                </div>
                <span style={{ fontSize: '12px', color: '#667085' }}>{s.desc}</span>
              </div>
            ))}
          </div>

          {/* JSON-LD Editor */}
          <AdminPanel style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>JSON-LD Code Editor</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleValidate}
                  style={{ padding: '6px 12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Play size={12} /> Test Code
                </button>
              </div>
            </div>

            {validationSuccess && (
              <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#047857', fontSize: '13px', fontWeight: '500', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> JSON Schema is structured correctly and parsed successfully!
              </div>
            )}

            <div style={{ position: 'relative', background: '#0f172a', borderRadius: '8px', padding: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <textarea
                value={activeSchema.code}
                onChange={(e) => {
                  const newSchemas = [...schemas];
                  newSchemas[activeIndex].code = e.target.value;
                  setSchemas(newSchemas);
                }}
                rows={15}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#38bdf8',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'Consolas, Monaco, monospace',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  resize: 'vertical'
                }}
              />
            </div>
          </AdminPanel>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSeoSchema;

import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileText, Table2, Check } from 'lucide-react';

/**
 * Reusable ExportDropdown Component
 * @param {string} fileName - Base filename without extension (e.g., 'Purchase_Returns')
 * @param {Array<string>} headers - Column titles array (e.g. ['Date', 'Invoice No', 'Party', 'Amount'])
 * @param {Array<Array<any>>} rows - 2D array of row data
 * @param {string} title - Human readable title for PDF report header
 * @param {function} onExportSuccess - Optional callback when download triggers
 */
const ExportDropdown = ({
  fileName = 'Export_Data',
  headers = [],
  rows = [],
  title = 'Data Report',
  buttonLabel = 'Export',
  buttonStyle = {},
  onExportSuccess = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadedFormat, setDownloadedFormat] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerSuccess = (format) => {
    setDownloadedFormat(format);
    setTimeout(() => setDownloadedFormat(null), 2000);
    setIsOpen(false);
    if (onExportSuccess) {
      onExportSuccess(format);
    }
  };

  // 1. Export to Excel (.xlsx / tab-delimited/csv Excel compatible)
  const handleExportExcel = () => {
    const cleanRows = rows.map((row) =>
      row.map((cell) => {
        const str = String(cell ?? '').replace(/"/g, '""');
        return `"${str}"`;
      })
    );

    const csvContent = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...cleanRows.map((r) => r.join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerSuccess('Excel');
  };

  // 2. Export to CSV (.csv)
  const handleExportCSV = () => {
    const cleanRows = rows.map((row) =>
      row.map((cell) => {
        const str = String(cell ?? '').replace(/"/g, '""');
        return `"${str}"`;
      })
    );

    const csvContent = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...cleanRows.map((r) => r.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerSuccess('CSV');
  };

  // 3. Export to PDF (.pdf printable document)
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocker prevented printing. Please allow popups.');
      return;
    }

    const tableHeadersHtml = headers.map((h) => `<th style="padding: 10px 12px; background: #ff6600; color: #ffffff; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #ea580c; text-align: left;">${h}</th>`).join('');

    const tableRowsHtml = rows.map((r, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = r.map((c) => `<td style="padding: 9px 12px; font-size: 12px; color: #1e293b; border: 1px solid #e2e8f0;">${c}</td>`).join('');
      return `<tr style="background: ${bg};">${cells}</tr>`;
    }).join('');

    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - ${fileName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 24px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #ff6600; padding-bottom: 16px; margin-bottom: 20px; }
          .logo-title { font-size: 22px; font-weight: 800; color: #000; letter-spacing: -0.5px; }
          .logo-highlight { color: #ff6600; }
          .subtitle { font-size: 11px; color: #ff6600; font-weight: 700; margin-top: -3px; }
          .doc-info { text-align: right; font-size: 12px; color: #64748b; }
          .doc-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print {
            body { margin: 0; padding: 12px; }
            button { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo-title">dzire<span class="logo-highlight">&gt;&gt;</span></div>
            <div class="subtitle">OUTDOOR EQUIPMENT STORE</div>
          </div>
          <div class="doc-info">
            <div class="doc-title">${title}</div>
            <div>Generated: ${dateStr}</div>
            <div>Total Records: ${rows.length}</div>
          </div>
        </div>

        <table>
          <thead><tr>${tableHeadersHtml}</tr></thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>

        <div class="footer">
          <div>Dzire Admin Management System &bull; Confidential</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    triggerSuccess('PDF');
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          padding: '7px 14px',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#1e293b',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          ...buttonStyle
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#f8fafc';
          e.currentTarget.style.borderColor = '#94a3b8';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }}
      >
        <Download size={15} color="#ea580c" />
        <span>{buttonLabel}</span>
        <ChevronDown size={14} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.06)',
            width: '210px',
            zIndex: 999,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{ padding: '8px 12px 6px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9' }}>
            Choose Export Format
          </div>

          {/* Option 1: Excel (.xlsx) */}
          <div
            onClick={handleExportExcel}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #f8fafc',
              transition: 'background 0.15s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#f0fdf4')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#dcfce7', color: '#16a34a', padding: '5px', borderRadius: '6px', display: 'flex' }}>
                <FileSpreadsheet size={15} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Excel Sheet</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>.xlsx spreadsheet</div>
              </div>
            </div>
            {downloadedFormat === 'Excel' && <Check size={14} color="#16a34a" />}
          </div>

          {/* Option 2: PDF (.pdf) */}
          <div
            onClick={handleExportPDF}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #f8fafc',
              transition: 'background 0.15s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '5px', borderRadius: '6px', display: 'flex' }}>
                <FileText size={15} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>PDF Document</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>.pdf printable report</div>
              </div>
            </div>
            {downloadedFormat === 'PDF' && <Check size={14} color="#dc2626" />}
          </div>

          {/* Option 3: CSV (.csv) */}
          <div
            onClick={handleExportCSV}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#eff6ff')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#dbeafe', color: '#2563eb', padding: '5px', borderRadius: '6px', display: 'flex' }}>
                <Table2 size={15} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>CSV File</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>.csv raw data</div>
              </div>
            </div>
            {downloadedFormat === 'CSV' && <Check size={14} color="#2563eb" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;

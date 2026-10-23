import React, { useState, useMemo, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import ExportDropdown from "../components/ExportDropdown";
import {
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  X,
  MapPin,
  Tag,
  Star,
  Users,
  IndianRupee,
  Filter,
  UserPlus,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Store,
  Image as ImageIcon,
  ExternalLink,
  Send,
  AlertCircle,
  UploadCloud,
  Upload,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  RotateCcw,
  Type,
  Check,
  FileCode,
  Edit2
} from "lucide-react";
import { allEvents } from "../../src/data/eventsData";

export const EVENTS_STORAGE_KEY = "dzire_admin_events_list";

const EVENT_TYPES = [
  "Indoor Workshop",
  "Outdoor Class",
  "Hands-On Session",
  "Special Event",
  "Trek & Camp",
  "Presenter Choice",
  "Day Trip",
  "Webinar / Online"
];

const PRESET_EVENT_IMAGES = [
  { label: "Backpacking Workshop", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
  { label: "Camping Tent Setup", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80" },
  { label: "Forest Trail Walk", url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80" },
  { label: "Campfire Evening", url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80" },
  { label: "Hiking Expedition", url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80" }
];

// Seed data removed
const INITIAL_EVENTS = [];

// ==========================================
// Rich Text & HTML Source Editor Component
// ==========================================
const EventRichDescriptionEditor = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState("visual"); // 'visual' | 'html'
  const visualEditorRef = useRef(null);
  const htmlTextareaRef = useRef(null);
  const isTypingRef = useRef(false);

  const [fontSize, setFontSize] = useState("15px");
  const [headingTag, setHeadingTag] = useState("p");

  const FONT_SIZES = [
    { label: "11px (Tiny)", val: "11px" },
    { label: "13px (Small)", val: "13px" },
    { label: "15px (Normal)", val: "15px" },
    { label: "18px (Medium)", val: "18px" },
    { label: "22px (Large)", val: "22px" },
    { label: "26px (Extra Large)", val: "26px" },
    { label: "32px (Huge)", val: "32px" }
  ];

  // Sync content into visual contentEditable when not typing
  useEffect(() => {
    if (visualEditorRef.current && !isTypingRef.current) {
      if (visualEditorRef.current.innerHTML !== (value || "")) {
        visualEditorRef.current.innerHTML = value || "";
      }
    }
  }, [value, activeTab]);

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      isTypingRef.current = true;
      const html = visualEditorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isTypingRef.current = false;
      }, 50);
    }
  };

  const execCmd = (cmd, val = null) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand("styleWithCSS", false, true);
      document.execCommand(cmd, false, val);
      const html = visualEditorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Font size apply
  const handleApplyFontSize = (sizeVal) => {
    setFontSize(sizeVal);
    if (activeTab === "html") {
      insertHtmlTag(`<span style="font-size: ${sizeVal};">`, "</span>");
      return;
    }
    if (!visualEditorRef.current) return;
    visualEditorRef.current.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = sizeVal;
    try {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
      sel.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.addRange(newRange);
    } catch {
      document.execCommand("fontSize", false, "4");
    }
    onChange(visualEditorRef.current.innerHTML);
  };

  // Font size step (A- font kam / A+ font jyada)
  const handleStepFontSize = (direction) => {
    const curIdx = FONT_SIZES.findIndex((f) => f.val === fontSize);
    let targetIdx = (curIdx === -1 ? 2 : curIdx) + direction;
    if (targetIdx < 0) targetIdx = 0;
    if (targetIdx >= FONT_SIZES.length) targetIdx = FONT_SIZES.length - 1;
    handleApplyFontSize(FONT_SIZES[targetIdx].val);
  };

  // Heading tag
  const handleApplyHeading = (tag) => {
    setHeadingTag(tag);
    if (activeTab === "html") {
      insertHtmlTag(`<${tag}>`, `</${tag}>`);
      return;
    }
    execCmd("formatBlock", `<${tag}>`);
  };

  // HTML tag insert helper
  const insertHtmlTag = (openTag, closeTag = "") => {
    const textarea = htmlTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const text = value || "";
    const selected = text.substring(start, end);
    const replacement = `${openTag}${selected}${closeTag}`;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    onChange(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 10);
  };

  const charCount = (value || "").replace(/<[^>]*>/g, "").length;
  const wordCount = (value || "").replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {/* Label and Tabs Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>
            Overview & Agenda <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            Format with bold, italic, font sizing, headings, or switch to raw HTML code.
          </span>
        </div>

        {/* Tab switchers */}
        <div style={{ display: "flex", background: "#f1f5f9", padding: "3px", borderRadius: "8px", gap: "3px", border: "1px solid #e2e8f0" }}>
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              border: "none",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              background: activeTab === "visual" ? "#ffffff" : "transparent",
              color: activeTab === "visual" ? "#ff6600" : "#64748b",
              boxShadow: activeTab === "visual" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <Edit2 size={13} />
            <span>Visual Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("html")}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              border: "none",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              background: activeTab === "html" ? "#ffffff" : "transparent",
              color: activeTab === "html" ? "#ff6600" : "#64748b",
              boxShadow: activeTab === "html" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <Code size={13} />
            <span>&lt;/&gt; HTML Source</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div style={{ border: "1px solid #cbd5e1", borderRadius: "10px", overflow: "hidden", background: "#ffffff", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
        {/* VISUAL MODE TOOLBAR */}
        {activeTab === "visual" && (
          <div
            style={{
              background: "#f8fafc",
              padding: "8px 10px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
              position: "relative"
            }}
          >
            {/* Heading Selector */}
            <select
              value={headingTag}
              onChange={(e) => handleApplyHeading(e.target.value)}
              title="Heading Style (Paragraph / H1 / H2 / H3 / Quote)"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: "600",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                background: "#fff",
                color: "#1e293b",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1 (24px)</option>
              <option value="h2">Heading 2 (20px)</option>
              <option value="h3">Heading 3 (16px)</option>
              <option value="blockquote">Quote Block</option>
            </select>

            {/* Font Size Selector (Font Kam / Jyada) */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "1px" }}>
              <select
                value={fontSize}
                onChange={(e) => handleApplyFontSize(e.target.value)}
                title="Font Size (Font ka size select karein)"
                style={{
                  padding: "3px 6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  border: "none",
                  background: "transparent",
                  color: "#1e293b",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                {FONT_SIZES.map((f) => (
                  <option key={f.val} value={f.val}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Font Kam (A-) */}
              <button
                type="button"
                onClick={() => handleStepFontSize(-1)}
                title="Font Kam Karein (Decrease font size)"
                style={{
                  background: "none",
                  border: "none",
                  padding: "3px 6px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#475569"
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                onMouseOut={(e) => (e.currentTarget.style.background = "none")}
              >
                A<sup>-</sup>
              </button>

              {/* Font Jyada (A+) */}
              <button
                type="button"
                onClick={() => handleStepFontSize(1)}
                title="Font Jyada Karein (Increase font size)"
                style={{
                  background: "none",
                  border: "none",
                  padding: "3px 6px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#475569"
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                onMouseOut={(e) => (e.currentTarget.style.background = "none")}
              >
                A<sup>+</sup>
              </button>
            </div>

            <div style={{ width: "1px", height: "18px", background: "#cbd5e1", margin: "0 2px" }} />

            {/* Bold */}
            <button
              type="button"
              onClick={() => execCmd("bold")}
              title="Bold (Ctrl+B) - Mota Font"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <Bold size={14} />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => execCmd("italic")}
              title="Italic (Ctrl+I) - Tirchha Font"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <Italic size={14} />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => execCmd("underline")}
              title="Underline (Ctrl+U) - Neeche Line"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <Underline size={14} />
            </button>

            <div style={{ width: "1px", height: "18px", background: "#cbd5e1", margin: "0 2px" }} />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => execCmd("insertUnorderedList")}
              title="Bullet List (Points)"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <List size={14} />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => execCmd("insertOrderedList")}
              title="Numbered List (1, 2, 3)"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <ListOrdered size={14} />
            </button>

            {/* Align Left */}
            <button
              type="button"
              onClick={() => execCmd("justifyLeft")}
              title="Align Left"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="17" y1="18" x2="3" y2="18" /></svg>
            </button>

            {/* Align Center */}
            <button
              type="button"
              onClick={() => execCmd("justifyCenter")}
              title="Align Center"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="17" y1="12" x2="7" y2="12" /><line x1="19" y1="18" x2="5" y2="18" /></svg>
            </button>

            {/* Align Right */}
            <button
              type="button"
              onClick={() => execCmd("justifyRight")}
              title="Align Right"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#1e293b"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="12" x2="9" y2="12" /><line x1="21" y1="18" x2="7" y2="18" /></svg>
            </button>

            {/* Clear Formatting */}
            <button
              type="button"
              onClick={() => execCmd("removeFormat")}
              title="Clear formatting on selection"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                color: "#64748b",
                fontSize: "11px",
                fontWeight: "600"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>

          </div>
        )}

        {/* HTML MODE HELPER TOOLBAR */}
        {activeTab === "html" && (
          <div
            style={{
              background: "#0f172a",
              padding: "8px 12px",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap"
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", marginRight: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Code size={13} /> Quick Tags:
            </span>

            {[
              { label: "<p>", open: "<p>", close: "</p>" },
              { label: "<strong>", open: "<strong>", close: "</strong>" },
              { label: "<em>", open: "<em>", close: "</em>" },
              { label: "<u>", open: "<u>", close: "</u>" },
              { label: "<h3>", open: "<h3>", close: "</h3>" },
              { label: "<ul><li>", open: "<ul>\n  <li>", close: "</li>\n</ul>" },
              { label: "<ol><li>", open: "<ol>\n  <li>", close: "</li>\n</ol>" },
              { label: "<span font-size>", open: '<span style="font-size: 18px;">', close: "</span>" },
              { label: "<hr/>", open: "<hr/>\n", close: "" },
              { label: "<br/>", open: "<br/>", close: "" }
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => insertHtmlTag(tag.open, tag.close)}
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#cbd5e1",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#334155";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#1e293b";
                  e.currentTarget.style.color = "#cbd5e1";
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        )}

        {/* EDITOR AREA ACCORDING TO ACTIVE TAB */}
        {activeTab === "visual" && (
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={handleVisualInput}
            style={{
              minHeight: "160px",
              maxHeight: "340px",
              overflowY: "auto",
              padding: "12px 16px",
              fontSize: "14px",
              lineHeight: "1.65",
              color: "#1e293b",
              outline: "none",
              background: "#ffffff"
            }}
            placeholder="Type your workshop overview and agenda here..."
          />
        )}

        {activeTab === "html" && (
          <textarea
            ref={htmlTextareaRef}
            rows={8}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write or paste your custom HTML code here (e.g. <h3>Workshop Overview</h3><p>...</p>)"
            style={{
              width: "100%",
              minHeight: "180px",
              maxHeight: "360px",
              padding: "12px 16px",
              fontFamily: "Consolas, Monaco, 'Courier New', monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              background: "#0f172a",
              color: "#f8fafc",
              border: "none",
              boxSizing: "border-box",
              resize: "vertical",
              outline: "none"
            }}
          />
        )}

        {/* BOTTOM METRICS & INSTRUCTIONS BAR */}
        <div
          style={{
            background: activeTab === "html" ? "#090d16" : "#f8fafc",
            padding: "6px 14px",
            borderTop: activeTab === "html" ? "1px solid #1e293b" : "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            color: activeTab === "html" ? "#94a3b8" : "#64748b"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontWeight: "700",
                color: activeTab === "html" ? "#38bdf8" : "#ff6600"
              }}
            >
              {activeTab === "visual"
                ? "✏️ Visual Mode Active"
                : "💻 Raw HTML Mode Active"}
            </span>
            <span>&bull;</span>
            <span>{charCount} Characters</span>
            <span>&bull;</span>
            <span>{wordCount} Words</span>
          </div>

          <div style={{ fontStyle: "italic" }}>
            {activeTab === "visual"
              ? "Select text to change font size, bold, or italic."
              : "Custom HTML tags are directly saved and rendered."}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminEvents = () => {
  const [events, setEvents] = useState(() => {
    return INITIAL_EVENTS;
  });

  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/admin/events")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success && Array.isArray(d.events)) {
          setEvents(d.events);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [notification, setNotification] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Add Attendee inside modal
  const [newAttendeeName, setNewAttendeeName] = useState("");
  const [newAttendeeEmail, setNewAttendeeEmail] = useState("");
  const [newAttendeePhone, setNewAttendeePhone] = useState("");
  const [newAttendeeTickets, setNewAttendeeTickets] = useState(1);

  // Form State (Blank by default for new event creation)
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    slug: "",
    type: "Indoor Workshop",
    date: "",
    time: "10:00 AM",
    duration: "",
    location: "",
    organizer: "",
    price: "",
    isFree: false,
    capacity: "",
    booked: 0,
    description: "",
    image: "",
    status: "Upcoming",
    visibility: "web",
    featured: false
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error("Failed to save events to storage", e);
    }
  }, [events]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        const matchesSearch =
          ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.organizer?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "All" || ev.type === typeFilter;
        const matchesStatus = statusFilter === "All" || ev.status === statusFilter;
        const matchesPrice =
          priceFilter === "All" ||
          (priceFilter === "Free" && ev.isFree) ||
          (priceFilter === "Paid" && !ev.isFree);

        return matchesSearch && matchesType && matchesStatus && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortBy === "bookings") {
          return (b.booked || 0) - (a.booked || 0);
        }
        if (sortBy === "capacity") {
          return (b.capacity || 0) - (a.capacity || 0);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [events, searchQuery, typeFilter, statusFilter, priceFilter, sortBy]);

  // Paginated List
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  // Handle Select All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedEvents.map((ev) => ev.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Create Form (Blank form for fresh entry)
  const handleOpenCreateModal = () => {
    setFormData({
      id: null,
      title: "",
      slug: "",
      type: "Indoor Workshop",
      date: "",
      time: "10:00 AM",
      duration: "",
      location: "",
      organizer: "",
      price: "",
      isFree: false,
      capacity: "",
      booked: 0,
      description: "",
      image: "",
      status: "Upcoming",
      visibility: "web",
      featured: false
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Form (Populate existing event data)
  const handleOpenEditModal = (ev) => {
    setFormData({
      id: ev.id,
      title: ev.title || "",
      slug: ev.slug || "",
      type: ev.type || "Indoor Workshop",
      date: ev.date || "",
      time: ev.time || "10:00 AM",
      duration: ev.duration || "",
      location: ev.location || "",
      organizer: ev.organizer || "",
      price: ev.price || "",
      isFree: !!ev.isFree,
      capacity: ev.capacity || "",
      booked: ev.booked || 0,
      description: ev.description || "",
      image: ev.image || "",
      status: ev.status || "Upcoming",
      visibility: ev.visibility || (ev.status === "Upcoming" ? "web" : "in-store"),
      featured: !!ev.featured
    });
    setIsEditModalOpen(true);
  };

  const fileInputRef = useRef(null);

  // Gallery Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Image size exceeds 15MB. Please choose a smaller image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setFormData((prev) => ({
          ...prev,
          image: dataUrl
        }));
        showToast("Event banner selected from gallery!");
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  // Save Event
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter an event title");
      return;
    }

    const cleanDesc = (formData.description || "").replace(/<[^>]*>/g, "").trim();
    if (!cleanDesc && !formData.description?.trim()) {
      alert("Please enter an Overview & Agenda for the workshop.");
      return;
    }

    const cleanPrice = formData.isFree ? "Free" : formData.price.startsWith("₹") ? formData.price : `₹${formData.price}`;
    const baseSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s-]+/g, "-");
    let candidateSlug = baseSlug;
    let suffix = 1;
    while (events.some((ev) => ev.slug === candidateSlug && ev.id !== formData.id)) {
      candidateSlug = `${baseSlug}-${suffix}`;
      suffix++;
    }
    const slugFormatted = candidateSlug;

    const isWeb = formData.status === "Upcoming";

    if (formData.id) {
      // Edit
      const updatedItem = {
        title: formData.title,
        slug: slugFormatted,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        location: formData.location,
        organizer: formData.organizer,
        price: cleanPrice,
        isFree: formData.isFree,
        capacity: parseInt(formData.capacity, 10) || 25,
        stock: (parseInt(formData.capacity, 10) || 25) - (formData.booked || 0),
        description: formData.description,
        image: formData.image,
        status: formData.status,
        visibility: isWeb ? "web" : "in-store",
        alert: !isWeb,
        featured: formData.featured
      };

      setEvents((prev) =>
        prev.map((ev) => (ev.id === formData.id ? { ...ev, ...updatedItem } : ev))
      );

      fetch(`https://dzire-backend.onrender.com/api/admin/events/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      }).catch(() => {});
      showToast(`Event "${formData.title}" updated successfully!`);
    } else {
      // Create
      const cap = parseInt(formData.capacity, 10) || 25;
      const newEvent = {
        id: Date.now(),
        title: formData.title,
        slug: slugFormatted,
        type: formData.type,
        venueTag: "Dzire Studio",
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        location: formData.location,
        organizer: formData.organizer,
        price: cleanPrice,
        isFree: formData.isFree,
        capacity: cap,
        stock: cap,
        booked: 0,
        description: formData.description,
        image: formData.image || PRESET_EVENT_IMAGES[0].url,
        status: formData.status,
        visibility: isWeb ? "web" : "in-store",
        alert: !isWeb,
        featured: formData.featured,
        attendees: [],
        createdAt: new Date().toISOString()
      };

      setEvents((prev) => [newEvent, ...prev]);

      fetch("https://dzire-backend.onrender.com/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.event) {
            setEvents((prev) => prev.map((ev) => (ev.id === newEvent.id ? d.event : ev)));
          }
        })
        .catch(() => {});
      showToast(`Event "${formData.title}" scheduled successfully!`);
    }

    setIsEditModalOpen(false);
  };

  // Delete Event
  const handleDeleteEvent = (ev) => {
    if (window.confirm(`Are you sure you want to delete event "${ev.title}"?`)) {
      setEvents((prev) => prev.filter((item) => item.id !== ev.id));
      setSelectedIds((prev) => prev.filter((id) => id !== ev.id));
      fetch(`https://dzire-backend.onrender.com/api/admin/events/${ev.id}`, { method: "DELETE" }).catch(() => {});
      showToast(`Deleted event "${ev.title}"`);
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected events?`)) {
      const idsToDelete = [...selectedIds];
      setEvents((prev) => prev.filter((ev) => !idsToDelete.includes(ev.id)));
      setSelectedIds([]);
      fetch("https://dzire-backend.onrender.com/api/admin/events/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      }).catch(() => {});
      showToast("Selected events deleted!");
    }
  };

  // Bulk Publish
  const handleBulkPublish = () => {
    const idsToPublish = [...selectedIds];
    setEvents((prev) =>
      prev.map((ev) =>
        idsToPublish.includes(ev.id)
          ? { ...ev, status: "Upcoming", visibility: "web", alert: false }
          : ev
      )
    );
    setSelectedIds([]);
    fetch("https://dzire-backend.onrender.com/api/admin/events/bulk-publish", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: idsToPublish }),
    }).catch(() => {});
    showToast("Selected events published to Website!");
  };

  // Attendees Modal
  const handleOpenAttendees = (ev) => {
    setSelectedEvent(ev);
    setNewAttendeeName("");
    setNewAttendeeEmail("");
    setNewAttendeePhone("");
    setNewAttendeeTickets(1);
    setIsAttendeesModalOpen(true);
  };

  // Add Attendee
  const handleAddAttendee = (e) => {
    e.preventDefault();
    if (!newAttendeeName.trim() || !selectedEvent) return;

    const ticketsNum = parseInt(newAttendeeTickets, 10) || 1;
    const newAttendee = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      name: newAttendeeName.trim(),
      email: newAttendeeEmail.trim() || "guest@dzire.in",
      phone: newAttendeePhone.trim() || "+91 98000 00000",
      tickets: ticketsNum,
      status: "Confirmed",
      registeredAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      paymentStatus: selectedEvent.isFree ? "Free Pass" : "Paid"
    };

    const updatedEvent = {
      ...selectedEvent,
      booked: (selectedEvent.booked || 0) + ticketsNum,
      stock: Math.max(0, (selectedEvent.stock || selectedEvent.capacity) - ticketsNum),
      attendees: [newAttendee, ...(selectedEvent.attendees || [])]
    };

    setEvents((prev) =>
      prev.map((ev) => (ev.id === selectedEvent.id ? updatedEvent : ev))
    );
    setSelectedEvent(updatedEvent);
    setNewAttendeeName("");
    setNewAttendeeEmail("");
    setNewAttendeePhone("");
    setNewAttendeeTickets(1);

    fetch(`https://dzire-backend.onrender.com/api/admin/events/${selectedEvent.id}/attendees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAttendee),
    }).catch(() => {});
    showToast(`Attendee ${newAttendee.name} registered!`);
  };

  // Remove Attendee
  const handleRemoveAttendee = (attendeeId) => {
    if (!selectedEvent) return;
    const att = selectedEvent.attendees.find((a) => a.id === attendeeId);
    const ticketsToRemove = att ? att.tickets : 1;

    const updatedEvent = {
      ...selectedEvent,
      booked: Math.max(0, (selectedEvent.booked || 0) - ticketsToRemove),
      stock: (selectedEvent.stock || 0) + ticketsToRemove,
      attendees: selectedEvent.attendees.filter((a) => a.id !== attendeeId)
    };

    setEvents((prev) =>
      prev.map((ev) => (ev.id === selectedEvent.id ? updatedEvent : ev))
    );
    setSelectedEvent(updatedEvent);

    fetch(`https://dzire-backend.onrender.com/api/admin/events/${selectedEvent.id}/attendees/${attendeeId}`, {
      method: "DELETE",
    }).catch(() => {});
    showToast("Attendee registration removed.");
  };

  // Export Data
  const exportHeaders = ["ID", "Title", "Type", "Venue / Location", "Date", "Duration", "Price", "Capacity", "Booked"];
  const exportRows = filteredEvents.map((e) => [
    e.id,
    e.title,
    e.type,
    e.location,
    e.date,
    e.duration,
    e.price,
    e.capacity,
    e.booked
  ]);

  return (
    <AdminLayout>
      <div style={{ padding: "24px 32px 64px 32px", width: "100%", boxSizing: "border-box", background: "#f8fafc" }}>
        {/* Toast Notification */}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              backgroundColor: "#ff6600",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px -5px rgba(255, 102, 0, 0.4)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              fontSize: "14px",
              animation: "fadeIn 0.2s ease"
            }}
          >
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "300px", flex: "1 1 320px" }}>
            <Search
              size={17}
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            />
            <input
              type="text"
              placeholder="Search by event title, type, location, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
                background: "#ffffff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ff6600")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
            />
            {searchQuery && (
              <X
                size={14}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8" }}
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <ExportDropdown
              fileName="Dzire_Events_List"
              title="Outdoor Events Report"
              headers={exportHeaders}
              rows={exportRows}
            />

            <button
              onClick={handleOpenCreateModal}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#ff6600",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 18px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(255, 102, 0, 0.2)",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e65c00")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6600")}
            >
              <Plus size={18} />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Main Table Card Container (Exact Unified Stock List style) */}
        <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #eef2f6", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>

          {/* Section Header */}
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>Unified Events Schedule</h4>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
                ({filteredEvents.length} scheduled sessions)
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {selectedIds.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#ff6600" }}>
                    {selectedIds.length} selected
                  </span>
                  <button
                    onClick={handleBulkPublish}
                    style={{ background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Publish
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                style={{
                  background: showAdvancedFilters ? "#fff7f1" : "#fff",
                  border: showAdvancedFilters ? "1px solid #ff6600" : "1px solid #cbd5e1",
                  color: showAdvancedFilters ? "#ff6600" : "#334155",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
              >
                <Filter size={14} /> Advanced Filters
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters Bar */}
          {showAdvancedFilters && (
            <div
              style={{
                padding: "14px 20px",
                background: "#f1f5f9",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap"
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "4px" }}>
                  Event Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff", outline: "none" }}
                >
                  <option value="All">All Types</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "4px" }}>
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff", outline: "none" }}
                >
                  <option value="All">All Status</option>
                  <option value="Upcoming">Upcoming (+ Website)</option>
                  <option value="Draft">In-Store / Draft Only</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "4px" }}>
                  Pricing
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff", outline: "none" }}
                >
                  <option value="All">All Pricing</option>
                  <option value="Free">Free Pass</option>
                  <option value="Paid">Paid Workshop</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "4px" }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff", outline: "none" }}
                >
                  <option value="date">Date</option>
                  <option value="bookings">Bookings Count</option>
                  <option value="capacity">Capacity</option>
                  <option value="title">Title (A - Z)</option>
                </select>
              </div>

              {(typeFilter !== "All" || statusFilter !== "All" || priceFilter !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setTypeFilter("All");
                    setStatusFilter("All");
                    setPriceFilter("All");
                    setSearchQuery("");
                  }}
                  style={{
                    marginTop: "16px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    cursor: "pointer"
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* Table Container */}
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="dash-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: "980px" }}>
              <thead>
                <tr>
                  <th style={{ width: "36px", padding: "12px 16px", background: "#ff6600", color: "#ffffff" }}>
                    <input
                      type="checkbox"
                      checked={paginatedEvents.length > 0 && selectedIds.length === paginatedEvents.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Event Name & SKU / Type
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Vendor / Venue
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Stock / Available
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Sell Price
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    MRP / Cap
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Purchase Price / Date
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      <Calendar size={36} style={{ color: "#cbd5e1", margin: "0 auto 8px" }} />
                      <p style={{ margin: 0, fontWeight: "600" }}>No events found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        style={{
                          background: isSelected ? "#fff7ed" : item.alert ? "#fffbeb" : "transparent",
                          borderBottom: "1px solid #eef2f6",
                          transition: "background 0.15s"
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected && !item.alert) e.currentTarget.style.background = "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected && !item.alert) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: "12px 16px" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(item.id)}
                          />
                        </td>

                        {/* Event Name & Type / SKU */}
                        <td style={{ padding: "12px 16px" }}>
                          <p
                            onClick={() => handleOpenAttendees(item)}
                            style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            {item.title}
                            {item.featured && <Star size={12} fill="#f59e0b" color="#f59e0b" title="Featured Event" />}
                          </p>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>
                            (SKU: EV-{item.slug.slice(0, 8).toUpperCase()})
                          </span>
                        </td>

                        {/* Vendor / Venue */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {item.organizer}
                          </p>
                          <span style={{ fontSize: "11px", color: "#ff6600", fontWeight: "600" }}>
                            [PO]
                          </span>
                        </td>

                        {/* Stock / Seats Available */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: item.stock <= 0 ? "#ef4444" : "#1e293b" }}>
                            {item.stock}
                          </p>
                        </td>

                        {/* Sell Price */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {item.price}
                          </p>
                        </td>

                        {/* MRP / Cap */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {item.isFree ? "Free" : `₹${((item.priceNumber || 999) * 1.25).toFixed(2)}`}
                          </p>
                        </td>

                        {/* Purchase Price / Date */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {item.isFree ? "₹0.00" : `₹${((item.priceNumber || 999) * 0.75).toFixed(2)}`}
                          </p>
                        </td>

                        {/* Actions (Exact Edit Product + View Web Listing style) */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              style={{
                                background: "#ffffff",
                                border: "1px solid #cbd5e1",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#334155",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                            >
                              <Edit3 size={13} color="#ff6600" /> Edit Product
                            </button>

                            {item.status === "Upcoming" ? (
                              <button
                                onClick={() => handleOpenAttendees(item)}
                                style={{
                                  background: "#16a34a",
                                  color: "#fff",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                              >
                                View Web Listing
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                style={{
                                  background: "#2563eb",
                                  color: "#fff",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                              >
                                Add Web Info
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteEvent(item)}
                              title="Delete Event"
                              style={{
                                background: "none",
                                border: "none",
                                color: "#94a3b8",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "4px"
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid #e2e8f0", background: "#fafafa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                Page {currentPage} of {totalPages}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    background: "#fff",
                    border: "1px solid #cbd5e1",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    opacity: currentPage <= 1 ? 0.5 : 1
                  }}
                >
                  <ChevronLeft size={16} color="#64748b" />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      background: currentPage === pageNum ? "#ff6600" : "#fff",
                      border: currentPage === pageNum ? "1px solid #ff6600" : "1px solid #cbd5e1",
                      color: currentPage === pageNum ? "#ffffff" : "#334155",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: currentPage === pageNum ? "700" : "500",
                      cursor: "pointer"
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    background: "#fff",
                    border: "1px solid #cbd5e1",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage >= totalPages ? 0.5 : 1
                  }}
                >
                  <ChevronRight size={16} color="#64748b" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODAL: CREATE / EDIT EVENT ================= */}
        {isEditModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "840px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                overflow: "hidden"
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#fafafa"
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
                    {formData.id ? "Edit Outdoor Event & Workshop" : "Schedule New Workshop"}
                  </h3>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                    Configure schedule, pricing, capacity, and details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveEvent} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                <div style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Title & Slug */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Backpacking 101: Sleep Systems Workshop"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Type, Date & Duration */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 0.8fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Event Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", boxSizing: "border-box" }}
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Date & Schedule *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 28 Oct 2026"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2 hours"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Location & Organizer */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Venue / Location Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dzire Outdoor Studio, Varanasi"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Vendor / Host
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tripole Gears or Store Staff"
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Pricing & Capacity */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", background: "#f8fafc", padding: "14px 16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Pricing Type
                      </label>
                      <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="priceType"
                            checked={!formData.isFree}
                            onChange={() => setFormData({ ...formData, isFree: false, price: "₹999.00" })}
                          />
                          Paid
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="priceType"
                            checked={formData.isFree}
                            onChange={() => setFormData({ ...formData, isFree: true, price: "Free" })}
                          />
                          Free
                        </label>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Ticket Fee (Sell Price)
                      </label>
                      <input
                        type="text"
                        disabled={formData.isFree}
                        placeholder="e.g. ₹999.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", background: formData.isFree ? "#f1f5f9" : "#fff" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                        Total Seats (MRP Cap) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        required
                        placeholder="e.g. 30"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Gallery Image Upload & Preview */}
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                        <UploadCloud size={16} color="#ff6600" />
                        Event Banner Image (Gallery / Local Device)
                      </label>
                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          style={{ fontSize: "11px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}
                        >
                          Remove Image
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />

                    {formData.image ? (
                      <div style={{ display: "flex", gap: "14px", alignItems: "center", background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                        <img
                          src={formData.image}
                          alt="preview"
                          style={{ width: "120px", height: "76px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                          onError={(e) => (e.target.src = "https://placehold.co/120x76?text=Invalid+Image")}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={13} /> Image Ready
                            </span>
                            <span style={{ fontSize: "11px", color: "#64748b" }}>
                              {formData.image.startsWith("data:") ? "(Uploaded from Gallery)" : "(Preset / Web)"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              backgroundColor: "#ff6600",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              boxShadow: "0 1px 3px rgba(255,102,0,0.3)"
                            }}
                          >
                            <Upload size={13} /> Change Image from Gallery
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: "2px dashed #cbd5e1",
                          borderRadius: "8px",
                          padding: "20px 16px",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: "#ffffff",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ff6600")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                      >
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff7f1", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                          <UploadCloud size={20} color="#ff6600" />
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "2px" }}>
                          Click to browse & upload banner from Gallery / Device
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          PNG, JPG, JPEG, WEBP or GIF (High resolution recommended)
                        </div>
                      </div>
                    )}

                    {/* Presets option */}
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Or choose sample preset:</span>
                      {PRESET_EVENT_IMAGES.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: preset.url })}
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            border: formData.image === preset.url ? "1px solid #ff6600" : "1px solid #e2e8f0",
                            background: formData.image === preset.url ? "#fff7f1" : "#ffffff",
                            color: formData.image === preset.url ? "#ff6600" : "#475569",
                            cursor: "pointer"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description - Rich Text & HTML Source Editor */}
                  <EventRichDescriptionEditor
                    value={formData.description}
                    onChange={(newVal) => setFormData({ ...formData, description: newVal })}
                  />

                  {/* Featured Option */}
                  <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                      Featured Event
                    </span>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "#ff6600" }}
                      />
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                        Pin / Highlight on Catalog
                      </span>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", background: "#fafafa", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#64748b", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: "#ff6600", color: "#ffffff", border: "none", padding: "9px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", boxShadow: "0 2px 6px rgba(255,102,0,0.3)" }}
                  >
                    {formData.id ? "Save Changes" : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: ATTENDEES & WEB INFO ================= */}
        {isAttendeesModalOpen && selectedEvent && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "760px",
                maxHeight: "88vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)"
              }}
            >
              {/* Header */}
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#166534", background: "#dcfce7", padding: "3px 8px", borderRadius: "4px" }}>
                      + Website Listing
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{selectedEvent.date}</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
                    {selectedEvent.title}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    <strong>{selectedEvent.booked}</strong> of <strong>{selectedEvent.capacity}</strong> seats booked &bull; Fee: <strong>{selectedEvent.price}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAttendeesModalOpen(false)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Add New Attendee */}
              <form
                onSubmit={handleAddAttendee}
                style={{
                  padding: "14px 24px",
                  background: "#fff7f1",
                  borderBottom: "1px solid #ffedd5",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                <input
                  type="text"
                  required
                  placeholder="Attendee Full Name *"
                  value={newAttendeeName}
                  onChange={(e) => setNewAttendeeName(e.target.value)}
                  style={{ flex: "1 1 140px", padding: "7px 10px", borderRadius: "6px", border: "1px solid #fed7aa", fontSize: "12px" }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newAttendeeEmail}
                  onChange={(e) => setNewAttendeeEmail(e.target.value)}
                  style={{ flex: "1 1 140px", padding: "7px 10px", borderRadius: "6px", border: "1px solid #fed7aa", fontSize: "12px" }}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newAttendeePhone}
                  onChange={(e) => setNewAttendeePhone(e.target.value)}
                  style={{ width: "110px", padding: "7px 10px", borderRadius: "6px", border: "1px solid #fed7aa", fontSize: "12px" }}
                />
                <button
                  type="submit"
                  style={{ background: "#ff6600", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <UserPlus size={13} /> Add
                </button>
              </form>

              {/* Attendees List */}
              <div style={{ padding: "16px 24px", overflowY: "auto", flex: 1 }}>
                {!selectedEvent.attendees || selectedEvent.attendees.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                    <Users size={36} style={{ margin: "0 auto 8px", color: "#cbd5e1" }} />
                    <p style={{ margin: 0, fontSize: "14px" }}>No registered attendees for this event yet.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: "11px", textTransform: "uppercase" }}>
                        <th style={{ padding: "8px 12px" }}>Attendee</th>
                        <th style={{ padding: "8px 12px" }}>Contact</th>
                        <th style={{ padding: "8px 12px" }}>Passes</th>
                        <th style={{ padding: "8px 12px" }}>Payment</th>
                        <th style={{ padding: "8px 12px" }}>Date</th>
                        <th style={{ padding: "8px 12px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvent.attendees.map((att) => (
                        <tr key={att.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 12px", fontWeight: "600", color: "#0f172a" }}>
                            {att.name}
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{att.id}</div>
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: "12px", color: "#64748b" }}>
                            <div>{att.email}</div>
                            <div>{att.phone}</div>
                          </td>
                          <td style={{ padding: "10px 12px", fontWeight: "700", color: "#ff6600" }}>
                            {att.tickets} Pass{att.tickets > 1 ? "es" : ""}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>
                              {att.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", fontSize: "12px", color: "#64748b" }}>
                            {att.registeredAt}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttendee(att.id)}
                              title="Remove attendee"
                              style={{ background: "#fef2f2", border: "none", color: "#ef4444", padding: "5px 8px", borderRadius: "4px", cursor: "pointer" }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Total registered tickets: <strong>{selectedEvent.booked}</strong></span>
                <button
                  type="button"
                  onClick={() => setIsAttendeesModalOpen(false)}
                  style={{ background: "#ff6600", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;

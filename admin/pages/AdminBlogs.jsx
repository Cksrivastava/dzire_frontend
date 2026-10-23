import React, { useState, useMemo, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import ExportDropdown from "../components/ExportDropdown";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Edit3,
  Trash2,
  X,
  Calendar,
  Tag,
  Star,
  MessageSquare,
  Filter,
  FileText,
  User,
  Image as ImageIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Store,
  ExternalLink,
  Send,
  AlertCircle,
  TrendingUp,
  Share2,
  UploadCloud,
  Upload,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  RotateCcw,
  Edit2
} from "lucide-react";

export const BLOGS_STORAGE_KEY = "dzire_admin_blogs_list";

const PRESET_IMAGES = [
  { label: "Mountain Trek", url: "https://images.unsplash.com/photo-1517821365201-7734f463f9e1?auto=format&fit=crop&w=1200&q=80" },
  { label: "Alpine Peaks", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" },
  { label: "Trekking Gear", url: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80" },
  { label: "Camp in Forest", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80" },
  { label: "Backpacking Trail", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80" },
  { label: "Winter Snow", url: "https://images.unsplash.com/photo-1516431883659-655d41c09bf9?auto=format&fit=crop&w=1200&q=80" }
];

const CATEGORIES = [
  "Adventure Tips",
  "Gear Guides",
  "Treks & Trails",
  "Outdoor Lifestyle",
  "Safety & Training",
  "Beginner Guides",
  "Product Reviews"
];

// Seed data removed
const INITIAL_BLOGS = [];

// ==========================================
// Rich Text & HTML Source Editor Component for Blogs
// ==========================================
const BlogRichContentEditor = ({ value, onChange }) => {
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
            Article Body / Content <span style={{ color: "#ef4444" }}>*</span>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
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
              minHeight: "220px",
              maxHeight: "380px",
              overflowY: "auto",
              padding: "14px 16px",
              fontSize: "14px",
              lineHeight: "1.7",
              color: "#1e293b",
              outline: "none",
              background: "#ffffff"
            }}
            placeholder="Write full blog article here..."
          />
        )}

        {activeTab === "html" && (
          <textarea
            ref={htmlTextareaRef}
            rows={10}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write or paste your custom HTML article code here (e.g. <h3>Introduction</h3><p>...</p>)"
            style={{
              width: "100%",
              minHeight: "220px",
              maxHeight: "380px",
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

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);

  useEffect(() => {
    let mounted = true;
    fetch("https://dzire-backend.onrender.com/api/blogs")
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success && Array.isArray(d.blogs)) {
          setBlogs(d.blogs);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [notification, setNotification] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Form State (Blank by default for new blog creation)
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    slug: "",
    category: "Adventure Tips",
    author: "",
    image: "",
    excerpt: "",
    content: "",
    readTime: "",
    status: "Published",
    visibility: "web",
    featured: false,
    date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    tagsInput: "",
    tags: []
  });

  // Comments State
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("Store Staff");

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
    } catch (e) {
      console.error("Failed to save blogs to storage", e);
    }
  }, [blogs]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Filtered Blogs
  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        const matchesSearch =
          blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          categoryFilter === "All" || blog.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All" || blog.status === statusFilter;

        const matchesAuthor =
          authorFilter === "All" || blog.author === authorFilter;

        return matchesSearch && matchesCategory && matchesStatus && matchesAuthor;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === "views") {
          return (b.views || 0) - (a.views || 0);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [blogs, searchQuery, categoryFilter, statusFilter, authorFilter, sortBy]);

  // Paginated List
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / pageSize));
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBlogs.slice(start, start + pageSize);
  }, [filteredBlogs, currentPage, pageSize]);

  // Handle Select All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedBlogs.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Create Form (Blank form for user to enter fresh info)
  const handleOpenCreateModal = () => {
    setFormData({
      id: null,
      title: "",
      slug: "",
      category: "Adventure Tips",
      author: "",
      image: "",
      excerpt: "",
      content: "",
      readTime: "",
      status: "Published",
      visibility: "web",
      featured: false,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      tagsInput: "",
      tags: []
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Form (Populate existing blog data)
  const handleOpenEditModal = (blog) => {
    setFormData({
      id: blog.id,
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || "Adventure Tips",
      author: blog.author || "",
      image: blog.image || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      readTime: blog.readTime || "",
      status: blog.status || "Published",
      visibility: blog.visibility || (blog.status === "Published" ? "web" : "draft-only"),
      featured: !!blog.featured,
      date: blog.date || "",
      tagsInput: (blog.tags || []).join(", "),
      tags: blog.tags || []
    });
    setIsEditModalOpen(true);
  };

  const fileInputRef = useRef(null);

  // Gallery Image Upload Handler with Multer
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Image size exceeds 15MB. Please choose a smaller image file.");
        return;
      }

      // Upload using multer backend route
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      try {
        showToast("Uploading blog image via multer...");
        const res = await fetch("https://dzire-backend.onrender.com/api/admin/blogs/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const data = await res.json();
        if (data.success && data.imageUrl) {
          setFormData((prev) => ({
            ...prev,
            image: data.imageUrl,
          }));
          showToast("Image uploaded successfully!");
        } else {
          // Fallback to local data URL if server response is unexpected
          const reader = new FileReader();
          reader.onload = (event) => {
            setFormData((prev) => ({ ...prev, image: event.target.result }));
          };
          reader.readAsDataURL(file);
          showToast(data.message || "Image selected from gallery!");
        }
      } catch (err) {
        console.error("Multer upload error:", err);
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({ ...prev, image: event.target.result }));
        };
        reader.readAsDataURL(file);
        showToast("Image selected from gallery!");
      }
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  // Auto generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s-]+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.id ? prev.slug : generatedSlug
    }));
  };

  // Handle Save Blog
  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return;
    }
    const cleanContent = (formData.content || "").replace(/<[^>]*>/g, "").trim();
    if (!cleanContent && !(formData.content || "").trim()) {
      alert("Please enter the blog article body content.");
      return;
    }

    const tagsArray = formData.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const slugFormatted =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s-]+/g, "-");

    const isPublished = formData.status === "Published";

    if (formData.id) {
      // Edit
      const updatedItem = {
        title: formData.title,
        slug: slugFormatted,
        category: formData.category,
        author: formData.author,
        image: formData.image,
        excerpt: formData.excerpt,
        content: formData.content,
        readTime: formData.readTime,
        status: formData.status,
        visibility: isPublished ? "web" : "draft-only",
        alert: !isPublished,
        featured: formData.featured,
        tags: tagsArray
      };

      setBlogs((prev) =>
        prev.map((b) => (b.id === formData.id ? { ...b, ...updatedItem } : b))
      );

      fetch(`https://dzire-backend.onrender.com/api/admin/blogs/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      }).catch(() => {});
      showToast(`Article "${formData.title}" updated successfully!`);
    } else {
      // Create
      const newPost = {
        id: Date.now(),
        title: formData.title,
        slug: slugFormatted,
        category: formData.category,
        author: formData.author,
        authorBadge: "[Author]",
        image: formData.image || PRESET_IMAGES[0].url,
        excerpt: formData.excerpt || formData.content.slice(0, 160) + "...",
        content: formData.content,
        readTime: formData.readTime || "5 min read",
        status: formData.status,
        visibility: isPublished ? "web" : "draft-only",
        alert: !isPublished,
        featured: formData.featured,
        date: formData.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        views: 1,
        tags: tagsArray,
        comments: [],
        createdAt: new Date().toISOString()
      };

      setBlogs((prev) => [newPost, ...prev]);

      fetch("https://dzire-backend.onrender.com/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.blog) {
            setBlogs((prev) => prev.map((b) => (b.id === newPost.id ? d.blog : b)));
          }
        })
        .catch(() => {});
      showToast(`Article "${formData.title}" published successfully!`);
    }

    setIsEditModalOpen(false);
  };

  // Delete Blog
  const handleDeleteBlog = (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
      setSelectedIds((prev) => prev.filter((id) => id !== blog.id));
      fetch(`https://dzire-backend.onrender.com/api/admin/blogs/${blog.id}`, { method: "DELETE" }).catch(() => {});
      showToast(`Deleted "${blog.title}"`);
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected articles?`)) {
      const idsToDelete = [...selectedIds];
      setBlogs((prev) => prev.filter((b) => !idsToDelete.includes(b.id)));
      setSelectedIds([]);
      fetch("https://dzire-backend.onrender.com/api/admin/blogs/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      }).catch(() => {});
      showToast("Selected articles deleted!");
    }
  };

  // Bulk Publish
  const handleBulkPublish = () => {
    const idsToPublish = [...selectedIds];
    setBlogs((prev) =>
      prev.map((b) =>
        idsToPublish.includes(b.id)
          ? { ...b, status: "Published", visibility: "web", alert: false }
          : b
      )
    );
    setSelectedIds([]);
    fetch("https://dzire-backend.onrender.com/api/admin/blogs/bulk-publish", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: idsToPublish }),
    }).catch(() => {});
    showToast("Selected articles published to Website!");
  };

  // Preview Modal
  const handleOpenPreview = (blog) => {
    setSelectedBlog(blog);
    setIsPreviewModalOpen(true);
  };

  // Comments Modal
  const handleOpenComments = (blog) => {
    setSelectedBlog(blog);
    setNewCommentText("");
    setIsCommentsModalOpen(true);
  };

  // Add Comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedBlog) return;

    const newComment = {
      id: Date.now(),
      author: newCommentAuthor.trim() || "Store Staff",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      text: newCommentText.trim(),
      likes: 0
    };

    const updatedBlog = {
      ...selectedBlog,
      comments: [newComment, ...(selectedBlog.comments || [])]
    };

    setBlogs((prev) =>
      prev.map((b) => (b.id === selectedBlog.id ? updatedBlog : b))
    );
    setSelectedBlog(updatedBlog);
    setNewCommentText("");

    fetch(`https://dzire-backend.onrender.com/api/admin/blogs/${selectedBlog.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    }).catch(() => {});
    showToast("Comment posted!");
  };

  // Delete Comment
  const handleDeleteComment = (commentId) => {
    if (!selectedBlog) return;
    const updatedBlog = {
      ...selectedBlog,
      comments: selectedBlog.comments.filter((c) => c.id !== commentId)
    };
    setBlogs((prev) =>
      prev.map((b) => (b.id === selectedBlog.id ? updatedBlog : b))
    );
    setSelectedBlog(updatedBlog);
    fetch(`https://dzire-backend.onrender.com/api/admin/blogs/${selectedBlog.id}/comments/${commentId}`, {
      method: "DELETE",
    }).catch(() => {});
    showToast("Comment removed.");
  };

  // Export Data Preparation
  const exportHeaders = ["ID", "Title", "Category", "Author", "Read Time", "Views", "Comments", "Status", "Date", "Slug"];
  const exportRows = filteredBlogs.map((b) => [
    b.id,
    b.title,
    b.category,
    b.author,
    b.readTime || "5 min",
    b.views || 0,
    b.comments?.length || 0,
    b.status,
    b.date,
    b.slug
  ]);

  const authorsList = ["All", ...new Set(blogs.map((b) => b.author).filter(Boolean))];

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
              placeholder="Search by article title, category, author, slug..."
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
              fileName="Dzire_Blog_Posts"
              title="Blog Posts Report"
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
              <span>Create Article</span>
            </button>
          </div>
        </div>

        {/* Main Table Card Container (Exact Unified Stock List style) */}
        <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #eef2f6", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>

          {/* Section Header */}
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: "700" }}>Unified Blog List</h4>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
                ({filteredBlogs.length} articles found)
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
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff", outline: "none" }}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                  <option value="Published">Published (+ Website)</option>
                  <option value="Draft">Draft Only</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "4px" }}>
                  Author
                </label>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff", outline: "none" }}
                >
                  {authorsList.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "4px" }}>
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", background: "#fff", outline: "none" }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Views</option>
                  <option value="title">Title (A - Z)</option>
                </select>
              </div>

              {(categoryFilter !== "All" || statusFilter !== "All" || authorFilter !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setCategoryFilter("All");
                    setStatusFilter("All");
                    setAuthorFilter("All");
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
                      checked={paginatedBlogs.length > 0 && selectedIds.length === paginatedBlogs.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Article Name & Slug
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Category
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Author
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Read Time
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Views
                  </th>
                  <th style={{ padding: "12px 16px", background: "#ff6600", color: "#ffffff", textAlign: "left", fontWeight: "600" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      <BookOpen size={36} style={{ color: "#cbd5e1", margin: "0 auto 8px" }} />
                      <p style={{ margin: 0, fontWeight: "600" }}>No articles found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((item) => {
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

                        {/* Article Title & Slug */}
                        <td style={{ padding: "12px 16px" }}>
                          <p
                            onClick={() => handleOpenPreview(item)}
                            style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            {item.title}
                            {item.featured && <Star size={12} fill="#f59e0b" color="#f59e0b" title="Featured Article" />}
                          </p>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>
                            (SLUG: {item.slug})
                          </span>
                        </td>

                        {/* Category */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {item.category}
                          </p>
                        </td>

                        {/* Author */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {item.author}
                          </p>
                          <span style={{ fontSize: "11px", color: "#ff6600", fontWeight: "600" }}>
                            {item.authorBadge || "[Author]"}
                          </span>
                        </td>

                        {/* Read Time */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {item.readTime || "5 min read"}
                          </p>
                        </td>

                        {/* Views */}
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                            {(item.views || 0).toLocaleString()}
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

                            {item.status === "Published" ? (
                              <button
                                onClick={() => handleOpenPreview(item)}
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
                              onClick={() => handleDeleteBlog(item)}
                              title="Delete Article"
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

          {/* Pagination Footer (Exact style) */}
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

        {/* ================= MODAL: CREATE / EDIT BLOG ================= */}
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
                    {formData.id ? "Edit Article Details" : "Create New Blog Article"}
                  </h3>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                    Configure web visibility, content, and author info.
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
              <form onSubmit={handleSaveBlog} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                <div style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Title & Slug */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tripole Walker 55L Backpack & Winter Treks Guide"
                      value={formData.title}
                      onChange={handleTitleChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        URL Slug
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. trekking-tips-beginners"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Author, Read Time, Date */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Author
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 min read"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                        Publish Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 20 Oct 2026"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Gallery Image Upload & Preview */}
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                        <UploadCloud size={16} color="#ff6600" />
                        Cover Image (Gallery / Local Device)
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
                          Click to browse & upload image from Gallery / Device
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          PNG, JPG, JPEG, WEBP or GIF (High resolution recommended)
                        </div>
                      </div>
                    )}

                    {/* Presets option */}
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Or choose sample preset:</span>
                      {PRESET_IMAGES.map((preset, i) => (
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

                  {/* Excerpt */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>
                      Short Summary / Excerpt
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Write a brief 1-2 sentence overview of this article..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", fontFamily: "inherit" }}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Trekking, Backpacking, Mountain, Winter Trek"
                      value={formData.tagsInput}
                      onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Article Body / Content with Rich Text & HTML Source */}
                  <BlogRichContentEditor
                    value={formData.content}
                    onChange={(newVal) => setFormData((prev) => ({ ...prev, content: newVal }))}
                  />

                  {/* Featured Option */}
                  <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                      Featured Article
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
                    {formData.id ? "Save Changes" : "Publish Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: VIEW WEB LISTING PREVIEW ================= */}
        {isPreviewModalOpen && selectedBlog && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
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
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)"
              }}
            >
              {/* Header */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>
                    + Website Live Listing
                  </span>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>/blog/{selectedBlog.slug}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                <div style={{ width: "100%", height: "240px", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
                  <img src={selectedBlog.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ background: "#fff7f1", color: "#ff6600", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>
                    {selectedBlog.category}
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{selectedBlog.date}</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>&bull;</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{selectedBlog.readTime || "5 min read"}</span>
                </div>

                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px 0", lineHeight: "1.3" }}>
                  {selectedBlog.title}
                </h2>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", marginBottom: "18px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ff6600", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" }}>
                    {selectedBlog.author?.charAt(0) || "D"}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{selectedBlog.author}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Dzire Outdoor Certified Editorial</div>
                  </div>
                </div>

                {/<[a-z][\s\S]*>/i.test(selectedBlog.content || "") ? (
                  <div
                    style={{ fontSize: "14px", lineHeight: "1.8", color: "#334155" }}
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                ) : (
                  <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#334155", whiteSpace: "pre-line" }}>
                    {selectedBlog.content || selectedBlog.excerpt}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Reader views: <strong>{selectedBlog.views?.toLocaleString()}</strong></span>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  style={{ background: "#ff6600", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;

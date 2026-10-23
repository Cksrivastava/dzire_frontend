import React, { useState, useMemo } from "react";
import { Calendar, Filter, RefreshCw, X } from "lucide-react";
import "../pages/AdminDashboard.css";

const formatDateYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (ymdStr) => {
  if (!ymdStr) return "";
  const parts = ymdStr.split("-");
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  return ymdStr;
};

const DateRangeFilter = ({
  onFilterChange,
  loading = false,
  title = "Date Range Filter",
  idPrefix = "filter-date",
  style = {}
}) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [activePreset, setActivePreset] = useState("all");

  const isFiltered = Boolean(appliedFrom || appliedTo);

  const filterPeriodLabel = useMemo(() => {
    if (!isFiltered) return "All Time";
    if (activePreset === "today") return "Today";
    if (activePreset === "yesterday") return "Yesterday";
    if (activePreset === "7days") return "Last 7 Days";
    if (activePreset === "30days") return "Last 30 Days";
    if (activePreset === "thisMonth") return "This Month";
    if (activePreset === "lastMonth") return "Last Month";
    if (appliedFrom && appliedTo) {
      return `${formatDisplayDate(appliedFrom)} – ${formatDisplayDate(appliedTo)}`;
    }
    if (appliedFrom) return `From ${formatDisplayDate(appliedFrom)}`;
    if (appliedTo) return `Up to ${formatDisplayDate(appliedTo)}`;
    return "Custom Range";
  }, [isFiltered, activePreset, appliedFrom, appliedTo]);

  const notifyChange = (fromVal, toVal, presetKey, label, filtered) => {
    if (onFilterChange) {
      onFilterChange({
        fromDate: fromVal,
        toDate: toVal,
        activePreset: presetKey,
        label,
        isFiltered: filtered
      });
    }
  };

  const handlePresetChange = (presetKey) => {
    setActivePreset(presetKey);
    const now = new Date();
    let f = "";
    let t = "";

    if (presetKey === "today") {
      f = formatDateYMD(now);
      t = formatDateYMD(now);
    } else if (presetKey === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      f = formatDateYMD(y);
      t = formatDateYMD(y);
    } else if (presetKey === "7days") {
      const past = new Date();
      past.setDate(past.getDate() - 6);
      f = formatDateYMD(past);
      t = formatDateYMD(now);
    } else if (presetKey === "30days") {
      const past = new Date();
      past.setDate(past.getDate() - 29);
      f = formatDateYMD(past);
      t = formatDateYMD(now);
    } else if (presetKey === "thisMonth") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      f = formatDateYMD(start);
      t = formatDateYMD(now);
    } else if (presetKey === "lastMonth") {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      f = formatDateYMD(start);
      t = formatDateYMD(end);
    } else if (presetKey === "all") {
      f = "";
      t = "";
    }

    setFromDate(f);
    setToDate(t);
    setAppliedFrom(f);
    setAppliedTo(t);

    const filtered = Boolean(f || t);
    let lbl = "All Time";
    if (presetKey === "today") lbl = "Today";
    else if (presetKey === "yesterday") lbl = "Yesterday";
    else if (presetKey === "7days") lbl = "Last 7 Days";
    else if (presetKey === "30days") lbl = "Last 30 Days";
    else if (presetKey === "thisMonth") lbl = "This Month";
    else if (presetKey === "lastMonth") lbl = "Last Month";
    else if (f && t) lbl = `${formatDisplayDate(f)} – ${formatDisplayDate(t)}`;

    notifyChange(f, t, presetKey, lbl, filtered);
  };

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    setActivePreset("custom");
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    const filtered = Boolean(fromDate || toDate);
    const lbl = fromDate && toDate
      ? `${formatDisplayDate(fromDate)} – ${formatDisplayDate(toDate)}`
      : fromDate
      ? `From ${formatDisplayDate(fromDate)}`
      : toDate
      ? `Up to ${formatDisplayDate(toDate)}`
      : "All Time";
    notifyChange(fromDate, toDate, "custom", lbl, filtered);
  };

  const handleResetFilter = () => {
    setActivePreset("all");
    setFromDate("");
    setToDate("");
    setAppliedFrom("");
    setAppliedTo("");
    notifyChange("", "", "all", "All Time", false);
  };

  return (
    <div className="dashboard-filter-bar" style={style}>
      <div className="filter-bar-top">
        <div className="filter-title-group">
          <Calendar size={16} className="text-orange-600" />
          <span>{title}</span>
          {isFiltered && (
            <span className="active-filter-badge">
              <span>Filtered: {filterPeriodLabel}</span>
              <button type="button" onClick={handleResetFilter} title="Clear Filter">
                <X size={13} />
              </button>
            </span>
          )}
        </div>

        <div className="filter-presets">
          <button
            type="button"
            className={`filter-preset-btn ${activePreset === "all" ? "active" : ""}`}
            onClick={() => handlePresetChange("all")}
          >
            All Time
          </button>
          <button
            type="button"
            className={`filter-preset-btn ${activePreset === "today" ? "active" : ""}`}
            onClick={() => handlePresetChange("today")}
          >
            Today
          </button>
          <button
            type="button"
            className={`filter-preset-btn ${activePreset === "yesterday" ? "active" : ""}`}
            onClick={() => handlePresetChange("yesterday")}
          >
            Yesterday
          </button>
          <button
            type="button"
            className={`filter-preset-btn ${activePreset === "7days" ? "active" : ""}`}
            onClick={() => handlePresetChange("7days")}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            className={`filter-preset-btn ${activePreset === "30days" ? "active" : ""}`}
            onClick={() => handlePresetChange("30days")}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            className={`filter-preset-btn ${activePreset === "thisMonth" ? "active" : ""}`}
            onClick={() => handlePresetChange("thisMonth")}
          >
            This Month
          </button>
          <button
            type="button"
            className={`filter-preset-btn ${activePreset === "lastMonth" ? "active" : ""}`}
            onClick={() => handlePresetChange("lastMonth")}
          >
            Last Month
          </button>
        </div>
      </div>

      <form onSubmit={handleApplyFilter} className="filter-bar-bottom">
        <div className="date-pickers-row">
          <div className="date-input-group">
            <label htmlFor={`${idPrefix}-from`}>
              <Calendar size={13} /> From
            </label>
            <input
              id={`${idPrefix}-from`}
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setActivePreset("custom");
              }}
            />
          </div>

          <span className="date-input-divider">to</span>

          <div className="date-input-group">
            <label htmlFor={`${idPrefix}-to`}>
              <Calendar size={13} /> To
            </label>
            <input
              id={`${idPrefix}-to`}
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => {
                setToDate(e.target.value);
                setActivePreset("custom");
              }}
            />
          </div>
        </div>

        <div className="filter-actions-group">
          <button
            type="submit"
            className="filter-btn-apply"
            disabled={loading || (!fromDate && !toDate)}
          >
            <Filter size={13} />
            <span>Apply Filter</span>
          </button>

          {(isFiltered || fromDate || toDate) && (
            <button
              type="button"
              className="filter-btn-reset"
              onClick={handleResetFilter}
              disabled={loading}
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DateRangeFilter;

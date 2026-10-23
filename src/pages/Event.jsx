import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Event.css";
import { eventAPI } from "../services/api";
import wsClient from "../services/websocket";

import { categoriesPills, eventsMaster } from "../data/eventsData";

import EventHero from "../components/event/EventHero";
import EventCategoryPills from "../components/event/EventCategoryPills";
import EventSidebarFilter from "../components/event/EventSidebarFilter";
import EventListingHeader from "../components/event/EventListingHeader";
import EventCard from "../components/event/EventCard";
import EventMobileFilterDrawer from "../components/event/EventMobileFilterDrawer";
import { getBannerSettings, BANNER_SETTINGS_EVENT } from "../services/bannerSettings";

export { categoriesPills, eventsMaster };

// Date parser helper
const extractDatesFromEvent = (ev) => {
  const dates = [];
  const parseStr = (str) => {
    if (!str || typeof str !== "string") return;
    const parts = str.split(/[–—-]/).map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      let clean = part.replace(/'(\d{2})\b/g, "20$1");
      clean = clean.replace(/^[A-Za-z]+,\s*/, "");
      const d = new Date(clean);
      if (!isNaN(d.getTime())) {
        dates.push(d);
      }
    }
  };

  parseStr(ev.date);
  if (Array.isArray(ev.moreDates)) {
    ev.moreDates.forEach((md) => parseStr(md?.label));
  }
  return dates;
};

// Category matching helper
const matchCategoryPill = (ev, cat) => {
  if (!cat || cat === "all") return true;
  const c = cat.toLowerCase();
  const evCat = (ev.category || "").toLowerCase();
  const evType = (ev.type || "").toLowerCase();
  const evTitle = (ev.title || "").toLowerCase();
  const evDesc = (ev.description || "").toLowerCase();

  if (c === "workshops") {
    return evCat.includes("workshop") || evType.includes("workshop") || evTitle.includes("workshop");
  }
  if (c === "water") {
    return evCat.includes("water") || evType.includes("water") || evTitle.includes("water") || evTitle.includes("lake") || evTitle.includes("beach");
  }
  if (c === "nature") {
    return evCat.includes("nature") || evType.includes("nature") || evTitle.includes("nature") || evTitle.includes("forest") || evTitle.includes("hike");
  }
  if (c === "photography") {
    return evCat.includes("photo") || evType.includes("photo") || evTitle.includes("photo");
  }
  if (c === "more") {
    return true;
  }
  return evCat.includes(c) || evType.includes(c) || evTitle.includes(c) || evDesc.includes(c);
};

// Activity matching helper
const matchActivity = (ev, act) => {
  if (!act || act === "All") return true;
  const a = act.toLowerCase();
  const evCat = (ev.category || "").toLowerCase();
  const evType = (ev.type || "").toLowerCase();
  const evTitle = (ev.title || "").toLowerCase();
  return evCat.includes(a) || evType.includes(a) || evTitle.includes(a);
};

// Location matching helper
const matchLocation = (ev, loc) => {
  if (!loc || loc === "All") return true;
  const l = loc.toLowerCase();
  const evLoc = (ev.location || "").toLowerCase();
  const evAddr = (ev.address || "").toLowerCase();
  return evLoc.includes(l) || evAddr.includes(l);
};

// Search matching helper
const matchSearch = (ev, q) => {
  if (!q || !q.trim()) return true;
  const query = q.trim().toLowerCase();
  const evTitle = (ev.title || "").toLowerCase();
  const evLoc = (ev.location || "").toLowerCase();
  const evAddr = (ev.address || "").toLowerCase();
  const evDesc = (ev.description || "").toLowerCase();
  const evCat = (ev.category || "").toLowerCase();
  const evType = (ev.type || "").toLowerCase();
  return (
    evTitle.includes(query) ||
    evLoc.includes(query) ||
    evAddr.includes(query) ||
    evDesc.includes(query) ||
    evCat.includes(query) ||
    evType.includes(query)
  );
};

// Date filter matching helper
const matchDateFilter = (ev, dFilter, cDate) => {
  if (!dFilter || dFilter === "Any Date") return true;

  const dates = extractDatesFromEvent(ev);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (dFilter === "Today") {
    if (dates.length === 0) return (ev.date || "").toLowerCase().includes("today");
    return dates.some((d) => isSameDay(d, startOfToday));
  }

  if (dFilter === "Tomorrow") {
    const tomorrow = new Date(startOfToday.getTime() + 86400000);
    if (dates.length === 0) return (ev.date || "").toLowerCase().includes("tomorrow");
    return dates.some((d) => isSameDay(d, tomorrow));
  }

  if (dFilter === "This Weekend") {
    const day = startOfToday.getDay(); // 0 is Sun, 6 is Sat
    const diffToSat = (6 - day + 7) % 7;
    const thisSat = new Date(startOfToday.getTime() + diffToSat * 86400000);
    const thisSun = new Date(thisSat.getTime() + 86400000);

    if (dates.length === 0) {
      return (ev.date || "").toLowerCase().includes("weekend");
    }
    return dates.some((d) => isSameDay(d, thisSat) || isSameDay(d, thisSun));
  }

  if (dFilter === "Next Weekend") {
    const day = startOfToday.getDay();
    const diffToSat = (6 - day + 7) % 7 + 7;
    const nextSat = new Date(startOfToday.getTime() + diffToSat * 86400000);
    const nextSun = new Date(nextSat.getTime() + 86400000);

    return dates.some((d) => isSameDay(d, nextSat) || isSameDay(d, nextSun));
  }

  if (dFilter === "Custom Date") {
    if (!cDate) return true;
    const [cy, cm, cd] = cDate.split("-").map(Number);
    if (!cy || !cm || !cd) return true;
    const target = new Date(cy, cm - 1, cd);

    if (dates.length === 0) {
      return (ev.date || "").includes(cDate);
    }
    return dates.some((d) => isSameDay(d, target));
  }

  return true;
};

// Duration filter matching helper
const matchDurationFilter = (evDuration, selectedDurs) => {
  if (!selectedDurs || selectedDurs.length === 0 || selectedDurs.includes("Any Duration")) {
    return true;
  }
  const durStr = String(evDuration || "").toLowerCase();
  const hoursMatch = durStr.match(/(\d+(?:\.\d+)?)\s*hour/i);
  const daysMatch = durStr.match(/(\d+)\s*day/i);
  const hours = hoursMatch ? parseFloat(hoursMatch[1]) : null;
  const days = daysMatch ? parseInt(daysMatch[1], 10) : null;

  return selectedDurs.some((dur) => {
    if (dur === "Half Day") {
      if (durStr.includes("half")) return true;
      if (hours !== null && hours <= 5) return true;
      return false;
    }
    if (dur === "1 Day") {
      if (days === 1) return true;
      if (hours !== null && hours > 5 && hours <= 24) return true;
      return durStr.includes("1 day");
    }
    if (dur === "2 Days") {
      if (days === 2) return true;
      return durStr.includes("2 day");
    }
    if (dur === "3 Days") {
      if (days === 3) return true;
      return durStr.includes("3 day");
    }
    if (dur === "4+ Days") {
      if (days !== null && days >= 4) return true;
      return durStr.includes("4+") || durStr.includes("4 day") || durStr.includes("5 day");
    }
    return durStr.includes(dur.toLowerCase());
  });
};

// Difficulty filter matching helper
const matchDifficultyFilter = (ev, selectedDiffs) => {
  if (!selectedDiffs || selectedDiffs.length === 0) return true;
  const evDiff = String(ev.difficulty || "Moderate").toLowerCase();
  return selectedDiffs.some((d) => evDiff === d.toLowerCase());
};

// Numeric price parser
const parsePrice = (priceVal) => {
  if (!priceVal) return 0;
  if (String(priceVal).toLowerCase() === "free") return 0;
  return Number(String(priceVal).replace(/[^0-9.]/g, "")) || 0;
};

const Event = () => {
  const navigate = useNavigate();
  const pillsContainerRef = useRef(null);

  const [eventsList, setEventsList] = useState([]);
  const [eventConfig, setEventConfig] = useState(() => getBannerSettings().event);

  useEffect(() => {
    const handleBannerUpdate = (e) => {
      if (e.detail?.event) {
        setEventConfig(e.detail.event);
      } else {
        setEventConfig(getBannerSettings().event);
      }
    };
    window.addEventListener(BANNER_SETTINGS_EVENT, handleBannerUpdate);
    window.addEventListener("storage", handleBannerUpdate);
    return () => {
      window.removeEventListener(BANNER_SETTINGS_EVENT, handleBannerUpdate);
      window.removeEventListener("storage", handleBannerUpdate);
    };
  }, []);

  const loadEvents = (skipCache = false) => {
    eventAPI
      .getAll({ skipCache })
      .then((res) => {
        if (Array.isArray(res?.events) && res.events.length > 0) {
          setEventsList(res.events);
        } else {
          setEventsList(eventsMaster);
        }
      })
      .catch(() => {
        setEventsList(eventsMaster);
      });
  };

  useEffect(() => {
    loadEvents(false);
    const unsub = wsClient.on("EVENTS_UPDATED", () => loadEvents(true));
    return () => {
      unsub();
    };
  }, []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  // Sidebar Filters
  const [dateFilter, setDateFilter] = useState("Any Date");
  const [customDate, setCustomDate] = useState("");
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);

  // Sort & View States
  const [sortBy, setSortBy] = useState("Upcoming First");
  const [viewMode, setViewMode] = useState("grid");
  const [wishlist, setWishlist] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Handlers for checkboxes
  const handleDurationToggle = (dur) => {
    setSelectedDurations((prev) =>
      prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur]
    );
  };

  const handleDifficultyToggle = (diff) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(6);
  }, [
    selectedCategory,
    searchQuery,
    selectedActivity,
    selectedLocation,
    dateFilter,
    customDate,
    selectedDurations,
    selectedDifficulties,
    sortBy,
  ]);

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedActivity("All");
    setSelectedLocation("All");
    setDateFilter("Any Date");
    setCustomDate("");
    setSelectedDurations([]);
    setSelectedDifficulties([]);
    setSortBy("Upcoming First");
    setVisibleCount(6);
  };

  const handleApplyFilters = () => {
    const listingEl = document.querySelector(".events-listing-content");
    if (listingEl) {
      listingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered Events Calculation
  const filteredEvents = useMemo(() => {
    const list = eventsList.length > 0 ? eventsList : eventsMaster;

    return list
      .filter((ev) => {
        // Hide cancelled or in-store only events
        if (ev.status === "Cancelled" || ev.visibility === "in-store") {
          return false;
        }

        // 1. Category pill filter
        if (!matchCategoryPill(ev, selectedCategory)) {
          return false;
        }

        // 2. Activity dropdown
        if (!matchActivity(ev, selectedActivity)) {
          return false;
        }

        // 3. Location dropdown
        if (!matchLocation(ev, selectedLocation)) {
          return false;
        }

        // 4. Search query
        if (!matchSearch(ev, searchQuery)) {
          return false;
        }

        // 5. Date filter
        if (!matchDateFilter(ev, dateFilter, customDate)) {
          return false;
        }

        // 6. Duration checkboxes
        if (!matchDurationFilter(ev.duration, selectedDurations)) {
          return false;
        }

        // 7. Difficulty checkboxes
        if (!matchDifficultyFilter(ev, selectedDifficulties)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Price: Low to High") {
          return parsePrice(a.price) - parsePrice(b.price);
        }
        if (sortBy === "Price: High to Low") {
          return parsePrice(b.price) - parsePrice(a.price);
        }
        if (sortBy === "Rating") {
          return (b.rating || 4.5) - (a.rating || 4.5);
        }
        if (sortBy === "Upcoming First") {
          const datesA = extractDatesFromEvent(a);
          const datesB = extractDatesFromEvent(b);
          const timeA = datesA[0] ? datesA[0].getTime() : 0;
          const timeB = datesB[0] ? datesB[0].getTime() : 0;
          return timeA - timeB;
        }
        return 0;
      });
  }, [
    eventsList,
    selectedCategory,
    searchQuery,
    selectedActivity,
    selectedLocation,
    dateFilter,
    customDate,
    selectedDurations,
    selectedDifficulties,
    sortBy,
  ]);

  return (
    <div className="event-page-wrapper">
      <Navbar />

      {/* Hero Banner with Search Bar Overlay */}
      <EventHero
        searchQuery={searchQuery}
        selectedActivity={selectedActivity}
        selectedLocation={selectedLocation}
        onSearchChange={setSearchQuery}
        onActivityChange={setSelectedActivity}
        onLocationChange={setSelectedLocation}
      />

      {/* Category Icon Pills Navigation Bar */}
      <EventCategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        pillsContainerRef={pillsContainerRef}
      />

      {/* Main Events Layout Container */}
      <section className="dzire-events-main-section">
        <div className="dzire-events-container">
          {/* Left Column: Filter Sidebar */}
          <EventSidebarFilter
            dateFilter={dateFilter}
            customDate={customDate}
            selectedDurations={selectedDurations}
            selectedDifficulties={selectedDifficulties}
            onDateFilterChange={setDateFilter}
            onCustomDateChange={setCustomDate}
            onDurationToggle={handleDurationToggle}
            onDifficultyToggle={handleDifficultyToggle}
            onResetFilters={resetFilters}
            onApplyFilters={handleApplyFilters}
          />

          {/* Right Column: Events Listing */}
          <main className="events-listing-content">
            {eventConfig?.belowBannerHeading && (
              <div style={{ marginBottom: "16px" }}>
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#0f172a",
                    margin: "0 0 4px 0",
                  }}
                >
                  {eventConfig.belowBannerHeading}
                </h2>
                {eventConfig?.belowBannerSubtitle && (
                  <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                    {eventConfig.belowBannerSubtitle}
                  </p>
                )}
              </div>
            )}

            {/* Listing Control Header Bar */}
            <EventListingHeader
              resultsCount={filteredEvents.length}
              sortBy={sortBy}
              viewMode={viewMode}
              onOpenMobileFilters={() => setShowMobileFilters(true)}
              onSortChange={setSortBy}
              onViewModeChange={setViewMode}
            />

            {/* Events Grid / Cards Container */}
            {filteredEvents.length === 0 ? (
              <div className="no-events-found">
                <h3>No events match your selected filters</h3>
                <p>Try resetting your filters or searching with a different term.</p>
                <button onClick={resetFilters} className="reset-events-btn">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`events-grid-container ${viewMode}`}>
                {filteredEvents.slice(0, visibleCount).map((ev) => (
                  <EventCard
                    key={ev.id || ev._id}
                    event={ev}
                    isWishlisted={!!wishlist[ev.id || ev._id]}
                    onToggleWishlist={toggleWishlist}
                    onClick={() => navigate(`/event/${ev.slug || ev.id || ev._id}`)}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredEvents.length > visibleCount && (
              <div className="load-more-events-wrap">
                <button
                  className="dz-event-load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  type="button"
                >
                  <span>Load More Events</span>
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Mobile Filter Drawer Modal */}
      <EventMobileFilterDrawer
        isOpen={showMobileFilters}
        dateFilter={dateFilter}
        customDate={customDate}
        selectedDurations={selectedDurations}
        selectedDifficulties={selectedDifficulties}
        filteredEventsCount={filteredEvents.length}
        onClose={() => setShowMobileFilters(false)}
        onDateFilterChange={setDateFilter}
        onCustomDateChange={setCustomDate}
        onDurationToggle={handleDurationToggle}
        onDifficultyToggle={handleDifficultyToggle}
        onResetFilters={resetFilters}
      />

      <Footer />
    </div>
  );
};

export default Event;
import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  categories,
  experiences,
  ITEMS_PER_PAGE,
} from "../data/eventCategoryData";
import EventCategorySidebar from "../components/event-category/EventCategorySidebar";
import EventCategoryCard from "../components/event-category/EventCategoryCard";
import EventCategoryPagination from "../components/event-category/EventCategoryPagination";
import "./EventCategoryPage.css";
import { eventAPI } from "../services/api";
import wsClient from "../services/websocket";

const matchCategoryToOption = (event, pageTitle) => {
  if (!event) return false;
  const titleClean = (pageTitle || "").toLowerCase().trim();
  const cat = (event.category || "").toLowerCase().trim();
  const type = (event.type || "").toLowerCase().trim();
  const eventTitle = (event.title || "").toLowerCase().trim();
  const desc = (event.description || "").toLowerCase().trim();

  // 1. Direct or partial category match
  if (cat && (titleClean.includes(cat) || cat.includes(titleClean))) {
    return true;
  }

  // 2. Specific domain keywords based on pageTitle
  if (titleClean.includes("camping") || titleClean.includes("hiking")) {
    if (
      cat.includes("camp") ||
      cat.includes("hike") ||
      cat.includes("trek") ||
      type.includes("camp") ||
      type.includes("hike") ||
      type.includes("trek") ||
      eventTitle.includes("camp") ||
      eventTitle.includes("hike") ||
      eventTitle.includes("trek")
    ) {
      return true;
    }
  }

  if (titleClean.includes("cycling")) {
    if (
      cat.includes("cycl") ||
      cat.includes("bike") ||
      type.includes("cycl") ||
      type.includes("bike") ||
      type.includes("ride") ||
      eventTitle.includes("cycl") ||
      eventTitle.includes("bike")
    ) {
      return true;
    }
  }

  if (titleClean.includes("climbing")) {
    if (
      cat.includes("climb") ||
      cat.includes("boulder") ||
      type.includes("climb") ||
      type.includes("boulder") ||
      eventTitle.includes("climb") ||
      eventTitle.includes("boulder")
    ) {
      return true;
    }
  }

  if (titleClean.includes("fitness")) {
    if (
      cat.includes("fit") ||
      cat.includes("run") ||
      cat.includes("yoga") ||
      type.includes("fit") ||
      type.includes("run") ||
      eventTitle.includes("fit") ||
      eventTitle.includes("run")
    ) {
      return true;
    }
  }

  if (titleClean.includes("outdoor skills")) {
    if (
      cat.includes("skill") ||
      cat.includes("safety") ||
      cat.includes("first aid") ||
      cat.includes("photo") ||
      type.includes("skill") ||
      type.includes("safety") ||
      type.includes("workshop") ||
      eventTitle.includes("safety") ||
      eventTitle.includes("survival") ||
      eventTitle.includes("photography")
    ) {
      return true;
    }
  }

  if (titleClean.includes("snowsports")) {
    if (
      cat.includes("snow") ||
      cat.includes("ski") ||
      type.includes("snow") ||
      eventTitle.includes("snow")
    ) {
      return true;
    }
  }

  if (titleClean.includes("stewardship")) {
    if (
      cat.includes("steward") ||
      cat.includes("conserv") ||
      cat.includes("clean") ||
      eventTitle.includes("conserv")
    ) {
      return true;
    }
  }

  if (titleClean.includes("travel")) {
    if (
      cat.includes("travel") ||
      cat.includes("tour") ||
      cat.includes("expedition") ||
      eventTitle.includes("expedition") ||
      eventTitle.includes("tour")
    ) {
      return true;
    }
  }

  if (titleClean.includes("watersports")) {
    if (
      cat.includes("water") ||
      cat.includes("kayak") ||
      cat.includes("raft") ||
      cat.includes("swim") ||
      eventTitle.includes("kayak") ||
      eventTitle.includes("raft")
    ) {
      return true;
    }
  }

  // 3. Fallback: check if keywords extracted from pageTitle match
  const words = titleClean.split(/\s+/).filter((w) => w.length > 3);
  return words.some(
    (w) => cat.includes(w) || type.includes(w) || eventTitle.includes(w) || desc.includes(w)
  );
};

// Robust date extractor helper
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

const EventCategoryPage = ({ pageTitle = "Camping And Hiking" }) => {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedExperiences, setSelectedExperiences] = useState([]);

  // Sidebar UI states
  const [activityOpen, setActivityOpen] = useState(true);
  const [experienceOpen, setExperienceOpen] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openItems, setOpenItems] = useState({ [pageTitle]: true });

  const loadEvents = (skipCache = false) => {
    setLoading(true);
    eventAPI
      .getAll(skipCache ? { skipCache: true } : {})
      .then((res) => {
        if (Array.isArray(res?.events)) {
          const visible = res.events.filter(
            (e) => e.visibility !== "in-store" && e.status !== "Cancelled"
          );
          setEventsList(visible.length > 0 ? visible : res.events);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEvents(false);
    const unsub = wsClient.on("EVENTS_UPDATED", () => loadEvents(true));
    return () => {
      unsub();
    };
  }, []);

  // When pageTitle changes (navigating between categories), keep current accordion open and reset subcategory
  useEffect(() => {
    setOpenItems((prev) => ({ ...prev, [pageTitle]: true }));
    setSelectedSubCategory("");
    setCurrentPage(1);
  }, [pageTitle]);

  // Reset pagination on any filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedLocation, selectedSubCategory, selectedExperiences]);

  // Handler for experience checkboxes
  const handleToggleExperience = (exp) => {
    setSelectedExperiences((prev) =>
      prev.includes(exp) ? prev.filter((item) => item !== exp) : [...prev, exp]
    );
  };

  // Handler for sub-category toggle
  const handleSelectSubCategory = (sub) => {
    setSelectedSubCategory((prev) => (prev === sub ? "" : sub));
  };

  const hasActiveFilters = Boolean(
    selectedDate ||
      selectedLocation ||
      selectedSubCategory ||
      selectedExperiences.length > 0
  );

  const handleResetFilters = () => {
    setSelectedDate("");
    setSelectedLocation("");
    setSelectedSubCategory("");
    setSelectedExperiences([]);
    setCurrentPage(1);
  };

  // Filter events matching current activity option and all active filters
  const matchingEvents = useMemo(() => {
    // 1. Base category match
    let list = eventsList.filter((event) => matchCategoryToOption(event, pageTitle));

    // 2. Sub-activity filter (e.g. "Trekking", "Camping", "Bouldering", "Mountain Biking")
    if (selectedSubCategory) {
      const s = selectedSubCategory.toLowerCase().trim();
      list = list.filter((event) => {
        const evCat = (event.category || "").toLowerCase();
        const evType = (event.type || "").toLowerCase();
        const evTitle = (event.title || "").toLowerCase();
        const evDesc = (event.description || "").toLowerCase();
        const evBadge = (event.badge || "").toLowerCase();
        return (
          evCat.includes(s) ||
          evType.includes(s) ||
          evTitle.includes(s) ||
          evDesc.includes(s) ||
          evBadge.includes(s)
        );
      });
    }

    // 3. Location filter
    if (selectedLocation) {
      const loc = selectedLocation.toLowerCase().trim();
      list = list.filter((event) => {
        const evLoc = (event.location || "").toLowerCase();
        const evAddr = (event.address || "").toLowerCase();
        return evLoc.includes(loc) || evAddr.includes(loc);
      });
    }

    // 4. Date filter (robust comparison)
    if (selectedDate) {
      const [cy, cm, cd] = selectedDate.split("-").map(Number);
      if (cy && cm && cd) {
        const target = new Date(cy, cm - 1, cd);
        const isSameDay = (d1, d2) =>
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();

        list = list.filter((event) => {
          const dates = extractDatesFromEvent(event);
          if (dates.length === 0) {
            return (event.date || "").includes(selectedDate);
          }
          return dates.some((d) => isSameDay(d, target));
        });
      }
    }

    // 5. Experience Type filter
    if (selectedExperiences.length > 0) {
      list = list.filter((event) => {
        const evType = (event.type || "").toLowerCase();
        const evCat = (event.category || "").toLowerCase();
        const evTitle = (event.title || "").toLowerCase();

        return selectedExperiences.some((exp) => {
          const expLower = exp.toLowerCase().trim();
          if (expLower.includes("workshop")) {
            return (
              evType.includes("workshop") ||
              evCat.includes("workshop") ||
              evTitle.includes("workshop")
            );
          }
          if (expLower.includes("class")) {
            return (
              evType.includes("class") ||
              evType.includes("session") ||
              evTitle.includes("class")
            );
          }
          if (expLower.includes("trip")) {
            return (
              evType.includes("trip") ||
              evType.includes("hike") ||
              evType.includes("trek") ||
              evType.includes("adventure") ||
              evType.includes("ride")
            );
          }
          if (expLower.includes("service") || expLower.includes("project")) {
            return (
              evType.includes("service") ||
              evType.includes("conserv") ||
              evTitle.includes("project")
            );
          }
          if (expLower.includes("special")) {
            return (
              event.featured ||
              evType.includes("special") ||
              (event.badge || "").toLowerCase().includes("special")
            );
          }
          if (expLower.includes("talk")) {
            return (
              evType.includes("talk") ||
              evType.includes("demo") ||
              evTitle.includes("talk")
            );
          }
          if (expLower.includes("basic") || expLower.includes("skill")) {
            return (
              evTitle.includes("basic") ||
              evTitle.includes("101") ||
              evCat.includes("skill") ||
              evType.includes("skill")
            );
          }
          return (
            evType.includes(expLower) ||
            evCat.includes(expLower) ||
            evTitle.includes(expLower)
          );
        });
      });
    }

    return list;
  }, [
    eventsList,
    pageTitle,
    selectedSubCategory,
    selectedLocation,
    selectedDate,
    selectedExperiences,
  ]);

  const totalPages = Math.max(1, Math.ceil(matchingEvents.length / ITEMS_PER_PAGE));

  const currentEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return matchingEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [matchingEvents, currentPage]);

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const toggleItem = (title) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const changePage = (page) => {
    setCurrentPage(page);
    setShowMobileFilter(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    const nextPage = currentPage < totalPages ? currentPage + 1 : 1;
    changePage(nextPage);
  };

  return (
    <>
      <Navbar />

      <div className="classes-page">
        <div className="classes-container">
          <div className="classes-heading-row classes-heading-simple">
            <div>
              <p className="classes-small-label">Classes & Events</p>
              <h1>
                {pageTitle} Classes & Events
                <span className="classes-results-count-text">
                  ({matchingEvents.length} {matchingEvents.length === 1 ? "Event" : "Events"} Available)
                </span>
              </h1>
            </div>
          </div>

          <div className="classes-layout">
            <EventCategorySidebar
              pageTitle={pageTitle}
              today={today}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedSubCategory={selectedSubCategory}
              onSelectSubCategory={handleSelectSubCategory}
              selectedExperiences={selectedExperiences}
              onToggleExperience={handleToggleExperience}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              activityOpen={activityOpen}
              setActivityOpen={setActivityOpen}
              experienceOpen={experienceOpen}
              setExperienceOpen={setExperienceOpen}
              showMobileFilter={showMobileFilter}
              setShowMobileFilter={setShowMobileFilter}
              openItems={openItems}
              toggleItem={toggleItem}
              categories={categories}
              experiences={experiences}
            />

            <section className="classes-content">
              {loading ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <p>Loading {pageTitle} events...</p>
                </div>
              ) : currentEvents.length > 0 ? (
                <div className="classes-grid">
                  {currentEvents.map((event) => (
                    <EventCategoryCard key={event.id || event._id || event.slug} event={event} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <h3>No {pageTitle} events match your selected filters</h3>
                  <p>Try clearing your filters or choosing a different date or location.</p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="classes-clear-filter-btn"
                      onClick={handleResetFilters}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {matchingEvents.length > ITEMS_PER_PAGE && (
                <EventCategoryPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onChangePage={changePage}
                  onNextPage={handleNextPage}
                />
              )}
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventCategoryPage;
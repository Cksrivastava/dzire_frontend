import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { allEvents } from "../data/eventDetail";
import EventDetailHero from "../components/event-detail/EventDetailHero";
import EventDetailHeader from "../components/event-detail/EventDetailHeader";
import EventDetailOverview from "../components/event-detail/EventDetailOverview";
import EventDetailAccordions from "../components/event-detail/EventDetailAccordions";
import EventDetailBookingCard from "../components/event-detail/EventDetailBookingCard";
import EventDetailStickyBar from "../components/event-detail/EventDetailStickyBar";
import "./EventDetail.css";
import { eventAPI } from "../services/api";

const EventDetail = () => {
  const { id, slug } = useParams();
  const eventIdentifier = slug || id;
  const navigate = useNavigate();
  const [showMoreDates, setShowMoreDates] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [learnOpen, setLearnOpen] = useState(true);

  const [remoteEvent, setRemoteEvent] = useState(null);

  const fetchEvent = () => {
    if (!eventIdentifier) return;
    eventAPI
      .getById(eventIdentifier)
      .then((res) => {
        if (res && res.event) {
          setRemoteEvent(res.event);
        }
      })
      .catch((err) => {
        console.warn("Failed to load event details:", err);
      });
  };

  useEffect(() => {
    fetchEvent();
  }, [eventIdentifier]);

  const event =
    remoteEvent ||
    allEvents.find(
      (item) =>
        String(item.slug) === String(eventIdentifier) ||
        String(item.id) === String(eventIdentifier) ||
        String(item._id) === String(eventIdentifier)
    ) ||
    allEvents[0];

  const [selectedDate, setSelectedDate] = useState({
    label: event?.date || "Upcoming Date",
    time: event?.time || "10:00 AM - 1:00 PM",
  });

  useEffect(() => {
    if (event) {
      setSelectedDate({
        label: event.date || "Upcoming Date",
        time: event.time || "10:00 AM - 1:00 PM",
      });
    }
  }, [event?.id, event?._id, event?.slug, event?.date, event?.time]);

  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const overviewElem = document.querySelector(".event-section-block");
      if (overviewElem) {
        const rect = overviewElem.getBoundingClientRect();
        if (rect.top <= 350) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      } else if (window.scrollY > 550) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRegister = () => {
    const slugOrId = event?.slug || event?.id || event?._id || eventIdentifier;
    navigate(`/event-register/${slugOrId}`, {
      state: {
        event: {
          ...event,
          date: selectedDate.label,
          time: selectedDate.time,
        },
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="event-detail-page">
        <div className="event-detail-container">
          {/* Back Button & Hero Banner Image */}
          <EventDetailHero event={event} onBack={() => navigate(-1)} />

          {/* Main Content Grid: Left Details + Right Sticky Price Box */}
          <div className="event-main-grid">
            {/* Left Column */}
            <div className="event-left-col">
              <EventDetailHeader
                event={event}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                showMoreDates={showMoreDates}
                setShowMoreDates={setShowMoreDates}
              />

              <EventDetailOverview event={event} />

              <EventDetailAccordions
                event={event}
                detailsOpen={detailsOpen}
                setDetailsOpen={setDetailsOpen}
                learnOpen={learnOpen}
                setLearnOpen={setLearnOpen}
              />
            </div>

            {/* Right Column: Sticky Price & Booking Card */}
            <EventDetailBookingCard
              event={event}
              onRegister={handleRegister}
            />
          </div>
        </div>
      </div>

      {/* Fixed/Sticky Bottom Booking Bar - Identical Structure to Product Page */}
      <EventDetailStickyBar
        event={event}
        showStickyBar={showStickyBar}
        onRegister={handleRegister}
      />

      <Footer />
    </>
  );
};

export default EventDetail;
import React from "react";

const OrangeCalendarIcon = ({ size = 15 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const OrangeClockIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const EventDetailHeader = ({
  event,
  selectedDate,
  setSelectedDate,
  showMoreDates,
  setShowMoreDates,
}) => {
  const typeLower = (event?.type || "Workshop").toLowerCase();
  let badgeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
  );

  if (typeLower.includes("adventure") || typeLower.includes("trek")) {
    badgeIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 3l4 8 5-5 5 15H2L8 3z" /></svg>
    );
  } else if (typeLower.includes("photo") || typeLower.includes("camera")) {
    badgeIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
    );
  }

  return (
    <>
      {/* Badge */}
      <div className="event-type-badge-pill">
        <span className="badge-icon-wrap">{badgeIcon}</span>
        <span>{(event.type || "WORKSHOP").toUpperCase()}</span>
      </div>

      {/* Title */}
      <h1 className="event-detail-title">{event.title}</h1>

      {/* Date & Time Row with Dropdown */}
      <div className="event-detail-date-row">
        <div className="event-detail-date-col">
          <div className="event-date-subrow">
            <OrangeCalendarIcon size={15} />
            <span className="date-label-bold">{selectedDate.label}</span>
          </div>
          {selectedDate.time && (
            <div className="event-time-subrow">
              <OrangeClockIcon size={14} />
              <span className="time-label-sub">{selectedDate.time}</span>
            </div>
          )}
        </div>
        {event.moreDates?.length > 0 && (
          <>
            <span className="vertical-sep">|</span>
            <button
              type="button"
              className="more-dates-trigger"
              onClick={() => setShowMoreDates(!showMoreDates)}
            >
              More Dates <ChevronDown open={showMoreDates} />
            </button>
          </>
        )}

        {showMoreDates && event.moreDates?.length > 0 && (
          <div className="more-dates-dropdown">
            {event.moreDates.map((item, idx) => (
              <div
                key={idx}
                className={`more-date-item ${selectedDate.label === item.label ? "active-date" : ""}`}
                onClick={() => {
                  setSelectedDate(item);
                  setShowMoreDates(false);
                }}
              >
                <p className="item-label">{item.label}</p>
                <span className="item-time">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EventDetailHeader;
export { OrangeCalendarIcon, OrangeClockIcon, ChevronDown };

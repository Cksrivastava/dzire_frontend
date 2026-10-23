// client/src/services/sectionSettings.js
// Dynamic configuration service for homepage showcase sections & headings

export const SECTION_SETTINGS_STORAGE_KEY = "dzire_section_titles_settings";
export const SECTION_SETTINGS_EVENT = "dzire_section_titles_updated";

export const DEFAULT_SECTION_SETTINGS = {
  // 1. Outdoor Collection
  outdoor: {
    prefixLine1: "Shop",
    prefixLine2: "your",
    titleLine1: "Outdoor",
    titleLine2: "Collection",
    showIcon: true,
  },

  // 2. Trending Gear
  trending: {
    title: "Trending Gear",
    badge: "200+ Products",
    description: "Discover the products outdoor enthusiasts are exploring the most.",
    showIcon: true,
  },

  // 3. New Arrivals
  newArrivals: {
    title: "New Arrivals",
    badge: "10+ Products",
    description: "Shop your gears, newly arrive at our website.",
    showIcon: true,
  },

  // 4. Budget Friendly (Gear for Every Budget!)
  budget: {
    badge: "BUDGET FRIENDLY",
    titleLine1: "Gear for",
    titleLine2: "Every Budget!",
    subtitle: "Quality products at prices that don't break the bank.",
    cards: [
      {
        id: 1,
        badge: "BEST VALUE",
        title: "STARTER PICKS",
        price: "499",
        btnText: "SHOP NOW",
      },
      {
        id: 2,
        badge: "TRENDING",
        title: "POPULAR GEAR",
        price: "999",
        btnText: "SHOP NOW",
      },
      {
        id: 3,
        badge: "TOP RATED",
        title: "PRO ESSENTIALS",
        price: "1,499",
        btnText: "SHOP NOW",
      },
      {
        id: 4,
        badge: "EDITOR'S CHOICE",
        title: "PREMIUM RANGE",
        price: "1,999",
        btnText: "SHOP NOW",
      },
    ],
  },

  // 5. Ways To Save (Outdoor adventures, offbeat escapes...)
  waysToSave: {
    title: "Outdoor adventures, offbeat escapes, and curated journeys for the explorer in you.",
    cards: [
      {
        id: 1,
        tag: "Save More on Outlet",
        heading: "The gear you love, for less",
        desc: "Save on expertly picked clothing and gear with up to 40% off at REI Outlet.",
        btnText: "Shop REI Outlet",
        btnLink: "/shop",
        image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        tag: "Bundle & Save 15% on Accessories",
        heading: "Make a splash",
        desc: "Save 15% on full-price paddles and PFDs with your kayak or stand up paddle board purchase.",
        btnText: "Shop watersports",
        btnLink: "/events/watersports",
        image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        tag: "Rent Premium Outdoor Gear",
        heading: "Rent instead of buying",
        desc: "Get top-brand tents, sleeping bags, and backpacks for rent at a fraction of retail prices.",
        btnText: "Explore Rentals",
        btnLink: "/rental",
        image: "https://images.unsplash.com/photo-1478131148067-21f180d070d6?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  // 6. Events (Join Experiences. Learn. Connect.)
  events: {
    subtitle: "UPCOMING EVENTS",
    title: "Join Experiences. Learn. Connect.",
    description: "Workshops, treks, and meetups for adventurers and explorers.",
  },

  // 7. Blogs (Stories, Tips & Adventure Guides)
  blogs: {
    subtitle: "FROM THE BLOG",
    title: "Stories, Tips & Adventure Guides",
    description: "Inspiration to help you explore more and travel better.",
  },
};

/**
 * Retrieve current section settings from localStorage with fallback to defaults
 */
export const getSectionSettings = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = localStorage.getItem(SECTION_SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          outdoor: { ...DEFAULT_SECTION_SETTINGS.outdoor, ...(parsed.outdoor || {}) },
          trending: { ...DEFAULT_SECTION_SETTINGS.trending, ...(parsed.trending || {}) },
          newArrivals: { ...DEFAULT_SECTION_SETTINGS.newArrivals, ...(parsed.newArrivals || {}) },
          budget: {
            ...DEFAULT_SECTION_SETTINGS.budget,
            ...(parsed.budget || {}),
            cards: Array.isArray(parsed.budget?.cards) && parsed.budget.cards.length > 0
              ? parsed.budget.cards
              : DEFAULT_SECTION_SETTINGS.budget.cards,
          },
          waysToSave: {
            ...DEFAULT_SECTION_SETTINGS.waysToSave,
            ...(parsed.waysToSave || {}),
            cards: Array.isArray(parsed.waysToSave?.cards) && parsed.waysToSave.cards.length > 0
              ? parsed.waysToSave.cards
              : DEFAULT_SECTION_SETTINGS.waysToSave.cards,
          },
          events: { ...DEFAULT_SECTION_SETTINGS.events, ...(parsed.events || {}) },
          blogs: { ...DEFAULT_SECTION_SETTINGS.blogs, ...(parsed.blogs || {}) },
        };
      }
    }
  } catch (err) {
    console.warn("Failed to load section settings from localStorage:", err);
  }
  return DEFAULT_SECTION_SETTINGS;
};

/**
 * Save section settings to localStorage and trigger instant live update event across app
 */
export const saveSectionSettings = (newSettings) => {
  try {
    const current = getSectionSettings();
    const merged = {
      outdoor: { ...current.outdoor, ...(newSettings?.outdoor || {}) },
      trending: { ...current.trending, ...(newSettings?.trending || {}) },
      newArrivals: { ...current.newArrivals, ...(newSettings?.newArrivals || {}) },
      budget: {
        ...current.budget,
        ...(newSettings?.budget || {}),
        cards: Array.isArray(newSettings?.budget?.cards)
          ? newSettings.budget.cards
          : current.budget.cards,
      },
      waysToSave: {
        ...current.waysToSave,
        ...(newSettings?.waysToSave || {}),
        cards: Array.isArray(newSettings?.waysToSave?.cards)
          ? newSettings.waysToSave.cards
          : current.waysToSave.cards,
      },
      events: { ...current.events, ...(newSettings?.events || {}) },
      blogs: { ...current.blogs, ...(newSettings?.blogs || {}) },
    };
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(SECTION_SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent(SECTION_SETTINGS_EVENT, { detail: merged }));
    }
    return true;
  } catch (err) {
    console.error("Failed to save section settings:", err);
    return false;
  }
};

/**
 * Reset section settings to initial defaults
 */
export const resetSectionSettings = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(SECTION_SETTINGS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(SECTION_SETTINGS_EVENT, { detail: DEFAULT_SECTION_SETTINGS }));
    }
    return true;
  } catch (err) {
    console.error("Failed to reset section settings:", err);
    return false;
  }
};

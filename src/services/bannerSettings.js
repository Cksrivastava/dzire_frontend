// Service to manage sitewide page banners and text dynamically
// Stored persistently in localStorage with fallback defaults and live event broadcasting.

export const BANNER_SETTINGS_KEY = "dzire_page_banners_settings";
export const BANNER_SETTINGS_EVENT = "dzire_page_banners_updated";

export const DEFAULT_BANNER_SETTINGS = {
  // 1. Events Page (/event)
  event: {
    pageName: "Events Page (/event)",
    pageRoute: "/event",
    imageMode: "url", // "url" | "upload"
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
    title: "EXPLORE ADVENTURES NEAR YOU",
    subtitle:
      "Discover treks, cycling events, camping trips, climbing workshops and more outdoor experiences.",
    belowBannerHeading: "Upcoming Outdoor Events & Treks",
    belowBannerSubtitle:
      "Handpicked journeys, certified guides & verified campsite bookings",
  },

  // 2. Rentals Page (/rental)
  rental: {
    pageName: "Rentals Page (/rental)",
    pageRoute: "/rental",
    imageMode: "url",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1600&q=80",
    title: "Trekking & Camping Equipment for Rent",
    subtitle:
      "Affordable daily rates on tents, down jackets, rucksacks & trekking poles.",
    belowBannerHeading: "Check out our premium",
    belowBannerSubtitle:
      "High-grade expedition equipment sanitized and thoroughly tested before every trip",
  },

  // 3. Blog Page (/blog)
  blog: {
    pageName: "Blog Page (/blog)",
    pageRoute: "/blog",
    imageMode: "url",
    image:
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80",
    title: "Stories, Tips & Adventure Guides",
    subtitle:
      "In-depth gear reviews, trail guides, packing checklists and Himalayan stories from passionate explorers.",
    belowBannerHeading: "Featured & Trending Topics",
    belowBannerSubtitle:
      "Curated trail guides, technical advice and community expeditions",
  },

  // 4. Home Page (/)
  home: {
    pageName: "Home Page (/)",
    pageRoute: "/",
    imageMode: "url",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
    title: "Running Shoes & Outdoor Gear Collection",
    subtitle:
      "Lightweight shoes, backpacks and gear for road, gym and daily outdoor training.",
  },

  // 5. About Us Page (/about)
  about: {
    pageName: "About Us Page (/about)",
    pageRoute: "/about",
    imageMode: "url",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    title: "ABOUT DZIRE STORE",
    subtitle:
      "Equipping India's adventurers, trekkers & athletes since 2018.",
  },

  // 6. Contact Us Page (/contact)
  contact: {
    pageName: "Contact Us Page (/contact)",
    pageRoute: "/contact",
    imageMode: "url",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    title: "Contact Us",
    subtitle:
      "Have a query about equipment, rental availability, or trek bookings? Our team is here 7 days a week.",
  },
};

/**
 * Retrieve current banner settings with safe fallbacks
 */
export const getBannerSettings = () => {
  try {
    const raw = localStorage.getItem(BANNER_SETTINGS_KEY);
    if (!raw) return DEFAULT_BANNER_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      event: {
        ...DEFAULT_BANNER_SETTINGS.event,
        ...(parsed.event || {}),
        image: parsed.event?.image || parsed.event?.bgImage || DEFAULT_BANNER_SETTINGS.event.image,
      },
      rental: {
        ...DEFAULT_BANNER_SETTINGS.rental,
        ...(parsed.rental || {}),
        image: parsed.rental?.image || DEFAULT_BANNER_SETTINGS.rental.image,
      },
      blog: {
        ...DEFAULT_BANNER_SETTINGS.blog,
        ...(parsed.blog || {}),
        image: parsed.blog?.image || parsed.blog?.bgImage || DEFAULT_BANNER_SETTINGS.blog.image,
      },
      home: {
        ...DEFAULT_BANNER_SETTINGS.home,
        ...(parsed.home || {}),
        image: parsed.home?.image || DEFAULT_BANNER_SETTINGS.home.image,
      },
      about: {
        ...DEFAULT_BANNER_SETTINGS.about,
        ...(parsed.about || {}),
        image: parsed.about?.image || parsed.about?.topBannerImage || DEFAULT_BANNER_SETTINGS.about.image,
      },
      contact: {
        ...DEFAULT_BANNER_SETTINGS.contact,
        ...(parsed.contact || {}),
        image: parsed.contact?.image || parsed.contact?.bgImage || DEFAULT_BANNER_SETTINGS.contact.image,
      },
    };
  } catch (err) {
    console.error("Failed to load banner settings from localStorage:", err);
    return DEFAULT_BANNER_SETTINGS;
  }
};

/**
 * Save new banner settings and notify all active listeners
 */
export const saveBannerSettings = (newSettings) => {
  try {
    const current = getBannerSettings();
    const merged = {
      ...current,
      ...newSettings,
    };
    localStorage.setItem(BANNER_SETTINGS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(BANNER_SETTINGS_EVENT, { detail: merged }));
    return true;
  } catch (err) {
    console.error("Failed to save banner settings to localStorage:", err);
    return false;
  }
};

/**
 * Reset banner settings back to factory default
 */
export const resetBannerSettings = () => {
  try {
    localStorage.removeItem(BANNER_SETTINGS_KEY);
    window.dispatchEvent(
      new CustomEvent(BANNER_SETTINGS_EVENT, { detail: DEFAULT_BANNER_SETTINGS })
    );
    return DEFAULT_BANNER_SETTINGS;
  } catch (err) {
    console.error("Failed to reset banner settings:", err);
    return DEFAULT_BANNER_SETTINGS;
  }
};

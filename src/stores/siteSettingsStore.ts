import { create } from "zustand";
import { persist } from "zustand/middleware";
import catHome from "@/assets/cat-home.jpg";
import catCommercial from "@/assets/cat-commercial.jpg";
import catUv from "@/assets/cat-uv.jpg";
import catFilters from "@/assets/cat-filters.jpg";

export interface SiteStat {
  label: string;
  value: string;
}

export interface HeroImageSettings {
  homeSlide1: string;
  homeSlide2: string;
  products: string;
  about: string;
  contact: string;
  blog: string;
  faq: string;
  footer: string;
}

export interface SolutionCard {
  title: string;
  desc: string;
  link: string;
  image: string;
}

export interface SiteSettings {
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  businessHours: string;
  gstin: string;
  homeStats: SiteStat[];
  aboutStats: SiteStat[];
  heroImages: HeroImageSettings;
  productSolutions: string[];
  homepageSolutions: SolutionCard[];
}

interface SiteSettingsStore {
  settings: SiteSettings;
  updateSettings: (data: SiteSettings) => void;
}

const defaultSettings: SiteSettings = {
  phone: "+91 9985851237",
  whatsappNumber: "919985851237",
  email: "info@waterfilterstore.in",
  address: "#7-13-23/2, NH-16 Main Road, Old Gajuwaka, Visakhapatnam - 530026, Andhra Pradesh",
  businessHours: "Mon-Sat: 9:00 AM - 7:00 PM | Sunday: 10:00 AM - 2:00 PM",
  gstin: "37ACHPL4663M1Z2",
  homeStats: [
    { label: "Happy Customers", value: "10,000+" },
    { label: "Customer Satisfaction", value: "98%" },
    { label: "Years of Experience", value: "10+" },
    { label: "Certified Engineers", value: "50+" },
  ],
  aboutStats: [
    { label: "Happy Customers", value: "10,000+" },
    { label: "Products", value: "50+" },
    { label: "Years Experience", value: "10+" },
    { label: "Average Rating", value: "4.7★" },
  ],
  heroImages: {
    homeSlide1: "",
    homeSlide2: "",
    products: "",
    about: "",
    contact: "",
    blog: "",
    faq: "",
    footer: "",
  },
  productSolutions: [
    "Home Water Solution",
    "Commercial Water Solution",
    "High TDS Water",
    "Municipal Water",
    "Borewell Water",
    "Hot and Cold Dispensing",
  ],
  homepageSolutions: [
    {
      title: "Home Water Solutions",
      desc: "Clean water, happy home. Choose the ideal filter for your family.",
      link: "/products?category=ro-purifiers",
      image: catHome,
    },
    {
      title: "Commercial Water Solutions",
      desc: "Enhance purity, elevate performance. Solutions for your commercial needs.",
      link: "/products?category=commercial",
      image: "/images/home-hero-industrial-800.webp",
    },
    {
      title: "Industrial Water Solutions",
      desc: "High-capacity solutions designed for demanding industrial purification needs.",
      link: "/products?category=uv-purifiers",
      image: catCommercial,
    },
    {
      title: "Filters & Accessories",
      desc: "Replacement filters, membranes, and maintenance kits.",
      link: "/products?category=filters-cartridges",
      image: catFilters,
    },
  ],
};

const normalizeSettings = (settings?: Partial<SiteSettings>): SiteSettings => ({
  ...defaultSettings,
  ...settings,
  homeStats: settings?.homeStats?.length ? settings.homeStats : defaultSettings.homeStats,
  aboutStats: settings?.aboutStats?.length ? settings.aboutStats : defaultSettings.aboutStats,
  heroImages: {
    ...defaultSettings.heroImages,
    ...(settings?.heroImages || {}),
  },
  productSolutions:
    settings?.productSolutions?.length
      ? settings.productSolutions
      : defaultSettings.productSolutions,
  homepageSolutions: (settings?.homepageSolutions?.length
    ? settings.homepageSolutions
    : defaultSettings.homepageSolutions
  ).map((solution) => {
    if (solution.title === "Commercial Water Solutions" && solution.image === catCommercial) {
      return { ...solution, image: "/images/home-hero-industrial-800.webp" };
    }
    if (
      solution.title === "Industrial Water Solutions" &&
      (solution.image === catUv || solution.image === "/images/home-hero-industrial-800.webp")
    ) {
      return { ...solution, image: catCommercial };
    }
    return solution;
  }),
});

export const useSiteSettingsStore = create<SiteSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (data) => set({ settings: normalizeSettings(data) }),
    }),
    {
      name: "aquasafe-site-settings",
      version: 7,
      migrate: (persistedState) => {
        const state = persistedState as { settings?: Partial<SiteSettings> } | undefined;
        const raw: Partial<SiteSettings> = { ...(state?.settings || {}) };
        if (raw.phone?.includes("9985850777")) {
          raw.phone = defaultSettings.phone;
        }
        if (raw.whatsappNumber === "919985850777") {
          raw.whatsappNumber = defaultSettings.whatsappNumber;
        }
        return {
          settings: normalizeSettings(raw),
        };
      },
    }
  )
);

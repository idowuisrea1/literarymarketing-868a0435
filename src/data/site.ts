// ✏️ Edit everything here: prices, links, contact details, portfolio.
import a from "@/assets/pf";

export const CONTACT = {
  whatsapp: "https://wa.me/2340000000000", // TODO: replace with real WhatsApp number
  calendly: "https://calendly.com/literarymarketing/strategy-call", // placeholder
  email: "hello@literarymarketing.com", // placeholder
  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    x: "https://x.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },
};

export type Pkg = { id: string; name: string; price: string; period: string; tagline: string; features: string[]; popular?: boolean };
export const PACKAGES: Pkg[] = [
  {
    id: "debut", name: "The Debut Author Package", price: "$299", period: "/month",
    tagline: "Get your book seen, the right way.",
    features: ["12 branded social posts / month", "2 platforms managed", "Welcome email sequence (3 emails)", "1 book spotlight graphic", "Monthly growth report"],
  },
  {
    id: "bestseller", name: "The Bestseller Tier", price: "$599", period: "/month", popular: true,
    tagline: "Build a reader movement around your book.",
    features: ["20 posts + 4 Reels / BookTok videos", "3 platforms managed", "Full email funnel + monthly newsletter", "1 book trailer", "3D book mockups", "Bi-weekly strategy call"],
  },
  {
    id: "empire", name: "The Publishing Empire Plan", price: "$1,199", period: "/month",
    tagline: "For publishers and serious series authors.",
    features: ["Daily content on all platforms", "Launch & pre-order campaigns", "ARC review mechanics", "Author website included", "Cover design or redesign", "Priority support"],
  },
];
export const ORDER_OPTIONS = [...PACKAGES.map((p) => p.name), "Custom quote: Author Website", "Custom quote: Other"];

export type Category = "Book Trailers" | "BookTok" | "Book Spotlights" | "Mockups" | "Cover Design" | "Content Design";
export const CATEGORIES: ("All" | Category)[] = ["All", "Book Trailers", "BookTok", "Book Spotlights", "Mockups", "Cover Design", "Content Design"];

export type Work = { id: string; title: string; cat: Category; img?: string | undefined; youtube?: string };

const yt = (id: string, title: string): Work => ({ id: `yt-${id}`, title, cat: "Book Trailers", youtube: id });

export const WORKS: Work[] = [
  yt("6MgL7enCGmI", "Book Trailer · Short"),
  yt("AhmJbAvhueE", "Book Trailer I"),
  yt("hleTcjUmxoc", "Book Trailer II"),
  yt("8DG3n8wUXXA", "Book Trailer III"),
  yt("CPG-2ALbUdA", "Book Trailer IV"),
  yt("fW3HKIWwm5U", "Book Trailer V"),
  yt("IHIBFc3lX6A", "Book Trailer VI"),
  yt("zyRxyaa8K3A", "Book Trailer VII"),
  yt("sd6xmk9LYpI", "Book Trailer VIII"),
  { id: "sp1", title: "Mały Przyjaciel", cat: "Book Spotlights", img: a["sp-maly"] },
  { id: "sp2", title: "Eddie", cat: "Book Spotlights", img: a["sp-eddie"] },
  { id: "sp3", title: "Memoirs of a Time Traveler", cat: "Book Spotlights", img: a["sp-memoirs"] },
  { id: "sp4", title: "Ashes of the Heart", cat: "Book Spotlights", img: a["sp-ashes"] },
  { id: "sp5", title: "Izzy's Dilemma", cat: "Book Spotlights", img: a["sp-izzy"] },
  { id: "sp6", title: "The Treaty of Two Worlds", cat: "Book Spotlights", img: a["sp-treaty"] },
  { id: "sp7", title: "Cloak King: Royal Blood", cat: "Book Spotlights", img: a["sp-cloak"] },
  { id: "sp8", title: "Mały Przyjaciel · Variant", cat: "Book Spotlights", img: a["sp-maly2"] },
  { id: "sp9", title: "I Am Fearfully and Wonderfully Made", cat: "Book Spotlights", img: a["sp-fearfully"] },
  { id: "mk1", title: "The Rose of Death", cat: "Mockups", img: a["mk-rose"] },
  { id: "mk2", title: "Dusk's Eternal Vow", cat: "Mockups", img: a["mk-dusk"] },
  { id: "mk3", title: "The Crimes of the Soul", cat: "Mockups", img: a["mk-crimes"] },
  { id: "mk4", title: "The Amber", cat: "Mockups", img: a["mk-amber"] },
  { id: "mk5", title: "The Blood Thief", cat: "Mockups", img: a["mk-blood"] },
  { id: "mk6", title: "Humanity Lost", cat: "Mockups", img: a["mk-humanity"] },
  { id: "cv1", title: "Eternal Stardust", cat: "Cover Design", img: a["cv-stardust"] },
  { id: "cv2", title: "Curse of Thorns and Fire", cat: "Cover Design", img: a["cv-curse"] },
  { id: "cv3", title: "Legends of the Lost Kingdoms", cat: "Cover Design", img: a["cv-legends"] },
  { id: "cv4", title: "The Mystical Realms", cat: "Cover Design", img: a["cv-mystical"] },
  { id: "cv5", title: "Of Snow and Steel", cat: "Cover Design", img: a["cv-snow"] },
  { id: "cv6", title: "Easy Method Spoken English", cat: "Cover Design", img: a["cv-english"] },
  { id: "cv7", title: "The Rose of Death · Cover", cat: "Cover Design", img: a["cv-rose"] },
  { id: "cd1", title: "Premade Cover Promo", cat: "Content Design", img: a["cd-premade"] },
  { id: "bt1", title: "BookTok Sample I (coming soon)", cat: "BookTok" },
  { id: "bt2", title: "BookTok Sample II (coming soon)", cat: "BookTok" },
  { id: "bt3", title: "BookTok Sample III (coming soon)", cat: "BookTok" },
];

export const FAQS = [
  { q: "What is included in each package?", a: "Every package includes content design, posting and a monthly report. Higher tiers add videos, email funnels and websites. See the pricing cards for the full list." },
  { q: "How fast do you start?", a: "Most campaigns go live within 5–7 days after our strategy call and your book details are in." },
  { q: "Do you need my full manuscript?", a: "No. A synopsis, your cover, a few favourite quotes and your target readers are enough." },
  { q: "How does payment work?", a: "After you order, we confirm details and send a secure invoice. Monthly plans are billed at the start of each month." },
  { q: "Can I cancel anytime?", a: "Yes. Monthly plans can be cancelled with 14 days' notice. No long contracts." },
  { q: "Do you work with traditionally published authors?", a: "Yes, we work with indie, self-published and traditionally published authors, plus small presses." },
  { q: "Will I own the designs and website?", a: "Yes. Once paid, every graphic, video and website we create for you is yours." },
  { q: "Which platforms do you manage?", a: "Instagram, TikTok, Facebook, X, Pinterest and YouTube Shorts, plus your email list." },
];

export const GENRES = ["Fantasy", "Romance", "Thriller / Mystery", "Sci-Fi", "Horror", "Literary Fiction", "Young Adult", "Children's", "Non-Fiction / Memoir", "Christian / Faith", "Other"];
export const SERVICES_LIST = ["Social Media Management", "Automated Email Marketing", "Author Website", "Book Trailer / BookTok", "Cover Design / Mockups", "Full Package"];

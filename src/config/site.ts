// ✏️ EDIT YOUR BUSINESS DETAILS HERE — this is the only file you need to change.

export const CONTACT = {
  // WhatsApp link (used by every WhatsApp button)
  whatsapp: "https://wa.me/2347033070181",
  // WhatsApp number as shown on the page
  whatsappDisplay: "+234 703 307 0181",
  // PLACEHOLDER: replace with your real Calendly booking link
  calendly: "https://calendly.com/YOUR-CALENDLY-LINK",
  // PLACEHOLDER: replace with your real email address
  email: "YOUR-EMAIL@example.com",
  // PLACEHOLDERS: replace with your real social profile links
  socials: {
    instagram: "https://instagram.com/YOUR-HANDLE",
    tiktok: "https://tiktok.com/@YOUR-HANDLE",
    x: "https://x.com/YOUR-HANDLE",
    linkedin: "https://linkedin.com/in/YOUR-HANDLE",
    youtube: "https://youtube.com/@YOUR-CHANNEL",
  },
};

// One-time project prices ("Starting from"). Change the numbers any time.
export const ONE_TIME = [
  { id: "cover", name: "Book Cover Design", from: "$120" },
  { id: "trailer", name: "Book Trailer", from: "$99" },
  { id: "booktok", name: "BookTok / UGC Video", from: "$40" },
  { id: "spotlight", name: "Book Spotlight Graphic Pack", from: "$75" },
  { id: "aplus", name: "Amazon A+ Content", from: "$120" },
  { id: "landing", name: "Landing / Squeeze Page", from: "$150" },
  { id: "website", name: "Author Website", from: "$450" },
  { id: "audit", name: "Website Audit", from: "$79" },
];

// Book trailers. The site tries to read each title from YouTube automatically.
// If YouTube's title is not the book name, the "title" you type here is used instead.
// Leave title as "" to let YouTube decide. Fill in "author" with the author's name.
export const TRAILERS: { url: string; title: string; author: string }[] = [
  { url: "https://youtu.be/6MgL7enCGmI", title: "Dragon Cursed", author: "Elise Kova" },
  { url: "https://youtu.be/AhmJbAvhueE", title: "", author: "" }, // ADD title
  { url: "https://youtu.be/hleTcjUmxoc", title: "The Wife Before", author: "" },
  { url: "https://youtu.be/8DG3n8wUXXA", title: "Emma Revived", author: "" },
  { url: "https://youtu.be/CPG-2ALbUdA", title: "", author: "" }, // ADD title
  { url: "https://youtu.be/fW3HKIWwm5U", title: "", author: "" }, // ADD title
  { url: "https://youtu.be/IHIBFc3lX6A", title: "Awakening", author: "" },
  { url: "https://youtu.be/zyRxyaa8K3A", title: "Blood Root", author: "" },
  { url: "https://youtu.be/sd6xmk9LYpI", title: "The Last Signal", author: "" },
];

// Case study result — replace with a real result when you have one.
export const CASE_STUDY_RESULT = "[Add a real result, e.g. clicks, saves, sales]";

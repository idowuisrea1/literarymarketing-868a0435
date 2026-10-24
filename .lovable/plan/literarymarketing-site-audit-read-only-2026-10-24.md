# Literarymarketing site audit (read-only)

Nothing was changed. Findings come from reading the code. Anything I could not confirm by running the site is marked **(unverified)**.

## Critical
1. **"Book a Call" buttons don't work.** The Calendly link is still `calendly.com/YOUR-CALENDLY-LINK`, and it's used by the hero, the contact section and the sticky mobile bar. Fix: add your real Calendly link, or point these buttons to WhatsApp until you have one.
2. **The footer social icons go to placeholder profiles** (Instagram, TikTok, X, LinkedIn, YouTube). Fix: add your real links, or hide icons that have no link.
3. **The admin password can be guessed over and over.** /admin checks one shared password with no limit on attempts, and every visitor can reach the page. Fix: add a short delay and an attempt limit, or move to a proper admin sign-in (email login with an admin role). Also check that the admin password is a long one **(unverified: I can't see its value)**.

## High
4. **You get no alert for new enquiries.** Leads and orders are only saved. Fix: set up an email domain and send a "new lead" email to idowuisreal@literarymarketing.online.
5. **Several things are still marked as samples or placeholders:** testimonials, results dashboard numbers, About stats, the case study result, 3 BookTok spots and some trailer titles. Real authors may trust these less. Fix: replace them with real details, or hide them until you have them.
6. **The contact form has a quiet failure.** If sending fails, the message is generic and the visitor's text isn't kept anywhere. Fix: offer WhatsApp or email as a backup right in the error message.

## Medium: SEO basics
7. The home page has no canonical link or `og:url`, and there is no share image. Links shared on WhatsApp or Facebook use an automatic screenshot. Fix: add a canonical link to https://literarymarketing.lovable.app, plus a 1200x630 share image made from your logo and a cover.
8. There is no sitemap, and robots.txt doesn't point to one. Fix: add a sitemap for the home page.
9. Page sections use `#anchor` links, which is fine for one page. But Google sees only one page, so services can't rank on their own. Optional: give Services, Portfolio and Pricing their own pages later.
10. There is no structured business data (Organization or ProfessionalService). Fix: add JSON-LD with your name, founder, email and WhatsApp.

## Medium: performance (unverified, no Lighthouse run)
11. The opening logo loader plus the 3D book may slow the first view and hurt the speed score. Fix: show the loader only briefly or drop it, and load the 3D book only after the page appears.
12. Three Google font families are loaded from Google's servers, which blocks the first view. Fix: trim the font weights you load and preload only the main ones.
13. Large portfolio images: check they're lazy-loaded and given fixed sizes so the page doesn't jump while loading **(unverified)**.

## Medium: accessibility
14. Hidden spam-trap fields use `aria-hidden` with no value. That's fine, but add `aria-hidden="true"` and `tabIndex={-1}` everywhere for consistency.
15. Form errors show as text but aren't linked to their fields (no `aria-invalid` or `aria-describedby`). Screen readers won't announce them. Fix: link each error to its field, and make the error area announce itself (`aria-live`).
16. Form fields rely on placeholder text with no visible labels. The labels vanish once someone starts typing. Fix: add small visible labels.
17. The mobile menu has no focus trap or Escape-to-close, and the hand-built backdrop isn't keyboard-dismissable. Fix: use the accessible Sheet/Dialog component.
18. Some low-contrast muted text sits over glass panels **(unverified contrast ratios)**.

## Low
19. Footer nav labels are generated with `capitalize`, so it shows "Faq". Fix: write "FAQ".
20. Header and footer brand text says "literarymarketing" in lowercase, while the logo says "Literary Marketing". Pick one.
21. The 404 and error pages use `min-h-screen`. Use `min-h-dvh` for mobile browsers.
22. The founder name is spelled "Isreal". Please confirm the spelling is intentional.

## Verified as fine
- The latest build has no recorded errors, and no runtime errors were logged.
- Earlier checks at 360, 390, 1280 and 1440px wide: nothing scrolls sideways.
- Public visitors can only add rows to leads, orders and newsletter. Reading them needs the admin key on the server. Submissions are rate-limited.
- The home page and /admin have their own titles and descriptions. /admin is hidden from search engines.
- Floating WhatsApp button and sticky mobile bar are present. The WhatsApp number is +234 703 307 0181.

## Recommended fix order (if approved)
1. Calendly and social links (needs your real links), or hide them.
2. Limit admin password attempts.
3. SEO: canonical link, share image, sitemap and structured data.
4. Accessibility: form labels and errors, accessible mobile menu.
5. Performance: lighter loader, fonts, then a mobile Lighthouse run to confirm.
6. New-lead email alerts (needs an email domain).

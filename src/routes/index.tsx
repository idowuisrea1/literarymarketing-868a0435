import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Services, AllServices } from "@/components/site/Services";
import { Portfolio } from "@/components/site/Portfolio";
import { Process, Results } from "@/components/site/Process";
import { Pricing } from "@/components/site/Pricing";
import { About, FAQ } from "@/components/site/About";
import { WhyUs, CaseStudy, LeadMagnet, LogoLoader } from "@/components/site/Extras";
import { Contact, Footer, FloatingBars } from "@/components/site/Contact";

const TITLE = "literarymarketing — Book Marketing for Authors & Publishers";
const DESC = "Social media management, automated email marketing, author websites, book trailers and cover design for authors, novelists and publishers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="grain relative">
      <LogoLoader />
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Services />
        <AllServices />
        <Portfolio />
        <CaseStudy />
        <Process />
        <Results />
        <Pricing />
        <About />
        <FAQ />
        <LeadMagnet />
        <Contact />
      </main>
      <Footer />
      <FloatingBars />
    </div>
  );
}

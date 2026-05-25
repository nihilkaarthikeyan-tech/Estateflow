import SmoothScroll   from "@/components/SmoothScroll";
import Navbar         from "@/components/landing/Navbar";
import Hero           from "@/components/landing/Hero";
import Ticker         from "@/components/landing/Ticker";
import Pain           from "@/components/landing/Pain";
import StatsBar       from "@/components/landing/StatsBar";
import Features       from "@/components/landing/Features";
import AIWorkflow     from "@/components/landing/AIWorkflow";
import Testimonials   from "@/components/landing/Testimonials";
import Comparison     from "@/components/landing/Comparison";
import FAQ            from "@/components/landing/FAQ";
import Contact        from "@/components/landing/Contact";
import Footer         from "@/components/landing/Footer";
import ChatWidget     from "@/components/chat/ChatWidget";
import VapiAgent      from "@/components/chat/VapiAgent";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="landing-mesh min-h-screen overflow-x-hidden relative">

        {/* Animated background orbs — fixed, parallax via GSAP */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </div>
        {/* Dot grid */}
        <div className="fixed inset-0 dot-grid pointer-events-none z-0" aria-hidden />

        {/* Page content */}
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <Ticker />
            <Pain />
            <StatsBar />
            <Features />
            <AIWorkflow />
            <Testimonials />
            <Comparison />
            <FAQ />
            <Contact />
          </main>
          <Footer />
        </div>

        <ChatWidget />
        <VapiAgent />
      </div>
    </SmoothScroll>
  );
}

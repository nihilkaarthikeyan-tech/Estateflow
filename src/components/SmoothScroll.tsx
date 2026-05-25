"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Init Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ── Cinematic scroll animations ───────────────────────────

    // Hero mockup parallax
    gsap.to(".hero-mockup", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-mockup",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // Floating notification cards parallax (different speeds)
    gsap.to(".float-card-left", {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-mockup",
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    });

    gsap.to(".float-card-right", {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-mockup",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Section headings — cinematic reveal
    gsap.utils.toArray<HTMLElement>(".cinematic-reveal").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 48, filter: "blur(8px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Bento cards stagger
    gsap.utils.toArray<HTMLElement>(".bento-card").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          delay: i * 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Stats count-up visual (just animate the card scale)
    gsap.utils.toArray<HTMLElement>(".stat-card").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 32, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          delay: i * 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Pain cards — slide in from sides alternating
    gsap.utils.toArray<HTMLElement>(".pain-card").forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
        {
          opacity: 1, x: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 87%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Background orbs — subtle scroll parallax
    gsap.to(".orb-1", {
      y: 200,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 3 },
    });
    gsap.to(".orb-2", {
      y: -150,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 2 },
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}

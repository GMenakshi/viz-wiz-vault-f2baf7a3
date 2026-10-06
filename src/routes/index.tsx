import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Fox,
  Search,
} from "lucide-react";

import baliImage from "@/assets/bali-coast-Dt5igx4L.jpg.asset.json";
import brokenBeachImage from "@/assets/broken-beach-C9wXLZ7e.jpg.asset.json";
import indonesiaImage from "@/assets/indonesia-volcano-BnNqYPQM.jpg.asset.json";
import keralaImage from "@/assets/kerala-hills-CP7s6-_O.jpg.asset.json";
import thailandImage from "@/assets/thailand-temple-CVhaOY8X.jpg.asset.json";
import { Button } from "@/components/ui/button";

const destinations = [
  {
    id: "thailand",
    name: "THAILAND",
    kicker: "Thailand",
    cardName: "Buddha temple",
    region: "Thailand",
    description:
      "Ancient temple spires meet the warm light of the coast. Discover a Thailand shaped by quiet rituals, vivid color, and open horizons.",
    image: thailandImage.url,
    imageAlt: "An ornate temple above a turquoise tropical coastline",
    dots: 5,
  },
  {
    id: "bali",
    name: "BALI",
    kicker: "Bali, Indonesia",
    cardName: "Island escape",
    region: "Bali, Indonesia",
    description:
      "Follow the island edge where emerald cliffs meet water in a hundred shades of blue. Bali moves to the rhythm of the sea.",
    image: baliImage.url,
    imageAlt: "Aerial view over the turquoise sea and green cliffs of Bali",
    dots: 3,
  },
  {
    id: "indonesia",
    name: "INDONESIA",
    kicker: "Indonesia",
    cardName: "Volcanic highlands",
    region: "Indonesia",
    description:
      "Above a sea of forest and mist, volcanic peaks trace the horizon. An island world made for slow mornings and long views.",
    image: indonesiaImage.url,
    imageAlt: "A volcanic peak rising over a misty tropical forest in Indonesia",
    dots: 3,
  },
  {
    id: "kerala",
    name: "KERALA",
    kicker: "Kerala, India",
    cardName: "Tea country",
    region: "Kerala, India",
    description:
      "Rolling tea gardens dissolve into the mist of the Western Ghats. Kerala invites you to take the scenic, unhurried route.",
    image: keralaImage.url,
    imageAlt: "Green tea plantations roll over the misty hills of Kerala",
    dots: 3,
  },
  {
    id: "broken-beach",
    name: "BROKEN BEACH",
    kicker: "Nusa Penida, Bali",
    cardName: "Broken Beach",
    region: "Nusa Penida, Bali",
    description:
      "A natural arch frames a quiet turquoise cove on Nusa Penida. Here, the coastline makes its own way through the stone.",
    image: brokenBeachImage.url,
    imageAlt: "A natural limestone arch curves over a turquoise cove in Nusa Penida",
    dots: 3,
  },
] as const;

type RailStyle = CSSProperties & { "--rail-index": number };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Foxico — Find Your Faraway" },
      {
        name: "description",
        content: "A cinematic collection of faraway places, from Indonesia to Kerala.",
      },
      { property: "og:title", content: "Foxico — Find Your Faraway" },
      {
        property: "og:description",
        content: "A cinematic collection of faraway places, from Indonesia to Kerala.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DestinationExplorer,
});

function DestinationExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => new Set());
  const pointerStart = useRef<number | null>(null);
  const activeDestination = destinations[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(destinations.length - 1, index)));
  }, []);

  useEffect(() => {
    destinations.forEach(({ image }) => {
      const preload = new Image();
      preload.src = image;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => Math.min(destinations.length - 1, current + 1));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => Math.max(0, current - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const travel = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(travel) < 70) return;
    setActiveIndex((current) =>
      travel < 0
        ? Math.min(destinations.length - 1, current + 1)
        : Math.max(0, current - 1),
    );
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="travel-shell">
      <section className="travel-stage" aria-label="Foxico destination explorer">
        <div className="travel-backdrop" aria-hidden="true">
          {destinations.map((destination, index) => (
            <img
              key={destination.id}
              className="backdrop-image"
              data-active={index === activeIndex}
              src={destination.image}
              alt=""
              width={1536}
              height={1024}
            />
          ))}
        </div>

        <header className="travel-header">
          <button className="brand-mark focus-ring" type="button" onClick={() => goTo(0)}>
            <Fox aria-hidden="true" />
            <span>Foxico</span>
          </button>
          <div className="travel-header-right">
            <nav className="top-links" aria-label="Main navigation">
              {['News', 'Destinations', 'Blog', 'Contact'].map((label) => (
                <Button key={label} type="button" variant="travelGhost" className="top-link">
                  {label}
                </Button>
              ))}
            </nav>
            <span className="greeting">Hello, Anney !</span>
            <Button type="button" variant="travelIcon" size="travelIcon" aria-label="Search destinations">
              <Search aria-hidden="true" />
            </Button>
          </div>
        </header>

        <nav className="destination-progress" aria-label="Destination slides">
          <div className="progress-line" aria-hidden="true" />
          {destinations.map((destination, index) => (
            <Button
              key={destination.id}
              type="button"
              variant="travelProgress"
              size="travelProgress"
              className="progress-stop"
              data-index={index}
              aria-label={`Show ${destination.name.toLowerCase()}`}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => goTo(index)}
            >
              {index === activeIndex ? String(index + 1).padStart(2, "0") : null}
            </Button>
          ))}
        </nav>

        <span className="vertical-count" key={`count-${activeIndex}`}>
          {String(activeIndex + 1).padStart(2, "0")}/{String(destinations.length).padStart(2, "0")}
        </span>

        <div className="destination-copy" key={activeDestination.id}>
          <div className="destination-kicker">{activeDestination.kicker}</div>
          <h1 className="destination-title">{activeDestination.name}</h1>
          <p className="destination-description">{activeDestination.description}</p>
          <Button type="button" variant="travelPrimary" size="travelCta" className="explore-button">
            <span>Explore</span>
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <div
          className="carousel-rail"
          aria-label="More destinations"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStart.current = null; }}
        >
          <div className="carousel-track" style={{ "--rail-index": activeIndex } as RailStyle}>
            {destinations.map((destination, index) => (
              <article
                className="destination-card"
                data-active={index === activeIndex}
                key={destination.id}
              >
                <div className="destination-card-label">
                  <span>{destination.cardName}, {destination.region}</span>
                  <div className="destination-card-dots" aria-hidden="true">
                    {Array.from({ length: destination.dots }, (_, dot) => <i key={dot} />)}
                  </div>
                </div>
                <div className="destination-card-media">
                  <button
                    className="destination-card-button focus-ring"
                    type="button"
                    aria-label={`View ${destination.name.toLowerCase()}`}
                    onClick={() => goTo(index)}
                  >
                    <img src={destination.image} alt={destination.imageAlt} width={1536} height={1024} />
                  </button>
                  <Button
                    type="button"
                    variant="travelIcon"
                    size="icon"
                    className="bookmark-button"
                    aria-label={`${bookmarked.has(destination.id) ? "Remove" : "Save"} ${destination.cardName}`}
                    aria-pressed={bookmarked.has(destination.id)}
                    onClick={() => toggleBookmark(destination.id)}
                  >
                    <Bookmark aria-hidden="true" fill={bookmarked.has(destination.id) ? "currentColor" : "none"} />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="bottom-controls">
          <span className="bottom-controls-note">Find your faraway</span>
          <div className="arrow-controls">
            <Button
              type="button"
              variant="travelArrow"
              size="travelArrow"
              aria-label="Previous destination"
              disabled={activeIndex === 0}
              onClick={() => goTo(activeIndex - 1)}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="travelArrow"
              size="travelArrow"
              aria-label="Next destination"
              disabled={activeIndex === destinations.length - 1}
              onClick={() => goTo(activeIndex + 1)}
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <span className="bottom-index" key={`bottom-${activeIndex}`}>
            {String(activeIndex + 1).padStart(2, "0")} <i /> {String(destinations.length).padStart(2, "0")}
          </span>
        </div>
      </section>
    </main>
  );
}
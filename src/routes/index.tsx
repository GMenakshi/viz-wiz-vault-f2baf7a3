import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Search,
} from "lucide-react";

import baliImage from "@/assets/bali-coast-Dt5igx4L.jpg.asset.json";
import brokenBeachImage from "@/assets/broken-beach-C9wXLZ7e.jpg.asset.json";
import indonesiaImage from "@/assets/indonesia-volcano-BnNqYPQM.jpg.asset.json";
import keralaImage from "@/assets/kerala-hills-CP7s6-_O.jpg.asset.json";
import thailandImage from "@/assets/thailand-temple-CVhaOY8X.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { destinationIndex, swipeDestination } from "@/lib/destination-navigation";

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
  const [menu, setMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const activeDestination = destinations[activeIndex] ?? destinations[0];

  const goTo = useCallback((index: number) => {
    setActiveIndex(destinationIndex(index));
    setMenu(null);
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    destinations.forEach(({ image }) => {
      const preload = new Image();
      preload.src = image;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable)) return;
      if (event.key === "Escape") setMenu(null);
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => destinationIndex(current + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => destinationIndex(current - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    suppressClick.current = false;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const travel = event.clientX - pointerStart.current.x;
    const vertical = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(travel) < 70 || Math.abs(travel) < Math.abs(vertical)) return;
    suppressClick.current = true;
    setActiveIndex((current) => swipeDestination(current, travel));
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
          <Button variant="travelGhost" className="brand-mark focus-ring" type="button" aria-label="Foxico home" onClick={() => goTo(0)}>
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M4.2 10.1 8.1 3.7l5.8 5.1h4.2l5.8-5.1 3.9 6.4-1.4 11.1-8.5 6.1h-3.8l-8.5-6.1L4.2 10.1Z" fill="currentColor" />
              <path d="m10.3 16.1 5.7 3.1 5.7-3.1-2.2 6.3h-7l-2.2-6.3Z" fill="var(--foreground)" />
              <path d="M11.2 12.7h.1m9.4 0h.1" stroke="var(--foreground)" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span>Foxico</span>
          </Button>
          <div className="travel-header-right">
            <nav className="top-links" aria-label="Main navigation">
              {['News', 'Destinations', 'Blog', 'Contact'].map((label) => (
                <Button key={label} type="button" variant="travelGhost" className="top-link" aria-expanded={menu === label} onClick={() => setMenu((current) => current === label ? null : label)}>
                  {label}
                </Button>
              ))}
            </nav>
            <span className="greeting">Hello, Anney !</span>
            <Button type="button" variant="travelIcon" size="travelIcon" aria-label="Search destinations" onClick={() => { setMenu(null); setSearchOpen(true); }}>
              <Search aria-hidden="true" />
            </Button>
          </div>
        </header>

        {menu && <div className="top-popover">
          <h2>{menu === "Destinations" ? "Find a place that stays with you." : menu === "News" ? "From the faraway files" : menu === "Blog" ? "The Foxico journal" : "Where would you like to go?"}</h2>
          {menu !== "Destinations" && <p>{menu === "News" ? "A little inspiration for wherever the next journey takes you." : menu === "Blog" ? "Field notes, quiet corners, and the stories behind the places." : "Start with a place that speaks to you. Your next journey begins there."}</p>}
          <div className="quick-destinations">
            {menu === "Destinations" ? destinations.map((destination, index) => <Button variant="travelGhost" className="quick-destination" key={destination.id} onClick={() => goTo(index)}>{destination.name}</Button>) : <Button variant="travelGhost" className="quick-destination" onClick={() => { setMenu(null); setSearchOpen(true); }}><Search />{menu === "News" ? "Explore the collection" : menu === "Blog" ? "Find a destination" : "Search destinations"}</Button>}
          </div>
        </div>}

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

        <div className="destination-copy">
          {destinations.map((destination, index) => <div className="copy-layer" key={destination.id} data-active={index === activeIndex} aria-hidden={index !== activeIndex} inert={index !== activeIndex}>
            <div className="destination-kicker">{destination.kicker}</div>
            <h1 className="destination-title">{destination.name}</h1>
            <p className="destination-description">{destination.description}</p>
            <Button type="button" variant="travelPrimary" size="travelCta" className="explore-button" onClick={() => setDetailsOpen(true)}>
              <span>Explore</span>
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>)}
        </div>

        <div
          className="carousel-rail"
          aria-label="More destinations"
          onPointerDown={handlePointerDown}
          onPointerMove={(event) => {
            if (pointerStart.current && Math.abs(event.clientX - pointerStart.current.x) > 12) event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStart.current = null; }}
          onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
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
                  <Button
                    variant="travelGhost"
                    className="destination-card-button focus-ring"
                    type="button"
                    aria-label={`View ${destination.name.toLowerCase()}`}
                    onClick={() => goTo(index)}
                  >
                    <img src={destination.image} alt={destination.imageAlt} width={1536} height={1024} draggable={false} />
                  </Button>
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
          <span className="bottom-controls-note">Somewhere worth finding</span>
          <div className="arrow-controls">
            <Button
              type="button"
              variant="travelArrow"
              size="travelArrow"
              aria-label="Previous destination"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((current) => destinationIndex(current - 1))}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="travelArrow"
              size="travelArrow"
              aria-label="Next destination"
              disabled={activeIndex === destinations.length - 1}
              onClick={() => setActiveIndex((current) => destinationIndex(current + 1))}
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <span className="bottom-index" key={`bottom-${activeIndex}`} aria-live="polite" aria-label={`Slide ${activeIndex + 1} of 5`}>
            {String(activeIndex + 1).padStart(2, "0")} <i /> {String(destinations.length).padStart(2, "0")}
          </span>
        </div>

        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="travel-dialog">
            <DialogTitle>Find your faraway</DialogTitle>
            <DialogDescription className="sr-only">Search the destination collection.</DialogDescription>
            <div className="search-field-wrap"><Search aria-hidden="true" /><input type="search" aria-label="Search a place or region" placeholder="Search a place or region" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div>
            <div className="search-results">
              {destinations.map((destination, index) => ({ destination, index })).filter(({ destination }) => `${destination.name} ${destination.region} ${destination.cardName}`.toLowerCase().includes(searchQuery.toLowerCase())).map(({ destination, index }) => <Button variant="travelGhost" className="search-result" key={destination.id} onClick={() => goTo(index)}><span><strong>{destination.name}</strong><small>{destination.region}</small></span><ArrowRight /></Button>)}
              {!destinations.some((destination) => `${destination.name} ${destination.region} ${destination.cardName}`.toLowerCase().includes(searchQuery.toLowerCase())) && <p>No destinations found. Try a region or another name.</p>}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="travel-dialog">
            <p className="details-eyebrow">{activeDestination.region}</p>
            <DialogTitle>{activeDestination.name}</DialogTitle>
            <DialogDescription>{activeDestination.description}</DialogDescription>
            <Button variant="travelPrimary" size="travelCta" onClick={() => { setDetailsOpen(false); setSearchOpen(true); }}>Find another place<ArrowRight /></Button>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
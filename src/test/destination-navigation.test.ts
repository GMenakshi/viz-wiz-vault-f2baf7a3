import { describe, expect, it } from "vitest";
import { destinationIndex, swipeDestination } from "@/lib/destination-navigation";

describe("Destination navigation", () => {
  it("stops at the fifth destination rather than entering an empty state", () => {
    expect(destinationIndex(5)).toBe(4);
    expect(destinationIndex(-1)).toBe(0);
  });

  it("moves to the next destination on a left swipe", () => {
    expect(swipeDestination(0, -80)).toBe(1);
  });

  it("moves to the previous destination on a right swipe", () => {
    expect(swipeDestination(2, 80)).toBe(1);
  });

  it("ignores a short accidental drag", () => {
    expect(swipeDestination(2, 25)).toBe(2);
  });
});
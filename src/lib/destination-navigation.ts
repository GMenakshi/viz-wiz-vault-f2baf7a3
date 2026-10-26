export const DESTINATION_COUNT = 5;
export const SWIPE_THRESHOLD = 70;

export function destinationIndex(index: number) {
  return Math.max(0, Math.min(DESTINATION_COUNT - 1, index));
}

export function swipeDestination(index: number, distance: number) {
  if (Math.abs(distance) < SWIPE_THRESHOLD) return index;
  return destinationIndex(index + (distance < 0 ? 1 : -1));
}
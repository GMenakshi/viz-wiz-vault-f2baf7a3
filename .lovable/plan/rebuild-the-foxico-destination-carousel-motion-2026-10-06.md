# Rebuild the Foxico destination carousel motion

## Scope
- Recreate the existing Foxico destination page at `/` from the linked live site without changing its visual direction, copy, navigation, hero composition, or five destinations.
- Replace only the destination interaction architecture with one continuously mounted horizontal card rail driven by a single active destination index.

## Implementation
- Bring the existing five destination photographs into the project asset flow and define one reusable destination data set.
- Build synchronized hero background crossfades, staggered title/description/button transitions, animated progress markers, and a subtle counter transition.
- Move the complete card track with a calculated `translate3d` position and the reference easing/duration; retain each card’s image, label, dots, and independent bookmark state.
- Support previous/next controls, marker and card selection, keyboard arrows, rapid repeated input, and touch swipe while preserving the horizontal composition on smaller screens.
- Respect reduced-motion preferences and preload the destination imagery.

## Validation
- Compare the rendered desktop timing, card spacing, travel distance, active-card position, and synchronization against the uploaded video.
- Check responsive layouts, keyboard controls, bookmarks, repeated navigation, previous/next direction, progress selection, and touch swipe.
- Confirm the page builds cleanly and includes route-specific metadata.
# Design System Specification: The Digital Keepsake

## 1. Overview & Creative North Star
This design system is built to evoke the tactile, emotional experience of a physical scrapbook, reimagined for a premium digital farewell. We are moving away from the rigid, clinical structures of traditional web design toward a "Creative North Star" we call **The Curated Memory.**

The goal is to balance "intentional chaos" with high-end editorial precision. We achieve this through a "compositional" approach rather than a "grid" approach. By utilizing overlapping layers, varying rotations, and a sophisticated pastel palette, the UI feels like a collection of moments pinned to a board. It is warm, nostalgic, and deeply human, yet remains polished through expert typography and tonal depth.

---

## 2. Color Strategy & Tonal Depth
The palette is a curated selection of soft pastels designed to feel like sun-bleached polaroids and vintage stationary.

### The "No-Line" Rule
To maintain the soft, organic feel of a scrapbook, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background color shifts. For instance, a section utilizing `surface-container-low` (#f0f1f1) should sit directly against a `surface` background (#f6f6f6) to create a soft transition.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of paper. Depth is created by nesting surface tiers:
- **Base Layer:** `surface` (#f6f6f6)
- **Secondary Sections:** `surface-container-low` (#f0f1f1)
- **Primary Cards/Elements:** `surface-container-lowest` (#ffffff) for maximum "pop" and perceived lift.

### Glass & Signature Textures
- **The Glass Rule:** For floating elements like navigation bars or celebratory "toast" notifications, use a semi-transparent `surface_container_lowest` (80% opacity) with a `24px` backdrop-blur. This allows the pastel chaos beneath to bleed through softly.
- **Signature Gradients:** Move beyond flat fills for CTAs. Use subtle linear gradients, such as `primary_container` (#f8bbd0) transitioning to `tertiary_container` (#f5d1fb) at a 45-degree angle. This adds a "soul" to the buttons that flat color cannot replicate.

---

## 3. Typography: Editorial Playfulness
The typography scale balances the whimsical nature of college memories with the clarity required for a seamless user experience.

- **Display & Headline (Plus Jakarta Sans/Rounded):** Used for "moments" and major section headings. These should feel expressive. Use `display-lg` (3.5rem) for hero sections to anchor the page.
- **Title & Body (Inter):** Inter provides the necessary "adult" grounding. While headings are playful, the body text remains exceptionally legible to handle long-form farewell messages.
- **Rhythm:** Always pair a `display-md` headline with a `body-lg` subtext. The contrast between the rounded, friendly headers and the technical precision of Inter creates a "modern-retro" tension.

---

## 4. Elevation & Depth: The Layering Principle
We reject traditional drop shadows in favor of **Tonal Layering** and **Ambient Light.**

### Ambient Shadows
When an element must "float" (like a photo card), use an extra-diffused shadow.
- **Token:** `shadow-xl`
- **Specs:** Blur: `40px`, Y-Offset: `12px`, Opacity: `6%`.
- **Color:** Instead of black, use a tinted version of `on-surface` (#2d2f2f) to mimic natural light filtering through the pastel environment.

### The "Ghost Border" Fallback
If a container needs more definition (e.g., on a high-brightness screen), apply a **Ghost Border**. Use the `outline-variant` token (#acadad) at **12% opacity**. It should be felt, not seen.

### Intentional Asymmetry
To lean into the scrapbook aesthetic, apply subtle rotations to cards and photos. Rotate primary elements between `-1.5deg` and `+1.5deg` to break the "perfect" digital line.

---

## 5. Components

### Cards (The "Scrap" Primitive)
Cards are the core of this design system.
- **Styling:** Use `surface-container-lowest` (#ffffff) with a radius of `xl` (3rem) or `lg` (2rem).
- **Layout:** Forbid divider lines. Use `body-sm` typography and vertical whitespace (32px+) to separate content blocks within a card.

### Buttons
- **Primary:** `primary_container` (#f8bbd0) fill with `on_primary_container` (#623648) text. Shape: `full` (pill-shaped). 
- **Secondary:** `secondary_container` (#b2e4fb) fill with `on_secondary_container` (#1f5467) text.
- **Interaction:** On hover, increase the elevation through a subtle `primary_fixed_dim` shadow rather than darkening the color.

### Chips (Doodle Tags)
- **Selection Chips:** Use `tertiary_container` (#f5d1fb). 
- **Shape:** `md` (1.5rem) to maintain a soft, pebble-like quality. 
- **Iconography:** Pair with "doodle" style icons (stars, sparkles) using the `on_tertiary_fixed` (#4c3253) color.

### Input Fields
- **Background:** `surface-container-high` (#e1e3e3).
- **Shape:** `md` (1.5rem).
- **Border:** No border on idle. On focus, use a 2px `secondary` (#2f6275) "Ghost Border" at 40% opacity.

---

## 6. Do’s and Don'ts

### Do:
- **Layer Elements:** Allow photo cards to slightly overlap text containers. 
- **Use "White Space" as a Color:** Treat empty space as a breathing room for the pastel colors to shine.
- **Vary Radii:** Use `xl` for large cards and `sm` for small tags to create visual hierarchy.

### Don’t:
- **Use Pure Black:** Never use #000000. Use `on_surface` (#2d2f2f) for all text to keep the vibe warm.
- **Use Hard Lines:** Avoid 1px dividers between list items. Use a background shift to `surface-container-low` instead.
- **Align Everything to a Grid:** If the layout looks too "perfect," it loses the scrapbook soul. Introduce slight offsets.

---

## 7. Signature Elements: The "Doodle" Layer
To finalize the "high-end" feel, treat the `on_surface_variant` (#5a5c5c) tokens as ink. Use these for small, hand-drawn star or sparkle icons tucked into the corners of cards. These should be placed mathematically but appear spontaneous, adding a final layer of charm to the digital experience.
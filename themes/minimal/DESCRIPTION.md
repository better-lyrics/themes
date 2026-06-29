# Better Lyrics – Minimal Immersive Theme (v1.7.7)

A clean, performance-focused theme for the **Better Lyrics** extension on **YouTube Music**.

Optimized for portrait view with minimal resource usage, and packed with quality-of-life refinements.

This theme removes most lyric swipe and word animations, replacing them with a smooth, opacity-based focus system. The result is a calm, immersive, distraction-free lyrics experience with dynamic blurred album art backgrounds.

> "Time, Tide, & I wait for nothing."

— *Boidu (probably)*

![Minimal](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/1.png)

## 📖 Table of Contents
- [✨ Who Is This Theme For?](#-who-is-this-theme-for)
- [🔤 Typography](#-typography)
- [🎯 Lyrics Behavior](#-lyrics-behavior)
- [🚫 Animation Changes](#-animation-changes)
- [🌌 Background System](#-background-system)
- [📱 Fullscreen & Portrait Support](#-fullscreen--portrait-support)
- [🎵 'No Lyrics Found' Experience](#-no-lyrics-found-experience)
- [📦 Loader & Ad Overlay](#-loader--ad-overlay)
- [🎨 UI Enhancements](#-ui-enhancements)
- [⚙ Performance Notes](#-performance-notes)
- [🛠 Customization Guide](#-customization-guide)
- [🎛 Album & Playlist Header Buttons](#-album--playlist-header-buttons)
- [🔌 Standalone Plugins](#-standalone-plugins)
 
[`Plugin codeblock for replacing karaoke with opacity based animation at the end`](#-standalone-plugins)

---

## ✨ Who Is This Theme For?

- Users who dislike flashy lyric animations
- Users who want a cinematic album-art background
- Users who prefer readability over motion
- Users with low-range systems who want better performance
- Minimalist aesthetic lovers

**Design principles:**
- Minimal motion
- Strong focus on current lyric
- Soft, immersive blurred background
- Consistent typography
- Performance-aware design

Animations are intentionally disabled or simplified for a stable and readable experience.

---

## 🔤 Typography

- Uses **Google Sans Flex** as the primary typeface via Google Fonts, with **Roboto Flex** as a fallback, backed by native system fonts and Noto Sans for universal language and character support.
- Applies globally across the page (can be removed in Section 2 if you prefer YouTube defaults).
- Heavy emphasis on:
  - High contrast white text
  - Clean scaling
  - Balanced line height

To revert to default YouTube font:
- Delete the `font-family` override in **Section-2**.

---

## 🎯 Lyrics Behavior

### Visibility Model (Section 3.1)

![Edit lyrics' transparency levels](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/2.png)

The theme uses opacity instead of animation emphasis. You can adjust the focus intensity by modifying these variables in `:root` (Section 3.1):

```css
--current-lyric-visibility: 1;      /* 100% opacity for active line */
--previous-lyrics-visibility: 0.35; /* 35% opacity for past lines */
--next-lyrics-visibility: 0.02;     /* 2% opacity for upcoming lines */
```

This makes it very easy to:

* Increase focus intensity
* Fade surrounding lines more
* Create a “floating spotlight” effect
* Prevent accidental reading of next lyrics

### Translations & Romanization
* **Smooth Reveal:** Translated and romanized lines ease into view beautifully without jarring the layout, when enabled.

![Performance and Elegance](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/3.png)

---

## 🚫 Animation Changes

This theme explicitly:

* Disables rich sync animations
* Removes word glow/wobble effects
* Removes swipe transitions
* Removes shimmer on active words
* Neutralizes pseudo-elements

If you want default Better Lyrics animations back:

Delete:

* **Section-2 font family line**
* **Section 3.1**
* **Section 3.2**
* **Section 4**
* **Section 6**
* **Section 25**

Then control animations via Better Lyrics settings instead.

---

## 🌌 Background System
**(Section 3.3)**

The default Dynamic album art background with:

* Blur: **Off by default** for best performance _(toggle back on in Section 3.3)_
* Brightness: `0.20` _(lowered for legibility)_
* Contrast: `0.85` _(lowered contrast for black color differentiation)_
* Saturation: `1.0` _(neutral — no artificial boost)_
* Smooth transition delay

You can change the values in accordance to your preference

Performance Tip:
Blur is disabled by default. To turn it back on, set:

```css
--apply-blur-toggle: initial;
```

The blur strength itself is controlled separately via:

```css
--blur-amount: 30px;
```

You can also:

* Disable background entirely in extension settings
* Adjust brightness for darker or lighter moods

---

## 📱 Fullscreen & Portrait Support

This theme includes:

* Dedicated fullscreen lyric scaling
* Portrait window layout fixes
* Artist page dynamic backgrounds
* Smooth slide-up/down animation when opening or collapsing the full player page on mobile web layouts
* Smooth transition between player states
* No-lyrics slide animation
* Sidebar entry smoothing

Portrait mode:

* Removes backdrop filters
* Removes layered gradients
* Ensures clarity and clean edges

---

## 🎵 'No Lyrics Found' Experience

If synced lyrics aren’t found:

* Text fades out
* A subtle `♫` symbol appears
* Hover reveals: `"No lyrics found"`

No harsh error screens. Just a calm fallback.

---

## 📦 Loader & Ad Overlay

Custom loader system:

* Opacity animation instead of complex shimmer
* Smooth, bouncy enter/exit transitions for the loader and ad overlay
* Loader and lyrics wrapper cleanly hide during ad playback
* No animations when not in use
* No logo spinning

---

## 🎨 UI Enhancements

Includes refined styling and layout fixes to match the immersive dark aesthetic:

* **Immersive Artist Pages:** Full-bleed, dimmed backgrounds for artist pages with smooth scroll linked background.

![Dynamically Refined Artist Pages](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/4.png)

* **Immersive Album Pages:** Album Pages feature the album cover spanned over the background with black tint.

 ![Immersive Album Pages](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/5.png)

* **Player Queue:** Sticky headers, custom transparent chip designs, hover highlighting on queue items, and fixed dragging-state backgrounds.
* **Menus & Popups:** Refined 3-dot menu scroll behavior and compact, rounded volume popups.
* **Search & Navigation:** Darker search box backgrounds and customized tab headings with pill-style active indicator.
* **Notifications:** Auto-dismissing toast notifications that sweep away smoothly.
* **UI Cleanups:** Hidden scrollbars, transparent player bars, and removed gradient overlays.
* **Progress Bar & Controls:** Added smooth movement to the progress bar. Improved aesthetic of floating timestamps-tooltip.
* **Superellipse Corner Shaping:** All UI surfaces — album art, queue items, menus, toasts, volume popup, progress knob, and tabs — now use `corner-shape: superellipse` for a consistent squircle aesthetic.
* **Sidebar Navigation:** Guide items styled with subtle opacity and hover highlight for a cleaner sidebar feel.
* **Audio/Video Toggle (Section 33):** Restyled A/V toggle with transparent background, superellipse corner shaping, opacity-based visibility, and contextual fullscreen variant.
* **Player Controls (Section 34):** Play/pause button has a subtle filled background. Skip, seek, shuffle, repeat, and icon buttons are opacity-dimmed by default with a highlight ring on hover.
* **Album & Playlist Header Buttons (Section 35):** Action buttons on album and playlist detail pages use transparent backgrounds with a subtle inset ring outline, matching the overall ghost-button aesthetic. The primary play button gets a softened filled treatment; secondary buttons fade in on hover.
* **Track Lists (Section 36):** Track list rows get rounded squircle corners, a subtle hover highlight, and a lighter font weight on secondary columns for better visual hierarchy.
---

## ⚙ Performance Notes

For best performance:

1. Keep background blur disabled (default) or lower the blur amount if you enable it.
2. Disable background effects in Better Lyrics settings.
3. Keep animations disabled (as designed).

This theme is built to be visually rich without relying on heavy animation logic.

---

## 🛠 Customization Guide

Most quick edits are inside **Section 3**:

* **Section 3.1 & 3.2:** Tweak font sizes, weights, scroll timing, and lyric opacity levels.
* **Section 3.3:** Background blur is off by default — set `--apply-blur-toggle: initial;` to enable it, then adjust blur amount, saturation, brightness, and contrast.
* **Section 3.4:** The whole theme relies on the custom variables of oklch colors. Altering these may break parts of the theme configuration.

If you want:

* More animation → Use default Better Lyrics theme
* More immersion → Enable blur (Section 3.3) and increase brightness
* More performance → Keep blur off (default) and/or disable background

---

## 🔖 Version

**v1.7.7** — Last updated: 2026-06-28

Please report bugs or suggestions on the Better Lyrics Discord.

---

## 🔌 Standalone Plugins

If you prefer using the default Better Lyrics theme but just want to cherry-pick specific features from this Minimal theme, you can copy and paste the standalone code blocks below into your Custom CSS.

### 1. Opacity-Scroll Lyric Animation
*Replaces default karaoke styles, wobbles, and glows with smooth, opacity-based scrolling.*

<details>
<summary>Show CSS</summary>

```css
:root {
  --current-lyric-visibility: 1;
  /* 1 would mean 100%   */
  --previous-lyrics-visibility: 0.35;
  /* 0.35 would mean 35% */
  --next-lyrics-visibility: 0.02;
  /* 0.02 would mean 2%  */
  --hovered-line-visibility: calc(var(--current-lyric-visibility) * 0.8);
  --non-hovered-lines-visibility: calc(var(--current-lyric-visibility) * 0.5);
  --translated-lyric-visibility: 0.7; /* also romanized */
  --blyrics-footer-font-family: var(--blyrics-font-family);
  --blyrics-font-weight: 600;
  --blyrics-font-size: 3.5rem;
  --blyrics-translated-font-size: 0.6667em;
  --blyrics-line-height: 1.5;
  --blyrics-padding: 0.45em;

  --white-1:      oklch(1 0 0 / 1);   /* Lyrics Color      */
  --white-dot-60: oklch(1 0 0 / 0.60);/* Translations etc  */

  --blyrics-lyric-inactive-color: oklch(1 0 0/0.35);
  --blyrics-lyric-active-color: var(--white-1);
  --blyrics-error-color: oklch(0.75 0.25 20);
  --blyrics-ui-text-color: var(--blyrics-lyric-active-color);
  --blyrics-translated-color: var(--white-dot-60);

  --transition-curve: cubic-bezier(0.4, 0, 0.2, 1);
  /* scroll animation curve */

  --blyrics-lyric-scroll-duration: 0.7s;
  /* dont change without blyrics-queue-scroll-ms */

  --blyrics-lyric-scroll-timing-function: var(--transition-curve);

  --lyrics-opacity-transition: opacity calc(var(--blyrics-lyric-scroll-duration) * 0.75) var(--blyrics-lyric-scroll-timing-function);
  /* opacity transition time and curve */

  --blyrics-scale-transition-duration: var(--blyrics-lyric-scroll-duration);
  --blyrics-lyric-highlight-fade-in-duration: var(--blyrics-lyric-scroll-duration);
  --blyrics-lyric-highlight-fade-out-duration: var(--blyrics-lyric-scroll-duration);
  --blyrics-scroll-timing-offset: var(--blyrics-lyric-scroll-duration);
  --blyrics-wobble-duration: 0s;
  --blyrics-timing-offset: 0s;
  --blyrics-richsync-timing-offset: 0s;
}

/* Removing this block will affect lyric animation.
It's supposed to be in a comment like this to work.

;
blyrics-disable-richsync = true;
blyrics-line-synced-animation-delay = 0;
blyrics-lyric-ending-threshold-s = 0;
blyrics-early-scroll-consider-s = 0;
blyrics-queue-scroll-ms = 720;
blyrics-debug-renderer = false;
blyrics-target-scroll-pos-ratio = 0.4;
blyrics-add-extra-top-padding = true;
*/

/* Override Keyframes */
@keyframes blyrics-wobble {
  from, to { transform: none; }
}

@keyframes blyrics-glow {
  from, to { transform: none; }
}

/* Resetting Pseudo-elements and animations */
#blyrics-wrapper .blyrics--word::after,
#blyrics-wrapper .blyrics--word::before,
#blyrics-wrapper .blyrics-container::after,
#blyrics-wrapper .blyrics-container::before,
#blyrics-wrapper .blyrics-container>div>span::after {
  content: "";
  display: none;
  animation: none;
  transition: none;
  background: none;
  transform: none;
  filter: none;
}

/* Disabling active animations */
#blyrics-wrapper .blyrics-container>div>span.blyrics--animating,
#blyrics-wrapper .blyrics--word.blyrics--animating {
  animation: none;
  transform: none;
  filter: none;
  translate: none;
  perspective: none;
}

#blyrics-wrapper .blyrics--line.blyrics--pre-animating,
#blyrics-wrapper .blyrics--line.blyrics--pre-animating .blyrics--word {
  will-change: auto;
}

#blyrics-wrapper .blyrics--word {
  transform: none;
  will-change: auto;
}

/* Container Lines - Base State */
#blyrics-wrapper .blyrics-container>div {
  opacity: var(--previous-lyrics-visibility);
  transform: none;
  transition: var(--lyrics-opacity-transition);
}

/* Active Line */
#blyrics-wrapper .blyrics-container>div.blyrics--active {
  opacity: var(--current-lyric-visibility);
}

/* Next Lines (Lines strictly after the LAST active line) */
#blyrics-wrapper .blyrics-container > div.blyrics--active ~ div:where(:not(.blyrics--active):not(:has(~ .blyrics--active))) {
  opacity: var(--next-lyrics-visibility);
}

/* Text Colors */
#blyrics-wrapper .blyrics-container>div>span {
  color: var(--white-1);
}

/* Translations and Romanization */
#blyrics-wrapper :is(.blyrics--romanized, .blyrics--translated),
#blyrics-wrapper .blyrics--romanized,
#blyrics-wrapper .blyrics--translated {
  color: var(--white-1);
  font-size: var(--blyrics-translated-font-size);
  line-height: 1.5;
  opacity: var(--translated-lyric-visibility);
  transition: var(--lyrics-opacity-transition);
}

#blyrics-wrapper .blyrics-container>div.blyrics--active :is(.blyrics--romanized, .blyrics--translated) {
  opacity: var(--translated-lyric-visibility);
}

/* User Scrolling or Hover */
#blyrics-wrapper .blyrics-container:is(:hover, .blyrics-user-scrolling) > div:not(.blyrics--active):not(:hover) {
  opacity: var(--non-hovered-lines-visibility);
  transition: opacity 0.3s ease-out;
}

/* Specific Line Hover */
#blyrics-wrapper .blyrics-container:is(:hover, .blyrics-user-scrolling) > div:not(.blyrics--active):hover {
  opacity: var(--hovered-line-visibility);
  transition: opacity 0.1s ease-out;
}

/* Unsynced Lyrics */
#blyrics-wrapper .blyrics-container[data-sync="none"]>div {
  opacity: var(--current-lyric-visibility);
  transform: none;
  transition: none;
  margin-top: 0.5em;
  padding-block: 0 !important;
}

/* Layout Adjustments for Translations */
#blyrics-wrapper .blyrics-container .blyrics--romanized {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  font-weight: 200;
}

#blyrics-wrapper .blyrics-container .blyrics--translated {
  margin-top: 0.4em;
}

/* Fullscreen Specifics */
ytmusic-app-layout:not([is-mweb-modernization-enabled]) [player-fullscreened]:not([blyrics-dfs]) .blyrics-container {
  font-size: 4.5rem;
}

/* Final Overrides */
#blyrics-wrapper .blyrics-container>.blyrics--active.blyrics--active,
#blyrics-wrapper .blyrics-container>div.blyrics--animating {
  opacity: var(--current-lyric-visibility);
}

/* Previous Lines Enforcer */
#blyrics-wrapper .blyrics-container:has(> .blyrics--active):not(.blyrics-user-scrolling):not(:hover) > div:not(.blyrics--active):not(:where(.blyrics--active ~ div):not(:has(~ .blyrics--active))) {
  opacity: var(--previous-lyrics-visibility);
}

/* Footer's opacity is affected by .blyrics container */
/* Override for it along with hover implementation  */
#blyrics-wrapper#blyrics-wrapper > .blyrics-container .blyrics-footer {
    opacity: 1; 
}

#blyrics-wrapper#blyrics-wrapper > .blyrics-container .blyrics-footer > * { 
    opacity: 0.3; 
    transition: opacity 0.1s ease;
}

#blyrics-wrapper#blyrics-wrapper > .blyrics-container .blyrics-footer > *:hover { 
    opacity: 1;
}

/* Hardcoding system lyric stylization disabling */
.blyrics-container>div>span>span.blyrics--animating::after,
.blyrics-container>div>span>span.blyrics--animating,
.blyrics-container>div>div>span>span.blyrics--animating::after,
.blyrics-container>div>div>span>span.blyrics--animating {
  animation: none;
}
```

</details>

### 2. Optional Musical Note Plugins
#### Disable musical note animation

<details>
<summary>Show CSS</summary>

```css
.blyrics--instrumental-icon {
  display: none;
}
.blyrics--instrumental.blyrics--line::after {
  content: "♫";
}
```

</details>

#### Replace all breaks with musical notes
<details>
<summary>Show CSS</summary>

```css
.blyrics--line:has(.blyrics--word[data-content=""]) .blyrics--break {
  display: inline-flex;
  align-items: center;
  min-height: 1.5em;
  line-height: var(--blyrics-line-height);
}
.blyrics--line:has(.blyrics--word[data-content=""]) .blyrics--break::before {
  content: "♫";
  visibility: visible;
}
```

</details>

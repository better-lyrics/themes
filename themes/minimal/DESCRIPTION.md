# Better Lyrics – Minimal Immersive Theme (v1.8.1)

A clean, performance-focused theme for the **Better Lyrics** extension on **YouTube Music**. Removes most lyric swipe/word animations in favor of a smooth, opacity-based focus system, paired with a calm, blurred album-art background.

Requires **Better Lyrics v2.4.0+** — that release changed how word-level lyric highlighting renders, and this theme's lyric-animation sections target that newer markup.

> "Time, Tide, & I wait for nothing."
> — *Boidu (probably)*

![Minimal](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/1.webp)

## 📖 Table of Contents
- [🛠 Quick Customization](#-quick-customization)
- [🔤 Typography](#-typography)
- [🎯 Lyrics Behavior](#-lyrics-behavior)
- [🚫 Animation Changes](#-animation-changes)
- [🌌 Background System](#-background-system)
- [📱 Fullscreen & Portrait Support](#-fullscreen--portrait-support)
- [🎵 'No Lyrics Found' Experience](#-no-lyrics-found-experience)
- [📦 Loader & Ad Overlay](#-loader--ad-overlay)
- [🎨 UI Enhancements](#-ui-enhancements)
- [🔌 Standalone Plugins](#-standalone-plugins)

---

## 🛠 Quick Customization

Most tweaks live in **Section 3** at the top of the file:

* **Section 3.1 & 3.2** — lyric opacity levels, font size/weight, scroll timing.
* **Section 3.3** — background blur (off by default: `--apply-blur-toggle: initial;` to turn on), plus brightness/contrast/saturation.
* **Section 3.4** — shared OKLCH color/easing variables the rest of the theme depends on; edit with care.
* **Section-2** — delete the `font-family` line to fall back to YouTube's default font.

Want more animation? Switch back to the default Better Lyrics theme, or delete Sections 3.1, 3.2, 4, 6, and 25 to restore default lyric animation while keeping the rest of this theme.

---

## 🔤 Typography

Uses **Google Sans Flex** (via Google Fonts) with **Roboto Flex**, system fonts, and Noto Sans as fallbacks, applied site-wide. High-contrast white text, clean scaling, balanced line height.

Delete the `font-family` override in **Section-2** to revert to YouTube's default font.

---

## 🎯 Lyrics Behavior

### Visibility Model (Section 3.1)

![Edit lyrics' transparency levels](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/2.webp)

Instead of animating emphasis, the theme fades lines by opacity. Tune it in `:root`:

```css
--current-lyric-visibility: 1;      /* 100% opacity for active line */
--previous-lyrics-visibility: 0.35; /* 35% opacity for past lines */
--next-lyrics-visibility: 0.02;     /* 2% opacity for upcoming lines */
```

Raise or lower these for more or less focus intensity, a tighter "spotlight" effect, or to hide upcoming lines completely.

### Translations & Romanization
Translated and romanized lines ease into view without jarring the layout, when enabled.

![Performance and Elegance](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/3.webp)

---

## 🚫 Animation Changes

This theme disables rich-sync animations, word glow/wobble/swipe effects, and shimmer on active words.

Word effects are switched off via Better Lyrics' own `--blyrics-animate-word-wobble`, `--blyrics-animate-highlight-swipe`, and `--blyrics-animate-highlight-glow` variables (set in Section 3.2), with some extra CSS resets in Section 6 as a fallback.

To get default animations back, delete **Section-2**'s font line, **Section 3.1**, **3.2**, **4**, **6**, and **25**, then use Better Lyrics' own animation settings instead.

---

## 🌌 Background System
**(Section 3.3)**

Dynamic album-art background, tuned for legibility over spectacle:

* Blur: **off by default** for performance — enable with `--apply-blur-toggle: initial;`, then adjust strength via `--blur-amount: 30px;`
* Brightness: `0.20` (lowered for legibility)
* Contrast: `0.85`
* Saturation: `1.0` (unboosted)

You can also disable the background entirely in the extension's own settings.

---

## 📱 Fullscreen & Portrait Support

Dedicated fullscreen lyric scaling, portrait-window layout fixes, and dynamic artist-page backgrounds. Portrait mode drops backdrop filters and layered gradients for cleaner, cheaper rendering. Player-page open/close and no-lyrics states get a smooth slide transition on mobile web layouts.

---

## 🎵 'No Lyrics Found' Experience

If synced lyrics aren't found, the text fades out and a subtle `♫` appears in its place; hovering reveals "No lyrics found." No harsh error screens.

---

## 📦 Loader & Ad Overlay

The loading state uses a simple opacity shimmer instead of a spinning logo, with a smooth, slightly bouncy enter/exit transition. Both the loader and the lyrics wrapper cleanly hide during ad playback.

---

## 🎨 UI Enhancements

* **Immersive Artist Pages:** Full-bleed, dimmed backgrounds with a scroll-linked background.

![Dynamically Refined Artist Pages](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/4.webp)

* **Immersive Album Pages:** Album cover spans the background with a black tint.

 ![Immersive Album Pages](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/5.webp)

* **Player Queue:** Sticky headers, transparent chip design, hover highlighting, fixed dragging-state background.
* **Menus & Popups:** Refined 3-dot menu scroll behavior and a compact, rounded volume popup.
* **Search & Navigation:** Darker search box background and pill-style active tab indicator.
* **Notifications:** Toasts auto-dismiss and sweep away smoothly instead of sitting on screen.
* **UI Cleanups:** Hidden scrollbars, transparent player bar, removed gradient overlays.
* **Progress Bar & Controls:** Smoother progress movement and a cleaner floating timestamp tooltip.
* **Superellipse Corner Shaping:** Squircle corners (`corner-shape: superellipse`) applied consistently across album art, queue items, menus, toasts, the volume popup, and tabs.
* **Sidebar Navigation:** Guide items get subtle opacity and hover highlighting.
* **Audio/Video Toggle:** Transparent background, superellipse corners, opacity-based visibility, and a fullscreen variant.
* **Player Controls:** Play/pause gets a subtle filled background; skip, seek, shuffle, and repeat are dimmed by default with a hover highlight ring.
* **Album & Playlist Header Buttons:** Transparent, inset-ring buttons matching the theme's ghost-button look; the primary play button is filled, secondary buttons fade in on hover.
* **Track Lists:** Rounded row corners, subtle hover highlight, lighter font weight on secondary columns.
* **Floating Lyrics Dock & Autoscroll Resume Button:** Both restyled to match the ghost-button look — flat translucent background, thin inset outline instead of a shadow, no backdrop blur.

---

## 🔖 Version

**v1.8.1** — Last updated: 2026-07-31 — Requires Better Lyrics **v2.4.0+**

Please report bugs or suggestions on the Better Lyrics Discord.

**Credits:** Thanks to chengg, mukeen, drago, boidu, noah, and tposejank for code help and testing.

---

## 🔌 Standalone Plugins

Prefer the default Better Lyrics theme but want to cherry-pick a feature? Copy the blocks below into your Custom CSS. Like the main theme, these target Better Lyrics v2.4.0+.

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

  --blyrics-lyric-scroll-duration: 0.6s;
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

  /* v2.4.0+ animation-engine toggles — set to 0 to turn each effect off  */
  --blyrics-animate-line-scale: 0;
  --blyrics-animate-word-wobble: 0;
  --blyrics-animate-highlight-swipe: 0;
  --blyrics-animate-highlight-glow: 0;
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

/* Override Keyframes (kept as a fallback — word effects mainly run via the
   animate-* flags above, not these) */
@keyframes blyrics-wobble {
  from, to { transform: none; }
}

@keyframes blyrics-glow {
  from, to { transform: none; }
}

/* Resetting the word-highlight gradient and any leftover pseudo-elements */
#blyrics-wrapper .blyrics--word::after,
#blyrics-wrapper .blyrics--word::before,
#blyrics-wrapper .blyrics-container::after,
#blyrics-wrapper .blyrics-container::before,
#blyrics-wrapper .blyrics-container div .blyrics-word-highlight {
  content: "";
  display: none;
  animation: none;
  transition: none;
  background: none;
  transform: none;
  filter: none;
}

/* Disabling active animations (now only relevant to the instrumental note icon) */
#blyrics-wrapper .blyrics-container div .blyrics--word.blyrics--animating,
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
#blyrics-wrapper .blyrics-container > div {
  opacity: var(--previous-lyrics-visibility);
  transform: none;
  transition: var(--lyrics-opacity-transition);
}

/* Active Line */
#blyrics-wrapper .blyrics-container > div.blyrics--active {
  opacity: var(--current-lyric-visibility);
}

/* Next Lines (any line after an active one) */
#blyrics-wrapper .blyrics-container > div.blyrics--active ~ div:not(.blyrics--active) {
  opacity: var(--next-lyrics-visibility);
}

/* Text Colors */
#blyrics-wrapper .blyrics-container div .blyrics--word {
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

#blyrics-wrapper .blyrics-container > div.blyrics--active :is(.blyrics--romanized, .blyrics--translated) {
  opacity: var(--translated-lyric-visibility);
}

/* User Scrolling or Hover */
#blyrics-wrapper .blyrics-container:is(:hover, .blyrics-user-scrolling) > div:not(.blyrics--active):not(:hover) {
  opacity: var(--non-hovered-lines-visibility);
  transition: opacity 0.3s var(--transition-curve);
}

/* Specific Line Hover */
#blyrics-wrapper .blyrics-container:is(:hover, .blyrics-user-scrolling) > div:not(.blyrics--active):hover {
  opacity: var(--hovered-line-visibility);
  transition: opacity 0.1s var(--transition-curve);
}

/* Unsynced Lyrics */
#blyrics-wrapper .blyrics-container[data-sync="none"] > div {
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
#blyrics-wrapper .blyrics-container > .blyrics--active.blyrics--active {
  opacity: var(--current-lyric-visibility);
}

/* Hardcoding system lyric stylization disabling (instrumental icon only) */
.blyrics-container div span.blyrics--animating::after,
.blyrics-container div span.blyrics--animating {
  animation: none;
}

/* Footer (credit line) */
.blyrics-footer__container.blyrics-footer__shaders {
  animation: none;
  box-shadow: none;

  & > span {
    animation: none;
    background: none;
    -webkit-background-clip: unset;
    color: var(--blyrics-footer-link-color);
  }
}

#blyrics-wrapper#blyrics-wrapper > .blyrics-container .blyrics-footer {
  opacity: 1;

  & > * {
    opacity: 0.3;
    transition: opacity 0.1s var(--transition-curve, ease);

    &:hover {
      opacity: 1;
    }
  }
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
*Note: `.blyrics--break` isn't referenced anywhere in the extension's current stylesheets or its styling docs, unlike the classes above — worth a quick test before relying on it.*

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

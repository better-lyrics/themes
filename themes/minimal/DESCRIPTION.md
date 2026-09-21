# Better Lyrics – Minimal Theme (v1.9.2)

Performance-focused theme for the **Better Lyrics** extension for **YouTube Music**. By default it swaps lyric swipe/word animations for a smoother, opacity-based line-by-line lyrics system, surrounded with a function-over-form approach based design for opimized readability.

**Karaoke Mode** and **blur** can be easily reenabled via section-3.

Requires **Better Lyrics v2.4.0+**.

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

Two following options are right at the top of **Section 3**:

```css
$karaoke-mode: off; /* off / minimal / default */
$enable-blur: off;  /* on / off */
$blur-amount: 30px;
```

* **`$karaoke-mode`** — **`off` by default.** Controls Karaoke enabling and styling (see [🎯 Lyrics Behavior](#-lyrics-behavior) and [🚫 Animation Changes](#-animation-changes)).
* **`$enable-blur`** — **`off` by default**, for performance (see [🌌 Background System](#-background-system)).

The rest of the options live further are in its subsections:

* **Section 3.1 & 3.2** — lyric opacity levels, font size/weight, scroll timing.
* **Section 3.3** — background blur amount, plus brightness/contrast/saturation.
* **Section 3.4** — shared OKLCH color/easing variables the rest of the theme depends on; edit with care.
* **Section-2** — delete the `font-family` line to fall back to YouTube's default font.

Want more animation? Set `$karaoke-mode: default` to fall back to Better Lyrics' own default lyric look and experience, while keeping the rest of this theme.

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
Translated and romanized lines entry is now controlled by the extension. You can configure each of their respective visibility levels separately:

```css
--translated-lyric-visibility: 0.82; /* opacity for translated lines */
--romanized-lyric-visibility: 0.55;  /* opacity for romanized lines */
```

![Performance and Elegance](https://raw.githubusercontent.com/ramansg/Minimal/refs/heads/main/images/3.webp)

---

## 🚫 Animation Changes

How much karaoke animation you have is controlled by `$karaoke-mode`, at the very top of Section 3:

* **`off`** *(default)* — no karaoke at all. Rich-sync animations, word glow/wobble/swipe, and shimmer on active lines are all disabled; lines simply change the opacity levels as listed in [Lyrics Behavior](#-lyrics-behavior).
* **`minimal`** — turns on karaoke, but lyrics retain their style to match the theme: every other animation than karaoke swipe on the current line and opacity change from the off mode is still disabled. Recommended option for karaoke, looks better than default.
* **`default`** — turns on the Better Lyrics' default look and experience (including animations) for lyrics; no minimal styling is applied on the lyrics.

Each mode configures Better Lyrics' `--blyrics-animate-word-wobble`, `--blyrics-animate-highlight-swipe`, `--blyrics-animate-highlight-glow`, and related variables (Section 3.2), with some CSS resets in Section 6.

More details about the default mode are available in the Better Lyrics' styling document.

---

## 🌌 Background System
**(Section 3.3)**

Dynamic album-art background, tuned for legibility over spectacle:

* Blur: **off by default** for performance (less blur = faster) — enable with `$enable-blur: on;` at the top of Section 3, then adjust amount via `$blur-amount: 30px;`
* Brightness: `0.20` (lowered for legibility)
* Contrast: `0.85` (so black album art thumbnails look different from backgrounds)
* Saturation: `1.0` (unboosted)

You can also disable the background entirely in the extension's own settings.

---

## 📱 Fullscreen & Portrait Support

Dedicated fullscreen lyric scaling, portrait-window layout fixes, and dynamic artist-page backgrounds. Portrait mode drops backdrop filters and layered gradients for cleaner, cheaper rendering. Player-page open/close and no-lyrics states get a smooth slide transition on mobile web layouts.

---

## 🎵 'No Lyrics Found' Experience

If synced lyrics aren't found, the text fades out and a subtle `♫` appears in its place; hovering reveals "No lyrics found." No harsh error screens.

On instrumental lines (when `$karaoke-mode` isn't `default`), the `♫`  only animates when that line is active.

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

**v1.9.2** — Last updated: 2026-09-21 — Requires Better Lyrics **v2.4.0+** (current stable)

Please report bugs or suggestions on the Better Lyrics Discord.

**Credits:** Thanks to chengg, mukeen, drago, boidu, noah, tposejank, and many others for code help and testing.

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
  --translated-lyric-visibility: 0.82;
  --romanized-lyric-visibility: 0.55;
  --blyrics-footer-font-family: var(--blyrics-font-family);
  --blyrics-font-weight: 600;
  --blyrics-font-size: 3.5rem;
  --blyrics-translated-font-size: 0.7071em;
  --blyrics-romanized-font-size: 0.6429em;
  --blyrics-line-height: 1.5;
  --blyrics-padding: 0.45em;

  --white-1:      oklch(1 0 0 / 1);   /* Lyrics Color      */
  --white-dot-60: oklch(1 0 0 / 0.60);/* Translations etc  */

  --blyrics-lyric-active-color: var(--white-1);
  --blyrics-lyric-inactive-color: var(--blyrics-lyric-active-color);
  --blyrics-error-color: oklch(0.75 0.25 20);
  --blyrics-ui-text-color: var(--blyrics-lyric-active-color);
  --blyrics-translated-color: var(--white-dot-60);

  --transition-curve: cubic-bezier(0.27, 1.06, 0.18, 1.00);
  /* scroll animation curve */

  --blyrics-lyric-scroll-duration: 1.5s;
  /* dont change without blyrics-queue-scroll-ms */

  --blyrics-lyric-scroll-timing-function: var(--transition-curve);
  --blyrics-line-scroll-uniform-duration: 1.5s;

  --lyrics-opacity-transition: opacity calc(var(--blyrics-lyric-scroll-duration, 650ms) * 1) var(--blyrics-lyric-scroll-timing-function, cubic-bezier(0.86, 0, 0.2, 1));
  /* opacity transition time and curve */

  --blyrics-scale-transition-duration: 0.5s;
  --blyrics-lyric-highlight-fade-in-duration: 0.4s;
  --blyrics-lyric-highlight-fade-out-duration: 0.4s;
  --blyrics-scroll-timing-offset: 0s;
  --blyrics-wobble-duration: 0s;
  --blyrics-timing-offset: 0.4s;
  --blyrics-richsync-timing-offset: 0.4s;
}

/* Removing this block will affect lyric animation.
It's supposed to be in a comment like this to work.

;
blyrics-disable-richsync = true;
blyrics-letter-wave = false;
blyrics-debug-renderer = false;
blyrics-add-extra-top-padding = true;
blyrics-line-synced-animation-delay = 0;
blyrics-lyric-ending-threshold-s = 0;
blyrics-early-scroll-consider-s = 0;
blyrics-queue-scroll-ms = 1520;
blyrics-target-scroll-pos-ratio = 0.4;
blyrics-line-scroll-duration = var(--blyrics-line-scroll-uniform-duration);
blyrics-line-scroll-above-duration = var(--blyrics-line-scroll-uniform-duration);
blyrics-line-scroll-below-duration = var(--blyrics-line-scroll-uniform-duration);
blyrics-line-scroll-active-duration = var(--blyrics-line-scroll-uniform-duration);
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
#blyrics-wrapper .blyrics-container::before {
  content: "";
  display: none;
  animation: none;
  transition: none;
  background: none;
  transform: none;
  filter: none;
}

#blyrics-wrapper .blyrics-container div .blyrics-word-highlight {
  content: "";
  display: none;
  animation: none;
  transition: none;
  background: none;
  transform: none;
  filter: none;
}

/* Disabling active animations */
#blyrics-wrapper .blyrics-container div .blyrics--word.blyrics--animating,
#blyrics-wrapper .blyrics--word.blyrics--animating {
  animation: none;
  transform: none;
  filter: none;
  translate: none;
  perspective: none;
}

.blyrics-highlight-run,
.blyrics-word-highlight {
  display: none;
}

#blyrics-wrapper .blyrics--word {
  transform: none;
  will-change: auto;
}

/* Hardcoding system lyric stylization disabling */
.blyrics-container div span.blyrics--animating::after,
.blyrics-container div span.blyrics--animating {
  animation: none;
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

/* Final Overrides */
#blyrics-wrapper .blyrics-container > .blyrics--active.blyrics--active {
  opacity: var(--current-lyric-visibility);
}

/* Text Colors */
#blyrics-wrapper .blyrics-container div .blyrics--word {
  color: var(--white-1);
}

/* Translations and Romanization (now on independent opacity levels) */
#blyrics-wrapper .blyrics--translated {
  color: var(--white-1);
  font-size: var(--blyrics-translated-font-size);
  line-height: 1.5;
  opacity: var(--translated-lyric-visibility);
  transition: var(--lyrics-opacity-transition);
}

#blyrics-wrapper .blyrics-container > div.blyrics--active .blyrics--translated {
  opacity: var(--translated-lyric-visibility);
}

#blyrics-wrapper .blyrics--romanized {
  color: var(--white-1);
  font-size: var(--blyrics-romanized-font-size);
  line-height: 1.5;
  opacity: var(--romanized-lyric-visibility);
  transition: var(--lyrics-opacity-transition);
}

#blyrics-wrapper .blyrics-container > div.blyrics--active .blyrics--romanized {
  opacity: var(--romanized-lyric-visibility);
}

/* Layout Adjustments for Translations */
#blyrics-wrapper .blyrics-container .blyrics--romanized {
  width: auto;
  padding-block: initial;
  background: 0;
  padding: initial;
  border: 0;
  border-radius: 0;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  font-weight: 350;
  letter-spacing: 0.03em;
}

#blyrics-wrapper .blyrics-container .blyrics--translated {
  margin-top: 0.4em;
  font-weight: 600;
}

/* Fullscreen Specifics */
ytmusic-app-layout:not([is-mweb-modernization-enabled]) [player-fullscreened]:not([blyrics-dfs]) .blyrics-container {
  font-size: 4.5rem;
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

*This is the `$karaoke-mode: off` behavior.*

</details>

### 2. Optional Musical Note Plugins

Both **instrumental lines** and **empty lines** can be modified separately with custom musical notes.

#### Instrumental Lines

<details>
<summary>Static note (no animation)</summary>

```css
.blyrics--instrumental-icon {
  display: none;
}
.blyrics--instrumental.blyrics--line::after {
  content: "♫";
}
```

</details>

<details>
<summary>Pulsing note (synced to playback)</summary>

*Pulses when the line is active, pauses when user pauses the song.

```css
.blyrics--instrumental-icon {
  display: none;
}
.blyrics--instrumental.blyrics--line::after {
  content: "♫";
  display: inline-block;
  font-size: 1.2em;
  animation: none;
  animation-play-state: paused;
  transform: scale(100%);
  text-shadow: unset;
  filter: none;
  opacity: 1;
}
.blyrics--active.blyrics--instrumental.blyrics--line::after {
  animation: note-pulse 1.5s ease-in-out infinite;
  animation-play-state: running;
}
.blyrics--paused.blyrics--instrumental.blyrics--line::after {
  animation-play-state: paused;
}

@keyframes note-pulse {
  0%, 100% {
    text-shadow: 0px 0 2px transparent;
    opacity: 0.6;
    transform: scale(100%);
    transform-origin: bottom center;
  }
  50% {
    text-shadow: 0px 0px 8px var(--white-dot-60);
    opacity: 1;
    transform: scale(105%);
    transform-origin: bottom center;
  }
}
```

</details>

#### Empty Lines

<details>
<summary>Static note (no animation)</summary>

```css
.blyrics--line:has(.blyrics-bidi-run:empty) .blyrics-line-main {
  display: inline-flex;
  align-items: center;
  min-height: 1.5em;
  line-height: var(--blyrics-line-height);
}

.blyrics--line:has(.blyrics-bidi-run:empty) .blyrics-line-main::before {
  content: "♫";
}
```

</details>

<details>
<summary>Pulsing note (synced to playback)</summary>

*Same pulse/pause behavior as above*

```css
.blyrics--line:has(.blyrics-bidi-run:empty) .blyrics-line-main {
  display: inline-flex;
  align-items: center;
  min-height: 1.5em;
  line-height: var(--blyrics-line-height);
}

.blyrics--line:has(.blyrics-bidi-run:empty) .blyrics-line-main::before {
  content: "♫";
}

.blyrics--active.blyrics--line:has(.blyrics-bidi-run:empty) .blyrics-line-main::before {
  animation: note-pulse 1.5s ease-in-out infinite;
  animation-play-state: running;
}

.blyrics--paused.blyrics--line:has(.blyrics-bidi-run:empty) .blyrics-line-main::before {
  animation-play-state: paused;
}

@keyframes note-pulse {
  0%, 100% {
    text-shadow: 0px 0 2px transparent;
    opacity: 0.6;
    transform: scale(100%);
    transform-origin: bottom center;
  }
  50% {
    text-shadow: 0px 0px 8px var(--white-dot-60);
    opacity: 1;
    transform: scale(105%);
    transform-origin: bottom center;
  }
}
```

</details>

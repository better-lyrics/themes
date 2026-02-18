# Better Lyrics – Minimal Immersive Theme (v1.6.9)

A clean, performance-focused theme for the **Better Lyrics** extension on **YouTube Music**.

Optimized to use minimal resources for portrait view. & many quality of life changes.

This theme removes most lyric swipe/word animations and replaces them with a smooth, opacity-based focus system. The result is a calm, immersive, distraction-free lyrics experience with dynamic blurred album art backgrounds.

> _“Time, Tide, & I wait for nothing.”_
> 
> — Boidu _(probably)_
 
`Plugin codeblock for replacing karaoke with opacity based animation at the end`

---

## ✨ Core Philosophy

- **Minimal motion**
- **Strong focus on current lyric**
- **Soft, immersive blurred background**
- **Consistent typography**
- **Performance-aware design**

Animations are intentionally disabled or simplified for a stable and readable experience.

---

## 🔤 Typography

- Uses **Roboto Flex** via Google Fonts.
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

The theme uses opacity instead of animation emphasis:

| Lyric State | Default Opacity |
|-------------|-----------------|
| Current     | `1` (100%)      |
| Previous    | `0.35`          |
| Next        | `0.02`          |

You can adjust:

```css
--current-lyric-visibility
--previous-lyrics-visibility
--next-lyrics-visibility
````

This makes it very easy to:

* Increase focus intensity
* Fade surrounding lines more
* Create a “floating spotlight” effect
* Prevent accidental reading of next lyrics

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

Then control animations via Better Lyrics settings instead.

---

## 🌌 Background System (Section 3.3)

Dynamic album art background with:

* Blur: `30px`
* Brightness: `0.35`
* Contrast: `0.90`
* Saturation: configurable
* Smooth transition delay

Performance Tip:
Lower this value for better performance:

```css
--blyrics-background-blur
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
* Smooth transition between player states
* No-lyrics slide animation
* Sidebar entry smoothing

Portrait mode:

* Removes backdrop filters
* Removes layered gradients
* Ensures clarity and clean edges

---

## 🎵 No Lyrics Experience

If synced lyrics aren’t found:

* Text fades out
* A subtle `♫` symbol appears
* Hover reveals: `"No lyrics found"`

No harsh error screens. Just a calm fallback.

---

## 📦 Loader & Ad Overlay

Custom loader system:

* Opacity animation instead of complex shimmer
* No animations when not in use
* No logo spinning

---

## 🎨 UI Enhancements

Includes refined styling for:

* Player queue
* 3-dot menu popup
* Search box background
* Queue drag states
* Toast notifications (auto-dismiss)
* Player bar transparency
* Tab headings (underline highlight system)
* Volume popup rounding
* Album immersive backgrounds

All adjusted to match the immersive dark aesthetic.

---

## ⚙ Performance Notes

For best performance:

1. Lower blur value.
2. Disable background effects in Better Lyrics settings.
3. Keep animations disabled (as designed).

This theme is built to be visually rich without relying on heavy animation logic.

---

## 🛠 Customization Guide

Most quick edits are inside:

### Section 3 – EASY CHANGE SETTINGS

You can safely tweak:

* Font size
* Font weight
* Line height
* Opacity levels
* Scroll timing
* Background filters

---

## 🐞 Reporting Issues

Please report bugs or suggestions on Discord.

---

## 🔖 Version

**v1.6.9**
Last updated: 2026-02-18

---

## 💡 Who Is This Theme For?

* Users who dislike flashy lyric animations
* Users who want a cinematic album-art background
* Users who prefer readability over motion
* Users with low-range systems who want better performance
* Minimalist aesthetic lovers

---

If you want:

* More animation → Use default Better Lyrics theme
* More immersion → Increase blur & brightness
* More performance → Reduce blur and/or disable background

---

Enjoy the calm.

---

---

## Plug-in code for converting Karaoke style lyric animation to Opacity-Scroll style

```css
:root {
  --current-lyric-visibility: 1;
  /* 1 would mean 100%   */
  --previous-lyrics-visibility: 0.35;
  /* 0.35 would mean 35% */
  --next-lyrics-visibility: 0.35;
  /* 0.02 would mean 2%  */

  --blyrics-footer-font-family: var(--blyrics-font-family);
  --blyrics-font-weight: 600;
  --blyrics-font-size: 3.5rem;
  --blyrics-translated-font-size: 0.6667em;
  --blyrics-line-height: 1.5;
  --blyrics-padding: 0.45em;

  --base-white: oklch(1 0 0/1);
  /* Lyrics Color */

  --base-white-half: oklch(1 0 0 / 0.6);
  /* Translations etc */

  --blyrics-lyric-inactive-color: oklch(1 0 0/0.35);
  --blyrics-lyric-active-color: var(--base-white);
  --blyrics-error-color: oklch(0.75 0.25 20);
  --blyrics-ui-text-color: var(--blyrics-lyric-active-color);
  --blyrics-translated-color: var(--base-white-half);

  --blyrics-lyric-scroll-duration: 0.5s;
  /* dont change without blyrics-queue-scroll-ms */

  --blyrics-lyric-scroll-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  /* scroll animation curve */

  --lyrics-opacity-transition: opacity calc(var(--blyrics-lyric-scroll-duration) / 2) var(--blyrics-lyric-scroll-timing-function);
  /* opacity transition time and curve. Opacity changes twice as fast as it scrolls */

  --blyrics-scale-transition-duration: var(--blyrics-lyric-scroll-duration);
  --blyrics-lyric-highlight-fade-in-duration: var(--blyrics-lyric-scroll-duration);
  --blyrics-lyric-highlight-fade-out-duration: var(--blyrics-lyric-scroll-duration);
  --blyrics-scroll-timing-offset: 0.2s;
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
blyrics-queue-scroll-ms = 520;
blyrics-debug-renderer = false;
blyrics-target-scroll-pos-ratio = 0.4;
blyrics-add-extra-top-padding = true;
*/

/* Override Keyframes */
@keyframes blyrics-wobble {

  from,
  to {
    transform: none;
  }
}

@keyframes blyrics-glow {

  from,
  to {
    transform: none;
  }
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

/* Next Lines (Lines after active) */
#blyrics-wrapper .blyrics-container>div.blyrics--active~div {
  opacity: var(--next-lyrics-visibility);
}

/* Text Colors */
#blyrics-wrapper .blyrics-container>div>span {
  color: var(--base-white);
}

/* Translations and Romanization */
#blyrics-wrapper :is(.blyrics--romanized, .blyrics--translated),
#blyrics-wrapper .blyrics--romanized,
#blyrics-wrapper .blyrics--translated {
  color: var(--base-white);
  font-size: var(--blyrics-translated-font-size);
  line-height: 1.5;
  opacity: 0.7;
  transition: var(--lyrics-opacity-transition);
}

#blyrics-wrapper .blyrics-container>div.blyrics--active :is(.blyrics--romanized, .blyrics--translated) {
  opacity: 0.7;
}

/* User Scrolling */
#blyrics-wrapper .blyrics-user-scrolling>div:not(.blyrics--active) {
  opacity: 0.5;
  transition: opacity 0.3s ease-out;
}

/* Hover Effects */
#blyrics-wrapper .blyrics-container:hover .blyrics--line:not(:hover, .blyrics--active) {
  opacity: 0.5;
  transition: opacity 0.3s ease-out;
}

#blyrics-wrapper .blyrics-container .blyrics--line:hover {
  opacity: 0.85;
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

/* Not scrolling, target previous lines to active line*/
#blyrics-wrapper .blyrics-container:has(> .blyrics--active):not(.blyrics-user-scrolling)>div:not(.blyrics--active):not(.blyrics--active ~ div) {
  opacity: var(--previous-lyrics-visibility);
}

#blyrics-wrapper#blyrics-wrapper>.blyrics-container .blyrics-footer {
  opacity: 0.87;
}

/* Hardcoding system lyric stylization disabling */
.blyrics-container>div>span>span.blyrics--animating::after,
.blyrics-container>div>span>span.blyrics--animating,
.blyrics-container>div>div>span>span.blyrics--animating::after,
.blyrics-container>div>div>span>span.blyrics--animating {
  animation: none;
}
```

### Optional Musical Note Plugins

```css
/* (Optional) To disable musical note animation */
.blyrics--instrumental-icon {
  display: none;
}
.blyrics--instrumental.blyrics--line::after {
  content: "♫";
}

/* (optional) to replace all breaks with musical notes */
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

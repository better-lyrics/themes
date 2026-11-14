Brings the look of [Spicy Lyrics](https://github.com/Spikerko/spicy-lyrics) (the Spicetify lyrics extension) to YouTube Music. Values such as the spring curves, colors, blur and layout were taken from the Spicy Lyrics source and matched against side-by-side screenshots.

## Features

- **Word bounce.** Every syllable rises and grows while it is sung, then settles back on Spicy's spring. Syllables of one word stay joined.
- **Letter wave on held syllables.** Letters swell and glow one after another as they are lit, like Spicy's letter groups. The timing and shape come from Spicy's own animator.
- **Spicy highlight and glow.** Words light up over exactly their length with a soft edge and a gentle glow.
- **Distance blur.** Lines further from the active one get more blur, and every line except the active one is dimmed to the Spicy levels.
- **Hover box.** A rounded box grows in behind the line under the pointer.
- **Instrumental breaks** are drawn as three dots that light up left to right over the length of the break.
- **Background vocals** sit under the line at 75% size and dim once they are sung.
- **Spicy-style fullscreen:**
  - a big rounded cover with the title and artist centered under it, and lyrics from the middle of the screen;
  - **Canvas Immersive** stage for tracks with active animated covers from Better Lyrics Shaders (full-height left-side animated artwork with a feathered blend, dark bottom vignette, and a hover-reveal bottom-left player dock);
  - **Portrait Fullscreen Layout** in tall/portrait windows with a compact top-left cover header, adjacent metadata, and full-width lyrics;
  - playback controls sit on the cover and show on hover.
- **Spicy Popup Lyrics (Picture-in-Picture):**
  - matching blurred vibrant backdrop;
  - compact rounded cover with frosted glass playback controls on hover;
  - sleek glass progress bar;
  - top and bottom soft gradient fades on the lyrics container;
  - active line positioned comfortably above center with smooth spring scrolling and word bounce.
- **Romanized Lyrics & Line Spacing:** syllable-synced romanization rows (`RomanizedRow` proportions) sitting neatly beneath each lyric line and close to background vocals, paired with Spicy 6.5.0's wider `0.6em` Spring line spacing.
- **Side-Panel Tab Bar:** minimalist frosted glass capsule housing 4 clean icons with a smooth sliding knockout white active disc indicator, replacing bulky uppercase text headers.
- **Refined Controls & Dock:** Spicy 6.5.0 frosted glass scroll-to-active button with inner hover disc, symmetrical dock with high-contrast white active toggles, and discreet Refined Credits contributor links (`Synced by … · Uploaded by …`).
- **Micro-interactions:** smooth sidebar expand/collapse without layout snapping, growing like/dislike buttons on hover, and fluid GPU-accelerated popups and context menus.
- **International Apple Typography:** bundled Variable Web Fonts for **SF Arabic**, **SF Hebrew**, **SF Armenian**, and **SF Georgian** (`100`–`900` weights), ensuring authentic San Francisco styling across Arabic, Hebrew, Armenian and Georgian lyrics.
- **Rest of YouTube Music** (home, library), kept subtle:
  - a blurred cover background;
  - a glass top bar and side bar;
  - rounded tiles and the same font as the lyrics.

## Recommended

- **[Better Lyrics Shaders](https://github.com/better-lyrics/shaders).** The included music-reactive shader settings match the Spicy Lyrics 6.5.0 Kawarp background (7 blur passes, subtle beat zoom, 1500ms crossfade), and the theme adds the same dim and saturation filter Spicy uses. Without Shaders, a CSS blurred-cover background is used instead.
- **SF Pro Display** installed locally, the font Spicy Lyrics uses. It is not bundled because of its license; the theme falls back to Inter.

## Tuning

Everything adjustable is in the **Tunables** block at the top of the CSS, including:

- global lyrics scale (`--spicy-lyrics-scale`) and line spacing (`--spicy-line-gap`);
- blur per line;
- line opacities;
- the height and size of the word bounce;
- cover size;
- the hover box color and radius.

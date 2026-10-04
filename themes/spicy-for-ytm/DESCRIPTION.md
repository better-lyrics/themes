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
  - playback controls sit on the cover and show on hover.
- **Spicy Popup Lyrics (Picture-in-Picture):**
  - matching blurred vibrant backdrop;
  - compact rounded cover with frosted glass playback controls on hover;
  - sleek glass progress bar;
  - top and bottom soft gradient fades on the lyrics container;
  - active line positioned comfortably above center with smooth spring scrolling and word bounce.
- **Rest of YouTube Music** (home, library), kept subtle:
  - a blurred cover background;
  - a glass top bar and side bar;
  - rounded tiles and the same font as the lyrics.

## Recommended

- **[Better Lyrics Shaders](https://github.com/better-lyrics/shaders).** The included shader settings match the Spicy Lyrics Kawarp background, and the theme adds the same dim and saturation filter Spicy uses. Without Shaders, a CSS blurred-cover background is used instead.
- **SF Pro Display** installed locally, the font Spicy Lyrics uses. It is not bundled because of its license; the theme falls back to Inter.

## Tuning

Everything adjustable is in the **Tunables** block at the top of the CSS, including:

- blur per line;
- line opacities;
- the height and size of the word bounce;
- cover size;
- the hover box color and radius.

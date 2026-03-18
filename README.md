# Better Lyrics Theme Store

[![Install Better Lyrics Harmonizer](https://img.shields.io/badge/Install-Better%20Lyrics%20Harmonizer-blue?logo=github)](https://github.com/apps/better-lyrics-harmonizer/installations/new)
[![Themes](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbetter-lyrics%2Fthemes%2Fmaster%2Findex.json&query=%24.themes.length&label=themes&color=blue)](https://github.com/better-lyrics/themes)
[![Last Updated](https://badgen.net/github/last-commit/better-lyrics/themes)](https://github.com/better-lyrics/themes/commits)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/UsHE3d5fWF)
[![License](https://badgen.net/badge/license/MIT/blue)](https://github.com/better-lyrics/themes/blob/master/LICENSE)

Community themes for [Better Lyrics](https://github.com/better-lyrics/better-lyrics).

## Browse Themes

Open the Better Lyrics extension options → **Themes** tab → **Browse Themes** to explore and install themes directly.

## Submit Your Theme

Want to add your theme to the store? Follow these steps:

### Quick Start

Scaffold a new theme instantly with the CLI:

```bash
npx create-bl-theme@latest my-theme
```

This creates a ready-to-use theme with all required files. You can also validate your theme before submitting:

```bash
npx create-bl-theme@latest validate ./my-theme
```

### 1. Create Your Theme Repository

Your theme repo must include these files:

```
your-theme-repo/
├── metadata.json    # Theme info (required)
├── style.css        # Your CSS (required)
├── DESCRIPTION.md   # Rich description (optional - takes precedence over metadata.json)
├── cover.png        # Cover image (optional - first image used if missing)
├── shader.json      # Shader config (optional)
└── images/          # Screenshots (required - at least one)
    ├── 1.png
    └── 2.png
```

### 2. Create `metadata.json`

```json
{
  "id": "your-unique-theme-id",
  "title": "Your Theme Name",
  "description": "A brief description of your theme and what makes it unique.",
  "creators": ["your-github-username"],
  "minVersion": "2.0.5.6",
  "hasShaders": false,
  "version": "1.0.0",
  "tags": ["dark", "minimal", "colorful"],
  "images": ["1.png", "2.png"]
}
```

| Field       | Required | Description                                                                 |
| ----------- | -------- | --------------------------------------------------------------------------- |
| id          | Yes      | Unique identifier (lowercase, hyphens allowed)                              |
| title       | Yes      | Display name                                                                |
| description | \*       | What your theme does (\*required unless DESCRIPTION.md exists)              |
| creators    | Yes      | Array of GitHub usernames                                                   |
| minVersion  | Yes      | Minimum Better Lyrics version required                                      |
| hasShaders  | Yes      | Whether theme includes shader.json                                          |
| version     | Yes      | Your theme's version (semver)                                               |
| tags        | No       | Searchable tags                                                             |
| images      | Yes      | Filenames in the images/ folder (first image used as cover if no cover.png) |

### 3. (Optional) Create `DESCRIPTION.md`

For richer descriptions with markdown formatting, create a `DESCRIPTION.md` file in your repo root:

```markdown
A beautiful dark theme with smooth animations.

## Features

- Custom gradient backgrounds
- Smooth lyric transitions
- **Rich sync** word-by-word highlighting

## Installation Notes

This theme works best with the album art background enabled.
```

**Benefits:**

- Full markdown support with headers, lists, images, and more
- GitHub renders the file nicely in your repo
- Easier to maintain longer descriptions

**Note:** If both `DESCRIPTION.md` and the `description` field in `metadata.json` exist, `DESCRIPTION.md` takes precedence.

### 4. Submit a Pull Request

1. Fork this repository
2. Add your theme to `index.json`:

```json
{
  "themes": [
    { "repo": "existing/theme" },
    { "repo": "your-username/your-theme-repo" }
  ]
}
```

3. Open a pull request

### 5. Enable Auto-Updates (Recommended)

Install the GitHub App to automatically publish updates when you push:

[![Install Better Lyrics Harmonizer](https://img.shields.io/badge/Install-Better%20Lyrics%20Harmonizer-blue?logo=github)](https://github.com/apps/better-lyrics-harmonizer/installations/new)

Once installed, just bump the `version` in your `metadata.json` and push - your theme updates automatically!

## Guidelines

- Test your theme with the latest Better Lyrics version
- Include at least one screenshot in the images/ folder
- Use 16:9 aspect ratio for images (1280x720 recommended)
- Keep your description concise but informative
- Don't include malicious or obfuscated CSS

## Install Count Badge

Add an install count badge to your theme's README:

```markdown
![Installs](https://img.shields.io/endpoint?url=https://better-lyrics-themes-api.boidu.dev/api/badge/your-theme-id)
```

Replace `your-theme-id` with the `id` from your `metadata.json`. You can customize the badge with [shields.io query parameters](https://shields.io/badges/endpoint-badge) like `&style=for-the-badge` or `&labelColor=black`.

## Direct Install

Users can also install themes directly from any GitHub repo URL via **Install from URL** in the extension — no submission required.

## License

Themes are maintained by their respective creators. Check individual theme repositories for licensing information.

# Better Lyrics Theme Store

Community themes for [Better Lyrics](https://github.com/better-lyrics/better-lyrics).

## Browse Themes

Open the Better Lyrics extension options → **Themes** tab → **Browse Themes** to explore and install themes directly.

## Submit Your Theme

Want to add your theme to the store? Follow these steps:

### 1. Create Your Theme Repository

Your theme repo must include these files:

```
your-theme-repo/
├── metadata.json   # Theme info (required)
├── style.css       # Your CSS (required)
├── cover.png       # Preview image, 16:9 recommended (required)
├── shader.json     # Shader config (optional)
└── images/         # Additional screenshots (optional)
    ├── preview1.png
    └── preview2.png
```

### 2. Create `metadata.json`

```json
{
  "id": "your-unique-theme-id",
  "title": "Your Theme Name",
  "description": "A brief description of your theme and what makes it unique.",
  "creators": ["your-github-username"],
  "minVersion": "3.0.0",
  "hasShaders": false,
  "version": "1.0.0",
  "tags": ["dark", "minimal", "colorful"],
  "images": ["preview1.png", "preview2.png"]
}
```

| Field       | Required | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| id          | Yes      | Unique identifier (lowercase, hyphens allowed) |
| title       | Yes      | Display name                                   |
| description | Yes      | What your theme does                           |
| creators    | Yes      | Array of GitHub usernames                      |
| minVersion  | Yes      | Minimum Better Lyrics version required         |
| hasShaders  | Yes      | Whether theme includes shader.json             |
| version     | Yes      | Your theme's version (semver)                  |
| tags        | No       | Searchable tags                                |
| images      | No       | Filenames in the images/ folder                |

### 3. Submit a Pull Request

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

## Guidelines

- Test your theme with the latest Better Lyrics version
- Use a clear, high-quality cover image (1280x720 or similar 16:9 ratio)
- Keep your description concise but informative
- Don't include malicious or obfuscated CSS

## Direct Install

Users can also install themes directly from any GitHub repo URL via **Install from URL** in the extension — no submission required.

## License

Themes are maintained by their respective creators. Check individual theme repositories for licensing information.

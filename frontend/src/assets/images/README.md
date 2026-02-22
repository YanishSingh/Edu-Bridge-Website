# Logo Placement Instructions

## Where to Place the Logo

Place your Edu-Bridge logo file in this directory: `frontend/src/assets/images/`

## Recommended File Formats (in order of preference):

1. **SVG** (`.svg`) - **BEST CHOICE**
   - Scalable without quality loss
   - Smallest file size
   - Perfect for logos
   - Works on all screens (retina, high-DPI)
   - Example: `logo.svg` or `edu-bridge-logo.svg`

2. **WebP** (`.webp`) - **GOOD CHOICE**
   - Modern format with excellent compression
   - Smaller than PNG/JPG
   - Good browser support
   - Example: `logo.webp`

3. **PNG** (`.png`) - **ACCEPTABLE**
   - Use PNG-24 for logos with transparency
   - Larger file size than SVG/WebP
   - Ensure it's optimized (use tools like TinyPNG)
   - Example: `logo.png`

## File Naming Convention

Recommended names:
- `logo.svg` (or `logo.webp`, `logo.png`)
- `edu-bridge-logo.svg`
- `logo-white.svg` (if you have a white version for dark backgrounds)

## File Size Recommendations

- **SVG**: Should be under 50KB (usually much smaller)
- **WebP/PNG**: Should be under 100KB for fast loading
- Optimize images before adding them

## Usage in Code

Once you place the logo file, it will be imported like this:

```javascript
import logo from '../assets/images/logo.svg';
// or
import logo from '../assets/images/logo.webp';
```

## Alternative Location (Public Folder)

If you prefer to use the public folder (for static assets that don't need processing):
- Place in: `frontend/public/images/logo.svg`
- Reference as: `<img src="/images/logo.svg" alt="Edu-Bridge" />`

**Note**: Assets in `src/assets` are processed by webpack and optimized during build.
Assets in `public` are served as-is.


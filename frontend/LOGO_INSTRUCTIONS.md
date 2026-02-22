# Logo Setup Instructions

## 📍 Where to Place Your Logo

**Location:** `frontend/src/assets/images/logo.svg` (or `.webp`, `.png`)

## 🎨 Recommended File Format

### **Best Choice: SVG** (`.svg`)
- ✅ Scalable without quality loss
- ✅ Smallest file size (usually 5-50KB)
- ✅ Perfect for logos
- ✅ Works perfectly on all screens (retina, high-DPI)
- ✅ Can be styled with CSS if needed

### Alternative Formats:
- **WebP** (`.webp`) - Modern, good compression, smaller than PNG
- **PNG** (`.png`) - Use PNG-24 if you need transparency, ensure it's optimized

## 📝 File Naming

Name your logo file exactly: **`logo.svg`** (or `logo.webp`, `logo.png`)

The code will automatically look for:
- `logo.svg` (preferred)
- `logo.webp`
- `logo.png`

## 📏 Recommended Logo Dimensions

- **Height:** 40-48px (for navigation bar)
- **Width:** Auto (maintain aspect ratio)
- **Format:** SVG is best, but if using PNG/WebP, ensure it's at least 2x resolution for retina displays

## 🚀 After Adding Your Logo

1. Place your logo file in: `frontend/src/assets/images/logo.svg`
2. The navigation bar will automatically use it
3. If the logo doesn't load, it will fallback to text "EduBridge"

## 💡 Tips

- **Optimize your logo:** Use tools like SVGOMG (for SVG) or TinyPNG (for PNG/WebP)
- **File size:** Keep it under 100KB for fast loading
- **Transparency:** SVG or PNG-24 supports transparency
- **Colors:** Your logo should work well on white backgrounds (navigation bar background)

## 🔄 Current Status

Currently, the navigation bar shows a text-based logo: **"EduBridge"** in brand colors.

Once you add `logo.svg` to `frontend/src/assets/images/`, it will automatically replace the text logo.


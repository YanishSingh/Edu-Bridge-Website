# Hero Image Instructions

## Where to Place Your Hero Image

Place your hero background image in the following location:

**Path:** `frontend/public/images/hero-image.jpg`

## Image Requirements

- **Recommended dimensions:** 1920x1080 pixels (or higher resolution)
- **Format:** JPG, PNG, or WebP
- **File name:** `hero-image.jpg` (or update the path in `HomePage.js` if using a different name)

## Current Setup

The hero section is configured to use:
```
/public/images/hero-image.jpg
```

If your image has a different name or format, update line 142 in `frontend/src/pages/HomePage.js`:

```javascript
backgroundImage: 'url(/images/your-image-name.jpg)',
```

## Alternative: Using an Image from Assets

If you prefer to use an image from the assets folder:

1. Place the image in `frontend/src/assets/images/hero-image.jpg`
2. Import it in `HomePage.js`:
   ```javascript
   import heroImage from '../assets/images/hero-image.jpg';
   ```
3. Update the backgroundImage style:
   ```javascript
   backgroundImage: `url(${heroImage})`,
   ```

## Notes

- The image will be automatically blurred and scaled for the hero section effect
- Make sure the image is optimized for web (compressed) to ensure fast loading times


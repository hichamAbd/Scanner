# Pocket Scanner

A phone-friendly web app that turns photos of documents into flat, straight scans, saved as photos or as a PDF.

1. **Take a photo** (opens the camera) or **choose one from your gallery**.
2. **Corners**: the page edges are **detected automatically**, including colored bands and logos printed
   at the page's edge. Drag any circle to fine-tune; a magnifier shows exactly where it lands.
   **Folded pages** (folded in half or in three, like a letter) are recognized from the bends in the page
   edges: each fold is shown as a dashed line with a small handle at each end that you can drag too.
   *Auto* re-applies the detection, *Reset* starts over.
   Optionally lock the shape to A4, US Letter, ID card or square.
3. **Straighten**: the page is perspective-corrected into a rectangle. Its real proportions are worked
   out from the perspective (and snapped to A4 / US Letter when close). On folded pages, each flat panel
   is straightened separately, so text stays level on both sides of a fold.
4. **Look**: *Original*, *Magic color* (removes shadows, whitens the paper), *Grayscale* or *Black & white*.
   **Adjust**: sliders for exposure, brightness, contrast, saturation and warmth (double-click a slider to zero it).
   Rotate if needed.
5. **Save**:
   - **Photo** saves a JPEG. iPhone: tap *Save Image* in the share sheet to put it in Photos.
     Android: pick your gallery app in the share sheet, or it lands in *Downloads*.
   - **PDF** saves a PDF. iPhone: tap *Save to Files*.
   - **+ Page** keeps this page and goes back to scan the next one, so several pages end up in one PDF.
     The PDF button shows how many pages it will contain.

Everything runs in the browser: the photo is never uploaded anywhere. No libraries are used.
Page detection (Canny edges, brightness and background-color segmentation, convex hull,
best-fit quadrilateral, then sub-pixel edge fitting and fold detection), the perspective
warp, the filters and the PDF writer are all plain JavaScript in `index.html`.

## Run it

Static site, no build step: `index.html`, `manifest.webmanifest`, `icon.svg`.

- Locally: `python3 -m http.server` in this folder, then open `http://localhost:8000`.
- GitHub Pages: **Settings → Pages → Build and deployment**, Source "Deploy from a branch",
  branch `main`, folder `/ (root)`. The app is then at `https://hichamabd.github.io/scanner/`.

Saving through the share sheet needs HTTPS (GitHub Pages provides it). On a phone you can use
"Add to Home Screen" to launch it like an app.

## Tips for good auto-detection

- Put the page on a surface that contrasts with it (a dark table under white paper is ideal).
- Keep all four corners inside the photo.
- If detection misses, just drag the corners; it falls back to manual placement automatically.

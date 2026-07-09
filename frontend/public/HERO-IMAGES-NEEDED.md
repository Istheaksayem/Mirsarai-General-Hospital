# Hero Section Images Required

The new Hero component references these images that need to be added to the `/public` folder:

## Slide Images (4):
- `hero-slide-1.jpg` — Emergency/hospital facility
- `hero-slide-2.jpg` — Doctor with patient
- `hero-slide-3.jpg` — Emergency room/ambulance
- `hero-slide-4.jpg` — Diagnostic equipment/lab

## Join Team Image:
- `doctor-team.jpg` — Doctor/medical team photo

## Current Fallback:
All images fall back to `/genaral_Hospital_logo.jpeg` if missing (already exists).

## Recommended Dimensions:
- Slide images: 600x600px (square, for circular display)
- Join team image: 300x300px (square)

## Temporary Solution:
You can use `/hospital-banner.jpg` (already exists) for all slides by updating the JSON file:
```json
"image": "/hospital-banner.jpg"
```

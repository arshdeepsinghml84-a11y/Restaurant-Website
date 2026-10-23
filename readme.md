# Bella Vista Restaurant Website

## Description

Bella Vista is a responsive, single-page website for a fictional fine-dining restaurant serving Italian, Continental and Indian cuisine in Mumbai. It is useful as a restaurant website template or a front-end portfolio project. It gives visitors one place to browse the menu, see offers and events, check opening hours and contact details, and fill in a table reservation form.

## Features

- Loading screen, sticky header and scroll-progress bar
- Hero section with a typing text effect
- Light and dark theme toggle (follows the system setting and remembers your choice)
- Responsive layout with a mobile hamburger menu
- Menu of 14 dishes with category filters (Starters, Main Course, Pizza, Pasta, Indian, Desserts, Drinks) and live search
- Veg / non-veg and spice-level indicators on each dish
- "Add to Cart" button (visual feedback only; there is no real cart or checkout)
- Download Menu PDF button
- Special offers section with a weekend countdown timer
- Chef profiles, features, "Our Story" section with animated counters
- Image gallery with a lightbox (keyboard and arrow-key support)
- Testimonials slider with a pause button
- Events section and FAQ accordion
- Reservation form, contact form and newsletter form with validation
- Map that loads from Google Maps only after the visitor clicks "Load map"
- WhatsApp and call floating buttons, back-to-top button
- Reduced-motion support and accessibility attributes (ARIA labels, focus styles)
- SEO tags (Open Graph, Twitter Card, schema.org Restaurant data)

## Technologies Used

- HTML5
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript (no framework)
- [Font Awesome 6.5.1](https://fontawesome.com/) icons (loaded from CDN)
- [Google Fonts](https://fonts.google.com/) - Playfair Display and Poppins (loaded from CDN)
- [Picsum Photos](https://picsum.photos/) for placeholder images (loaded online)
- Google Maps embed (loaded only on request)

## Project Structure

```text
bella-vista/
├── assets/
│   └── bella-vista-menu.pdf
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

All images, fonts and icons come from online sources (see above), so `assets/` currently holds only the downloadable menu PDF.

## How to Run

No installation or build step is needed.

1. Open the project folder in VS Code.
2. Double-click `index.html` to open it in your browser, or right-click it in VS Code and choose **Open with Live Server** if you have that extension.
3. You need an internet connection so the fonts, icons and placeholder images can load.

## Usage

Scroll through the page or use the top navigation to jump between sections. Use the menu search box and category buttons to filter dishes, click gallery photos to enlarge them, and use the moon/sun button to switch themes. Click **Download Menu PDF** to get the menu.

## Configuration

- **Contact details** (phone, WhatsApp number, address) are set in the `SITE` object at the top of `script.js`. The values currently in the project are placeholders, so replace them with real details before publishing. The same details also appear in the schema.org block in `index.html`.
- **Forms:** the reservation, contact and newsletter forms are not connected to a server yet. `FORM_ENDPOINT` in `script.js` is empty, so submitting a form shows a message saying nothing was sent. To receive submissions, set it to a form service URL such as a Formspree endpoint.
- No API keys are used or needed.

## Screenshots

*Screenshots not added yet.*

## Live Demo

Live Demo: Not deployed yet

## Future Improvements

- Connect the forms to a real service so reservations and messages are delivered
- Replace placeholder photos and details with the restaurant's real ones
- Build a working cart and online ordering
- Add a real "Order Online" flow and payment options
- Update the footer and social links, which currently point to `#`

## Author

Created by Arshdeep Singh
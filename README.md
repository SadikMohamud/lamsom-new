# LAMSOM website (v2)

Website for the Lambeth Somali Community Association, 13 to 15 Stockwell Road, London SW9 9AU. Live at lamsom.org.

## Pages
- `index.html` home: hero film opening out of an arch, the proverb, programmes, this week's timetable, albums, visit
- `about.html` mission, history and staff
- `gallery.html` three albums with a full screen photo viewer
- `contact.html` address, phone, email and hours

## Editing
- **Timetable:** the `WEEK` list in `assets/js/site.js`
- **Gallery albums:** the `ALBUMS` list in `assets/js/site.js`, photos in `assets/img/`
- **Logo:** `assets/img/lamsom-logo.svg` (vector, sharp at any size), light version for dark backgrounds, plus a high resolution PNG

Static site, no build step, hosted on GitHub Pages (see `CNAME`). Motion uses GSAP, ScrollTrigger and Lenis, and switches off for visitors who prefer reduced motion.

Built by [Snurm](https://github.com/SadikMohamud).

# 182 design

Minimal architecture studio site: one hero landing page and one work gallery page.

## Pages

- **/** — Full-screen hero with background image, “182 design” logo, main nav (work, publications, contact), and category links (architecture — interiors — landscape).
- **/work** — Gallery: header, one large central image, horizontal thumbnail strip. Shows all projects.
- **/work/architecture**, **/work/interiors**, **/work/landscape** — Same gallery layout with only that category’s projects. Clicking a thumbnail updates the main image.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Images

Put assets in `public/images/`:

- `hero.jpg` — Homepage hero (full viewport).
- `project-1-1.jpg`, `project-2-1.jpg`, … — Project images (see `lib/projects.ts` for paths).

## Customize

- **Copy:** Logo and nav labels are in `app/page.tsx` and `components/WorkGallery.tsx`.
- **Projects:** Edit `lib/projects.ts` to add/change projects and categories.

# Portfolio Project

This repository is a personal portfolio website foundation.

## Stack

- Vite
- React
- JavaScript
- Tailwind CSS
- pnpm
- GSAP + ScrollTrigger

## Structure

- `src/components/`: reusable React components
- `src/pages/`: route or page-level views
- `src/layouts/`: layout components
- `src/styles/`: global styles
- `src/utils/`: shared utilities
- `src/data/projects.js`: portfolio profile, work, and experiment data
- `src/assets/`: bundled source assets
- `public/images/`: public image files
- `public/videos/`: public video files
- `public/pdf/`: public PDF files
- `projects/`: project materials and notes

## Editing Content

Update `src/data/projects.js` to change the name, role, email, project titles, years,
categories, descriptions, and media files. Supported project and file types are:

- `pdf`
- `image`
- `video`
- `mixed`

Put your WeChat QR code at `public/images/wechat-qr.png`, or update `profile.wechatQr`
to match your actual file name.

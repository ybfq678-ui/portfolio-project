export const profile = {
  name: "MY NAME",
  role: "Designer / AI Product Builder / Creative Developer",
  intro:
    "I shape digital products, AI experiments, visual systems, and motion-led stories for teams that care about clarity and atmosphere.",
  email: "hello@example.com",
  wechatQr: "/images/wechat-qr.png",
};

export const projects = [
  {
    slug: "21day-sport",
    number: "01",
    title: "21 Day Sport",
    year: "2026",
    category: "AI Product / UI UX",
    type: "pdf",
    description:
      "A product concept and visual system for a guided sport habit experience, documented as a presentation-ready PDF.",
    cover: {
      kind: "pdf",
      src: "/pdf/21day-sport.pdf",
      alt: "21 Day Sport PDF preview",
    },
    files: [
      {
        kind: "pdf",
        src: "/pdf/21day-sport.pdf",
        title: "Project deck",
        downloadName: "21day-sport.pdf",
      },
    ],
  },
  {
    slug: "commercial-film",
    number: "02",
    title: "Commercial Motion",
    year: "2026",
    category: "Video / Visual Direction",
    type: "video",
    description:
      "A restrained commercial video piece focused on pacing, framing, rhythm, and atmosphere.",
    cover: {
      kind: "video",
      src: "/videos/商业广告.mp4",
      alt: "Commercial motion video",
    },
    files: [
      {
        kind: "video",
        src: "/videos/商业广告.mp4",
        title: "Commercial video",
      },
    ],
  },
  {
    slug: "visual-profile",
    number: "03",
    title: "Visual Profile",
    year: "2026",
    category: "Personal Branding / Image",
    type: "image",
    description:
      "A visual identity anchor for personal positioning, portfolio mood, and human presence.",
    cover: {
      kind: "image",
      src: "/images/形象照.png",
      alt: "Personal portrait visual",
    },
    files: [
      {
        kind: "image",
        src: "/images/形象照.png",
        title: "Portrait direction",
        alt: "Personal portrait",
        layout: "full",
      },
    ],
  },
];

export const experiments = [
  {
    title: "AI Visual Tests",
    year: "2026",
    category: "AI Experiment",
    description: "Image-led explorations for mood, identity, and visual tone.",
    media: "/images/形象照.png",
  },
  {
    title: "Motion Studies",
    year: "2026",
    category: "Video",
    description: "Short-form pacing, quiet transitions, and editorial rhythm.",
    media: "/videos/商业广告.mp4",
  },
  {
    title: "Interactive Decks",
    year: "2026",
    category: "PDF / Product",
    description: "Project narratives designed to be read, presented, and shared.",
    media: "/pdf/21day-sport.pdf",
  },
];

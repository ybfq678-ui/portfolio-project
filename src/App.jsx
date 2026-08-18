import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingLines from "./components/FloatingLines";
import GradientWaves from "./components/GradientWaves";
import { experiments, profile, projects } from "./data/projects";

gsap.registerPlugin(ScrollTrigger);

const isVideo = (src = "") => /\.(mp4|webm)$/i.test(src);
const isPdf = (src = "") => /\.pdf$/i.test(src);

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [section, slug] = hash.split("/");
  return { section: section || "home", slug };
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === route.slug),
    [route.slug],
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  usePortfolioMotion(route.section);
  useViewportVideos(route.section);

  return route.section === "project" && selectedProject ? (
    <ProjectPage project={selectedProject} />
  ) : (
    <HomePage />
  );
}

function usePortfolioMotion(routeKey) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      document.querySelectorAll("[data-reveal], [data-image-reveal]").forEach((node) => {
        node.classList.add("is-visible");
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 38 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
            },
          },
        );
      });

      gsap.utils.toArray("[data-image-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: "inset(18% 0 18% 0)", scale: 1.04 },
          {
            clipPath: "inset(0% 0 0% 0)",
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
            },
          },
        );
      });

      if (window.innerWidth > 760) {
        gsap.utils.toArray("[data-parallax]").forEach((element) => {
          gsap.to(element, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, [routeKey]);
}

function useViewportVideos(routeKey) {
  useEffect(() => {
    const videos = [...document.querySelectorAll("video[data-viewport-video]")];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 },
    );

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [routeKey]);
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <main className="site-shell">
      <Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((value) => !value)} />
      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      <section className="hero" id="top">
        <div className="hero__background">
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={7}
            lineDistance={34.5}
            bendRadius={8}
            bendStrength={-7}
            interactive
            parallax
            animationSpeed={1.6}
            gradientStart="#e945f5"
            gradientMid="#6f6f6f"
            gradientEnd="#6a6a6a"
          />
        </div>
        <div className="hero__media" data-image-reveal>
          <img src="/images/形象照.png" alt={`${profile.name} portrait`} />
        </div>
        <div className="hero__content">
          <p className="eyebrow" data-reveal>
            Portfolio 2026
          </p>
          <h1 data-reveal>{profile.name}</h1>
          <p className="hero__intro" data-reveal>
            {profile.role}. {profile.intro}
          </p>
        </div>
        <a className="scroll-cue" href="#works" data-reveal>
          <span>Scroll</span>
          <span>to Explore</span>
        </a>
      </section>

      <div className="post-hero">
        <GradientWaves
          horizonColor="#8b70bf"
          waveColor="#e8a7cf"
          crestColor="#fffaf5"
          speed={0.4}
          turbulence={14}
          opacity={0.86}
          mouseInteraction
          parallaxStrength={0.5}
        />
        <div className="post-hero__content">
          <section className="section section--works" id="works">
            <SectionKicker number="01" label="Selected Works" />
            <div className="section-heading">
              <h2 data-reveal>Selected Works</h2>
              <p data-reveal>
                PDF decks, image systems, and moving-image work are arranged as editorial project
                stories instead of repeated cards.
              </p>
            </div>
            <div className="works-list">
              {projects.map((project, index) => (
                <ProjectTeaser key={project.slug} project={project} index={index} />
              ))}
            </div>
          </section>

          <AboutSection />
          <ExperimentsSection />
          <ContactSection qrOpen={qrOpen} onQrToggle={() => setQrOpen((value) => !value)} />
        </div>
      </div>

      {qrOpen && <QrLayer onClose={() => setQrOpen(false)} />}
    </main>
  );
}

function Header({ menuOpen, onMenuToggle }) {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Back to top">
        Portfolio
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#works">Works</a>
        <a href="#about">About</a>
        <a href="#experiments">Experiments</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="menu-button" type="button" onClick={onMenuToggle} aria-expanded={menuOpen}>
        {menuOpen ? "Close" : "Menu"}
      </button>
    </header>
  );
}

function MobileMenu({ open, onNavigate }) {
  return (
    <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <a href="#works" onClick={onNavigate}>
        Works
      </a>
      <a href="#about" onClick={onNavigate}>
        About
      </a>
      <a href="#experiments" onClick={onNavigate}>
        Experiments
      </a>
      <a href="#contact" onClick={onNavigate}>
        Contact
      </a>
    </div>
  );
}

function SectionKicker({ number, label }) {
  return (
    <div className="section-kicker" data-reveal>
      <span>{number}</span>
      <span>{label}</span>
    </div>
  );
}

function ProjectTeaser({ project, index }) {
  return (
    <article className={`work-item work-item--${index % 3}`} data-reveal>
      <a className="work-media" href={`#/project/${project.slug}`} data-image-reveal>
        <PreviewMedia media={project.cover} title={project.title} />
      </a>
      <div className="work-copy">
        <span className="work-number">{project.number}</span>
        <div>
          <p className="work-meta">
            {project.category} / {project.year}
          </p>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <a className="text-link" href={`#/project/${project.slug}`}>
            View Project
          </a>
        </div>
      </div>
    </article>
  );
}

function PreviewMedia({ media, title }) {
  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        muted
        loop
        playsInline
        data-viewport-video
        aria-label={media.alt || title}
      />
    );
  }

  if (media.kind === "pdf") {
    return (
      <iframe
        title={`${title} preview`}
        src={`${media.src}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
      />
    );
  }

  return <img src={media.src} alt={media.alt || title} loading="lazy" />;
}

function AboutSection() {
  const skills = ["UI / UX Design", "AI Product", "Creative Development", "3D / Blender"];

  return (
    <section className="section about" id="about">
      <SectionKicker number="02" label="About" />
      <div className="about__grid">
        <h2 data-reveal>
          I design quiet systems with strong visual memory and product-level intent.
        </h2>
        <div data-reveal>
          <p>
            My work moves between product thinking, visual direction, AI-assisted workflows,
            web interaction, and moving image. I care about rhythm, hierarchy, and interfaces
            that feel precise without losing personality.
          </p>
          <div className="skill-list">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperimentsSection() {
  return (
    <section className="section experiments" id="experiments">
      <SectionKicker number="03" label="Experiments" />
      <div className="section-heading">
        <h2 data-reveal>Experiments</h2>
        <p data-reveal>Visual tests, AI studies, web motion, and short video pieces.</p>
      </div>
      <div className="experiment-grid">
        {experiments.map((item, index) => (
          <article className="experiment-item" key={item.title} data-reveal>
            <div className="experiment-media" data-image-reveal>
              {isVideo(item.media) ? (
                <video src={item.media} muted loop playsInline data-viewport-video />
              ) : isPdf(item.media) ? (
                <iframe title={item.title} src={`${item.media}#page=1&toolbar=0&navpanes=0`} />
              ) : (
                <img src={item.media} alt={item.title} loading="lazy" />
              )}
            </div>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p className="work-meta">
              {item.category} / {item.year}
            </p>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ qrOpen, onQrToggle }) {
  return (
    <section className="contact" id="contact">
      <SectionKicker number="04" label="Contact" />
      <h2 data-reveal>
        LET'S BUILD
        <br />
        SOMETHING NEXT.
      </h2>
      <div className="contact__row" data-reveal>
        <button type="button" className="qr-button" onClick={onQrToggle} aria-expanded={qrOpen}>
          WeChat QR
        </button>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <span>© 2026</span>
      </div>
    </section>
  );
}

function QrLayer({ onClose }) {
  return (
    <div className="qr-layer" role="dialog" aria-modal="true" aria-label="WeChat QR code">
      <button type="button" onClick={onClose} className="qr-layer__backdrop" aria-label="Close QR" />
      <div className="qr-panel">
        <button type="button" onClick={onClose} className="qr-panel__close">
          Close
        </button>
        <img
          src={profile.wechatQr}
          alt="WeChat QR code"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling.style.display = "grid";
          }}
        />
        <div className="qr-placeholder" aria-hidden="true">
          <span>WECHAT</span>
          <small>Add /public/images/wechat-qr.png</small>
        </div>
      </div>
    </div>
  );
}

function ProjectPage({ project }) {
  const nextProject = projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];

  return (
    <main className="project-page">
      <header className="project-nav">
        <a href="#/">Portfolio</a>
        <a href="#works">Back to Works</a>
      </header>

      <section className="project-hero">
        <div className="project-hero__meta" data-reveal>
          <span>{project.number}</span>
          <span>{project.category}</span>
          <span>{project.year}</span>
          <span>{project.type}</span>
        </div>
        <h1 data-reveal>{project.title}</h1>
        <p data-reveal>{project.description}</p>
      </section>

      <section className="project-story">
        {project.files.map((file, index) => (
          <MediaBlock key={`${file.src}-${index}`} file={file} index={index} />
        ))}
      </section>

      <footer className="project-footer">
        <a href={`#/project/${nextProject.slug}`}>Next Project / {nextProject.title}</a>
      </footer>
    </main>
  );
}

function MediaBlock({ file, index }) {
  const label = file.title || `Media ${index + 1}`;

  return (
    <figure className={`media-block media-block--${file.kind} media-block--${file.layout || "standard"}`}>
      <figcaption data-reveal>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{label}</strong>
      </figcaption>
      <div className="media-block__frame" data-image-reveal data-parallax>
        {file.kind === "pdf" && (
          <>
            <iframe title={label} src={`${file.src}#toolbar=1&navpanes=0`} />
            <a className="download-link" href={file.src} download={file.downloadName || ""}>
              Download PDF
            </a>
          </>
        )}
        {file.kind === "image" && <img src={file.src} alt={file.alt || label} loading="lazy" />}
        {file.kind === "video" && (
          <video src={file.src} muted controls playsInline data-viewport-video aria-label={label} />
        )}
      </div>
    </figure>
  );
}

export default App;

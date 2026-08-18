import { useEffect, useId, useRef } from "react";

function GradientWaves({
  horizonColor = "#8c75cc",
  waveColor = "#e7a4cf",
  crestColor = "#fffaf5",
  speed = 0.4,
  turbulence = 20,
  opacity = 1,
  mouseInteraction = false,
  parallaxStrength = 0.5,
}) {
  const containerRef = useRef(null);
  const filterId = `gradient-waves-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!mouseInteraction || !containerRef.current) return undefined;

    const container = containerRef.current;
    const onPointerMove = ({ clientX, clientY }) => {
      const { width, height, left, top } = container.getBoundingClientRect();
      container.style.setProperty("--gradient-waves-x", `${(((clientX - left) / width - 0.5) * 18).toFixed(2)}px`);
      container.style.setProperty("--gradient-waves-y", `${(((clientY - top) / height - 0.5) * 12).toFixed(2)}px`);
    };
    const reset = () => {
      container.style.setProperty("--gradient-waves-x", "0px");
      container.style.setProperty("--gradient-waves-y", "0px");
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", reset);
    };
  }, [mouseInteraction]);

  return (
    <div
      ref={containerRef}
      className="gradient-waves-container"
      aria-hidden="true"
      style={{
        "--gradient-waves-horizon": horizonColor,
        "--gradient-waves-wave": waveColor,
        "--gradient-waves-crest": crestColor,
        "--gradient-waves-duration": `${(12 / Math.max(speed, 0.1)).toFixed(2)}s`,
        "--gradient-waves-parallax": parallaxStrength,
        opacity,
      }}
    >
      <svg className="gradient-waves" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <filter id={filterId} x="-10%" y="-15%" width="120%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="2" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={turbulence} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <path
            className="gradient-waves__band gradient-waves__band--far"
            d="M-90 420 C180 260 370 575 650 410 S1130 235 1530 405 L1530 960 L-90 960 Z"
          />
          <path
            className="gradient-waves__band gradient-waves__band--near"
            d="M-110 635 C150 445 360 775 630 615 S1120 440 1550 640 L1550 960 L-110 960 Z"
          />
          <path
            className="gradient-waves__crest gradient-waves__crest--far"
            d="M-90 420 C180 260 370 575 650 410 S1130 235 1530 405"
          />
          <path
            className="gradient-waves__crest gradient-waves__crest--near"
            d="M-110 635 C150 445 360 775 630 615 S1120 440 1550 640"
          />
        </g>
      </svg>
    </div>
  );
}

export default GradientWaves;

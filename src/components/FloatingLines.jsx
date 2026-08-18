import { useEffect, useMemo, useRef } from "react";

const WAVE_ORDER = ["top", "middle", "bottom"];
const WAVE_BASELINES = {
  top: 150,
  middle: 430,
  bottom: 710,
};

function valueForWave(value, waveIndex) {
  return Array.isArray(value) ? value[waveIndex] ?? value[value.length - 1] : value;
}

function createLinePath({ wave, lineIndex, count, distance, bendRadius, bendStrength }) {
  const centerOffset = (lineIndex - (count - 1) / 2) * distance;
  const baseY = WAVE_BASELINES[wave] + centerOffset;
  const waveDirection = wave === "middle" ? -1 : 1;
  const bend = bendStrength * waveDirection;
  const radius = Math.max(0, bendRadius);
  const ripple = Math.sin((lineIndex + 1) * 0.72) * Math.abs(bend) * 0.55;

  return [
    `M -120 ${baseY.toFixed(2)}`,
    `C ${(170 - radius).toFixed(2)} ${(baseY + bend).toFixed(2)}`,
    `${(330 + radius).toFixed(2)} ${(baseY - bend + ripple).toFixed(2)}`,
    `520 ${(baseY + ripple).toFixed(2)}`,
    `S 880 ${(baseY + bend - ripple).toFixed(2)}`,
    `1080 ${(baseY - ripple).toFixed(2)}`,
    `S 1320 ${(baseY - bend).toFixed(2)}`,
    `1560 ${baseY.toFixed(2)}`,
  ].join(" ");
}

function FloatingLines({
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = 7,
  lineDistance = 34.5,
  bendRadius = 8,
  bendStrength = -7,
  interactive = false,
  parallax = true,
  animationSpeed = 1.6,
  gradientStart = "#e945f5",
  gradientMid = "#6f6f6f",
  gradientEnd = "#6a6a6a",
}) {
  const containerRef = useRef(null);
  const lines = useMemo(
    () =>
      WAVE_ORDER.flatMap((wave, waveIndex) => {
        if (!enabledWaves.includes(wave)) {
          return [];
        }

        const count = valueForWave(lineCount, waveIndex);
        const distance = valueForWave(lineDistance, waveIndex);

        return Array.from({ length: count }, (_, lineIndex) => ({
          wave,
          lineIndex,
          id: `${wave}-${lineIndex}`,
          d: createLinePath({
            wave,
            lineIndex,
            count,
            distance,
            bendRadius,
            bendStrength,
          }),
        }));
      }),
    [bendRadius, bendStrength, enabledWaves, lineCount, lineDistance],
  );

  useEffect(() => {
    if (!interactive && !parallax) {
      return undefined;
    }

    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      container.style.setProperty("--floating-x", `${(x * 18).toFixed(2)}px`);
      container.style.setProperty("--floating-y", `${(y * 12).toFixed(2)}px`);
    };

    const handlePointerLeave = () => {
      container.style.setProperty("--floating-x", "0px");
      container.style.setProperty("--floating-y", "0px");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [interactive, parallax]);

  return (
    <div ref={containerRef} className="floating-lines-container" aria-hidden="true">
      <svg
        className="floating-lines"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        style={{ "--line-duration": `${(18 / Math.max(0.1, animationSpeed)).toFixed(2)}s` }}
      >
        <defs>
          <linearGradient id="floating-lines-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="48%" stopColor={gradientMid} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
        {WAVE_ORDER.map((wave) => (
          <g className={`floating-lines__wave floating-lines__wave--${wave}`} key={wave}>
            {lines
              .filter((line) => line.wave === wave)
              .map((line) => (
                <path
                  d={line.d}
                  key={line.id}
                  pathLength="1"
                  style={{ "--line-index": line.lineIndex }}
                />
              ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default FloatingLines;

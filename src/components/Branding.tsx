/* Shared branding assets: FLEE logo, Argentina flag, Car illustration */

/* Logo uses the provided blue brush-stroke asset from public/ */
export function FleeLogo() {
  return (
    <img
      src="/image copy copy.png"
      alt="FLEE"
      className="h-14 w-auto object-contain select-none"
      draggable={false}
    />
  );
}

/* Argentina flag – used in the phone dial-code picker */
export function ArgentinaFlag({ size = 22 }: { size?: number }) {
  const h = Math.round(size * 0.72);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 22 16"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 2, flexShrink: 0 }}
    >
      <rect width="22" height="16" fill="#74ACDF" />
      <rect y="5.3" width="22" height="5.4" fill="white" />
      <circle cx="11" cy="8" r="2.2" fill="#F6B40E" />
      <circle cx="11" cy="8" r="1.4" fill="#F6B40E" />
    </svg>
  );
}

/* Car illustration – uses the hand-drawn asset from public/ */
export function CarIllustration() {
  return (
    <img
      src="/image.png"
      alt=""
      className="w-full h-auto object-contain select-none"
      draggable={false}
      aria-hidden="true"
    />
  );
}

/**
 * Gerçek şantiye fotoğrafları gelene kadar kullanılan zarif placeholder.
 * Fotoğraflar geldiğinde next/image ile değiştirilecek.
 */
const palettes = [
  ["#EDE7DB", "#D9CFBC"],
  ["#DFE3DC", "#B9C2B1"],
  ["#E8DED6", "#CBAF9F"],
  ["#DCE0E4", "#ABB4BE"],
  ["#EAE3D4", "#D6C39A"],
  ["#E5DDDA", "#C7ABA4"],
] as const;

export function PlaceholderImage({
  index = 0,
  label,
  className = "",
}: {
  index?: number;
  label?: string;
  className?: string;
}) {
  const [from, to] = palettes[index % palettes.length];

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex items-end overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {/* boya rulosu izi hissi veren yumuşak bantlar */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background: `repeating-linear-gradient(105deg, transparent 0 90px, rgb(255 255 255 / 0.22) 90px 160px)`,
        }}
      />
      {label && (
        <span className="relative m-4 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-ink/70 backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}

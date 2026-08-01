/**
 * Sonsuz kayan şerit — hizmetler ve şehirler arasında marka renk çipleri.
 * Saf CSS animasyonu (globals.css → .animate-marquee); hover'da durur,
 * prefers-reduced-motion'da tamamen kapanır.
 */
const chipColors = ["#C03428", "#A8B39A", "#C96F4A", "#5A6B7A", "#F1EDE4"];

export function Marquee({ items }: { items: string[] }) {
  const track = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span className="px-6 font-display text-2xl italic tracking-tight text-ink/60 md:px-8 md:text-3xl">
            {item}
          </span>
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-full border border-black/10"
            style={{ backgroundColor: chipColors[i % chipColors.length] }}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line bg-surface py-5">
      <div className="animate-marquee flex w-max">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}

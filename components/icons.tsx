import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function RollerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="4" width="14" height="6" rx="1.5" />
      <path d="M17 6h2.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H13v2" />
      <rect x="11.5" y="13" width="3" height="7" rx="1" />
    </svg>
  );
}

export function FacadeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 20V6l6-3v17" />
      <path d="M10 20V9h10v11" />
      <path d="M2 20h20" />
      <path d="M13.5 12.5h1.5M17 12.5h1.5M13.5 16h1.5M17 16h1.5M6.5 8.5h1M6.5 12h1M6.5 15.5h1" />
    </svg>
  );
}

export function TrowelIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 4l9 3.5L20.5 4 12 15.5 3 4z" />
      <path d="M12 15.5V18" />
      <rect x="10.5" y="18" width="3" height="3.5" rx="1" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9v10.5h13V9" />
      <path d="M10 19.5v-5h4v5" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 4h4l1.5 4L8 9.5a12 12 0 0 0 6.5 6.5l1.5-2.5 4 1.5v4a1.5 1.5 0 0 1-1.6 1.5C10.5 19.9 4.1 13.5 3.5 5.6A1.5 1.5 0 0 1 5 4z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 21s-6.5-5.5-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 12h16m0 0-6-6m6 6-6 6" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.17-3.05.88.9-2.96-.2-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.3 4.02c-.2 0-.5.07-.76.36-.26.28-1 .97-1 2.36 0 1.4 1.02 2.75 1.16 2.94.14.19 2 3.04 4.85 4.14 2.37.92 2.85.74 3.37.7.51-.05 1.65-.68 1.89-1.33.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33-.28-.14-1.65-.81-1.9-.9-.26-.1-.44-.15-.63.13-.18.28-.72.9-.88 1.09-.16.19-.32.21-.6.07a7.6 7.6 0 0 1-2.23-1.38 8.36 8.36 0 0 1-1.55-1.92c-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.49.14-.16.19-.28.28-.46.1-.19.05-.35-.02-.5-.07-.14-.62-1.5-.85-2.05-.23-.54-.46-.47-.63-.47l-.66-.01Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.9 3c.4 1.9 1.7 3.4 3.6 3.7v3a6.8 6.8 0 0 1-3.9-1.3v5.9a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.07v3.1a2.9 2.9 0 1 0 2 2.73V3h3.3Z" />
    </svg>
  );
}

export const serviceIcons = {
  roller: RollerIcon,
  facade: FacadeIcon,
  trowel: TrowelIcon,
  home: HomeIcon,
} as const;

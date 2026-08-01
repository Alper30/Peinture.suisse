/**
 * Peinture Suisse Rénovation logo işareti — kullanıcının logosunun
 * vektörel (SVG) yeniden çizimi: fırça + boya süpürmesi + çatı + İsviçre haritası.
 * tone="light": koyu zeminlerde koyu lacivert kısımlar beyaza döner.
 */
export function LogoMark({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const ink = tone === "light" ? "#FFFFFF" : "#232833";
  const hole = tone === "light" ? "#232833" : "#F7F5F0";

  return (
    <svg
      viewBox="0 0 260 170"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      {/* boya süpürmesi: gri + kırmızı */}
      <path
        fill="#C9CBCE"
        d="M66 96 C82 72 104 56 126 49 L136 47 L128 61 L138 57 L128 73 L119 84 C104 91 88 94 76 98 Z"
      />
      <path
        fill="#D8261C"
        d="M118 62 C134 46 154 36 174 34 L200 38 L188 44 L198 49 L184 53 L192 59 L176 62 L182 68 L164 70 C148 73 135 78 123 83 L113 87 C113 78 115 70 118 62 Z"
      />
      <path fill="#D8261C" d="M204 42 L214 46 L205 49 Z" />
      {/* İsviçre haritası + haç */}
      <path
        fill="#D8261C"
        d="M196 66 C192 56 200 47 209 50 C210 40 221 35 229 39 C234 31 246 31 250 38 C258 38 262 46 258 52 C264 57 262 66 254 69 C257 77 250 84 242 81 C240 89 230 92 224 86 C220 91 212 91 208 85 C200 86 194 80 196 72 Z"
      />
      <g fill="#FFFFFF">
        <rect x="223" y="47" width="9" height="27" />
        <rect x="214" y="56" width="27" height="9" />
      </g>
      {/* çatılar + baca + pencere */}
      <path fill={ink} d="M62 150 L128 58 L194 150 L172 150 L128 88 L84 150 Z" />
      <rect x="196" y="64" width="12" height="28" fill={ink} />
      <path
        fill={ink}
        d="M160 116 L190 78 L252 150 L231 150 L190 101 L174 122 Z"
      />
      <g fill={ink}>
        <rect x="111" y="112" width="15" height="15" />
        <rect x="130" y="112" width="15" height="15" />
        <rect x="111" y="131" width="15" height="15" />
        <rect x="130" y="131" width="15" height="15" />
      </g>
      {/* fırça */}
      <path
        fill={ink}
        d="M12 166 Q4 158 10 150 L34 122 L52 140 L26 166 Q19 172 12 166 Z"
      />
      <circle cx="17" cy="158" r="3.4" fill={hole} />
      <path fill="#B9BEC4" d="M34 122 L54 102 L72 118 L52 140 Z" />
      <path fill="#8E939B" d="M40 116 L60 96 L63 99 L43 121 Z" />
      <path
        fill="#C9CBCE"
        d="M54 102 L76 82 Q96 64 118 54 L104 78 L74 108 L68 118 Z"
      />
      <g stroke="#A7AAB0" strokeWidth="1.6" fill="none">
        <path d="M60 100 L88 74" />
        <path d="M66 104 L96 76" />
        <path d="M72 108 L102 80" />
      </g>
    </svg>
  );
}

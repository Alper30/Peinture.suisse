/**
 * Sayfa geçişi: her rota değişiminde içerik yumuşak belirir.
 * Saf CSS animasyonu (globals.css → .page-enter) — bu dosya layout
 * seviyesinde olduğu için animasyon kütüphanesini her sayfaya taşıyordu.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}

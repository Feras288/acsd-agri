import { Button } from "@/components/ui/button";
import { navigationItems } from "@/content/siteContent";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const logoUrl = "/manus-storage/acsd-official-logo_112cc60c.jpg";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkToSection = (hash: string) => `/${hash}`;
  return <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? "border-[#d9c995]/70 bg-[#fbf8ed]/95 shadow-[0_8px_24px_rgba(21,62,35,0.08)] backdrop-blur" : "border-transparent bg-[#fbf8ed]/90 backdrop-blur"}`}>
    <div className="container flex h-[5.4rem] items-center justify-between gap-5">
      <a href="/" className="flex items-center gap-3 text-right" aria-label="العودة إلى الرئيسية">
        <span className="hidden flex-col items-center justify-center border-l border-[#d9c995] pl-2 sm:flex" aria-hidden="true"><span className="brand-crown" /><span className="mt-1 text-[0.55rem] font-extrabold tracking-[0.22em] text-[#a67017]">ACSD</span></span>
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_6px_18px_rgba(16,77,40,0.12)] ring-1 ring-[#d7b15c]/45"><img src={logoUrl} alt="شعار الجمعية" className="h-full w-full object-cover" /></span>
        <span className="hidden sm:block"><span className="display-font block text-sm font-extrabold leading-tight text-[#155029]">الجمعية التعاونية الزراعية</span><span className="block pt-0.5 text-xs font-medium text-[#9b6a1c]">للتطوير والاستدامة</span></span>
      </a>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="التنقل الرئيسي">{navigationItems.slice(0, 6).map(item => <a key={item.href} href={linkToSection(item.href)} className="text-sm font-bold text-[#315441] transition-colors hover:text-[#a76e14]">{item.label}</a>)}</nav>
      <a href="/#تواصل" className="hidden lg:block"><Button className="h-10 rounded-full bg-[#165B2A] px-5 font-bold text-white shadow-[0_6px_18px_rgba(22,91,42,0.2)] transition-transform duration-200 hover:bg-[#10461f] active:scale-[0.97]">تواصل معنا <ArrowLeft className="mr-1 h-4 w-4" /></Button></a>
      <button type="button" onClick={() => setIsMenuOpen(value => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-[#d9c995] bg-white text-[#155029] lg:hidden" aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={isMenuOpen}>{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
    </div>
    {isMenuOpen && <nav className="border-t border-[#e4d7b5] bg-[#fbf8ed] px-5 py-5 shadow-lg lg:hidden" aria-label="التنقل عبر الجوال"><div className="mx-auto flex max-w-md flex-col gap-1">{navigationItems.map(item => <a key={item.href} href={linkToSection(item.href)} onClick={() => setIsMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#315441] transition-colors hover:bg-[#e8f0df] hover:text-[#155029]">{item.label}</a>)}</div></nav>}
  </header>;
}

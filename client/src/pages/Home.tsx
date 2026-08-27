/**
 * توجه «الأثر الأخضر»: صفحة عربية عضوية تتصل بصريًا عبر مسارات الحقول والماء.
 * الأولوية: وضوح المعلومات، الدفء المؤسسي، وإبراز الشعار الرسمي بوصفه ختم ثقة.
 */
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import LatestUpdates from "@/components/LatestUpdates";
import { activities, focusAreas, governanceAreas, navigationItems, objectives } from "@/content/siteContent";
import {
  ArrowLeft,
  ChevronLeft,
  Ghost,
  Instagram,
  Menu,
  Sprout,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const logoUrl = "/manus-storage/acsd-official-logo_112cc60c.jpg";
const markUrl = "/manus-storage/acsd-ecosystem-mark_bb9ed866.png";

function FieldDivider({ tone = "light" }: { tone?: "light" | "green" }) {
  return (
    <div className={`relative h-14 overflow-hidden ${tone === "green" ? "bg-[#165B2A]" : "bg-[#fbf8ed]"}`} aria-hidden="true">
      <div className={`absolute -bottom-12 -left-[10%] h-20 w-[72%] rounded-[50%] border-t-[18px] ${tone === "green" ? "border-[#e6bd67]" : "border-[#1b6835]"}`} />
      <div className={`absolute -bottom-16 left-[31%] h-24 w-[74%] rounded-[50%] border-t-[18px] ${tone === "green" ? "border-[#1a7cab]" : "border-[#d9a33a]"}`} />
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const FeaturedActivityIcon = activities[0].Icon;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="site-shell min-h-screen bg-[#fbf8ed] text-[#173d26]" dir="rtl">
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? "border-[#d9c995]/70 bg-[#fbf8ed]/95 shadow-[0_8px_24px_rgba(21,62,35,0.08)] backdrop-blur" : "border-transparent bg-[#fbf8ed]/90 backdrop-blur"}`}>
        <div className="container flex h-[5.4rem] items-center justify-between gap-5">
          <a href="#الرئيسية" className="flex items-center gap-3 text-right" aria-label="العودة إلى الرئيسية">
            <span className="hidden flex-col items-center justify-center border-l border-[#d9c995] pl-2 sm:flex" aria-hidden="true">
              <span className="brand-crown" />
              <span className="mt-1 text-[0.55rem] font-extrabold tracking-[0.22em] text-[#a67017]">ACSD</span>
            </span>
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_6px_18px_rgba(16,77,40,0.12)] ring-1 ring-[#d7b15c]/45">
              <img src={logoUrl} alt="شعار الجمعية" className="h-full w-full object-cover" />
            </span>
            <span className="hidden sm:block">
              <span className="display-font block text-sm font-extrabold leading-tight text-[#155029]">الجمعية التعاونية الزراعية</span>
              <span className="block pt-0.5 text-xs font-medium text-[#9b6a1c]">للتطوير والاستدامة</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="التنقل الرئيسي">
            {navigationItems.slice(0, 6).map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-bold text-[#315441] transition-colors hover:text-[#a76e14]">
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#تواصل" className="hidden lg:block">
            <Button className="h-10 rounded-full bg-[#165B2A] px-5 font-bold text-white shadow-[0_6px_18px_rgba(22,91,42,0.2)] transition-transform duration-200 hover:bg-[#10461f] active:scale-[0.97]">
              تواصل معنا
              <ArrowLeft className="mr-1 h-4 w-4" />
            </Button>
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#d9c995] bg-white text-[#155029] lg:hidden"
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-[#e4d7b5] bg-[#fbf8ed] px-5 py-5 shadow-lg lg:hidden" aria-label="التنقل عبر الجوال">
            <div className="mx-auto flex max-w-md flex-col gap-1">
              {navigationItems.map((item) => (
                <a key={item.href} href={item.href} onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm font-bold text-[#315441] transition-colors hover:bg-[#e8f0df] hover:text-[#155029]">
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="الرئيسية" className="grain-layer relative isolate overflow-hidden bg-[#f1efdF] pt-9 md:pt-14">
          <div className="container relative z-10 grid items-stretch gap-8 pb-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-28">
            <div className="order-2 flex flex-col justify-center pb-4 lg:order-1 lg:pb-12">
              <div className="reveal-up">
                <p className="section-label">نزرع الأثر المشترك</p>
                <h1 className="display-font mt-5 max-w-2xl text-[2.3rem] font-extrabold leading-[1.4] tracking-tight text-[#155029] sm:text-5xl lg:text-[3.7rem] lg:leading-[1.35]">
                  معًا نحو أرضٍ <span className="relative whitespace-nowrap text-[#ad761c]">أكثر عطاءً<span className="absolute -bottom-1 right-0 h-1.5 w-full bg-[#d8aa47]/55" /></span> واستدامة.
                </h1>
                <p className="mt-6 max-w-xl text-base font-medium leading-8 text-[#456351] sm:text-lg">
                  الجمعية التعاونية الزراعية للتطوير والاستدامة تجمع المعرفة والمبادرة والتعاون؛ لتطوير قطاع زراعي يحقق قيمة دائمة للمزارع والمجتمع والبيئة.
                </p>
              </div>

              <div className="reveal-up-delay mt-8 flex flex-wrap items-center gap-3">
                <a href="#عن-الجمعية">
                  <Button className="h-12 rounded-full bg-[#165B2A] px-6 font-bold text-white shadow-[0_12px_25px_rgba(22,91,42,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#10461f] active:scale-[0.97]">
                    اكتشف رسالتنا
                    <ChevronLeft className="mr-1 h-4 w-4" />
                  </Button>
                </a>
                <a href="#أنشطتنا" className="inline-flex h-12 items-center gap-2 rounded-full border border-[#bb913c] bg-white/70 px-5 text-sm font-bold text-[#775619] transition-all duration-200 hover:border-[#8c6419] hover:bg-white active:scale-[0.97]">
                  استعرض الأنشطة
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-11 grid max-w-xl grid-cols-3 border-t border-[#d9c995] pt-5">
                {focusAreas.map(({ label, Icon }) => (
                  <div key={label} className="flex flex-col gap-2 border-l border-[#d9c995] px-3 last:border-l-0 first:pr-0">
                    <Icon className="h-5 w-5 text-[#b17816]" strokeWidth={1.8} />
                    <span className="text-xs font-bold leading-5 text-[#315441] sm:text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 min-h-[25rem] overflow-hidden rounded-bl-[5.5rem] rounded-tr-[5.5rem] border-[9px] border-white shadow-[0_28px_70px_rgba(24,76,46,0.17)] lg:order-2 lg:min-h-[38rem]">
              <img src="/manus-storage/acsd-hero-terraced-fields_8e549636.jpg" alt="حقول زراعية متدرجة ومسار مائي" className="warm-documentary absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123e26]/50 via-transparent to-[#f7e7b8]/20" />
              <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/50 bg-[#fbf8ed]/90 px-3 py-2 shadow-lg backdrop-blur">
                <img src={markUrl} alt="" className="h-6 w-6 object-contain" />
                <span className="text-xs font-bold text-[#155029]">أرض، ماء، معرفة</span>
              </div>
              <div className="absolute bottom-6 right-6 left-6 border-r-2 border-[#dfb757] pr-4 text-right text-white">
                <span className="display-font block text-base font-bold">التنمية تبدأ من جذورٍ قوية</span>
                <span className="mt-1 block text-xs text-white/80">ونقودها بشراكة تؤمن بالمستقبل.</span>
              </div>
              <div className="hero-field-lines drift-lines" />
            </div>
          </div>
        </section>

        <section id="عن-الجمعية" className="relative bg-[#165B2A] pb-20 pt-14 text-white lg:pb-24">
          <FieldDivider tone="green" />
          <div className="container mt-8 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div className="relative min-h-[16rem]">
              <div className="absolute right-[10%] top-2 h-52 w-52 rounded-full border border-[#e6bd67]/45" />
              <div className="focus-orb absolute right-[16%] top-10 grid h-40 w-40 place-items-center rounded-full bg-[#fbf8ed]">
                <img src={logoUrl} alt="شعار الجمعية التعاونية الزراعية للتطوير والاستدامة" className="h-[8.4rem] w-[8.4rem] rounded-full object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 display-font text-7xl font-extrabold text-[#e6bd67]/25">ACSD</span>
            </div>
            <div className="max-w-3xl">
              <p className="section-label !text-[#e6bd67] before:!bg-[#e6bd67]">عن الجمعية</p>
              <h2 className="display-font mt-4 text-3xl font-extrabold leading-[1.55] sm:text-4xl">نبني حلولًا زراعية تنمو مع الناس وتدوم للأرض.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#e7f0df]/90 sm:text-lg">
                جمعية تعاونية سعودية تجمع الأعضاء والمساهمين والخبرات حول تنمية زراعية مستدامة؛ لرفع الكفاءة الإنتاجية وتعظيم القيمة الاقتصادية والاجتماعية للمجتمع المحلي.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="border-r border-[#e6bd67]/60 pr-4">
                  <h3 className="display-font text-lg font-bold text-[#f2cd78]">رؤيتنا</h3>
                  <p className="mt-2 text-sm leading-7 text-white/80">منظومة زراعية متعاونة تنمو بالمعرفة والابتكار، وتحافظ على الموارد، وتصنع قيمة مستدامة.</p>
                </div>
                <div className="border-r border-[#e6bd67]/60 pr-4">
                  <h3 className="display-font text-lg font-bold text-[#f2cd78]">رسالتنا</h3>
                  <p className="mt-2 text-sm leading-7 text-white/80">تمكين التنمية الزراعية عبر مبادرات واستثمارات وشراكات عملية ذات أثر اقتصادي واجتماعي وبيئي.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="أهدافنا" className="route-map relative isolate bg-[#fbf8ed] py-20 lg:py-28">
          <div className="container relative z-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="section-label">وجهة العمل</p>
                <h2 className="display-font mt-4 max-w-xl text-3xl font-extrabold leading-[1.5] text-[#155029] sm:text-4xl">مسارات عملية لتنميةٍ تمتد آثارها.</h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-[#516f5d]">نحوّل احتياجات الأعضاء والميدان إلى مشاريع وخدمات وشراكات تجمع الإنتاج والمعرفة والفرص السوقية في دورة نمو واحدة.</p>
            </div>
            <div className="branch-rule mt-10" />
            <div className="mt-2">
              {objectives.map(({ number, title, description, Icon }, index) => (
                <article key={number} className="group grid gap-4 border-b border-[#ded4b7] py-7 transition-colors hover:bg-[#f3f0e3]/70 sm:grid-cols-[6.5rem_4rem_1fr] sm:items-center sm:gap-6 sm:px-4">
                  <div className="outline-number order-2 sm:order-1">{number}</div>
                  <div className="order-1 grid h-12 w-12 place-items-center rounded-full border border-[#d4b467] bg-white text-[#a36d18] transition-transform duration-200 group-hover:-translate-y-1 sm:order-2">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <div className="order-3 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
                    <h3 className="display-font shrink-0 text-xl font-bold text-[#155029]">{title}</h3>
                    <p className="max-w-2xl text-sm leading-7 text-[#567260]">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="أنشطتنا" className="route-map relative isolate bg-[#e8f0df] py-20 lg:py-28">
          <div className="container relative z-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="section-label">مسارات الأثر</p>
                <h2 className="display-font mt-4 text-3xl font-extrabold leading-[1.5] text-[#155029] sm:text-4xl">برامج تنطلق من احتياج الميدان.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#52705b]">من التدريب والإنتاج المحمي إلى المشاريع الحيوانية والموارد، تتحول الأولويات إلى مبادرات قابلة للتنفيذ.</p>
            </div>

            <div className="mt-11 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="group relative min-h-[30rem] overflow-hidden rounded-bl-[4rem] rounded-tr-[4rem] bg-[#155029] shadow-[0_20px_45px_rgba(22,91,42,0.18)]">
                <img src={activities[0].image} alt="تعاون وتعلّم في حقل زراعي" className="warm-documentary absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123e26] via-[#123e26]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e6bd67] text-[#155029]"><FeaturedActivityIcon className="h-5 w-5" /></span>
                  <h3 className="display-font mt-5 text-2xl font-bold">{activities[0].title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/85">{activities[0].description}</p>
                </div>
              </article>

              <div className="activity-route flex flex-col gap-5 py-2">
                {activities.slice(1).map(({ title, description, Icon, image }) => (
                  <article key={title} className="activity-step group grid min-h-[14rem] grid-cols-[0.83fr_1.17fr] overflow-hidden border-b border-[#c6d7bd] bg-[#fbf8ed]/35 pb-5 last:border-b-0 last:pb-0">
                    <div className="relative mr-3 overflow-hidden rounded-bl-[2rem] rounded-tr-[2rem] shadow-[0_10px_23px_rgba(22,91,42,0.09)]">
                      <img src={image} alt="" className="warm-documentary h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="image-wash" />
                    </div>
                    <div className="flex flex-col justify-center p-5 sm:p-7">
                      <Icon className="h-5 w-5 text-[#ad761c]" strokeWidth={1.8} />
                      <h3 className="display-font mt-3 text-lg font-bold text-[#155029]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#58735f]">{description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[#fbf8ed] py-18 lg:py-24">
          <div className="container grid gap-7 lg:grid-cols-[1fr_0.66fr] lg:items-center">
            <div className="relative overflow-hidden rounded-bl-[4rem] rounded-tr-[4rem] bg-[#dba83c] px-7 py-10 text-[#173d26] sm:px-11 sm:py-12">
              <div className="absolute -left-14 -top-14 h-48 w-48 rounded-full border-[22px] border-[#f6d98d]/60" />
              <Sprout className="absolute bottom-7 left-9 h-24 w-24 text-[#155029]/15" strokeWidth={1.1} />
              <div className="relative z-10 max-w-xl">
                <p className="section-label !text-[#5f4617] before:!bg-[#5f4617]">رؤيتنا للمستقبل</p>
                <h2 className="display-font mt-4 text-3xl font-extrabold leading-[1.6] sm:text-4xl">الأمن الغذائي يبدأ بقيمةٍ تُبنى معًا.</h2>
                <p className="mt-4 text-base font-medium leading-8 text-[#4f421f]">نرى أن الزراعة المتقدمة لا تقاس بحجم الإنتاج وحده؛ بل بكفاءة الموارد، والابتكار، والاستثمار المسؤول، والشراكات التي ترفع أثرها على الإنسان والمكان.</p>
              </div>
            </div>
            <div className="px-2 py-4 lg:px-8">
              <p className="display-font text-xl font-bold leading-9 text-[#155029]">نبني شراكات فاعلة مع القطاعين العام والخاص والجهات التمويلية؛ لفتح فرص تنموية واستثمارية أوسع.</p>
              <div className="mt-6 flex items-center gap-3 text-[#987020]">
                <span className="h-px w-12 bg-[#c88a19]" />
                <span className="text-sm font-bold">شراكة، ابتكار، واستدامة مالية وإدارية</span>
              </div>
            </div>
          </div>
        </section>

        <section id="الحوكمة" className="relative overflow-hidden bg-[#f4f1e5] py-20 lg:py-28">
          <div className="container relative z-10">
            <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="section-label">الحوكمة والشفافية</p>
                <h2 className="display-font mt-4 max-w-lg text-3xl font-extrabold leading-[1.55] text-[#155029] sm:text-4xl">ثقةٌ تنمو من وضوح القواعد.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[#516f5d]">نعمل على بناء منظومة مؤسسية ترتكز على المشاركة والشفافية والمسؤولية؛ وتحمي مصالح الأعضاء والمساهمين والشركاء، وتدعم قرارات واضحة ومستدامة.</p>
            </div>
            <div className="mt-11 grid gap-5 md:grid-cols-3">
              {governanceAreas.map(({ title, description, Icon }, index) => (
                <article key={title} className={`relative overflow-hidden rounded-bl-[2rem] rounded-tr-[2rem] border p-6 ${index === 1 ? "border-[#d7b15c] bg-[#165B2A] text-white" : "border-[#ded4b7] bg-white/70 text-[#155029]"}`}>
                  <span className={`grid h-11 w-11 place-items-center rounded-full ${index === 1 ? "bg-[#e6bd67] text-[#155029]" : "bg-[#e8f0df] text-[#155029]"}`}><Icon className="h-5 w-5" strokeWidth={1.7} /></span>
                  <h3 className={`display-font mt-6 text-xl font-bold ${index === 1 ? "text-white" : "text-[#155029]"}`}>{title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? "text-white/80" : "text-[#58735f]"}`}>{description}</p>
                  <span className={`mt-6 block h-px w-16 ${index === 1 ? "bg-[#e6bd67]/70" : "bg-[#dba83c]"}`} />
                </article>
              ))}
            </div>
            <a href="#تواصل" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#8f651a] transition-colors hover:text-[#155029]">للاستفسار عن وثائق الحوكمة والسياسات <ArrowLeft className="h-4 w-4" /></a>
          </div>
        </section>

        <LatestUpdates />
        <ContactForm />
      </main>

      <footer className="bg-[#103a22] py-6 text-white/65">
        <div className="container flex flex-col gap-5 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-right">
          <div className="flex flex-col gap-1"><span>الجمعية التعاونية الزراعية للتطوير والاستدامة</span><span className="font-medium text-[#e6bd67]">من الأرض نبدأ، وبالمعرفة نرفع أثرها.</span><a href="/admin" className="mt-1 w-fit self-center text-[0.68rem] font-bold text-white/55 transition-colors hover:text-[#f2cd78] sm:self-start">دخول إدارة الجمعية</a></div>
          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <span className="ml-1 text-xs font-bold text-white/75">تابعونا</span>
            <a href="https://x.com/acsd2027?s=11" target="_blank" rel="noreferrer" aria-label="حساب الجمعية على X" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#e6bd67] hover:bg-[#e6bd67] hover:text-[#155029]"><Twitter className="h-4 w-4" /></a>
            <a href="https://www.instagram.com/acsd2027/" target="_blank" rel="noreferrer" aria-label="حساب الجمعية على إنستغرام" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#e6bd67] hover:bg-[#e6bd67] hover:text-[#155029]"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.snapchat.com/@acsd2027?invite_id=ctp_OFma&locale=ar_SA%40calendar%3Dgregorian&share_id=ujdQkug2RiGTHVnW8Sc_1A&sid=a5931264988c415e8e3463a334230b6d" target="_blank" rel="noreferrer" aria-label="حساب الجمعية على سناب شات" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#e6bd67] hover:bg-[#e6bd67] hover:text-[#155029]"><Ghost className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

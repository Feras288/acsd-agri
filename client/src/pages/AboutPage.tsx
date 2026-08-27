import { Button } from "@/components/ui/button";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ArrowLeft, BadgeCheck, Building2, Handshake, Landmark, Leaf, ShieldCheck, Sprout, UsersRound } from "lucide-react";

const logoUrl = "/manus-storage/acsd-official-logo_112cc60c.jpg";
const chairPhotoUrl = "/manus-storage/acsd-board-chair_c9405dd9.jpeg";

const impactPaths = [
  { title: "مشاريع زراعية منتجة", description: "تطوير المشاريع الزراعية والبيوت المحمية بما يدعم تنوع الإنتاج وكفاءته.", Icon: Sprout },
  { title: "تنمية الثروة الحيوانية", description: "إتاحة مسارات لمشاريع حيوانية متخصصة تتناسب مع احتياجات المجتمع المحلي.", Icon: Leaf },
  { title: "معرفة تصل إلى الميدان", description: "تنفيذ دورات وورش عملية للأعضاء والمزارعين حول الممارسات الزراعية الحديثة.", Icon: UsersRound },
  { title: "قيمة وشراكات", description: "بناء شراكات مع الجهات الحكومية والخاصة وغير الربحية لتنمية الموارد والفرص.", Icon: Handshake },
  { title: "مدخلات زراعية ميسّرة", description: "المساهمة في توفير المعدات والبذور والأسمدة بأسعار تشجيعية للمزارعين.", Icon: Building2 },
  { title: "حوكمة تصنع الثقة", description: "إدارة العمل بمنهج الشفافية والمشاركة والمسؤولية المجتمعية والاستدامة.", Icon: ShieldCheck },
];

const boardMembers = [
  { name: "عبدالرحمن حسن عبدالله عزران", role: "رئيس مجلس الإدارة" },
  { name: "ولي عبدالله عبده", role: "نائب رئيس مجلس الإدارة" },
  { name: "محمد حسن آل الهادي", role: "أمين الصندوق" },
  { name: "سامي ولي عبدالله", role: "عضو مجلس الإدارة" },
  { name: "ندى حسن صديق عزران", role: "عضو مجلس الإدارة" },
];

export default function AboutPage() {
  return <div className="site-shell min-h-screen bg-[#fbf8ed] text-[#173d26]" dir="rtl">
    <SiteHeader />
    <main>
      <section className="grain-layer relative isolate overflow-hidden bg-[#f0eedf] py-14 lg:py-20">
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full border-[28px] border-[#e6bd67]/20" aria-hidden="true" />
        <div className="container relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="order-2 max-w-2xl lg:order-1">
            <p className="section-label">سجل الأثر</p>
            <h1 className="display-font mt-4 text-4xl font-extrabold leading-[1.45] text-[#155029] sm:text-5xl">جمعية تنمّي القيمة، وتحفظ أثر الأرض.</h1>
            <p className="mt-6 text-base leading-8 text-[#466452] sm:text-lg">الجمعية التعاونية الزراعية للتطوير والاستدامة كيان تعاوني سعودي يجمع الأعضاء والمساهمين والشركاء حول تنمية زراعية أكثر كفاءة، وقيمة اقتصادية واجتماعية تنمو مع المجتمع.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#مسارات-الأثر"><Button className="h-11 rounded-full bg-[#165B2A] px-5 font-bold text-white hover:bg-[#10461f] active:scale-[0.97]">استكشف مساراتنا <ArrowLeft className="mr-1 h-4 w-4" /></Button></a><a href="/contact" className="inline-flex h-11 items-center rounded-full border border-[#bb913c] bg-white/70 px-5 text-sm font-bold text-[#775619] transition-colors hover:bg-white">تواصل مع الجمعية</a></div>
          </div>
          <div className="relative order-1 min-h-[21rem] lg:order-2">
            <div className="absolute left-[14%] top-[6%] h-64 w-64 rounded-full border border-[#d6b156]/70 sm:h-80 sm:w-80" />
            <div className="absolute left-[25%] top-[18%] grid h-44 w-44 place-items-center rounded-full bg-[#165B2A] shadow-[0_24px_50px_rgba(21,91,42,0.22)] sm:h-56 sm:w-56"><img src={logoUrl} alt="شعار الجمعية التعاونية الزراعية للتطوير والاستدامة" className="h-[88%] w-[88%] rounded-full object-cover" /></div>
            <div className="absolute bottom-0 right-0 max-w-52 rounded-bl-[2.5rem] rounded-tr-[2.5rem] border border-[#d9c995] bg-white p-5 shadow-[0_16px_36px_rgba(22,91,42,0.1)]"><Landmark className="h-6 w-6 text-[#a67017]" /><p className="display-font mt-3 text-base font-bold text-[#155029]">شراكةٌ عادلة، وقرارٌ مسؤول.</p><p className="mt-2 text-xs leading-6 text-[#607a68]">نحو نموذج مؤسسي مستدام يحفظ الثقة ويعظّم القيمة.</p></div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#155029] py-18 text-white lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div><p className="section-label !text-[#e6bd67] before:!bg-[#e6bd67]">من نحن</p><h2 className="display-font mt-4 text-3xl font-extrabold leading-[1.55] sm:text-4xl">تعاونٌ ينقل المعرفة إلى قيمةٍ مستدامة.</h2></div>
          <div className="space-y-5 text-base leading-8 text-[#e8f2e4]/90"><p>نعمل على تنمية العوائد المستدامة للمساهمين وتعزيز مشاركتهم في المبادرات التنموية والاستثمارية، عبر حلول ترفع الكفاءة الإنتاجية وتعزّز القيمة المضافة للمنتجات الزراعية وتدعم الصناعات التحويلية والتقنيات الحديثة.</p><p>يقوم عملنا على المشاركة والشفافية والحوكمة والمسؤولية المجتمعية، وعلى شراكات استراتيجية تبني الموارد والخبرات والفرص الاستثمارية بما يخدم مستهدفات التنمية المستدامة ورؤية المملكة 2030.</p></div>
        </div>
      </section>

      <section id="مسارات-الأثر" className="route-map relative isolate bg-[#fbf8ed] py-20 lg:py-28"><div className="container relative z-10"><div className="max-w-2xl"><p className="section-label">وجهة العمل</p><h2 className="display-font mt-4 text-3xl font-extrabold leading-[1.5] text-[#155029] sm:text-4xl">ستة مسارات، وأثر واحد متصل.</h2><p className="mt-4 text-base leading-8 text-[#58735f]">تترجم أهداف الجمعية إلى تدخلات عملية تقرّب الموارد والمعرفة والشراكة من احتياج المزارع والمجتمع.</p></div><div className="mt-12 grid gap-x-8 lg:grid-cols-2">{impactPaths.map(({ title, description, Icon }, index) => <article key={title} className="group flex gap-5 border-b border-[#d9d1b8] py-6 transition-colors hover:bg-[#f1efdf]/65 sm:px-4"><span className="outline-number shrink-0 text-3xl">{String(index + 1).padStart(2, "0")}</span><div><span className="grid h-11 w-11 place-items-center rounded-full border border-[#d6b156] bg-white text-[#a67017] transition-transform duration-200 group-hover:-translate-y-1"><Icon className="h-5 w-5" /></span><h3 className="display-font mt-4 text-xl font-bold text-[#155029]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#607a68]">{description}</p></div></article>)}</div></div></section>

      <section className="bg-[#e8f0df] py-20 lg:py-28"><div className="container grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"><div className="relative mx-auto w-full max-w-sm"><div className="absolute -right-4 -top-4 h-full w-full rounded-bl-[4rem] rounded-tr-[4rem] border border-[#d4ae54]" /><div className="relative overflow-hidden rounded-bl-[4rem] rounded-tr-[4rem] bg-[#f9f6e9] p-3 shadow-[0_22px_50px_rgba(22,91,42,0.13)]"><img src={chairPhotoUrl} alt="رئيس مجلس إدارة الجمعية" className="h-[27rem] w-full object-contain" /></div></div><div><p className="section-label">رسالة القيادة</p><blockquote className="display-font mt-5 border-r-2 border-[#b57c1d] pr-6 text-2xl font-bold leading-[1.75] text-[#155029] sm:text-3xl">«مستقبل الزراعة لا يُقاس بحجم الإنتاج وحده، بل بقدرة المؤسسات على بناء قيمة مستدامة وإدارة الموارد بكفاءة.»</blockquote><p className="mt-6 max-w-2xl text-base leading-8 text-[#57715f]">تعمل الجمعية على نموذج مؤسسي حديث يجمع الحوكمة والكفاءة التشغيلية والاستثمار المستدام، ويدعو الشركاء والمساهمين والجهات ذات العلاقة إلى المشاركة في بناء أثر اقتصادي واجتماعي وبيئي طويل المدى.</p><p className="mt-6 font-bold text-[#155029]">عبدالرحمن بن حسن عزران<span className="mr-2 font-normal text-[#78907d]">رئيس مجلس الإدارة</span></p></div></div></section>

      <section className="bg-[#fbf8ed] py-20 lg:py-28"><div className="container"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-label">منظومة الثقة</p><h2 className="display-font mt-4 text-3xl font-extrabold text-[#155029] sm:text-4xl">قيادة تلتزم بالأثر.</h2></div><p className="max-w-md text-sm leading-7 text-[#5e7765]">مدة عضوية مجلس الإدارة خمس سنوات.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{boardMembers.map((member, index) => <article key={member.name} className="rounded-bl-[2rem] rounded-tr-[2rem] border border-[#d9c995] bg-white p-5 shadow-[0_10px_28px_rgba(22,91,42,0.06)]"><span className="text-xs font-bold text-[#b07819]">0{index + 1}</span><h3 className="display-font mt-5 text-base font-bold leading-7 text-[#155029]">{member.name}</h3><p className="mt-2 text-xs leading-6 text-[#66816d]">{member.role}</p></article>)}</div><div className="mt-10 rounded-bl-[2.5rem] rounded-tr-[2.5rem] bg-[#155029] p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-9"><div><p className="inline-flex items-center gap-2 text-sm font-bold text-[#f2cd78]"><BadgeCheck className="h-4 w-4" />قيم تحكم المسار</p><p className="display-font mt-3 text-xl font-bold">شفافية، مشاركة، مسؤولية، واستدامة.</p></div><a href="/contact" className="mt-5 inline-flex h-11 items-center rounded-full border border-[#e6bd67]/70 px-5 text-sm font-bold text-[#f2cd78] transition-colors hover:bg-[#e6bd67] hover:text-[#155029] sm:mt-0">ابدأ شراكة مع الجمعية <ArrowLeft className="mr-2 h-4 w-4" /></a></div></div></section>
      <section className="bg-[#f3f1e4] py-16 lg:py-20"><div className="container rounded-bl-[3rem] rounded-tr-[3rem] border border-[#d9c995] bg-white p-8 shadow-[0_14px_32px_rgba(22,91,42,0.07)] sm:flex sm:items-center sm:justify-between sm:gap-8"><div><p className="section-label">الحوكمة والإفصاح</p><h2 className="display-font mt-4 text-2xl font-extrabold text-[#155029]">وثائق تؤكد التزامنا بالوضوح.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#5b7562]">اطّلع على مكتبة مستقلة تضم وثائق الحوكمة والتقارير السنوية مع تصفية حسب النوع وسنة الإصدار.</p></div><a href="/governance" className="mt-6 inline-flex h-11 shrink-0 items-center rounded-full bg-[#155029] px-5 text-sm font-bold text-white transition-colors hover:bg-[#10461f] sm:mt-0">استعرض مكتبة الحوكمة <ArrowLeft className="mr-2 h-4 w-4" /></a></div></section>
    </main>
    <SiteFooter />
  </div>;
}

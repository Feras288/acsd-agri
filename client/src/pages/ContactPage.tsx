import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Ghost, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

const contactChannels = [
  { label: "البريد الإلكتروني", value: "info@acsd.sa", href: "mailto:info@acsd.sa", Icon: Mail, detail: "القناة المعتمدة لاستقبال الاستفسارات والشراكات." },
  { label: "اتصال هاتفي", value: "017 325 0000", href: "tel:+966173250000", Icon: Phone, detail: "للاستفسارات والتنسيق المباشر مع الجمعية." },
  { label: "اتصال هاتفي", value: "055 123 4567", href: "tel:+966551234567", Icon: Phone, detail: "للاستفسارات والتنسيق المباشر مع الجمعية." },
];

const socialChannels = [
  { label: "X", href: "https://x.com/acsd2027?s=11", Icon: Twitter },
  { label: "إنستغرام", href: "https://www.instagram.com/acsd2027/", Icon: Instagram },
  { label: "سناب شات", href: "https://www.snapchat.com/@acsd2027?invite_id=ctp_OFma&locale=ar_SA%40calendar%3Dgregorian&share_id=ujdQkug2RiGTHVnW8Sc_1A&sid=a5931264988c415e8e3463a334230b6d", Icon: Ghost },
];

export default function ContactPage() {
  return <div className="site-shell min-h-screen bg-[#fbf8ed] text-[#173d26]" dir="rtl"><SiteHeader /><main>
    <section className="grain-layer relative isolate overflow-hidden bg-[#f0eedf] py-14 lg:py-20"><div className="absolute -left-24 top-8 h-80 w-80 rounded-full border-[30px] border-[#d5a647]/20" aria-hidden="true" /><div className="container relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"><div><p className="section-label">بوابة التواصل</p><h1 className="display-font mt-4 max-w-2xl text-4xl font-extrabold leading-[1.45] text-[#155029] sm:text-5xl">لنتحوّل من فكرة إلى خطوةٍ مشتركة.</h1><p className="mt-6 max-w-2xl text-base leading-8 text-[#4e6b58] sm:text-lg">نستقبل أسئلتكم ومقترحاتكم وطلبات الشراكة عبر نموذج واحد يحفظ الرسالة ومرفقاتها، ويتيح لفريق الجمعية متابعتها والرد عليها بصورة موثقة.</p></div><div className="rounded-bl-[3.5rem] rounded-tr-[3.5rem] border border-[#d9c995] bg-white/85 p-7 shadow-[0_20px_45px_rgba(22,91,42,0.08)]"><MapPin className="h-7 w-7 text-[#a67017]" /><p className="section-label mt-6">نطاق التواصل</p><h2 className="display-font mt-3 text-2xl font-extrabold text-[#155029]">محافظة الدرب، المملكة العربية السعودية</h2><p className="mt-3 text-sm leading-7 text-[#617a68]">لأن الموقع السابق لا يتضمن عنوانًا تفصيليًا أو إحداثيات، نعرض نطاق الجمعية المنشور دون افتراض عنوان إضافي.</p></div></div></section>

    <section className="bg-[#fbf8ed] py-20 lg:py-24"><div className="container"><div className="max-w-2xl"><p className="section-label">قنوات مباشرة</p><h2 className="display-font mt-4 text-3xl font-extrabold text-[#155029] sm:text-4xl">اختر القناة الأنسب لخطوتك التالية.</h2></div><div className="mt-10 grid gap-5 lg:grid-cols-3">{contactChannels.map(({ label, value, href, Icon, detail }) => <a key={value} href={href} className="group rounded-bl-[2.5rem] rounded-tr-[2.5rem] border border-[#d9c995] bg-white p-6 shadow-[0_12px_30px_rgba(22,91,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(22,91,42,0.12)]"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f0df] text-[#155029] transition-colors group-hover:bg-[#e6bd67]"><Icon className="h-5 w-5" /></span><p className="mt-6 text-xs font-bold text-[#a67017]">{label}</p><p className="display-font mt-2 text-xl font-bold text-[#155029]" dir="ltr">{value}</p><p className="mt-3 text-xs leading-6 text-[#68816f]">{detail}</p></a>)}</div><div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#d9c995] bg-[#f5f1df] px-5 py-4"><span className="text-sm font-bold text-[#155029]">تابعونا</span>{socialChannels.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#315441] shadow-sm transition-colors hover:bg-[#e6bd67] hover:text-[#155029]"><Icon className="h-3.5 w-3.5" />{label}</a>)}</div></div></section>
    <ContactForm />
  </main><SiteFooter /></div>;
}

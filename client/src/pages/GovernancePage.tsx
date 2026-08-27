import GovernanceLibrary from "@/components/GovernanceLibrary";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { FileCheck2, Landmark, ShieldCheck } from "lucide-react";

export default function GovernancePage() {
  return <div className="site-shell min-h-screen bg-[#fbf8ed] text-[#173d26]" dir="rtl">
    <SiteHeader />
    <main>
      <section className="grain-layer relative isolate overflow-hidden bg-[#f0eedf] py-16 lg:py-24">
        <div className="absolute -left-24 top-2 h-80 w-80 rounded-full border-[28px] border-[#e6bd67]/20" aria-hidden="true" />
        <div className="container relative z-10 grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div className="max-w-xl"><p className="section-label">بوابة الإفصاح</p><h1 className="display-font mt-4 text-4xl font-extrabold leading-[1.45] text-[#155029] sm:text-5xl">وثائق تُبقي الثقة مرئية.</h1><p className="mt-6 text-base leading-8 text-[#4f6d58] sm:text-lg">تجمع هذه الصفحة وثائق الحوكمة والتقارير السنوية المعتمدة في مكتبة واضحة، قابلة للتصفية والتحميل، لتقريب المعرفة المؤسسية من المجتمع والشركاء.</p></div>
          <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-bl-[2rem] rounded-tr-[2rem] border border-[#d9c995] bg-white/80 p-5"><Landmark className="h-6 w-6 text-[#a67017]" /><p className="display-font mt-4 font-bold text-[#155029]">إفصاح واضح</p><p className="mt-2 text-xs leading-6 text-[#66816d]">وثائق المؤسسة في مسار واحد.</p></div><div className="rounded-bl-[2rem] rounded-tr-[2rem] border border-[#d9c995] bg-white/80 p-5"><FileCheck2 className="h-6 w-6 text-[#a67017]" /><p className="display-font mt-4 font-bold text-[#155029]">وصول منظّم</p><p className="mt-2 text-xs leading-6 text-[#66816d]">تصفية سريعة حسب النوع والسنة.</p></div><div className="rounded-bl-[2rem] rounded-tr-[2rem] border border-[#d9c995] bg-white/80 p-5"><ShieldCheck className="h-6 w-6 text-[#a67017]" /><p className="display-font mt-4 font-bold text-[#155029]">ثقة قابلة للقياس</p><p className="mt-2 text-xs leading-6 text-[#66816d]">تتبّع واضح لمرات تحميل الوثائق.</p></div></div>
        </div>
      </section>
      <GovernanceLibrary />
    </main>
    <SiteFooter />
  </div>;
}

/** صفحة قراءة الخبر الكامل؛ تعرض الأخبار المنشورة فقط. */
import { trpc } from "@/lib/trpc";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ArrowRight, CalendarDays, ChevronLeft, LoaderCircle, Sprout } from "lucide-react";
import { Link, useRoute } from "wouter";

const formatDate = (value: Date) => new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));

export default function NewsDetail() {
  const [, params] = useRoute("/news/:id");
  const id = Number(params?.id);
  const news = trpc.content.publicNewsById.useQuery({ id: Number.isInteger(id) && id > 0 ? id : 0 }, { enabled: Number.isInteger(id) && id > 0 });

  if (news.isLoading) return <main className="grid min-h-screen place-items-center bg-[#fbf8ed]"><LoaderCircle className="h-8 w-8 animate-spin text-[#165B2A]" /></main>;
  if (news.error || !news.data) return <main className="grid min-h-screen place-items-center bg-[#fbf8ed] px-5 text-center" dir="rtl"><div className="max-w-md"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8f0df] text-[#165B2A]"><Sprout className="h-6 w-6" /></span><h1 className="display-font mt-6 text-3xl font-extrabold text-[#155029]">هذا الخبر غير متاح.</h1><p className="mt-3 leading-8 text-[#58735f]">قد يكون الخبر غير منشور أو لم يعد متاحًا للعرض العام.</p><Link href="/#الأخبار" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#165B2A] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97]"><ArrowRight className="h-4 w-4" />العودة إلى الأخبار</Link></div></main>;

  const paragraphs = (news.data.body || news.data.summary).split(/\n{2,}/).filter(Boolean);
  return <div className="site-shell min-h-screen overflow-x-hidden bg-[#fbf8ed]" dir="rtl">
    <SiteHeader />
    <main><article className="container py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f0df] px-3 py-1.5 text-xs font-bold text-[#165B2A]"><Sprout className="h-3.5 w-3.5" />من أخبار الجمعية</div>
        <h1 className="display-font mt-6 text-3xl font-extrabold leading-[1.55] text-[#155029] sm:text-5xl">{news.data.title}</h1>
        <div className="mt-5 flex items-center gap-2 border-b border-[#e3d9be] pb-7 text-sm font-bold text-[#a56c18]"><CalendarDays className="h-4 w-4" /><time>{formatDate(news.data.publishedAt)}</time></div>
        {news.data.imageUrl && <figure className="mt-8 flex max-h-[34rem] items-center justify-center overflow-hidden rounded-bl-[4rem] rounded-tr-[4rem] border border-[#dfd2ae] bg-[#e8f0df] p-3 sm:p-5"><img src={news.data.imageUrl} alt={news.data.title} className="warm-documentary max-h-[31rem] w-full object-contain" /></figure>}
        <p className="display-font mt-9 border-r-4 border-[#dba83c] pr-5 text-xl font-bold leading-10 text-[#315441]">{news.data.summary}</p>
        <div className="mt-8 space-y-6 text-base leading-9 text-[#496b56] sm:text-lg">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <div className="mt-12 border-t border-[#e3d9be] pt-7"><Link href="/#الأخبار" className="inline-flex items-center gap-2 text-sm font-bold text-[#165B2A] transition-colors hover:text-[#a56c18]"><ArrowRight className="h-4 w-4" />العودة إلى آخر الأخبار</Link></div>
      </div>
    </article></main>
    <SiteFooter />
  </div>;
}

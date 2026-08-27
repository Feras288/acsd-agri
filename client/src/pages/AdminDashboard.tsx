/**
 * توجه «الأثر الأخضر»: لوحة تشغيل عربية لتحرير الأخبار والفعاليات والرد على رسائل المجتمع.
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CalendarDays, Check, ChevronRight, FilePenLine, Inbox, Loader2, Mail, MessageSquareReply, Newspaper, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type ContentForm = {
  type: "news" | "event";
  title: string;
  summary: string;
  status: "draft" | "published";
  imageUrl: string;
  eventStartsAt: string;
  eventLocation: string;
};

const emptyContent: ContentForm = { type: "news", title: "", summary: "", status: "published", imageUrl: "", eventStartsAt: "", eventLocation: "" };
const formatDate = (value: Date) => new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
const formatDateTime = (value: Date) => new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

function DashboardContent() {
  const utils = trpc.useUtils();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ContentForm>(emptyContent);
  const [activeTab, setActiveTab] = useState<"content" | "messages">("content");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const content = trpc.content.adminList.useQuery();
  const messages = trpc.contact.adminList.useQuery();
  const replies = trpc.contact.adminReplies.useQuery();
  const selectedMessage = messages.data?.find(item => item.id === selectedMessageId);
  const selectedReplies = replies.data?.filter(item => item.messageId === selectedMessageId) ?? [];

  const createContent = trpc.content.create.useMutation({ onSuccess: async () => { await utils.content.adminList.invalidate(); await utils.content.publicList.invalidate(); resetContentForm(); toast.success("تم حفظ المحتوى بنجاح"); } });
  const updateContent = trpc.content.update.useMutation({ onSuccess: async () => { await utils.content.adminList.invalidate(); await utils.content.publicList.invalidate(); resetContentForm(); toast.success("تم تحديث المحتوى بنجاح"); } });
  const deleteContent = trpc.content.delete.useMutation({ onSuccess: async () => { await utils.content.adminList.invalidate(); await utils.content.publicList.invalidate(); toast.success("تم حذف المحتوى"); } });
  const markRead = trpc.contact.markRead.useMutation({ onSuccess: () => utils.contact.adminList.invalidate() });
  const sendReply = trpc.contact.reply.useMutation({ onSuccess: async () => { await Promise.all([utils.contact.adminList.invalidate(), utils.contact.adminReplies.invalidate()]); setReply(""); toast.success("تم إرسال الرد وحفظه في سجل الرسالة"); } });

  function resetContentForm() { setEditingId(null); setForm(emptyContent); }
  function openForEdit(item: NonNullable<typeof content.data>[number]) {
    setEditingId(item.id);
    setForm({ type: item.type, title: item.title, summary: item.summary, status: item.status, imageUrl: item.imageUrl ?? "", eventStartsAt: item.eventStartsAt ? new Date(item.eventStartsAt).toISOString().slice(0, 10) : "", eventLocation: item.eventLocation ?? "" });
    setActiveTab("content");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { ...form, eventStartsAt: form.eventStartsAt ? new Date(`${form.eventStartsAt}T12:00:00`).getTime() : null };
    if (editingId) updateContent.mutate({ id: editingId, ...payload }); else createContent.mutate(payload);
  }
  function openMessage(id: number) { setSelectedMessageId(id); setActiveTab("messages"); if (messages.data?.find(item => item.id === id)?.status === "new") markRead.mutate({ id }); }

  const isSavingContent = createContent.isPending || updateContent.isPending;

  return (
    <div className="mx-auto max-w-6xl space-y-7" dir="rtl">
      <div className="flex flex-col justify-between gap-5 rounded-bl-[2.6rem] rounded-tr-[2.6rem] bg-[#155029] px-6 py-7 text-white shadow-[0_14px_30px_rgba(22,91,42,0.15)] sm:flex-row sm:items-center sm:px-8">
        <div><p className="text-xs font-bold tracking-[0.14em] text-[#f2cd78]">مركز إدارة الجمعية</p><h1 className="display-font mt-2 text-2xl font-extrabold">المحتوى والرسائل</h1><p className="mt-2 text-sm text-white/75">أضف ما يستجد، نظّم الفعاليات، وتابع رسائل المستفيدين.</p></div>
        <a href="/" className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#f2cd78] hover:text-white"><ChevronRight className="h-4 w-4" />عرض الموقع</a>
      </div>

      <div className="flex gap-2 border-b border-[#d9c995] pb-3">
        <button type="button" onClick={() => setActiveTab("content")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeTab === "content" ? "bg-[#165B2A] text-white" : "text-[#4f6c59] hover:bg-[#edf2e9]"}`}><Newspaper className="h-4 w-4" />الأخبار والفعاليات</button>
        <button type="button" onClick={() => setActiveTab("messages")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeTab === "messages" ? "bg-[#165B2A] text-white" : "text-[#4f6c59] hover:bg-[#edf2e9]"}`}><Inbox className="h-4 w-4" />الرسائل{messages.data?.filter(item => item.status === "new").length ? <span className="rounded-full bg-[#e6bd67] px-1.5 py-0.5 text-[0.65rem] text-[#155029]">{messages.data.filter(item => item.status === "new").length}</span> : null}</button>
      </div>

      {activeTab === "content" ? <div className="grid gap-7 xl:grid-cols-[0.7fr_1.3fr]">
        <form onSubmit={submitContent} className="h-fit rounded-bl-[2rem] rounded-tr-[2rem] border border-[#ddd2b2] bg-[#fbf8ed] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><p className="section-label">تحرير مباشر</p><h2 className="display-font mt-2 text-xl font-bold text-[#155029]">{editingId ? "تحديث المحتوى" : "إضافة محتوى جديد"}</h2></div>{editingId ? <button type="button" onClick={resetContentForm} className="text-xs font-bold text-[#9b6a1c]">إلغاء التعديل</button> : <Plus className="h-5 w-5 text-[#a56c18]" />}</div>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold text-[#355943]">النوع <select value={form.type} onChange={event => setForm({ ...form, type: event.target.value as ContentForm["type"] })} className="h-10 rounded-lg border border-[#d8d0b9] bg-white px-3 text-sm font-medium outline-none focus:border-[#165B2A]"><option value="news">خبر</option><option value="event">فعالية</option></select></label>
            <label className="grid gap-1.5 text-sm font-bold text-[#355943]">العنوان <input required minLength={5} maxLength={240} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} className="h-10 rounded-lg border border-[#d8d0b9] bg-white px-3 text-sm font-medium outline-none focus:border-[#165B2A]" /></label>
            <label className="grid gap-1.5 text-sm font-bold text-[#355943]">الملخص <textarea required minLength={15} maxLength={3000} rows={5} value={form.summary} onChange={event => setForm({ ...form, summary: event.target.value })} className="resize-none rounded-lg border border-[#d8d0b9] bg-white px-3 py-2 text-sm font-medium leading-6 outline-none focus:border-[#165B2A]" /></label>
            <label className="grid gap-1.5 text-sm font-bold text-[#355943]">رابط صورة <span className="font-normal text-[#6b8371]">اختياري</span><input type="url" value={form.imageUrl} onChange={event => setForm({ ...form, imageUrl: event.target.value })} className="h-10 rounded-lg border border-[#d8d0b9] bg-white px-3 text-left text-sm font-medium outline-none focus:border-[#165B2A]" dir="ltr" /></label>
            {form.type === "event" && <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-bold text-[#355943]">تاريخ الفعالية <input type="date" required value={form.eventStartsAt} onChange={event => setForm({ ...form, eventStartsAt: event.target.value })} className="h-10 rounded-lg border border-[#d8d0b9] bg-white px-3 text-sm font-medium outline-none focus:border-[#165B2A]" /></label><label className="grid gap-1.5 text-sm font-bold text-[#355943]">الموقع <input value={form.eventLocation} onChange={event => setForm({ ...form, eventLocation: event.target.value })} className="h-10 rounded-lg border border-[#d8d0b9] bg-white px-3 text-sm font-medium outline-none focus:border-[#165B2A]" /></label></div>}
            <label className="grid gap-1.5 text-sm font-bold text-[#355943]">الحالة <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as ContentForm["status"] })} className="h-10 rounded-lg border border-[#d8d0b9] bg-white px-3 text-sm font-medium outline-none focus:border-[#165B2A]"><option value="published">منشور</option><option value="draft">مسودة</option></select></label>
          </div>
          <Button type="submit" disabled={isSavingContent} className="mt-6 h-10 w-full rounded-full bg-[#165B2A] font-bold text-white hover:bg-[#10461f]">{isSavingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FilePenLine className="ml-2 h-4 w-4" />{editingId ? "حفظ التحديث" : "نشر المحتوى"}</>}</Button>
        </form>

        <div className="rounded-bl-[2rem] rounded-tr-[2rem] border border-[#e5ddc4] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="section-label">المحتوى المنشور</p><h2 className="display-font mt-2 text-xl font-bold text-[#155029]">سجل الأخبار والفعاليات</h2></div><span className="rounded-full bg-[#e8f0df] px-3 py-1 text-xs font-bold text-[#155029]">{content.data?.length ?? 0} عنصر</span></div>
          {content.isLoading ? <div className="grid place-items-center py-20 text-[#567260]"><Loader2 className="h-6 w-6 animate-spin" /></div> : content.error ? <p className="py-16 text-center text-sm font-bold text-[#9c4835]">هذه الصفحة متاحة لمدير الجمعية فقط.</p> : content.data?.length ? <div className="mt-6 divide-y divide-[#ece5d2]">{content.data.map(item => <article key={item.id} className="flex gap-4 py-5 first:pt-0"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.type === "event" ? "bg-[#e8eff4] text-[#1a7cab]" : "bg-[#e8f0df] text-[#165B2A]"}`}>{item.type === "event" ? <CalendarDays className="h-4 w-4" /> : <Newspaper className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="display-font text-base font-bold text-[#155029]">{item.title}</h3><span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${item.status === "published" ? "bg-[#e8f0df] text-[#155029]" : "bg-[#f8edd0] text-[#916215]"}`}>{item.status === "published" ? "منشور" : "مسودة"}</span></div><p className="mt-1 line-clamp-2 text-sm leading-6 text-[#5c7663]">{item.summary}</p><p className="mt-2 text-xs font-bold text-[#a56c18]">{item.type === "event" && item.eventStartsAt ? formatDate(item.eventStartsAt) : formatDate(item.publishedAt)}</p></div><div className="flex shrink-0 items-start gap-1"><button type="button" onClick={() => openForEdit(item)} className="grid h-8 w-8 place-items-center rounded-full text-[#477058] hover:bg-[#edf2e9]" aria-label="تعديل"><FilePenLine className="h-4 w-4" /></button><button type="button" onClick={() => deleteContent.mutate({ id: item.id })} className="grid h-8 w-8 place-items-center rounded-full text-[#a54b36] hover:bg-[#f9e8e1]" aria-label="حذف"><Trash2 className="h-4 w-4" /></button></div></article>)}</div> : <div className="grid min-h-56 place-items-center text-center"><div><Newspaper className="mx-auto h-7 w-7 text-[#b17816]" /><p className="display-font mt-3 font-bold text-[#155029]">لا توجد عناصر بعد</p><p className="mt-1 text-sm text-[#5c7663]">أضف أول خبر أو فعالية لتظهر تلقائيًا في الموقع.</p></div></div>}
        </div>
      </div> : <div className="grid gap-7 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-bl-[2rem] rounded-tr-[2rem] border border-[#e5ddc4] bg-white p-5 sm:p-6"><div><p className="section-label">صندوق الرسائل</p><h2 className="display-font mt-2 text-xl font-bold text-[#155029]">رسائل المستفيدين</h2></div>{messages.isLoading ? <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#165B2A]" /></div> : messages.error ? <p className="py-16 text-center text-sm font-bold text-[#9c4835]">هذه الصفحة متاحة لمدير الجمعية فقط.</p> : messages.data?.length ? <div className="mt-5 divide-y divide-[#ece5d2]">{messages.data.map(item => <button key={item.id} type="button" onClick={() => openMessage(item.id)} className={`w-full px-1 py-4 text-right transition-colors hover:bg-[#fbf8ed] ${selectedMessageId === item.id ? "bg-[#f2f6ed]" : ""}`}><div className="flex items-center justify-between gap-3"><span className="display-font text-sm font-bold text-[#155029]">{item.senderName}</span>{item.status === "new" ? <span className="h-2 w-2 rounded-full bg-[#dba83c]" aria-label="رسالة جديدة" /> : item.status === "replied" ? <span className="inline-flex items-center gap-1 rounded-full bg-[#e4f0d9] px-2 py-1 text-[0.62rem] font-bold text-[#155029]"><MessageSquareReply className="h-3 w-3" />تم الرد</span> : <Check className="h-4 w-4 text-[#6d9278]" />}</div><p className="mt-1 truncate text-sm font-medium text-[#486a55]">{item.subject}</p><p className="mt-1 text-xs text-[#7a9181]">{formatDate(item.createdAt)}</p></button>)}</div> : <div className="grid min-h-56 place-items-center text-center"><div><Inbox className="mx-auto h-7 w-7 text-[#b17816]" /><p className="display-font mt-3 font-bold text-[#155029]">لا توجد رسائل بعد</p><p className="mt-1 text-sm text-[#5c7663]">ستظهر هنا الرسائل التي تصل عبر نموذج الموقع.</p></div></div>}</div>
        <div className="rounded-bl-[2rem] rounded-tr-[2rem] border border-[#ddd2b2] bg-[#fbf8ed] p-5 sm:p-7">{selectedMessage ? <><div className="flex items-start justify-between gap-4"><div><p className="section-label">رسالة واردة</p><div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="display-font text-xl font-bold text-[#155029]">{selectedMessage.subject}</h2>{selectedMessage.status === "replied" && <span className="inline-flex items-center gap-1 rounded-full bg-[#e4f0d9] px-2.5 py-1 text-xs font-bold text-[#155029]"><Check className="h-3.5 w-3.5" />تم الرد</span>}</div><p className="mt-2 text-sm text-[#597362]">من {selectedMessage.senderName} · <span dir="ltr">{selectedMessage.senderEmail}</span></p>{selectedMessage.phone && <p className="mt-1 text-xs text-[#6b8371]" dir="ltr">{selectedMessage.phone}</p>}</div><Mail className="h-5 w-5 text-[#a56c18]" /></div><div className="mt-7 rounded-xl border-r-2 border-[#dba83c] bg-white/70 p-5 text-sm leading-8 text-[#315441]">{selectedMessage.message}</div>{selectedReplies.length > 0 && <section className="mt-6 border-r-2 border-[#165B2A] pr-4"><div className="flex items-center gap-2 text-[#155029]"><MessageSquareReply className="h-4 w-4" /><h3 className="display-font text-base font-bold">سجل الردود</h3></div><div className="mt-3 space-y-3">{selectedReplies.map(item => <article key={item.id} className="rounded-xl bg-[#e9f1e4] p-4"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-[#155029]">رد الجمعية</span><time className="text-[0.68rem] font-medium text-[#5b7663]">{formatDateTime(item.sentAt)}</time></div><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#315441]">{item.body}</p></article>)}</div></section>}<form onSubmit={event => { event.preventDefault(); sendReply.mutate({ id: selectedMessage.id, body: reply }); }} className="mt-7"><label className="grid gap-2 text-sm font-bold text-[#355943]">{selectedReplies.length > 0 ? "إضافة رد متابعة عبر البريد" : "الرد عبر البريد الإلكتروني"}<textarea required minLength={5} rows={6} value={reply} onChange={event => setReply(event.target.value)} className="resize-none rounded-xl border border-[#d8d0b9] bg-white px-3 py-3 text-sm font-medium leading-7 outline-none focus:border-[#165B2A]" placeholder="اكتب رد الجمعية هنا..." /></label>{sendReply.error && <p role="alert" className="mt-3 text-sm font-bold text-[#a54b36]">تعذر إرسال الرد. يرجى مراجعة إعدادات البريد والمحاولة مرة أخرى.</p>}<Button type="submit" disabled={sendReply.isPending} className="mt-4 h-10 rounded-full bg-[#165B2A] px-5 font-bold text-white hover:bg-[#10461f]">{sendReply.isPending ? "جارٍ الإرسال..." : <><MessageSquareReply className="ml-2 h-4 w-4" />إرسال الرد</>}</Button></form></> : <div className="grid min-h-72 place-items-center text-center"><div><Mail className="mx-auto h-8 w-8 text-[#b17816]" /><p className="display-font mt-4 font-bold text-[#155029]">اختر رسالة لعرض تفاصيلها</p><p className="mt-2 text-sm leading-7 text-[#5c7663]">يمكنك قراءة رسالة المستفيد والرد عليها مباشرةً من هذه اللوحة.</p></div></div>}</div>
      </div>}
    </div>
  );
}

export default function AdminDashboard() { return <DashboardLayout><DashboardContent /></DashboardLayout>; }

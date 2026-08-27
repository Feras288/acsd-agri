/**
 * توجه «الأثر الأخضر»: نموذج تواصل واضح وموثوق يُحفظ في لوحة الجمعية ويرسل تنبيهًا بالبريد.
 */
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, FileText, Mail, MessageCircle, Paperclip, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";

type ContactValues = {
  senderName: string;
  senderEmail: string;
  phone: string;
  subject: string;
  message: string;
};

type PreparedAttachment = {
  name: string;
  type: "application/pdf" | "image/jpeg" | "image/png" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  size: number;
  base64: string;
};

const initialValues: ContactValues = { senderName: "", senderEmail: "", phone: "", subject: "", message: "" };
const acceptedTypes = new Set<PreparedAttachment["type"]>([
  "application/pdf", "image/jpeg", "image/png", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const maxAttachmentSize = 5 * 1024 * 1024;
const formatSize = (size: number) => `${Math.ceil(size / 1024)} كيلوبايت`;

const readAsBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const value = typeof reader.result === "string" ? reader.result.split(",")[1] : undefined;
    if (value) resolve(value); else reject(new Error("Unable to read file"));
  };
  reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
  reader.readAsDataURL(file);
});

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [attachments, setAttachments] = useState<PreparedAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [isPreparingFiles, setIsPreparingFiles] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const submit = trpc.contact.submit.useMutation({
    onSuccess: result => {
      setValues(initialValues);
      setAttachments([]);
      setSuccessMessage(result.delivered ? `تم استلام رسالتكم وإرسالها إلى بريد الجمعية بنجاح${result.attachmentCount ? `، مع ${result.attachmentCount} مرفق.` : "."}` : "تم استلام رسالتكم وحفظها لدى فريق الجمعية، وسيتم التواصل معكم قريبًا.");
    },
  });

  const onChooseFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setAttachmentError("");
    if (!chosenFiles.length) return;
    if (attachments.length + chosenFiles.length > 3) {
      setAttachmentError("يمكن إرفاق ثلاثة ملفات كحد أقصى مع الرسالة.");
      return;
    }
    const invalidFile = chosenFiles.find(file => !acceptedTypes.has(file.type as PreparedAttachment["type"]) || file.size > maxAttachmentSize);
    if (invalidFile) {
      setAttachmentError("يرجى اختيار PDF أو صورة JPG/PNG أو مستند Word/Excel بحجم لا يتجاوز 5 ميغابايت للملف.");
      return;
    }
    setIsPreparingFiles(true);
    try {
      const prepared = await Promise.all(chosenFiles.map(async file => ({
        name: file.name,
        type: file.type as PreparedAttachment["type"],
        size: file.size,
        base64: await readAsBase64(file),
      })));
      setAttachments(current => [...current, ...prepared]);
    } catch {
      setAttachmentError("تعذر تجهيز المرفق. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsPreparingFiles(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    submit.mutate({ ...values, attachments });
  };

  return (
    <section id="تواصل" className="relative bg-[#155029] py-20 text-white lg:py-24">
      <div className="container grid gap-9 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
        <div className="pt-3">
          <p className="section-label !text-[#e6bd67] before:!bg-[#e6bd67]">لنبنِ الأثر معًا</p>
          <h2 className="display-font mt-4 max-w-xl text-3xl font-extrabold leading-[1.55] sm:text-4xl">هل لديك مبادرة أو فكرة تخدم التنمية الزراعية؟</h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#e7f0df]/85">اكتب إلينا وسيتولى فريق الجمعية مراجعة رسالتك والرد عليها عبر البريد الإلكتروني.</p>
          <a href="mailto:info@acsd.sa" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#f2cd78] transition-colors hover:text-white">
            <Mail className="h-4 w-4" />
            info@acsd.sa
          </a>
        </div>

        <form onSubmit={onSubmit} className="rounded-bl-[3rem] rounded-tr-[3rem] border border-[#e6bd67]/40 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e6bd67] text-[#155029]"><MessageCircle className="h-5 w-5" /></span>
            <div><h3 className="display-font text-xl font-bold">أرسل رسالتك</h3><p className="mt-1 text-xs text-white/70">الحقول ذات العلامة مطلوبة.</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">الاسم <input required minLength={2} value={values.senderName} onChange={event => setValues({ ...values, senderName: event.target.value })} className="h-11 rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-medium text-white outline-none placeholder:text-white/40 focus:border-[#f2cd78]" placeholder="الاسم الكامل" /></label>
            <label className="grid gap-2 text-sm font-bold">البريد الإلكتروني <input required type="email" value={values.senderEmail} onChange={event => setValues({ ...values, senderEmail: event.target.value })} className="h-11 rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-medium text-white outline-none placeholder:text-white/40 focus:border-[#f2cd78]" placeholder="name@example.com" dir="ltr" /></label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">رقم الجوال <span className="font-normal text-white/60">اختياري</span><input value={values.phone} onChange={event => setValues({ ...values, phone: event.target.value })} className="h-11 rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-medium text-white outline-none placeholder:text-white/40 focus:border-[#f2cd78]" placeholder="05xxxxxxxx" inputMode="tel" dir="ltr" /></label>
            <label className="grid gap-2 text-sm font-bold">موضوع الرسالة <input required minLength={3} value={values.subject} onChange={event => setValues({ ...values, subject: event.target.value })} className="h-11 rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-medium text-white outline-none placeholder:text-white/40 focus:border-[#f2cd78]" placeholder="كيف يمكننا التعاون؟" /></label>
          </div>
          <label className="mt-4 grid gap-2 text-sm font-bold">الرسالة <textarea required minLength={10} rows={5} value={values.message} onChange={event => setValues({ ...values, message: event.target.value })} className="resize-none rounded-xl border border-white/25 bg-white/10 px-3 py-3 text-sm font-medium leading-7 text-white outline-none placeholder:text-white/40 focus:border-[#f2cd78]" placeholder="اكتب رسالتك هنا..." /></label>
          <div className="mt-4 rounded-xl border border-dashed border-white/30 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-sm font-bold"><Paperclip className="h-4 w-4 text-[#f2cd78]" />إرفاق ملفات <span className="font-normal text-white/60">اختياري</span></p><p className="mt-1 text-xs leading-5 text-white/60">PDF وJPG وPNG وWord وExcel؛ حتى 3 ملفات، وبحد أقصى 5 ميغابايت للملف.</p></div><label className="cursor-pointer rounded-full border border-[#e6bd67]/60 px-3 py-2 text-xs font-bold text-[#f2cd78] transition-colors hover:bg-[#e6bd67] hover:text-[#155029]"><input className="sr-only" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" onChange={onChooseFiles} disabled={isPreparingFiles || attachments.length >= 3} />{isPreparingFiles ? "جارٍ تجهيز الملف..." : "اختيار ملفات"}</label></div>
            {attachments.length > 0 && <ul className="mt-3 space-y-2" aria-label="المرفقات المختارة">{attachments.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-black/10 px-3 py-2 text-xs"><span className="flex min-w-0 items-center gap-2"><FileText className="h-4 w-4 shrink-0 text-[#f2cd78]" /><span className="truncate">{file.name}</span><span className="shrink-0 text-white/55">{formatSize(file.size)}</span></span><button type="button" onClick={() => setAttachments(current => current.filter((_, itemIndex) => itemIndex !== index))} className="grid h-6 w-6 place-items-center rounded-full text-white/70 hover:bg-white/15 hover:text-white" aria-label={`إزالة ${file.name}`}><X className="h-3.5 w-3.5" /></button></li>)}</ul>}
            {attachmentError && <p role="alert" className="mt-3 text-xs font-bold leading-6 text-[#ffd8c9]">{attachmentError}</p>}
          </div>
          {successMessage && <p role="status" className="mt-4 flex items-start gap-2 rounded-xl bg-[#e4f0d9] px-4 py-3 text-sm font-bold leading-6 text-[#155029]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{successMessage}</p>}
          {submit.error && <p role="alert" className="mt-4 rounded-xl bg-[#c75d3f]/25 px-4 py-3 text-sm font-bold leading-6 text-white">تعذر إرسال الرسالة الآن. يرجى المحاولة مرة أخرى أو مراسلتنا عبر البريد الإلكتروني.</p>}
          <Button type="submit" disabled={submit.isPending || isPreparingFiles} className="mt-6 h-11 rounded-full bg-[#e6bd67] px-6 font-bold text-[#155029] transition-transform duration-200 hover:bg-[#f2cd78] active:scale-[0.97] disabled:opacity-70">{submit.isPending ? "جارٍ إرسال الرسالة..." : <>إرسال الرسالة <Send className="mr-2 h-4 w-4" /></>}</Button>
        </form>
      </div>
    </section>
  );
}

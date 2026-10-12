import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Lock, Sprout } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      window.location.href = "/admin";
    },
    onError: error => {
      toast.error(error.message === "INVALID_CREDENTIALS"
        ? "بيانات الدخول غير صحيحة."
        : "تعذر إكمال تسجيل الدخول.");
    },
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username || !password) {
      toast.error("يرجى إدخال اسم المستخدم وكلمة المرور.");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-[#fbf8ed] text-[#173d26]" dir="rtl">
      <div className="container flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md rounded-bl-[3rem] rounded-tr-[3rem] border border-[#d9c995] bg-white p-8 shadow-[0_18px_45px_rgba(21,62,35,0.10)] sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#165B2A] text-[#e6bd67]">
              <Sprout className="h-5 w-5" />
            </span>
            <div>
              <p className="section-label">لوحة الإدارة</p>
              <h1 className="display-font mt-2 text-xl font-bold text-[#155029]">تسجيل دخول المشرف</h1>
            </div>
          </div>

          <p className="mb-6 text-sm leading-7 text-[#58735f]">
            هذه البوّابة مخصّصة لمشرف الجمعية المعتمَد فقط. أدخل بيانات الدخول التي ضبطتها في متغيّرات البيئة لمتابعة إدارة المحتوى.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#155029]">اسم المستخدم</span>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="block w-full rounded-xl border border-[#d9c995] bg-white px-4 py-3 text-sm text-[#173d26] outline-none transition-colors focus:border-[#165B2A] focus:ring-2 focus:ring-[#165B2A]/15"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#155029]">كلمة المرور</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-[#d9c995] bg-white px-4 py-3 text-sm text-[#173d26] outline-none transition-colors focus:border-[#165B2A] focus:ring-2 focus:ring-[#165B2A]/15"
                required
              />
            </label>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-12 w-full rounded-full bg-[#165B2A] font-bold text-white shadow-[0_12px_25px_rgba(22,91,42,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#10461f] active:scale-[0.97]"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جارٍ التحقّق...
                </>
              ) : (
                <>
                  <Lock className="ml-2 h-4 w-4" />
                  دخول
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

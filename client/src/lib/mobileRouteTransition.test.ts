import { describe, expect, it } from "vitest";
import { shouldInterceptMobileNavClick, shouldReduceMobileMotion } from "./mobileRouteTransition";

describe("mobile route transition helpers", () => {
  it("يعترض النقر الأساسي فقط ليتمكن الزائر من فتح الرابط في تبويب جديد عند الحاجة", () => {
    expect(shouldInterceptMobileNavClick({ button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false })).toBe(true);
    expect(shouldInterceptMobileNavClick({ button: 0, metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(false);
    expect(shouldInterceptMobileNavClick({ button: 1, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false })).toBe(false);
  });

  it("يحافظ على التنقل الفوري عند تفعيل تفضيل تقليل الحركة", () => {
    expect(shouldReduceMobileMotion(true)).toBe(true);
    expect(shouldReduceMobileMotion(false)).toBe(false);
  });
});

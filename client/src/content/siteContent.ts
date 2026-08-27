/**
 * محتوى موقع الجمعية التعاونية الزراعية للتطوير والاستدامة.
 * نبرة المحتوى: عملية، دافئة، قائمة على الشراكة والأثر المستدام.
 */
import {
  BadgeCheck,
  Beef,
  BookOpenCheck,
  Droplets,
  FileCheck2,
  HandCoins,
  Handshake,
  Leaf,
  Scale,
  ShieldCheck,
  Sprout,
  Store,
  Tractor,
  Trees,
  UsersRound,
  Warehouse,
} from "lucide-react";

export const objectives = [
  {
    number: "01",
    title: "مشاريع زراعية منتجة",
    description: "إطلاق مشاريع تعزّز الإنتاج الزراعي وتبني عائدًا اقتصاديًا واجتماعيًا مستدامًا للأعضاء والمجتمع.",
    Icon: Tractor,
  },
  {
    number: "02",
    title: "بيوت محمية أكثر كفاءة",
    description: "تطوير إنتاج الخضار والفواكه في بيئات محمية، مع تشجيع الإدارة الرشيدة للمياه والمدخلات.",
    Icon: Warehouse,
  },
  {
    number: "03",
    title: "مشاريع حيوانية متخصصة",
    description: "فتح فرص نوعية في مجالات المواشي والأغنام والدواجن بما يدعم تنوع النشاط الزراعي المحلي.",
    Icon: Beef,
  },
  {
    number: "04",
    title: "تدريب يلامس الميدان",
    description: "تنظيم دورات وورش عمل للمزارعين والأعضاء حول الممارسات الزراعية الحديثة والمعرفة التطبيقية.",
    Icon: BookOpenCheck,
  },
  {
    number: "05",
    title: "شراكات واستثمار مؤثر",
    description: "بناء شراكات مع القطاعين العام والخاص والجهات التمويلية لتبادل الخبرات وتنمية الفرص الاستثمارية.",
    Icon: Handshake,
  },
  {
    number: "06",
    title: "مدخلات وأسواق أقرب",
    description: "المساهمة في تأمين المعدات والبذور والأسمدة، وتحسين الوصول إلى منافذ منتجات عادلة ومحفّزة.",
    Icon: Store,
  },
];

export const activities = [
  {
    title: "الإرشاد والتدريب الزراعي",
    description: "ورش ميدانية ومسارات تعلم عملية تعزز كفاءة القرار الزراعي، وتقرّب المعرفة الحديثة من احتياجات المزارعين.",
    Icon: BookOpenCheck,
    image: "/manus-storage/acsd-cooperative-learning_38133a05.jpg",
  },
  {
    title: "إنتاج محمي ومدخلات واعية",
    description: "دعم البيوت المحمية والخدمات التي ترتقي بجودة الخضار والفواكه وتساعد على الاستخدام الأجدى للموارد.",
    Icon: Sprout,
    image: "/manus-storage/acsd-hero-terraced-fields_8e549636.jpg",
  },
  {
    title: "المشاريع الحيوانية المتخصصة",
    description: "استكشاف فرص نوعية في الثروة الحيوانية تسهم في تنويع مصادر القيمة وتعزيز الاقتصاد الزراعي.",
    Icon: Beef,
    image: "/manus-storage/acsd-water-stewardship_ed239526.jpg",
  },
  {
    title: "الماء والغطاء النباتي",
    description: "مبادرات عملية لكفاءة المياه، والتشجير، وحماية التربة؛ ليظل الإنتاج متوازنًا مع البيئة.",
    Icon: Trees,
    image: "/manus-storage/acsd-hero-terraced-fields_8e549636.jpg",
  },
];

export const governanceAreas = [
  {
    title: "لوائح واضحة وممارسة منضبطة",
    description: "تقوم بيئة العمل على اللوائح الأساسية والإجراءات التنظيمية، بما يعزّز وضوح الأدوار والقرارات.",
    Icon: FileCheck2,
  },
  {
    title: "نزاهة ومسؤولية مشتركة",
    description: "نهتم بإدارة تعارض المصالح والإبلاغ عن الممارسات المخالفة وحماية جميع أصحاب المصلحة.",
    Icon: ShieldCheck,
  },
  {
    title: "موارد واستثمار بحوكمة",
    description: "نوجّه الاستثمار والمشتريات والبرامج ضمن ممارسات مالية وإدارية تعزز الاستدامة والثقة.",
    Icon: Scale,
  },
];

export const focusAreas = [
  { label: "الإنتاج والشراكة", Icon: Tractor },
  { label: "الاستدامة البيئية", Icon: Leaf },
  { label: "الحوكمة والمعرفة", Icon: BadgeCheck },
];

export const navigationItems = [
  { label: "الرئيسية", href: "#الرئيسية" },
  { label: "عن الجمعية", href: "#عن-الجمعية" },
  { label: "مسارات التنمية", href: "#أهدافنا" },
  { label: "برامجنا", href: "#أنشطتنا" },
  { label: "حوكمتنا", href: "#الحوكمة" },
  { label: "أخبارنا", href: "#الأخبار" },
  { label: "تواصل معنا", href: "#تواصل" },
];

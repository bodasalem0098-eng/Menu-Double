/* ============================================
   HireFlow — Constants & Job Data
   ============================================ */

export const COMPANY = {
  name: "المستشار للمحاماة والاستشارات القانونية",
  nameEn: "Al-Mustashar Law Firm",
  logo: "⚖️",
  slogan: "Hire smarter. Move faster.",
  adminEmail: "moabdo038@gmail.com",
  adminName: "عبدالرحمن",
};

export const JOB = {
  id: "accountant-001",
  title: "محاسب",
  titleEn: "Accountant",
  department: "المالية",
  departmentEn: "Finance",
  company: COMPANY.name,
  location: "المملكة العربية السعودية",
  type: "دوام كامل",
  typeEn: "Full-time",
  level: "متوسط",
  levelEn: "Mid-level",
  salary: "يُحدد بعد المقابلة",
  description:
    "نبحث عن محاسب محترف للانضمام إلى فريقنا في مكتب المستشار للمحاماة والاستشارات القانونية. سيكون المحاسب مسؤولاً عن إدارة الحسابات المالية للمكتب وإعداد التقارير المالية الدورية وضمان الامتثال للأنظمة المحاسبية المعمول بها.",
  responsibilities: [
    "إدارة الحسابات المالية اليومية للمكتب",
    "إعداد القوائم المالية والتقارير الشهرية والسنوية",
    "متابعة الفواتير والمدفوعات والمستحقات",
    "إعداد إقرارات ضريبة القيمة المضافة (VAT)",
    "التنسيق مع المراجع الخارجي",
    "إدارة الرواتب والمستحقات",
    "حفظ وتنظيم السجلات المالية",
  ],
  requirements: [
    "بكالوريوس في المحاسبة أو المالية",
    "خبرة لا تقل عن سنتين في مجال المحاسبة",
    "إجادة برامج المحاسبة (مثل: QuickBooks, SAP)",
    "إلمام بمعايير المحاسبة الدولية (IFRS)",
    "إجادة Microsoft Excel",
    "مهارات تواصل ممتازة",
  ],
  skills: ["المحاسبة", "IFRS", "ضريبة القيمة المضافة", "Excel", "ERP", "التقارير المالية"],
  benefits: [
    "تأمين طبي",
    "بيئة عمل احترافية",
    "فرص تطوير مهني",
    "إجازات سنوية مدفوعة",
  ],
};

export const APPLICATION_STATUSES = [
  { key: "SUBMITTED", label: "تم الإرسال", labelEn: "Submitted" },
  { key: "RECEIVED", label: "تم الاستلام", labelEn: "Received" },
  { key: "CV_VIEWED", label: "تم مراجعة السيرة الذاتية", labelEn: "CV Viewed" },
  { key: "SHORTLISTED", label: "في القائمة المختصرة", labelEn: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "تم جدولة المقابلة", labelEn: "Interview Scheduled" },
  { key: "INTERVIEW_COMPLETED", label: "تمت المقابلة", labelEn: "Interview Completed" },
  { key: "UNDER_REVIEW", label: "تحت المراجعة", labelEn: "Under Review" },
  { key: "ACCEPTED", label: "مقبول", labelEn: "Accepted" },
  { key: "REJECTED", label: "مرفوض", labelEn: "Rejected" },
] as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[number]["key"];

export const NATIONALITIES = [
  "سعودي/ة", "مصري/ة", "أردني/ة", "سوري/ة", "يمني/ة", "سوداني/ة",
  "فلسطيني/ة", "لبناني/ة", "عراقي/ة", "تونسي/ة", "مغربي/ة", "جزائري/ة",
  "باكستاني/ة", "هندي/ة", "فلبيني/ة", "بنغلاديشي/ة", "أخرى",
];

export const QUALIFICATIONS = [
  "ثانوية عامة",
  "دبلوم",
  "بكالوريوس",
  "ماجستير",
  "دكتوراه",
  "أخرى",
];

export const MARITAL_STATUSES = ["أعزب/عزباء", "متزوج/ة", "مطلق/ة", "أرمل/ة"];

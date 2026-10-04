// إعدادات كويز ديناميكا المركبات - AutoVroom Racing Cars Community
export const config = {
  // بيانات الفريق والاختبار
  community: "AutoVroom Racing Cars Community",
  university: "Innovation University",
  manager: "Eng. Anas Essam | Operation Manager",
  subteam: "Vehicle Dynamics Subteam",
  quizTitle: "Vehicle Dynamics Applicant Quiz",
  totalQuestions: 12,
  totalMarks: 12,
  defaultTimeMinutes: 25, // مدة الاختبار المقترحة

  // إعدادات إرسال الإجابات عبر البريد الإلكتروني:
  emailService: {
    // 1) الطريقة الفورية السهلة (بدون سيرفر): Web3Forms
    web3formsAccessKey: "0c494a24-4a78-40b5-b227-5281a6331bb7", // مفتاحك الخاص المفعل

    // البريد الإلكتروني الذي ستصلك عليه الإجابات
    recipientEmail: "mn8665967@gmail.com", 

    // 2) بديل آخر: Formspree (اختياري)
    formspreeEndpoint: "", // مثال: https://formspree.io/f/mqkvywzy

    // إرسال نسخة من النتيجة لطالب الاختبار إذا رغب
    sendCopyToStudent: true
  },

  // ضوابط الاختبار
  settings: {
    showScoreImmediately: true, // إظهار الدرجة والنسبة للطالب فور التسليم
    allowReviewAfterSubmit: true, // السماح للطالب بمراجعة الحل النموذجي مع الشرح الهندسي
    enforceTimer: true, // تفعيل عداد الوقت التنازلي
    shuffleQuestions: false, // ترتيب الأسئلة كما في الورقة الرسمية (1 إلى 12)
    bilingualMode: true // إتاحة قراءة الأسئلة بالإنجليزية مع ترجمة وشرح عربي
  }
};

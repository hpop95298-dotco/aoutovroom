// بنك أسئلة اختبار ديناميكا المركبات
// AutoVroom Racing Cars Community — Innovation University
// Vehicle Dynamics Applicant Quiz — Eng. Anas Essam | Operation Manager

export const quizInfo = {
  community: "AutoVroom Racing Cars Community",
  university: "Innovation University",
  manager: "Eng. Anas Essam | Operation Manager",
  subteam: "Vehicle Dynamics Subteam",
  title: "Vehicle Dynamics Applicant Quiz",
  instructions: "Search is allowed. Work individually and use your own words. You may answer in Arabic or English.",
  totalQuestions: 12,
  totalMarks: 12
};

export const quizQuestions = [
  {
    id: 1,
    number: "01",
    category: "Subteam Scope",
    categoryAr: "نطاق عمل الفريق",
    question: "Which activity belongs to the Vehicle Dynamics subteam?",
    questionAr: "أي من الأنشطة التالية تتبع تخصص Vehicle Dynamics؟",
    options: [
      { letter: "A", text: "Choosing the car paint color", textAr: "اختيار لون طلاء السيارة" },
      { letter: "B", text: "Studying handling, suspension, steering and braking", textAr: "دراسة التحكم، التعليق، التوجيه والفرامل" },
      { letter: "C", text: "Managing ticket sales", textAr: "إدارة مبيعات التذاكر" }
    ],
    correctAnswer: 1, // B
    explanation: "The subteam studies car motion and the systems that influence it (handling, suspension, steering, and braking).",
    explanationAr: "فريق ديناميكا المركبات يدرس حركة السيارة وجميع الأنظمة المؤثرة عليها مثل التوجيه والتعليق والمكابح وسلوك المناورة."
  },
  {
    id: 2,
    number: "02",
    category: "Suspension",
    categoryAr: "نظام التعليق",
    question: "Which suspension component stores elastic energy when compressed?",
    questionAr: "أي مكون في نظام التعليق يقوم بتخزين الطاقة المرنة عند انضغاطه؟",
    options: [
      { letter: "A", text: "Damper", textAr: "المساعد (Damper)" },
      { letter: "B", text: "Steering rack", textAr: "علبة التوجيه (Steering rack)" },
      { letter: "C", text: "Spring", textAr: "الياي / السوستة (Spring)" }
    ],
    correctAnswer: 2, // C
    explanation: "A spring stores elastic energy as it deflects under load.",
    explanationAr: "الياي (Spring) يخزن الطاقة المرنة عند انضغاطه أو استطالته بفعل الحمل."
  },
  {
    id: 3,
    number: "03",
    category: "Suspension",
    categoryAr: "نظام التعليق",
    question: "What is the main role of a suspension damper?",
    questionAr: "ما هو الدور الأساسي للمساعد (Damper) في نظام التعليق؟",
    options: [
      { letter: "A", text: "Reduce oscillations by dissipating energy", textAr: "تقليل وتخميد الاهتزازات عن طريق تشتيت الطاقة" },
      { letter: "B", text: "Turn the front wheels", textAr: "توجيه العجلات الأمامية" },
      { letter: "C", text: "Store energy like a spring", textAr: "تخزين الطاقة مثل الياي" }
    ],
    correctAnswer: 0, // A
    explanation: "A damper dissipates kinetic energy into thermal energy to control and dampen spring oscillations.",
    explanationAr: "يقوم المساعد (Damper) بامتصاص وتشتيت الطاقة الحركية لتحويلها لحرارة وتخميد تذبذب السوستة."
  },
  {
    id: 4,
    number: "04",
    category: "Weight Transfer",
    categoryAr: "انتقال الأحمال والأوزان",
    question: "During straight-line braking on level ground, which axle normally gains vertical load?",
    questionAr: "أثناء الفرملة في خط مستقيم على أرض مستوية، أي محور يكتسب حملاً رأسياً إضافياً؟",
    options: [
      { letter: "A", text: "Front axle", textAr: "المحور الأمامي (Front axle)" },
      { letter: "B", text: "Rear axle", textAr: "المحور الخلفي (Rear axle)" },
      { letter: "C", text: "Neither axle", textAr: "لا أحد منهما" }
    ],
    correctAnswer: 0, // A
    explanation: "Braking generates deceleration that transfers vertical load toward the front axle due to the center of gravity height.",
    explanationAr: "الفرملة تؤدي إلى نقل الوزن الديناميكي للأمام، مما يزيد الحمل الرأسي على المحور الأمامي."
  },
  {
    id: 5,
    number: "05",
    category: "Center of Gravity",
    categoryAr: "مركز الثقل والاتزان",
    question: "With the same acceleration, wheelbase and track width, a lower center of gravity generally causes:",
    questionAr: "مع ثبات التسارع وقاعدة العجلات وعرض المسار، انخفاض مركز ثقل السيارة يؤدي عموماً إلى:",
    options: [
      { letter: "A", text: "More load transfer", textAr: "انتقال حمل أكبر (More load transfer)" },
      { letter: "B", text: "Less load transfer", textAr: "انتقال حمل أقل (Less load transfer)" },
      { letter: "C", text: "Exactly the same load transfer", textAr: "نفس معدل انتقال الحمل تماماً" }
    ],
    correctAnswer: 1, // B
    explanation: "A lower center of gravity (CG) reduces the moment arm, resulting in less dynamic load transfer.",
    explanationAr: "انخفاض مركز الثقل (CG) يقلل ذراع العزم، مما يقلل من انتقال الأحمال الديناميكية في المنعطفات والفرملة."
  },
  {
    id: 6,
    number: "06",
    category: "Braking Physics",
    categoryAr: "فيزياء منظومة الفرامل",
    question: "During friction braking, most of the car's lost kinetic energy becomes:",
    questionAr: "أثناء الفرملة بالاحتكاك، معظم الطاقة الحركية المفقودة من السيارة تتحول إلى:",
    options: [
      { letter: "A", text: "Electricity", textAr: "كهرباء" },
      { letter: "B", text: "Sound", textAr: "صوت" },
      { letter: "C", text: "Heat", textAr: "حرارة (Heat)" }
    ],
    correctAnswer: 2, // C
    explanation: "Friction between brake pads and discs/drums converts kinetic energy directly into thermal energy (heat).",
    explanationAr: "الاحتكاك بين تيل الفرامل والقرص يحول طاقة حركة السيارة إلى طاقة حرارية هائلة."
  },
  {
    id: 7,
    number: "07",
    category: "Braking Hardware",
    categoryAr: "مكونات منظومة الفرامل",
    question: "In a disc brake, which component presses the pads against the disc?",
    questionAr: "في الفرامل القرصية، أي جزء يضغط بطانات الاحتكاك (التيل) على قرص الفرامل؟",
    options: [
      { letter: "A", text: "Caliper", textAr: "الكاليبر / الفرجار (Caliper)" },
      { letter: "B", text: "Suspension spring", textAr: "سوستة التعليق" },
      { letter: "C", text: "Tie rod", textAr: "ذراع التوجيه (Tie rod)" }
    ],
    correctAnswer: 0, // A
    explanation: "The caliper contains pistons that push the brake pads firmly against both sides of the rotating brake disc.",
    explanationAr: "الكاليبر (Caliper) يحتوي على مكابس هيدروليكية تضغط التيل على ديسك الفرامل لإيقاف العجلة."
  },
  {
    id: 8,
    number: "08",
    category: "Wheel Alignment",
    categoryAr: "ضبط زوايا العجلات (Camber)",
    question: "Camber is the wheel's tilt relative to vertical when viewed from:",
    questionAr: "زاوية الكامبر (Camber) هي ميل العجلة بالنسبة للمستوى الرأسي عند النظر إليها من:",
    options: [
      { letter: "A", text: "Above the car", textAr: "أعلى السيارة" },
      { letter: "B", text: "The front of the car", textAr: "مقدمة السيارة (The front of the car)" },
      { letter: "C", text: "The side of the car", textAr: "جانب السيارة" }
    ],
    correctAnswer: 1, // B
    explanation: "Camber is the angle of inclination of the wheel relative to vertical when viewed from the front or rear of the vehicle.",
    explanationAr: "الكامبر هو زاوية ميل الإطار إلى الداخل أو الخارج نسبة إلى الخط الرأسي عند النظر من الأمام أو الخلف."
  },
  {
    id: 9,
    number: "09",
    category: "Wheel Alignment",
    categoryAr: "ضبط زوايا العجلات (Toe)",
    question: "Toe describes wheel direction most clearly when viewed from:",
    questionAr: "زاوية التو (Toe) تصف اتجاه العجلات بوضوح تام عند النظر إليها من:",
    options: [
      { letter: "A", text: "The front", textAr: "الأمام" },
      { letter: "B", text: "The side", textAr: "الجانب" },
      { letter: "C", text: "Above", textAr: "الأعلى (Above)" }
    ],
    correctAnswer: 2, // C
    explanation: "Toe is the symmetric angle that each wheel makes with the longitudinal axis of the vehicle when viewed from directly above.",
    explanationAr: "زاوية الـ Toe (Toe-in / Toe-out) هي تقارب أو تباعد العجلات عن خط منتصف السيارة عند النظر من الأعلى (Bird's eye view)."
  },
  {
    id: 10,
    number: "10",
    category: "Vehicle Handling",
    categoryAr: "سلوك المناورة (Understeer)",
    question: "Near the grip limit, the front tires lose grip first and the car runs wider in a turn. This is:",
    questionAr: "عند الاقتراب من حد التماسك، إذا فقدت الإطارات الأمامية تماسكها أولاً واتسعت دائرة المنعطف، تسمى هذه الحالة:",
    options: [
      { letter: "A", text: "Oversteer", textAr: "أوفرستير (Oversteer)" },
      { letter: "B", text: "Understeer", textAr: "أندرستير (Understeer)" },
      { letter: "C", text: "Vertical bounce", textAr: "ارتداد رأسي" }
    ],
    correctAnswer: 1, // B
    explanation: "Understeer occurs when the front tires slip before the rear, causing the car to steer less and push wide of the intended line.",
    explanationAr: "الأندرستير (Understeer) يحدث عندما تفقد الإطارات الأمامية التماسك أولاً مما يجعل السيارة تزحف للخارج في المنعطف."
  },
  {
    id: 11,
    number: "11",
    category: "Vehicle Handling",
    categoryAr: "سلوك المناورة (Oversteer)",
    question: "Near the grip limit, the rear tires lose grip first and the car rotates more than intended. This is:",
    questionAr: "عند الاقتراب من حد التماسك، إذا فقدت الإطارات الخلفية تماسكها أولاً ودارت مؤخرة السيارة أكثر من المطلوب، تسمى هذه الحالة:",
    options: [
      { letter: "A", text: "Understeer", textAr: "أندرستير (Understeer)" },
      { letter: "B", text: "Vertical bounce", textAr: "ارتداد رأسي" },
      { letter: "C", text: "Oversteer", textAr: "أوفرستير (Oversteer)" }
    ],
    correctAnswer: 2, // C
    explanation: "Oversteer occurs when the rear tires lose grip first, causing the rear end to slide out and rotate the vehicle excessively.",
    explanationAr: "الأوفرستير (Oversteer) يحدث حين تفقد العجلات الخلفية تماسكها أولاً، فتنزلق خلفية السيارة وتدور باتجاه المنعطف."
  },
  {
    id: 12,
    number: "12",
    category: "Steering Geometry",
    categoryAr: "هندسة التوجيه (Ackermann)",
    question: "In ideal Ackermann steering during a slow turn, which front wheel has the larger steering angle?",
    questionAr: "في هندسة توجيه أكرمان (Ackermann) المثالية في المنعطفات البطيئة، أي عجلة أمامية تكون زاوية انحرافها أكبر؟",
    options: [
      { letter: "A", text: "The inner wheel", textAr: "العجلة الداخلية للمنعطف (The inner wheel)" },
      { letter: "B", text: "The outer wheel", textAr: "العجلة الخارجية للمنعطف (The outer wheel)" },
      { letter: "C", text: "Both angles must be equal", textAr: "الزاويتان متساويتان تماماً" }
    ],
    correctAnswer: 0, // A
    explanation: "The inner wheel travels along a tighter turning radius circle, and thus requires a steeper/larger steering angle than the outer wheel.",
    explanationAr: "العجلة الداخلية ترسم مسار دائري أصغر قطراً وأضيق، لذا تتطلب زاوية توجيه أكبر من العجلة الخارجية."
  }
];

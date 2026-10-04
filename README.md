# 🏎️ AutoVroom — Vehicle Dynamics Applicant Quiz
### Innovation University | AutoVroom Racing Cars Community
**Eng. Anas Essam | Operation Manager**

منظومة اختبارات إلكترونية تفاعلية متكاملة جاهزة للرفع المباشر على **Vercel**، مزودة بنظامين أوتوماتيكيين لحفظ البيانات:
1. **إرسال النتيجة والإجابات مباشرة إلى بريدك الإلكتروني (Email)**.
2. **تجميع كافة إجابات وبيانات الطلاب في شيت إكسيل (Excel .xlsx / Google Sheets)** تلقائياً في نفس اللحظة!

---

## 📊 مميزات نظام تجميع وتصدير الإكسيل (Excel & Sheets):
- زر مباشر بأعلى الموقع: **📊 شيت النتائج (Excel)**.
- لوحة تحكم تعرض جميع المتقدمين ودرجاتهم ونسبهم المئوية مع إحصائيات حية (متوسط الدرجات، نسبة النجاح، أعلى درجة).
- **تحميل شيت إكسيل حقيقي (.xlsx)** بنقرة واحدة متوافق تماماً مع Microsoft Excel واللغة العربية مع تفصيل إجابة كل طالب على الأسئلة من س1 إلى س12.
- **تصدير بصيغة CSV** يدعم الترميز العربي UTF-8.
- **الربط المباشر مع Google Sheets (Live Sync):** بمجرد تسليم أي طالب للاختبار، ينزل صف جديد تلقائياً في شيت جوجل أونلاين لحظياً!

---

## ⚡ كود ربط Google Sheets التلقائي (في 30 ثانية):
1. افتح أي شيت جديد على **[Google Sheets](https://sheets.new)**.
2. اضغط من القائمة العلوية على: **الإضافات (Extensions) &gt; Apps Script**.
3. احذف الكود الموجود والصق هذا الكود:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "تاريخ ووقت التسليم", "اسم الطالب", "رقم القيد", "الكلية / التخصص", "الفرقة",
      "البريد الإلكتروني", "الهاتف / واتساب", "الدرجة (من 12)", "النسبة المئوية", "الوقت المستغرق",
      "س1", "س2", "س3", "س4", "س5", "س6", "س7", "س8", "س9", "س10", "س11", "س12"
    ]);
    sheet.getRange(1, 1, 1, 22).setFontWeight("bold").setBackground("#7c3aed").setFontColor("#ffffff");
  }
  var data = JSON.parse(e.postData.contents);
  var row = [
    data.dateFormatted || new Date().toLocaleString(),
    data.name,
    data.studentId,
    data.faculty,
    data.level,
    data.email,
    data.phone,
    data.score,
    data.percentage + "%",
    data.timeSpent
  ];
  if (data.answers && data.answers.length) {
    data.answers.forEach(function(a) {
      row.push(a.userChoiceLetter + " (" + (a.isCorrect ? "صحيحة" : "خاطئة") + ")");
    });
  }
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```
4. اضغط على زر **Deploy (نشر) &gt; New deployment &gt; اختر Web app**:
   - في خانة **Who has access** اختر: **Anyone (أي شخص)**.
5. انسخ رابط الـ Web App وضعه في الموقع من زر **شيت النتائج &gt; الربط التلقائي بـ Google Sheets**، ومبروك! كل إجابة ستصل مباشرة للشيت.

---

## 🌐 خطوات رفع الموقع على Vercel:
1. ارفع مجلد `autovroom-quiz` إلى مستودع جديد على **GitHub**.
2. افتح موقع **[vercel.com](https://vercel.com)** وسجل الدخول.
3. اضغط على **"Add New Project"** واختر المستودع.
4. اضغط مباشرة على **"Deploy"**.
5. ستحصل فوراً على رابط مباشر مثل:
   `https://autovroom-dynamics-quiz.vercel.app` تقدر تبعته للطلاب!

---

## 🛠️ المعاينة المحلية:
الموقع يعمل الآن وجاهز للاختبار وتجربة تنزيل الإكسيل على الرابط:
👉 **[http://localhost:3030/](http://localhost:3030/)**

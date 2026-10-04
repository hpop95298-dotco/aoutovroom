// Vercel Serverless Function - api/submit.js
// يستقبل نتيجة اختبار Vehicle Dynamics ويرسل تقريراً مفصلاً إلى إيميل المهندس المشرف

export default async function handler(req, res) {
  // تفعيل CORS للسماح بالاستدعاء من Vercel أو أي دومين
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { student, score, total, percentage, timeSpent, answers, web3Key, targetEmail } = req.body;

    if (!student || !student.name) {
      return res.status(400).json({ success: false, message: 'بيانات الطالب غير مكتملة' });
    }

    const dateFormatted = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    const toEmail = process.env.TO_EMAIL || targetEmail || 'mn8665967@gmail.com';

    // توليد تقرير جدول الإجابات
    let answersHtml = answers.map((ans, idx) => {
      const isCorrect = ans.userChoice === ans.correctChoice;
      const statusColor = isCorrect ? '#10B981' : '#EF4444';
      const statusBadge = isCorrect 
        ? '<span style="background-color: #064e3b; color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">✔️ صحيحة</span>' 
        : '<span style="background-color: #450a0a; color: #f87171; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">❌ خاطئة</span>';

      return `
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 10px; color: #94a3b8; font-weight: bold; text-align: center;">${ans.number || (idx + 1)}</td>
          <td style="padding: 10px; color: #f1f5f9;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${ans.question}</div>
            <div style="font-size: 13px; color: #cbd5e1;">
              <strong>إجابة الطالب:</strong> 
              <span style="color: ${statusColor}; font-weight: bold;">(${ans.userChoiceLetter || '—'}) ${ans.userAnswerText || 'لم يُجب'}</span>
            </div>
            ${!isCorrect ? `
              <div style="font-size: 12px; color: #34d399; margin-top: 3px;">
                <strong>الإجابة الصحيحة:</strong> (${ans.correctChoiceLetter}) ${ans.correctAnswerText}
              </div>
            ` : ''}
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px; font-style: italic;">
              💡 <strong>السبب الهندسي:</strong> ${ans.explanation}
            </div>
          </td>
          <td style="padding: 10px; text-align: center; vertical-align: top;">
            ${statusBadge}
          </td>
        </tr>
      `;
    }).join('');

    // القالب الكامل للبريد الإلكتروني بتصميم نيورون داكن يناسب AutoVroom
    const fullHtmlEmail = `
      <div style="background-color: #0b0f19; padding: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #f8fafc;">
        <div style="max-width: 680px; margin: 0 auto; background-color: #111827; border-radius: 14px; overflow: hidden; border: 1px solid #7c3aed; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);">
          
          <!-- الهيدر -->
          <div style="background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #a855f7;">
            <h3 style="margin: 0 0 6px; color: #c084fc; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Innovation University</h3>
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">AutoVroom Racing Cars Community</h1>
            <p style="margin: 8px 0 0; color: #e9d5ff; font-size: 15px; font-weight: 500;">Vehicle Dynamics Applicant Quiz — تقرير إجابة متقدم</p>
            <div style="margin-top: 8px; font-size: 12px; color: #d8b4fe;">Eng. Anas Essam | Operation Manager</div>
          </div>

          <div style="padding: 24px;">
            <!-- كارت النتيجة -->
            <div style="background: linear-gradient(180deg, #1f2937, #111827); border: 1px solid #374151; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 13px; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">النتيجة الكلية للتقييم</div>
              <div style="font-size: 42px; font-weight: 900; color: ${percentage >= 50 ? '#34d399' : '#f87171'};">
                ${score} <span style="font-size: 24px; color: #9ca3af;">/ ${total}</span>
              </div>
              <div style="display: inline-block; background-color: ${percentage >= 50 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border: 1px solid ${percentage >= 50 ? '#10b981' : '#ef4444'}; color: ${percentage >= 50 ? '#34d399' : '#f87171'}; padding: 4px 14px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-top: 8px;">
                النسبة المئوية: ${percentage}%
              </div>
            </div>

            <!-- بيانات الطالب الرسمية كما في ورقة الاختبار -->
            <div style="background-color: #1f2937; border-radius: 10px; padding: 18px; margin-bottom: 24px; border-right: 4px solid #8b5cf6;">
              <h3 style="margin: 0 0 12px; color: #c084fc; font-size: 15px; display: flex; align-items: center; gap: 6px;">
                📋 بيانات المتقدم (Applicant Information):
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e5e7eb;">
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af; width: 140px;">👤 الاسم (Name):</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #ffffff;">${student.name}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af;">🪪 رقم القيد (Student ID):</td>
                  <td style="padding: 5px 0; font-weight: bold; color: #a78bfa;">${student.studentId || 'غير محدد'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af;">🏛️ الكلية / التخصص (Faculty):</td>
                  <td style="padding: 5px 0; color: #f3f4f6;">${student.faculty || 'غير محدد'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af;">🎓 الفرقة (Level):</td>
                  <td style="padding: 5px 0; color: #f3f4f6;">${student.level || 'غير محدد'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af;">✉️ البريد الإلكتروني:</td>
                  <td style="padding: 5px 0; color: #38bdf8;">${student.email || 'غير مسجل'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af;">📱 الهاتف / واتساب:</td>
                  <td style="padding: 5px 0; color: #f3f4f6;">${student.phone || 'غير مسجل'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af;">⏱️ الوقت المستغرق:</td>
                  <td style="padding: 5px 0; color: #f3f4f6;">${timeSpent}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #9ca3af;">📅 تاريخ وتوقيت التسليم:</td>
                  <td style="padding: 5px 0; color: #9ca3af;">${dateFormatted}</td>
                </tr>
              </table>
            </div>

            <!-- جدول تفاصيل الأسئلة والحل النموذجي -->
            <h3 style="color: #f3f4f6; margin: 0 0 12px; font-size: 15px; border-bottom: 2px solid #374151; padding-bottom: 8px;">
              🔍 تفاصيل الإجابات الـ 12 مع التحليل الهندسي:
            </h3>

            <table style="width: 100%; border-collapse: collapse; background-color: #171f2e; border-radius: 8px; overflow: hidden; border: 1px solid #334155;">
              <thead>
                <tr style="background-color: #1e293b; color: #94a3b8; font-size: 12px;">
                  <th style="padding: 8px; width: 40px; text-align: center;">#</th>
                  <th style="padding: 8px; text-align: right;">السؤال وإجابة الطالب</th>
                  <th style="padding: 8px; width: 85px; text-align: center;">الحالة</th>
                </tr>
              </thead>
              <tbody>
                ${answersHtml}
              </tbody>
            </table>

            <!-- الفوتر -->
            <div style="text-align: center; margin-top: 30px; padding-top: 18px; border-top: 1px solid #374151; color: #6b7280; font-size: 12px;">
              نظام اختبارات ومسابقات AutoVroom Racing Cars Community &bull; Innovation University
            </div>
          </div>
        </div>
      </div>
    `;

    // 1. محاولة الإرسال عبر Resend إن وُجد مفتاح البيئة
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'AutoVroom Quiz <onboarding@resend.dev>',
          to: toEmail,
          reply_to: student.email,
          subject: `🏎️ [Vehicle Dynamics Quiz] ${student.name} (${student.studentId || 'ID'}) — النتيجة: ${score}/${total}`,
          html: fullHtmlEmail
        })
      });

      if (resendRes.ok) {
        return res.status(200).json({ success: true, message: 'تم إرسال النتيجة بنجاح عبر Resend' });
      }
    }

    // 2. استخدام Web3Forms المجاني المباشر
    const activeWeb3Key = process.env.WEB3FORMS_ACCESS_KEY || web3Key || '0c494a24-4a78-40b5-b227-5281a6331bb7';
    if (activeWeb3Key) {
      const w3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: activeWeb3Key,
          subject: `🏎️ [Vehicle Dynamics] نتيجة اختبار: ${student.name} (${score}/${total} - ${percentage}%)`,
          from_name: `AutoVroom Racing Community`,
          to_email: toEmail,
          name: student.name,
          email: student.email,
          message: `
📋 بيانات المتقدم:
- الاسم: ${student.name}
- Student ID: ${student.studentId || 'غير محدد'}
- Faculty / Major: ${student.faculty || 'غير محدد'}
- Level: ${student.level || 'غير محدد'}
- التاريخ: ${dateFormatted}
- الإيميل: ${student.email}
- الهاتف: ${student.phone || 'غير مسجل'}

🎯 النتيجة النهائية:
- الدرجة: ${score} من ${total}
- النسبة المئوية: ${percentage}%
- الوقت المستغرق: ${timeSpent}

📝 تفاصيل إجابات الأسئلة الـ 12:
${answers.map((a, i) => `${a.number || (i+1)}. ${a.question}
- إجابة الطالب: (${a.userChoiceLetter}) ${a.userAnswerText} [${a.userChoice === a.correctChoice ? '✔️ صحيحة' : '❌ خاطئة'}]
${a.userChoice !== a.correctChoice ? `- الإجابة الصحيحة: (${a.correctChoiceLetter}) ${a.correctAnswerText}\n` : ''}- السبب الهندسي: ${a.explanation}`).join('\n\n')}
          `
        })
      });

      const w3Data = await w3Response.json();
      return res.status(200).json({ 
        success: true, 
        message: 'تم الإرسال بنجاح عبر Web3Forms', 
        details: w3Data 
      });
    }

    return res.status(200).json({
      success: true,
      needsClientFallback: true,
      message: 'Serverless response ready.'
    });

  } catch (error) {
    console.error('Submit API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

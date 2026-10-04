// ==========================================================================
// AutoVroom Racing Cars Community - Innovation University
// Vehicle Dynamics Applicant Quiz Engine & Excel Aggregator (app.js)
// Eng. Anas Essam | Operation Manager
// ==========================================================================

import { quizQuestions, quizInfo } from './questions.js';
import { config } from './config.js';

// Application State
const state = {
  questions: [...quizQuestions],
  student: {
    name: '',
    studentId: '',
    level: '',
    faculty: '',
    email: '',
    phone: '',
    date: ''
  },
  answers: {}, // { [questionId]: selectedOptionIndex (0, 1, 2) }
  currentQuestionIndex: 0,
  viewMode: 'step', // 'step' | 'all'
  timerSeconds: config.defaultTimeMinutes * 60,
  timerInterval: null,
  startTime: null,
  endTime: null,
  timeSpentFormatted: '',
  isSubmitted: false,
  reviewFilter: 'all',
  
  // Custom Settings (persisted in localStorage)
  adminEmail: localStorage.getItem('autovroom_admin_email') || config.emailService.recipientEmail || 'mn8665967@gmail.com',
  web3Key: localStorage.getItem('autovroom_web3_key') || config.emailService.web3formsAccessKey || '0c494a24-4a78-40b5-b227-5281a6331bb7',
  webhookUrl: localStorage.getItem('autovroom_webhook_url') || '',
  googleSheetWebhook: localStorage.getItem('autovroom_gsheet_webhook') || '',

  // All student submissions collection for Excel export
  submissions: JSON.parse(localStorage.getItem('autovroom_submissions') || '[]')
};

// Seed sample submission if none exists so user can test Excel immediately
if (state.submissions.length === 0) {
  state.submissions = [
    {
      id: 'sub_demo_1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      dateFormatted: new Date(Date.now() - 3600000).toLocaleDateString('ar-EG'),
      name: 'أنس عصام (تجريبي)',
      studentId: '20240189',
      level: 'Level 2',
      faculty: 'هندسة ميكاترونكس',
      email: 'anass.essamm@gmail.com',
      phone: '01012345678',
      score: 11,
      total: 12,
      percentage: 92,
      timeSpent: '14 دقيقة و 20 ثانية',
      answers: state.questions.map((q, idx) => ({
        number: q.number,
        question: q.question,
        userChoiceLetter: idx === 3 ? 'B' : ['B','C','A','A','B','C','A','B','C','B','C','A'][idx],
        correctChoiceLetter: ['B','C','A','A','B','C','A','B','C','B','C','A'][idx],
        isCorrect: idx !== 3
      }))
    }
  ];
  localStorage.setItem('autovroom_submissions', JSON.stringify(state.submissions));
}

// DOM Elements
const elements = {
  // Screens
  welcomeScreen: document.getElementById('welcomeScreen'),
  quizScreen: document.getElementById('quizScreen'),
  resultScreen: document.getElementById('resultScreen'),
  
  // Header & Navigation
  quizTimer: document.getElementById('quizTimer'),
  timerText: document.getElementById('timerText'),
  stickyProgress: document.getElementById('stickyProgress'),
  answeredCount: document.getElementById('answeredCount'),
  totalCountHeader: document.getElementById('totalCountHeader'),
  percentageBadge: document.getElementById('percentageBadge'),
  progressFill: document.getElementById('progressFill'),
  questionsMap: document.getElementById('questionsMap'),

  // Forms
  studentForm: document.getElementById('studentForm'),
  studentName: document.getElementById('studentName'),
  studentId: document.getElementById('studentId'),
  studentLevel: document.getElementById('studentLevel'),
  facultyMajor: document.getElementById('facultyMajor'),
  studentEmail: document.getElementById('studentEmail'),
  studentPhone: document.getElementById('studentPhone'),
  quizDate: document.getElementById('quizDate'),

  // Quiz View Controls
  singleQuestionArea: document.getElementById('singleQuestionArea'),
  allQuestionsArea: document.getElementById('allQuestionsArea'),
  modeStepBtn: document.getElementById('modeStepBtn'),
  modeAllBtn: document.getElementById('modeAllBtn'),
  btnPrevQuestion: document.getElementById('btnPrevQuestion'),
  btnNextQuestion: document.getElementById('btnNextQuestion'),
  btnSubmitQuiz: document.getElementById('btnSubmitQuiz'),

  // Modals
  submitModal: document.getElementById('submitModal'),
  modalBody: document.getElementById('modalBody'),
  btnCloseModal: document.getElementById('btnCloseModal'),
  btnCancelSubmit: document.getElementById('btnCancelSubmit'),
  btnConfirmSubmit: document.getElementById('btnConfirmSubmit'),

  // Settings Modal
  btnOpenSettings: document.getElementById('btnOpenSettings'),
  settingsModal: document.getElementById('settingsModal'),
  btnCloseSettings: document.getElementById('btnCloseSettings'),
  inputAdminEmail: document.getElementById('inputAdminEmail'),
  inputWeb3Key: document.getElementById('inputWeb3Key'),
  inputWebhookUrl: document.getElementById('inputWebhookUrl'),
  btnSaveSettings: document.getElementById('btnSaveSettings'),

  // Admin & Excel Dashboard Modal
  btnOpenAdmin: document.getElementById('btnOpenAdmin'),
  adminModal: document.getElementById('adminModal'),
  btnCloseAdmin: document.getElementById('btnCloseAdmin'),
  tabSubmissionsBtn: document.getElementById('tabSubmissionsBtn'),
  tabGoogleSheetBtn: document.getElementById('tabGoogleSheetBtn'),
  tabSubmissionsContent: document.getElementById('tabSubmissionsContent'),
  tabGoogleSheetContent: document.getElementById('tabGoogleSheetContent'),
  statTotalStudents: document.getElementById('statTotalStudents'),
  statAvgScore: document.getElementById('statAvgScore'),
  statPassRate: document.getElementById('statPassRate'),
  statTopScore: document.getElementById('statTopScore'),
  adminSearchInput: document.getElementById('adminSearchInput'),
  btnExportExcelXlsx: document.getElementById('btnExportExcelXlsx'),
  btnExportCsv: document.getElementById('btnExportCsv'),
  btnClearAllSubmissions: document.getElementById('btnClearAllSubmissions'),
  adminSubmissionsTbody: document.getElementById('adminSubmissionsTbody'),
  inputGoogleSheetWebhook: document.getElementById('inputGoogleSheetWebhook'),
  btnSaveGoogleSheetWebhook: document.getElementById('btnSaveGoogleSheetWebhook'),
  btnTestGoogleSheetWebhook: document.getElementById('btnTestGoogleSheetWebhook'),
  btnCopyGoogleScript: document.getElementById('btnCopyGoogleScript'),

  // Results
  finalScoreVal: document.getElementById('finalScoreVal'),
  resultBadge: document.getElementById('resultBadge'),
  studentGreeting: document.getElementById('studentGreeting'),
  resultSummary: document.getElementById('resultSummary'),
  studentInfoSummary: document.getElementById('studentInfoSummary'),
  emailStatusCard: document.getElementById('emailStatusCard'),
  emailStatusIcon: document.getElementById('emailStatusIcon'),
  emailStatusTitle: document.getElementById('emailStatusTitle'),
  emailStatusDesc: document.getElementById('emailStatusDesc'),
  answersReviewContainer: document.getElementById('answersReviewContainer'),
  filterAll: document.getElementById('filterAll'),
  filterCorrect: document.getElementById('filterCorrect'),
  filterWrong: document.getElementById('filterWrong'),
  btnPrintReport: document.getElementById('btnPrintReport'),
  btnCopyReport: document.getElementById('btnCopyReport'),
  btnWhatsAppShare: document.getElementById('btnWhatsAppShare'),
  btnResendEmail: document.getElementById('btnResendEmail'),

  // Toast
  toastNotification: document.getElementById('toastNotification'),
  toastIcon: document.getElementById('toastIcon'),
  toastMsg: document.getElementById('toastMsg')
};

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initDate();
  loadSettings();
  attachEventListeners();
});

function initDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  if (elements.quizDate) {
    elements.quizDate.value = now.toLocaleDateString('ar-EG', options);
  }
  if (elements.totalCountHeader) {
    elements.totalCountHeader.textContent = state.questions.length;
  }
}

function loadSettings() {
  if (elements.inputAdminEmail) elements.inputAdminEmail.value = state.adminEmail;
  if (elements.inputWeb3Key) elements.inputWeb3Key.value = state.web3Key;
  if (elements.inputWebhookUrl) elements.inputWebhookUrl.value = state.webhookUrl;
  if (elements.inputGoogleSheetWebhook) elements.inputGoogleSheetWebhook.value = state.googleSheetWebhook;
}

// --------------------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------------------
function attachEventListeners() {
  // Start Quiz
  elements.studentForm.addEventListener('submit', handleStartQuiz);

  // View Mode
  elements.modeStepBtn.addEventListener('click', () => setViewMode('step'));
  elements.modeAllBtn.addEventListener('click', () => setViewMode('all'));

  // Navigation
  elements.btnPrevQuestion.addEventListener('click', goToPreviousQuestion);
  elements.btnNextQuestion.addEventListener('click', goToNextQuestion);
  elements.btnSubmitQuiz.addEventListener('click', openSubmitModal);

  // Modals
  elements.btnCloseModal.addEventListener('click', closeSubmitModal);
  elements.btnCancelSubmit.addEventListener('click', closeSubmitModal);
  elements.btnConfirmSubmit.addEventListener('click', finalizeAndSubmit);

  elements.btnOpenSettings.addEventListener('click', () => elements.settingsModal.classList.add('active'));
  elements.btnCloseSettings.addEventListener('click', () => elements.settingsModal.classList.remove('active'));
  elements.btnSaveSettings.addEventListener('click', handleSaveSettings);

  // Admin Dashboard & Excel
  if (elements.btnOpenAdmin) {
    elements.btnOpenAdmin.addEventListener('click', openAdminDashboard);
  }
  if (elements.btnCloseAdmin) {
    elements.btnCloseAdmin.addEventListener('click', () => elements.adminModal.classList.remove('active'));
  }
  if (elements.tabSubmissionsBtn) {
    elements.tabSubmissionsBtn.addEventListener('click', () => switchAdminTab('submissions'));
  }
  if (elements.tabGoogleSheetBtn) {
    elements.tabGoogleSheetBtn.addEventListener('click', () => switchAdminTab('gsheet'));
  }
  if (elements.btnExportExcelXlsx) {
    elements.btnExportExcelXlsx.addEventListener('click', exportToExcelXlsx);
  }
  if (elements.btnExportCsv) {
    elements.btnExportCsv.addEventListener('click', exportToCsv);
  }
  if (elements.btnClearAllSubmissions) {
    elements.btnClearAllSubmissions.addEventListener('click', handleClearSubmissions);
  }
  if (elements.adminSearchInput) {
    elements.adminSearchInput.addEventListener('input', renderAdminTable);
  }
  if (elements.btnSaveGoogleSheetWebhook) {
    elements.btnSaveGoogleSheetWebhook.addEventListener('click', handleSaveGoogleSheetWebhook);
  }
  if (elements.btnTestGoogleSheetWebhook) {
    elements.btnTestGoogleSheetWebhook.addEventListener('click', handleTestGoogleSheet);
  }
  if (elements.btnCopyGoogleScript) {
    elements.btnCopyGoogleScript.addEventListener('click', handleCopyGoogleScript);
  }

  // Results Actions
  elements.btnPrintReport.addEventListener('click', () => window.print());
  elements.btnCopyReport.addEventListener('click', copySummaryToClipboard);
  if (elements.btnResendEmail) {
    elements.btnResendEmail.addEventListener('click', handleResendEmail);
  }

  // Filters
  elements.filterAll.addEventListener('click', () => setReviewFilter('all'));
  elements.filterCorrect.addEventListener('click', () => setReviewFilter('correct'));
  elements.filterWrong.addEventListener('click', () => setReviewFilter('wrong'));

  // Keyboard Navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// --------------------------------------------------------------------------
// Start Quiz Flow
// --------------------------------------------------------------------------
function handleStartQuiz(e) {
  e.preventDefault();

  state.student.name = elements.studentName.value.trim();
  state.student.studentId = elements.studentId.value.trim();
  state.student.level = elements.studentLevel.value.trim();
  state.student.faculty = elements.facultyMajor.value.trim();
  state.student.email = elements.studentEmail.value.trim();
  state.student.phone = elements.studentPhone.value.trim();
  state.student.date = elements.quizDate.value;

  if (!state.student.name || !state.student.studentId || !state.student.email) {
    showToast('يرجى ملء جميع الحقول الإلزامية', '⚠️');
    return;
  }

  state.startTime = new Date();
  if (config.settings.enforceTimer) {
    startTimer();
  }

  elements.welcomeScreen.style.display = 'none';
  elements.quizScreen.style.display = 'block';
  elements.stickyProgress.style.display = 'block';
  if (config.settings.enforceTimer) {
    elements.quizTimer.style.display = 'flex';
  }

  buildQuestionsMap();
  renderCurrentQuestion();
  renderAllQuestions();
  updateProgress();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`بالتوفيق يا ${state.student.name.split(' ')[0]}! 🏎️`, '🏁');
}

// --------------------------------------------------------------------------
// Countdown Timer
// --------------------------------------------------------------------------
function startTimer() {
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerDisplay();

    if (state.timerSeconds <= 300 && state.timerSeconds > 60) {
      elements.quizTimer.className = 'timer-box warning';
    } else if (state.timerSeconds <= 60) {
      elements.quizTimer.className = 'timer-box danger';
    }

    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      showToast('انتهى الوقت المخصص للاختبار! جاري تسليم إجاباتك...', '⏰');
      setTimeout(finalizeAndSubmit, 1500);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(state.timerSeconds / 60);
  const s = state.timerSeconds % 60;
  elements.timerText.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// --------------------------------------------------------------------------
// Question Navigation & Rendering
// --------------------------------------------------------------------------
function buildQuestionsMap() {
  elements.questionsMap.innerHTML = '';
  state.questions.forEach((q, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'map-dot';
    dot.id = `mapDot-${idx}`;
    dot.textContent = idx + 1;
    dot.title = `السؤال رقم ${idx + 1}`;
    dot.addEventListener('click', () => {
      state.currentQuestionIndex = idx;
      if (state.viewMode === 'all') {
        const targetCard = document.getElementById(`qcard-all-${idx}`);
        if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        renderCurrentQuestion();
      }
    });
    elements.questionsMap.appendChild(dot);
  });
}

function renderCurrentQuestion() {
  const q = state.questions[state.currentQuestionIndex];
  const total = state.questions.length;

  elements.singleQuestionArea.innerHTML = `
    <div class="question-card" id="qcard-${state.currentQuestionIndex}">
      <div class="q-header-row">
        <span class="q-number-pill">Question ${q.number} / ${total}</span>
        <span class="q-category-badge">${q.category} &bull; ${q.categoryAr}</span>
      </div>

      <div class="q-body">
        <h3 class="q-text-en">${q.number}. ${q.question}</h3>
        <p class="q-text-ar">${q.questionAr}</p>
      </div>

      <div class="options-list">
        ${q.options.map((opt, optIdx) => {
          const isSelected = state.answers[q.id] === optIdx;
          return `
            <div class="option-item ${isSelected ? 'selected' : ''}" 
                 onclick="window.selectOption(${q.id}, ${optIdx})">
              <div class="option-letter">${opt.letter}</div>
              <div class="option-content">
                <div class="opt-en">${opt.text}</div>
                <div class="opt-ar">${opt.textAr}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  elements.btnPrevQuestion.style.visibility = state.currentQuestionIndex === 0 ? 'hidden' : 'visible';

  if (state.currentQuestionIndex === total - 1) {
    elements.btnNextQuestion.style.display = 'none';
    elements.btnSubmitQuiz.style.display = 'inline-flex';
  } else {
    elements.btnNextQuestion.style.display = 'inline-flex';
    elements.btnSubmitQuiz.style.display = 'none';
  }

  updateMapHighlights();
}

function renderAllQuestions() {
  elements.allQuestionsArea.innerHTML = state.questions.map((q, idx) => {
    return `
      <div class="question-card" id="qcard-all-${idx}">
        <div class="q-header-row">
          <span class="q-number-pill">Question ${q.number} / 12</span>
          <span class="q-category-badge">${q.category} &bull; ${q.categoryAr}</span>
        </div>

        <div class="q-body">
          <h3 class="q-text-en">${q.number}. ${q.question}</h3>
          <p class="q-text-ar">${q.questionAr}</p>
        </div>

        <div class="options-list">
          ${q.options.map((opt, optIdx) => {
            const isSelected = state.answers[q.id] === optIdx;
            return `
              <div class="option-item ${isSelected ? 'selected' : ''}" 
                   onclick="window.selectOption(${q.id}, ${optIdx})">
                <div class="option-letter">${opt.letter}</div>
                <div class="option-content">
                  <div class="opt-en">${opt.text}</div>
                  <div class="opt-ar">${opt.textAr}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

window.selectOption = function(questionId, optionIndex) {
  state.answers[questionId] = optionIndex;
  updateProgress();
  
  if (state.viewMode === 'step') {
    renderCurrentQuestion();
  } else {
    renderAllQuestions();
  }
};

function updateProgress() {
  const answered = Object.keys(state.answers).length;
  const total = state.questions.length;
  const pct = Math.round((answered / total) * 100);

  elements.answeredCount.textContent = answered;
  elements.percentageBadge.textContent = `${pct}%`;
  elements.progressFill.style.width = `${pct}%`;

  updateMapHighlights();
}

function updateMapHighlights() {
  state.questions.forEach((q, idx) => {
    const dot = document.getElementById(`mapDot-${idx}`);
    if (!dot) return;

    dot.classList.remove('current', 'answered');
    if (state.answers[q.id] !== undefined) {
      dot.classList.add('answered');
    }
    if (idx === state.currentQuestionIndex && state.viewMode === 'step') {
      dot.classList.add('current');
    }
  });
}

function setViewMode(mode) {
  state.viewMode = mode;
  if (mode === 'step') {
    elements.modeStepBtn.classList.add('active');
    elements.modeAllBtn.classList.remove('active');
    elements.singleQuestionArea.style.display = 'block';
    elements.allQuestionsArea.style.display = 'none';
    elements.btnPrevQuestion.style.display = 'inline-flex';
    elements.btnNextQuestion.style.display = 'inline-flex';
    renderCurrentQuestion();
  } else {
    elements.modeStepBtn.classList.remove('active');
    elements.modeAllBtn.classList.add('active');
    elements.singleQuestionArea.style.display = 'none';
    elements.allQuestionsArea.style.display = 'block';
    elements.btnPrevQuestion.style.display = 'none';
    elements.btnNextQuestion.style.display = 'none';
    elements.btnSubmitQuiz.style.display = 'inline-flex';
    renderAllQuestions();
  }
}

function goToNextQuestion() {
  if (state.currentQuestionIndex < state.questions.length - 1) {
    state.currentQuestionIndex++;
    renderCurrentQuestion();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

function goToPreviousQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    renderCurrentQuestion();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

function handleKeyboardNavigation(e) {
  if (elements.quizScreen.style.display !== 'block') return;

  if (e.key === 'ArrowLeft') {
    goToNextQuestion();
  } else if (e.key === 'ArrowRight') {
    goToPreviousQuestion();
  } else if (['1', '2', '3', 'a', 'b', 'c', 'A', 'B', 'C'].includes(e.key)) {
    const q = state.questions[state.currentQuestionIndex];
    let optIdx = -1;
    if (e.key === '1' || e.key.toLowerCase() === 'a') optIdx = 0;
    if (e.key === '2' || e.key.toLowerCase() === 'b') optIdx = 1;
    if (e.key === '3' || e.key.toLowerCase() === 'c') optIdx = 2;

    if (optIdx !== -1 && optIdx < q.options.length) {
      window.selectOption(q.id, optIdx);
    }
  }
}

// --------------------------------------------------------------------------
// Modal & Confirmation
// --------------------------------------------------------------------------
function openSubmitModal() {
  const answeredCount = Object.keys(state.answers).length;
  const total = state.questions.length;
  const unanswered = total - answeredCount;

  let modalHtml = '';
  if (unanswered > 0) {
    modalHtml = `
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 16px;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">⚠️</div>
        <div style="font-weight: 800; color: #f87171; font-size: 1.15rem; margin-bottom: 6px;">
          تنبيه: لديك ${unanswered} أسئلة دون إجابة!
        </div>
        <p style="color: #cbd5e1; font-size: 0.92rem;">
          هل تود تسليم الاختبار الآن بالدرجات الحالية أم العودة لإكمال بقية الأسئلة؟
        </p>
      </div>
    `;
  } else {
    modalHtml = `
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 18px; text-align: center; margin-bottom: 16px;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🏁</div>
        <div style="font-weight: 800; color: #34d399; font-size: 1.15rem; margin-bottom: 6px;">
          رائع! قمت بالإجابة على جميع الأسئلة الـ 12
        </div>
        <p style="color: #cbd5e1; font-size: 0.92rem;">
          هل أنت مستعد لإنهاء الاختبار وتسليم إجاباتك وعرض نتيجتك النهائية؟
        </p>
      </div>
    `;
  }

  elements.modalBody.innerHTML = modalHtml;
  elements.submitModal.classList.add('active');
}

function closeSubmitModal() {
  elements.submitModal.classList.remove('active');
}

// --------------------------------------------------------------------------
// Final Score Calculation, Excel Aggregation & Submission
// --------------------------------------------------------------------------
let lastPayload = null;

async function finalizeAndSubmit() {
  closeSubmitModal();
  if (state.isSubmitted) return;

  state.isSubmitted = true;
  clearInterval(state.timerInterval);
  state.endTime = new Date();

  // Calculate elapsed time
  const timeDiffMs = state.endTime - state.startTime;
  const minutesSpent = Math.floor(timeDiffMs / 60000);
  const secondsSpent = Math.floor((timeDiffMs % 60000) / 1000);
  state.timeSpentFormatted = `${minutesSpent} دقيقة و ${secondsSpent} ثانية`;

  // Calculate score & answers detail
  let score = 0;
  const answersDetail = state.questions.map((q, idx) => {
    const userChoice = state.answers[q.id];
    const isCorrect = userChoice === q.correctAnswer;
    if (isCorrect) score++;

    const userOpt = userChoice !== undefined ? q.options[userChoice] : null;
    const correctOpt = q.options[q.correctAnswer];

    return {
      id: q.id,
      number: q.number,
      category: q.category,
      categoryAr: q.categoryAr,
      question: q.question,
      questionAr: q.questionAr,
      userChoice: userChoice !== undefined ? userChoice : null,
      userChoiceLetter: userOpt ? userOpt.letter : '—',
      userAnswerText: userOpt ? userOpt.text : 'لم يُجب الطالب',
      userAnswerTextAr: userOpt ? userOpt.textAr : '',
      correctChoice: q.correctAnswer,
      correctChoiceLetter: correctOpt.letter,
      correctAnswerText: correctOpt.text,
      correctAnswerTextAr: correctOpt.textAr,
      explanation: q.explanation,
      explanationAr: q.explanationAr,
      isCorrect
    };
  });

  const total = state.questions.length;
  const percentage = Math.round((score / total) * 100);

  // Transition UI to Result Screen
  elements.quizScreen.style.display = 'none';
  elements.stickyProgress.style.display = 'none';
  elements.quizTimer.style.display = 'none';
  elements.resultScreen.style.display = 'block';

  // Render Result Card
  elements.finalScoreVal.textContent = score;
  elements.studentGreeting.textContent = `عاش يا ${state.student.name}! 🏎️`;
  elements.resultSummary.textContent = `النسبة المئوية: ${percentage}% &bull; الوقت المستغرق: ${state.timeSpentFormatted}`;

  // Performance Badge
  if (percentage >= 80) {
    elements.resultBadge.className = 'result-badge excellent';
    elements.resultBadge.textContent = '🏆 أداء استثنائي — مؤهل لفريق Vehicle Dynamics';
    triggerConfetti();
  } else if (percentage >= 50) {
    elements.resultBadge.className = 'result-badge good';
    elements.resultBadge.textContent = '👏 أداء واعد ومبشر جداً';
    triggerConfetti();
  } else {
    elements.resultBadge.className = 'result-badge needs-work';
    elements.resultBadge.textContent = '💪 بداية جيدة — راجع الشرح الهندسي أدناه';
  }

  // Student Info Snapshot
  elements.studentInfoSummary.innerHTML = `
    <h4 style="color: var(--primary-light); margin-bottom: 8px; font-size: 0.95rem;">📋 بطاقة تقييم المتقدم:</h4>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.88rem; color: #cbd5e1;">
      <div><strong>الاسم:</strong> ${state.student.name}</div>
      <div><strong>Student ID:</strong> <span style="font-family: var(--font-english); color: #c084fc;">${state.student.studentId}</span></div>
      <div><strong>الكلية والتخصص:</strong> ${state.student.faculty}</div>
      <div><strong>الفرقة:</strong> ${state.student.level}</div>
      <div><strong>البريد:</strong> ${state.student.email}</div>
      <div><strong>واتساب:</strong> ${state.student.phone}</div>
      <div><strong>التاريخ:</strong> ${state.student.date}</div>
      <div><strong>الدرجة النهائية:</strong> <span style="font-weight: 800; color: #34d399;">${score} / ${total} (${percentage}%)</span></div>
    </div>
  `;

  // WhatsApp Share
  const waMsg = encodeURIComponent(
    `🏎️ نتيجة اختبار Vehicle Dynamics Applicant Quiz:\n` +
    `👤 المتقدم: ${state.student.name} (ID: ${state.student.studentId})\n` +
    `🎯 الدرجة: ${score} من ${total} (${percentage}%)\n` +
    `⏱️ الوقت: ${state.timeSpentFormatted}\n` +
    `🏛️ AutoVroom Racing Cars Community — Innovation University`
  );
  elements.btnWhatsAppShare.href = `https://wa.me/?text=${waMsg}`;

  // Educational Review
  renderReviewSheet(answersDetail);

  lastPayload = {
    student: state.student,
    score,
    total,
    percentage,
    timeSpent: state.timeSpentFormatted,
    answers: answersDetail,
    targetEmail: state.adminEmail
  };

  // 1. SAVE RECORD TO EXCEL DATABASE (localStorage)
  const submissionRecord = {
    id: 'sub_' + Date.now(),
    timestamp: new Date().toISOString(),
    dateFormatted: state.student.date || new Date().toLocaleString('ar-EG'),
    name: state.student.name,
    studentId: state.student.studentId,
    level: state.student.level,
    faculty: state.student.faculty,
    email: state.student.email,
    phone: state.student.phone,
    score,
    total,
    percentage,
    timeSpent: state.timeSpentFormatted,
    answers: answersDetail
  };

  state.submissions.unshift(submissionRecord);
  localStorage.setItem('autovroom_submissions', JSON.stringify(state.submissions));

  // 2. DISPATCH TO GOOGLE SHEETS LIVE SYNC IF WEBHOOK EXISTS
  if (state.googleSheetWebhook) {
    sendRowToGoogleSheet(submissionRecord);
  }

  // 3. DISPATCH EMAIL REPORT
  await dispatchEmailReport(lastPayload);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// Email Dispatcher
// --------------------------------------------------------------------------
async function dispatchEmailReport(payload) {
  elements.emailStatusCard.className = 'email-status-card';
  elements.emailStatusIcon.textContent = '⏳';
  elements.emailStatusTitle.textContent = 'جاري إرسال النتيجة إلى بريد الفريق...';
  elements.emailStatusDesc.textContent = `يتم توصيل التقرير إلى (${state.adminEmail}).`;

  try {
    // 1. Try Vercel Serverless Function first (/api/submit)
    try {
      const serverlessRes = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, web3Key: state.web3Key })
      });

      if (serverlessRes.ok) {
        const json = await serverlessRes.json();
        if (json.success && !json.needsClientFallback) {
          markEmailSuccess(state.adminEmail);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // 2. Direct Web3Forms submission (Free & Serverless)
    let emailSent = false;
    if (state.web3Key) {
      try {
        const w3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: state.web3Key,
            subject: `🏎️ [Vehicle Dynamics Quiz] ${payload.student.name} (${payload.score}/${payload.total} - ${payload.percentage}%)`,
            from_name: 'AutoVroom Racing Community',
            to_email: state.adminEmail,
            name: payload.student.name,
            email: payload.student.email,
            phone: payload.student.phone,
            message: formatTextReport(payload)
          })
        });

        const w3Data = await w3Response.json();
        if (w3Data.success) {
          emailSent = true;
          markEmailSuccess(state.adminEmail);
          return;
        }
      } catch (e) {
        console.warn('Web3Forms client warning:', e);
      }
    }

    // 2.5 Dual-Dispatch via FormSubmit (Direct to Email without key)
    try {
      const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(state.adminEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🏎️ [Vehicle Dynamics] نتيجة: ${payload.student.name} (${payload.score}/${payload.total})`,
          _captcha: 'false',
          'اسم الطالب': payload.student.name,
          'Student ID': payload.student.studentId,
          'الكلية': payload.student.faculty,
          'الفرقة': payload.student.level,
          'البريد الإلكتروني': payload.student.email,
          'الهاتف': payload.student.phone,
          'الدرجة': `${payload.score} من ${payload.total} (${payload.percentage}%)`,
          'الوقت': payload.timeSpent,
          'تقرير الإجابات': formatTextReport(payload)
        })
      });

      const fsData = await fsRes.json();
      if (fsData.success === 'true' || fsData.success === true) {
        markEmailSuccess(state.adminEmail);
        return;
      }
    } catch (e) {
      console.warn('FormSubmit client warning:', e);
    }

    // 3. Custom Webhook
    if (state.webhookUrl) {
      await fetch(state.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      markEmailSuccess('قاعدة البيانات والـ Webhook');
      return;
    }

    elements.emailStatusCard.className = 'email-status-card success';
    elements.emailStatusIcon.textContent = '📬';
    elements.emailStatusTitle.textContent = 'تم تسجيل النتيجة وتخزينها في شيت الإكسيل!';
    elements.emailStatusDesc.textContent = `تم تسجيل بيانات الطالب في سجل النتائج بنجاح، ويمكنك تصديرها كشيت إكسيل من زر 📊 شيت النتائج.`;

  } catch (error) {
    console.error('Email dispatch error:', error);
    elements.emailStatusCard.className = 'email-status-card';
    elements.emailStatusIcon.textContent = '📋';
    elements.emailStatusTitle.textContent = 'تم حفظ النتيجة محلياً بنجاح';
    elements.emailStatusDesc.textContent = 'تمت إضافة الطالب لشيت الإكسيل، ويمكنك مشاركة النتيجة عبر واتساب.';
  }
}

function handleResendEmail() {
  if (lastPayload) {
    showToast('جاري إعادة إرسال التقرير...', '🔄');
    dispatchEmailReport(lastPayload);
  }
}

function markEmailSuccess(target) {
  elements.emailStatusCard.className = 'email-status-card success';
  elements.emailStatusIcon.textContent = '✅';
  elements.emailStatusTitle.textContent = 'تم إرسال تقرير النتيجة بنجاح إلى الإيميل!';
  elements.emailStatusDesc.textContent = `تم تسليم جميع إجابات وتفاصيل الطالب إلى (${target}).`;
  showToast('وصل التقرير إلى الإيميل بنجاح!', '📬');
}

function formatTextReport(payload) {
  return `
=== تقرير نتيجة اختبار Vehicle Dynamics Applicant Quiz ===
AutoVroom Racing Cars Community — Innovation University
Eng. Anas Essam | Operation Manager

بيانات المتقدم:
- الاسم: ${payload.student.name}
- Student ID: ${payload.student.studentId}
- الكلية / التخصص: ${payload.student.faculty}
- الفرقة: ${payload.student.level}
- البريد الإلكتروني: ${payload.student.email}
- الهاتف / واتساب: ${payload.student.phone}
- تاريخ التسليم: ${payload.student.date}

النتيجة الكلية:
- الدرجة: ${payload.score} من ${payload.total} (${payload.percentage}%)
- الوقت المستغرق: ${payload.timeSpent}

تفاصيل الإجابات الـ 12:
${payload.answers.map(a => `
س${a.number}: ${a.question}
• إجابة الطالب: (${a.userChoiceLetter}) ${a.userAnswerText} [${a.isCorrect ? 'صحيحة ✔️' : 'خاطئة ❌'}]
${!a.isCorrect ? `• الإجابة الصحيحة: (${a.correctChoiceLetter}) ${a.correctAnswerText}\n` : ''}• السبب الهندسي: ${a.explanation}
`).join('\n')}
  `;
}

// --------------------------------------------------------------------------
// Admin Dashboard & Excel Export Engine (.xlsx & CSV)
// --------------------------------------------------------------------------
function openAdminDashboard() {
  renderAdminStats();
  renderAdminTable();
  elements.adminModal.classList.add('active');
}

function switchAdminTab(tab) {
  if (tab === 'submissions') {
    elements.tabSubmissionsBtn.classList.add('active');
    elements.tabGoogleSheetBtn.classList.remove('active');
    elements.tabSubmissionsContent.style.display = 'block';
    elements.tabGoogleSheetContent.style.display = 'none';
  } else {
    elements.tabSubmissionsBtn.classList.remove('active');
    elements.tabGoogleSheetBtn.classList.add('active');
    elements.tabSubmissionsContent.style.display = 'none';
    elements.tabGoogleSheetContent.style.display = 'block';
  }
}

function renderAdminStats() {
  const subs = state.submissions;
  elements.statTotalStudents.textContent = subs.length;

  if (subs.length === 0) {
    elements.statAvgScore.textContent = '0.0';
    elements.statPassRate.textContent = '0%';
    elements.statTopScore.textContent = '0 / 12';
    return;
  }

  const sumScores = subs.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const avg = (sumScores / subs.length).toFixed(1);
  const passed = subs.filter(s => (s.score || 0) >= 6).length;
  const passPct = Math.round((passed / subs.length) * 100);
  const maxScore = Math.max(...subs.map(s => s.score || 0));

  elements.statAvgScore.textContent = avg;
  elements.statPassRate.textContent = `${passPct}%`;
  elements.statTopScore.textContent = `${maxScore} / 12`;
}

function renderAdminTable() {
  const query = (elements.adminSearchInput.value || '').trim().toLowerCase();
  const tbody = elements.adminSubmissionsTbody;
  tbody.innerHTML = '';

  const filtered = state.submissions.filter(s => {
    if (!query) return true;
    return (s.name && s.name.toLowerCase().includes(query)) ||
           (s.studentId && s.studentId.toLowerCase().includes(query)) ||
           (s.faculty && s.faculty.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; color: var(--text-muted); padding: 30px;">
          لا توجد تسليمات مسجلة مطابقة للبحث حتى الآن.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((sub, idx) => {
    const tr = document.createElement('tr');
    const scoreClass = sub.score >= 10 ? 'high' : (sub.score >= 6 ? 'medium' : 'low');

    tr.innerHTML = `
      <td style="text-align: center; color: var(--text-muted);">${idx + 1}</td>
      <td style="font-weight: 700; color: #ffffff;">${sub.name}</td>
      <td style="font-family: var(--font-english); color: #c084fc;">${sub.studentId || '—'}</td>
      <td>${sub.faculty || '—'}</td>
      <td>${sub.level || '—'}</td>
      <td><span class="score-pill ${scoreClass}">${sub.score} / 12</span></td>
      <td style="font-weight: 700; font-family: var(--font-english);">${sub.percentage}%</td>
      <td style="color: var(--text-muted); font-size: 0.82rem;">${sub.timeSpent}</td>
      <td style="color: var(--text-muted); font-size: 0.82rem;">${sub.dateFormatted}</td>
      <td style="font-size: 0.82rem; color: #38bdf8;">${sub.email}</td>
      <td style="font-size: 0.82rem;">${sub.phone}</td>
      <td style="text-align: center;">
        <button class="btn btn-secondary btn-sm" onclick="window.viewSubmissionDetails('${sub.id}')" title="عرض تفاصيل الإجابات">
          🔍 عرض
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.viewSubmissionDetails = function(subId) {
  const sub = state.submissions.find(s => s.id === subId);
  if (!sub) return;

  const answersBrief = sub.answers.map(a => 
    `س${a.number}: إجابة (${a.userChoiceLetter}) [${a.isCorrect ? 'صحيحة ✔️' : 'خاطئة ❌ - الصحيحة ' + a.correctChoiceLetter}]`
  ).join('\n');

  alert(
    `📋 تفاصيل تسليم: ${sub.name}\n` +
    `رقم القيد: ${sub.studentId} | الكلية: ${sub.faculty}\n` +
    `الدرجة: ${sub.score} من 12 (${sub.percentage}%)\n` +
    `الوقت المستغرق: ${sub.timeSpent}\n\n` +
    `تفاصيل الأسئلة:\n${answersBrief}`
  );
};

function handleClearSubmissions() {
  if (confirm('هل أنت متأكد من مسح جميع سجلات الطلاب المخزنة محلياً؟ لن يمكنك التراجع.')) {
    state.submissions = [];
    localStorage.removeItem('autovroom_submissions');
    renderAdminStats();
    renderAdminTable();
    showToast('تم مسح جميع السجلات بنجاح', '🗑️');
  }
}

// --------------------------------------------------------------------------
// Export to Genuine Excel File (.xlsx) via SheetJS
// --------------------------------------------------------------------------
function exportToExcelXlsx() {
  if (state.submissions.length === 0) {
    showToast('لا توجد بيانات متاحة للتصدير حالياً!', '⚠️');
    return;
  }

  // Check if SheetJS library is loaded
  if (typeof XLSX === 'undefined') {
    showToast('جاري تصدير CSV كبديل فوري...', 'ℹ️');
    exportToCsv();
    return;
  }

  // Prepare full data rows including each question's answer
  const rows = state.submissions.map((sub, idx) => {
    const row = {
      'م': idx + 1,
      'تاريخ ووقت التسليم': sub.dateFormatted,
      'اسم الطالب': sub.name,
      'رقم القيد (Student ID)': sub.studentId,
      'الكلية / التخصص': sub.faculty,
      'الفرقة الدراسية': sub.level,
      'البريد الإلكتروني': sub.email,
      'رقم الواتساب': sub.phone,
      'الدرجة الكلية (من 12)': sub.score,
      'النسبة المئوية': `${sub.percentage}%`,
      'الوقت المستغرق': sub.timeSpent,
      'التقييم': sub.percentage >= 80 ? 'مؤهل متميز' : (sub.percentage >= 50 ? 'واعد ومبشر' : 'يحتاج تدريب')
    };

    // Append 12 questions status and letters
    if (sub.answers && sub.answers.length) {
      sub.answers.forEach(a => {
        row[`س${a.number}: ${a.question ? a.question.substring(0, 30) + '...' : ''}`] = 
          `${a.userChoiceLetter} (${a.isCorrect ? 'صحيحة' : 'خاطئة'})`;
      });
    }

    return row;
  });

  // Create Excel Worksheet & Workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set Right-to-Left (RTL) mode for Arabic
  worksheet['!views'] = [{ rightToLeft: true }];

  // Auto-fit column widths
  const colWidths = [
    { wch: 6 },  // م
    { wch: 22 }, // التاريخ
    { wch: 25 }, // الاسم
    { wch: 16 }, // ID
    { wch: 24 }, // الكلية
    { wch: 14 }, // الفرقة
    { wch: 28 }, // البريد
    { wch: 16 }, // الهاتف
    { wch: 18 }, // الدرجة
    { wch: 14 }, // النسبة
    { wch: 18 }, // الوقت
    { wch: 16 }  // التقييم
  ];
  for (let i = 1; i <= 12; i++) {
    colWidths.push({ wch: 18 });
  }
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'نتائج المتقدمين');

  // Trigger browser download
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `AutoVroom_Vehicle_Dynamics_Quiz_Results_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, fileName);

  showToast('تم تحميل شيت الإكسيل (.xlsx) بنجاح!', '📗');
}

// --------------------------------------------------------------------------
// Export to CSV with UTF-8 BOM
// --------------------------------------------------------------------------
function exportToCsv() {
  if (state.submissions.length === 0) {
    showToast('لا توجد بيانات متاحة للتصدير!', '⚠️');
    return;
  }

  const headers = [
    'م', 'تاريخ التسليم', 'اسم الطالب', 'رقم القيد', 'الكلية والتخصص', 'الفرقة',
    'البريد الإلكتروني', 'الهاتف', 'الدرجة (12)', 'النسبة المئوية', 'الوقت المستغرق',
    'س1', 'س2', 'س3', 'س4', 'س5', 'س6', 'س7', 'س8', 'س9', 'س10', 'س11', 'س12'
  ];

  const csvRows = [headers.join(',')];

  state.submissions.forEach((sub, idx) => {
    const row = [
      idx + 1,
      `"${sub.dateFormatted}"`,
      `"${sub.name}"`,
      `"${sub.studentId}"`,
      `"${sub.faculty}"`,
      `"${sub.level}"`,
      `"${sub.email}"`,
      `"${sub.phone}"`,
      sub.score,
      `"${sub.percentage}%"`,
      `"${sub.timeSpent}"`
    ];

    if (sub.answers && sub.answers.length) {
      sub.answers.forEach(a => {
        row.push(`"${a.userChoiceLetter} (${a.isCorrect ? 'صحيحة' : 'خاطئة'})"`);
      });
    }

    csvRows.push(row.join(','));
  });

  const csvContent = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AutoVroom_Quiz_Results_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('تم تصدير ملف CSV بنجاح!', '📄');
}

// --------------------------------------------------------------------------
// Google Sheets Real-Time Sync
// --------------------------------------------------------------------------
function handleSaveGoogleSheetWebhook() {
  const url = elements.inputGoogleSheetWebhook.value.trim();
  state.googleSheetWebhook = url;
  localStorage.setItem('autovroom_gsheet_webhook', url);
  showToast('تم حفظ رابط Google Sheet بنجاح!', '💾');
}

async function sendRowToGoogleSheet(record) {
  if (!state.googleSheetWebhook) return;
  try {
    await fetch(state.googleSheetWebhook, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    console.log('Row synced to Google Sheet successfully');
  } catch (err) {
    console.error('Failed to sync row to Google Sheet:', err);
  }
}

async function handleTestGoogleSheet() {
  const url = elements.inputGoogleSheetWebhook.value.trim();
  if (!url) {
    showToast('يرجى لصق رابط الـ Webhook أولاً!', '⚠️');
    return;
  }

  showToast('جاري إرسال صف تجريبي للشيت...', '⏳');
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toLocaleString('ar-EG'),
        name: 'طالب تجريبي (اختبار الربط)',
        studentId: '20249999',
        faculty: 'هندسة ميكاترونكس',
        level: 'Level 1',
        email: 'test@autovroom.com',
        phone: '01000000000',
        score: 12,
        percentage: 100,
        timeSpent: '10 دقائق',
        answers: state.questions.map(q => ({
          userChoiceLetter: 'A',
          isCorrect: true
        }))
      })
    });
    showToast('تم إرسال الصف التجريبي لـ Google Sheet بنجاح! افتح الشيت للتأكد.', '✅');
  } catch (err) {
    console.error(err);
    showToast('حدث خطأ أثناء الإرسال للشيت', '❌');
  }
}

function handleCopyGoogleScript() {
  const code = document.getElementById('googleScriptCodeSnippet').innerText;
  navigator.clipboard.writeText(code).then(() => {
    showToast('تم نسخ كود Google Apps Script بنجاح!', '📋');
  });
}

// --------------------------------------------------------------------------
// Educational Review Sheet
// --------------------------------------------------------------------------
function renderReviewSheet(answers) {
  const container = elements.answersReviewContainer;
  container.innerHTML = '';

  const filtered = answers.filter(a => {
    if (state.reviewFilter === 'correct') return a.isCorrect;
    if (state.reviewFilter === 'wrong') return !a.isCorrect;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 24px;">لا توجد إجابات مطابقة لهذا الفلتر.</p>`;
    return;
  }

  filtered.forEach(a => {
    const item = document.createElement('div');
    item.className = `review-item ${a.isCorrect ? 'is-correct' : 'is-incorrect'}`;

    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span class="q-number-pill">Question ${a.number}</span>
        <span style="font-weight: 800; font-size: 0.9rem; color: ${a.isCorrect ? 'var(--success)' : 'var(--danger)'};">
          ${a.isCorrect ? '✔️ إجابة صحيحة (+1)' : '❌ إجابة خاطئة (0)'}
        </span>
      </div>

      <div style="font-weight: 700; font-size: 1.05rem; color: #ffffff; margin-bottom: 4px; direction: ltr; text-align: left; font-family: var(--font-english);">
        ${a.question}
      </div>
      <div style="font-size: 0.88rem; color: var(--text-purple); margin-bottom: 12px;">
        ${a.questionAr}
      </div>

      <div style="background: #110c29; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 0.92rem;">
        <div style="margin-bottom: 6px;">
          <span style="color: var(--text-muted);">إجابة الطالب:</span> 
          <strong style="color: ${a.isCorrect ? 'var(--success)' : 'var(--danger)'};">(${a.userChoiceLetter}) ${a.userAnswerText}</strong>
        </div>
        ${!a.isCorrect ? `
          <div style="color: var(--success); font-weight: 700;">
            <span style="color: var(--text-muted); font-weight: normal;">الإجابة النموذجية:</span> (${a.correctChoiceLetter}) ${a.correctAnswerText}
          </div>
        ` : ''}
      </div>

      <div class="review-explanation">
        <div style="font-weight: 800; color: #c084fc; margin-bottom: 4px;">💡 السبب الهندسي والتحليل (Reason):</div>
        <div style="direction: ltr; text-align: left; font-family: var(--font-english); font-size: 0.9rem; margin-bottom: 4px; color: #f1f5f9;">
          ${a.explanation}
        </div>
        <div style="font-size: 0.85rem; color: #cbd5e1;">
          ${a.explanationAr}
        </div>
      </div>
    `;

    container.appendChild(item);
  });
}

function setReviewFilter(filter) {
  state.reviewFilter = filter;
  elements.filterAll.classList.toggle('active', filter === 'all');
  elements.filterCorrect.classList.toggle('active', filter === 'correct');
  elements.filterWrong.classList.toggle('active', filter === 'wrong');

  if (lastPayload && lastPayload.answers) {
    renderReviewSheet(lastPayload.answers);
  }
}

// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------
function copySummaryToClipboard() {
  if (!lastPayload) return;
  const text = formatTextReport(lastPayload);
  navigator.clipboard.writeText(text).then(() => {
    showToast('تم نسخ تقرير النتيجة إلى الحافظة بنجاح!', '📋');
  }).catch(() => {
    showToast('تعذر النسخ تلقائياً', '⚠️');
  });
}

function handleSaveSettings() {
  const newEmail = elements.inputAdminEmail.value.trim();
  const newKey = elements.inputWeb3Key.value.trim();
  const newHook = elements.inputWebhookUrl.value.trim();

  if (newEmail) {
    state.adminEmail = newEmail;
    localStorage.setItem('autovroom_admin_email', newEmail);
  }
  if (newKey) {
    state.web3Key = newKey;
    localStorage.setItem('autovroom_web3_key', newKey);
  }
  if (newHook !== undefined) {
    state.webhookUrl = newHook;
    localStorage.setItem('autovroom_webhook_url', newHook);
  }

  elements.settingsModal.classList.remove('active');
  showToast('تم حفظ إعدادات البريد بنجاح!', '⚙️');
}

function showToast(msg, icon = '🚀') {
  elements.toastIcon.textContent = icon;
  elements.toastMsg.textContent = msg;
  elements.toastNotification.classList.add('show');
  setTimeout(() => {
    elements.toastNotification.classList.remove('show');
  }, 3500);
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#a855f7', '#ec4899', '#3b82f6', '#10b981']
    });
  }
}

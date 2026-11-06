/**
 * Fliqlo Modern Web Flip Clock
 * Vanilla JavaScript Engine
 */

(function () {
  'use strict';

  // --- VARSAYILAN AYARLAR VE DURUM (STATE) ---
  const DEFAULT_SETTINGS = {
    format: '12',           // '12' veya '24'
    showSeconds: false,     // Saniye kartı
    showDate: true,         // Tarih gösterimi
    scale: 100,             // %50 - %160
    theme: 'theme-fliqlo-dark',
    font: 'font-inter',     // Yazı tipi
    soundEnabled: false,    // Mekanik klik sesi
    soundVolume: 50,        // Ses seviyesi (%)
    wakeLockEnabled: false, // Ekranı açık tut (Wake Lock)
    pomodoroWorkMin: 25,    // Pomodoro çalışma süresi (dk)
    pomodoroBreakMin: 5     // Pomodoro mola süresi (dk)
  };

  let state = { ...DEFAULT_SETTINGS };

  // --- DOM ELEMENTLERİ ---
  const body = document.getElementById('body');
  const clockContainer = document.getElementById('clockContainer');
  const dateDisplay = document.getElementById('dateDisplay');
  const dateDayName = document.getElementById('dateDayName');
  const dateFull = document.getElementById('dateFull');
  const ampmBadge = document.getElementById('ampmBadge');

  const unitHours = document.getElementById('unitHours');
  const unitMinutes = document.getElementById('unitMinutes');
  const unitSeconds = document.getElementById('unitSeconds');

  // Kontrol Butonları
  const btnToggleWakeLock = document.getElementById('btnToggleWakeLock');
  const iconWakeLockOn = btnToggleWakeLock ? btnToggleWakeLock.querySelector('.icon-wakelock-on') : null;
  const iconWakeLockOff = btnToggleWakeLock ? btnToggleWakeLock.querySelector('.icon-wakelock-off') : null;
  const btnToggleSound = document.getElementById('btnToggleSound');
  const iconSoundOn = btnToggleSound.querySelector('.icon-sound-on');
  const iconSoundOff = btnToggleSound.querySelector('.icon-sound-off');
  const btnToggleFullscreen = document.getElementById('btnToggleFullscreen');
  const btnToggleSettings = document.getElementById('btnToggleSettings');

  // Ayar Modalı
  const settingsPanel = document.getElementById('settingsPanel');
  const settingsBackdrop = document.getElementById('settingsBackdrop');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const formatControl = document.getElementById('formatControl');
  const toggleSeconds = document.getElementById('toggleSeconds');
  const toggleDate = document.getElementById('toggleDate');
  const toggleWakeLock = document.getElementById('toggleWakeLock');
  const toggleSound = document.getElementById('toggleSound');
  const volumeGroup = document.getElementById('volumeGroup');
  const soundVolume = document.getElementById('soundVolume');
  const volumeVal = document.getElementById('volumeVal');
  const clockScale = document.getElementById('clockScale');
  const scaleVal = document.getElementById('scaleVal');
  const themeGrid = document.getElementById('themeGrid');
  const fontGrid = document.getElementById('fontGrid');

  // Mod Seçici & Aksiyonlar (Saat / Kronometre / Zamanlayıcı / Pomodoro)
  const modeNavigation = document.getElementById('modeNavigation');
  const modeBtnClock = document.getElementById('modeBtnClock');
  const modeBtnStopwatch = document.getElementById('modeBtnStopwatch');
  const modeBtnTimer = document.getElementById('modeBtnTimer');
  const modeBtnPomodoro = document.getElementById('modeBtnPomodoro');

  const modeActionBar = document.getElementById('modeActionBar');
  const stopwatchControls = document.getElementById('stopwatchControls');
  const btnStopwatchToggle = document.getElementById('btnStopwatchToggle');
  const stopwatchToggleText = document.getElementById('stopwatchToggleText');
  const btnStopwatchLap = document.getElementById('btnStopwatchLap');
  const btnStopwatchReset = document.getElementById('btnStopwatchReset');

  const timerControls = document.getElementById('timerControls');
  const btnTimerToggle = document.getElementById('btnTimerToggle');
  const timerToggleText = document.getElementById('timerToggleText');
  const btnOpenTimerSetup = document.getElementById('btnOpenTimerSetup');
  const btnTimerReset = document.getElementById('btnTimerReset');

  const pomodoroControls = document.getElementById('pomodoroControls');
  const btnPomodoroToggle = document.getElementById('btnPomodoroToggle');
  const pomodoroToggleText = document.getElementById('pomodoroToggleText');
  const btnPomodoroSkip = document.getElementById('btnPomodoroSkip');
  const pomodoroSkipText = document.getElementById('pomodoroSkipText');
  const btnOpenPomodoroSetup = document.getElementById('btnOpenPomodoroSetup');
  const btnPomodoroReset = document.getElementById('btnPomodoroReset');

  const pomodoroTracker = document.getElementById('pomodoroTracker');
  const pomodoroBadge = document.getElementById('pomodoroBadge');
  const pomodoroCycleText = document.getElementById('pomodoroCycleText');
  const pomodoroDots = document.getElementById('pomodoroDots');

  const timerPresets = document.getElementById('timerPresets');
  const lapsContainer = document.getElementById('lapsContainer');
  const lapCount = document.getElementById('lapCount');
  const btnClearLaps = document.getElementById('btnClearLaps');
  const lapsList = document.getElementById('lapsList');

  // Zamanlayıcı Kurma Modalı
  const timerModal = document.getElementById('timerModal');
  const timerModalBackdrop = document.getElementById('timerModalBackdrop');
  const btnCloseTimerModal = document.getElementById('btnCloseTimerModal');
  const timerInputHours = document.getElementById('timerInputHours');
  const timerInputMinutes = document.getElementById('timerInputMinutes');
  const timerInputSeconds = document.getElementById('timerInputSeconds');
  const btnSaveTimer = document.getElementById('btnSaveTimer');

  // Pomodoro Kurma Modalı
  const pomodoroModal = document.getElementById('pomodoroModal');
  const pomodoroModalBackdrop = document.getElementById('pomodoroModalBackdrop');
  const btnClosePomodoroModal = document.getElementById('btnClosePomodoroModal');
  const pomodoroInputWork = document.getElementById('pomodoroInputWork');
  const pomodoroInputBreak = document.getElementById('pomodoroInputBreak');
  const btnStartPomodoroWithSetup = document.getElementById('btnStartPomodoroWithSetup');

  // Zamanlayıcı Alarm Overlay
  const timerAlarmOverlay = document.getElementById('timerAlarmOverlay');
  const btnStopAlarm = document.getElementById('btnStopAlarm');
  const alarmDetail = document.getElementById('alarmDetail');

  // Pomodoro Aşama Bildirimi Overlay
  const pomodoroAlertOverlay = document.getElementById('pomodoroAlertOverlay');
  const pomodoroAlertIcon = document.getElementById('pomodoroAlertIcon');
  const pomodoroAlertTitle = document.getElementById('pomodoroAlertTitle');
  const pomodoroAlertDesc = document.getElementById('pomodoroAlertDesc');
  const btnPomodoroAlertNext = document.getElementById('btnPomodoroAlertNext');
  const btnPomodoroAlertDismiss = document.getElementById('btnPomodoroAlertDismiss');

  // --- MOD & SAAT DURUMLARI (STATE) ---
  let currentMode = 'clock'; // 'clock' | 'stopwatch' | 'timer' | 'pomodoro'

  // Kronometre Durumu
  let stopwatchRunning = false;
  let stopwatchStartTime = 0;
  let stopwatchElapsed = 0;
  let stopwatchLaps = [];

  // Zamanlayıcı Durumu
  let timerDuration = 300; // Varsayılan 5 dakika
  let timerRemaining = 300;
  let timerRunning = false;
  let timerEndTime = 0;
  let alarmIntervalId = null;

  // Pomodoro Durumu
  let pomodoroRunning = false;
  let pomodoroPhase = 'work'; // 'work' | 'break'
  let pomodoroWorkDuration = (DEFAULT_SETTINGS.pomodoroWorkMin || 25) * 60;
  let pomodoroBreakDuration = (DEFAULT_SETTINGS.pomodoroBreakMin || 5) * 60;
  let pomodoroRemaining = pomodoroWorkDuration;
  let pomodoroEndTime = 0;
  let pomodoroCompletedCycles = 0;
  let pomodoroHasConfiguredOnce = false;

  // --- İZİN VERİLEN DEĞERLER (WHITELIST) ---
  const ALLOWED_THEMES = [
    'theme-fliqlo-dark',
    'theme-fliqlo-light',
    'theme-fliqlo-amber',
    'theme-fliqlo-neon',
    'theme-fliqlo-nord'
  ];

  const ALLOWED_FONTS = [
    'font-inter',
    'font-bebas',
    'font-oswald',
    'font-mono',
    'font-orbitron',
    'font-playfair',
    'font-space',
    'font-syne'
  ];

  // --- AYARLARI YÜKLE / KAYDET (localStorage) ---
  function loadSettings() {
    try {
      const saved = localStorage.getItem('fliqlo_web_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.format === '12' || parsed.format === '24') {
            state.format = parsed.format;
          }
          if (typeof parsed.showSeconds === 'boolean') {
            state.showSeconds = parsed.showSeconds;
          }
          if (typeof parsed.showDate === 'boolean') {
            state.showDate = parsed.showDate;
          }
          if (typeof parsed.scale === 'number' && !isNaN(parsed.scale)) {
            state.scale = Math.max(50, Math.min(160, Math.round(parsed.scale)));
          }
          if (ALLOWED_THEMES.includes(parsed.theme)) {
            state.theme = parsed.theme;
          }
          if (ALLOWED_FONTS.includes(parsed.font)) {
            state.font = parsed.font;
          }
          if (typeof parsed.soundEnabled === 'boolean') {
            state.soundEnabled = parsed.soundEnabled;
          }
          if (typeof parsed.soundVolume === 'number' && !isNaN(parsed.soundVolume)) {
            state.soundVolume = Math.max(0, Math.min(100, Math.round(parsed.soundVolume)));
          }
          if (typeof parsed.wakeLockEnabled === 'boolean') {
            state.wakeLockEnabled = parsed.wakeLockEnabled;
          }
          if (typeof parsed.pomodoroWorkMin === 'number' && !isNaN(parsed.pomodoroWorkMin)) {
            state.pomodoroWorkMin = Math.max(1, Math.min(180, Math.round(parsed.pomodoroWorkMin)));
          }
          if (typeof parsed.pomodoroBreakMin === 'number' && !isNaN(parsed.pomodoroBreakMin)) {
            state.pomodoroBreakMin = Math.max(1, Math.min(60, Math.round(parsed.pomodoroBreakMin)));
          }
        }
      }
      pomodoroWorkDuration = (state.pomodoroWorkMin || 25) * 60;
      pomodoroBreakDuration = (state.pomodoroBreakMin || 5) * 60;
      pomodoroRemaining = pomodoroWorkDuration;
    } catch (e) {
      console.warn('Ayarlar yüklenemedi, varsayılanlar kullanılıyor:', e);
      state = { ...DEFAULT_SETTINGS };
      pomodoroWorkDuration = 25 * 60;
      pomodoroBreakDuration = 5 * 60;
      pomodoroRemaining = pomodoroWorkDuration;
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem('fliqlo_web_settings', JSON.stringify(state));
    } catch (e) {
      console.warn('Ayarlar kaydedilemedi:', e);
    }
  }

  // --- SES SENTEZLEYİCİ (WEB AUDIO API) ---
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Gerçekçi mekanik split-flap yaprak düşme sesi sentezleyici
  function playMechanicalFlapSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const vol = (state.soundVolume / 100) * 0.45;

      // 1. Plastik kanat vuruş gürültüsü (Filtered Noise Burst)
      const bufferSize = audioCtx.sampleRate * 0.035; // 35ms burst
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;

      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(vol * 1.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noiseSource.start(now);

      // 2. Mekanik gövde tok klik vuruşu (Resonant Thud)
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.045);

      oscGain.gain.setValueAtTime(vol * 0.8, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (err) {
      console.error('Ses çalma hatası:', err);
    }
  }

  // --- FLIP KART KONTROLCÜSÜ ---
  class FlipUnit {
    constructor(element) {
      this.element = element;
      this.card = element.querySelector('.flip-card');
      this.topFace = element.querySelector('.card-face.top .digit');
      this.bottomFace = element.querySelector('.card-face.bottom .digit');
      this.flapTop = element.querySelector('.card-flap.flap-top .digit');
      this.flapBottom = element.querySelector('.card-flap.flap-bottom .digit');
      
      this.currentVal = '';
      this.animationTimer = null;
    }

    setInitialValue(val) {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }
      this.currentVal = val;
      this.topFace.textContent = val;
      this.bottomFace.textContent = val;
      this.flapTop.textContent = val;
      this.flapBottom.textContent = val;
      this.element.classList.remove('flipping');
    }

    update(nextVal, triggerSound = true) {
      if (nextVal === this.currentVal) return;

      const prevVal = this.currentVal;
      this.currentVal = nextVal;

      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }

      // Animasyon için yüzleri hazırla
      this.topFace.textContent = nextVal;
      this.bottomFace.textContent = prevVal;
      this.flapTop.textContent = prevVal;
      this.flapBottom.textContent = nextVal;

      // Animasyon sınıfını yeniden tetikle
      this.element.classList.remove('flipping');
      void this.element.offsetWidth; // Reflow zorla
      this.element.classList.add('flipping');

      if (triggerSound) {
        playMechanicalFlapSound();
      }

      // Animasyon bittiğinde (500ms) TÜM yüzleri yeni değere eşitle ve temizle
      this.animationTimer = setTimeout(() => {
        this.topFace.textContent = nextVal;
        this.bottomFace.textContent = nextVal;
        this.flapTop.textContent = nextVal;
        this.flapBottom.textContent = nextVal;
        this.element.classList.remove('flipping');
        this.animationTimer = null;
      }, 500);
    }
  }

  const hoursUnit = new FlipUnit(unitHours);
  const minutesUnit = new FlipUnit(unitMinutes);
  const secondsUnit = new FlipUnit(unitSeconds);

  // --- ZAMAN & TARİH HESAPLAMA ---
  const MONTHS_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const DAYS_TR = [
    'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
  ];

  let isInitialized = false;

  function updateClock() {
    if (currentMode !== 'clock') return;

    const now = new Date();

    let rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();

    let displayHours = rawHours;
    let ampmText = '';

    if (state.format === '12') {
      ampmText = rawHours >= 12 ? 'PM' : 'AM';
      displayHours = rawHours % 12;
      if (displayHours === 0) displayHours = 12;
      ampmBadge.classList.remove('hidden');
      ampmBadge.textContent = ampmText;
    } else {
      ampmBadge.classList.add('hidden');
    }

    // İki basamaklı string formatları
    const hoursStr = String(displayHours).padStart(2, '0');
    const minutesStr = String(rawMinutes).padStart(2, '0');
    const secondsStr = String(rawSeconds).padStart(2, '0');

    if (!isInitialized) {
      hoursUnit.setInitialValue(hoursStr);
      minutesUnit.setInitialValue(minutesStr);
      secondsUnit.setInitialValue(secondsStr);
      isInitialized = true;
    } else {
      hoursUnit.update(hoursStr);
      minutesUnit.update(minutesStr);
      if (state.showSeconds) {
        secondsUnit.update(secondsStr);
      }
    }

    // Tarih Güncellemesi
    if (state.showDate) {
      const dayName = DAYS_TR[now.getDay()];
      const dayNum = now.getDate();
      const monthName = MONTHS_TR[now.getMonth()];
      const year = now.getFullYear();

      dateDayName.textContent = dayName;
      dateFull.textContent = `${dayNum} ${monthName} ${year}`;
    }
  }

  // --- MOD GEÇİŞ YÖNETİMİ ---
  function setMode(mode) {
    if (currentMode === mode) return;
    initAudioContext();
    playMechanicalFlapSound();
    currentMode = mode;

    // Mod butonlarının aktifliğini güncelle
    [modeBtnClock, modeBtnStopwatch, modeBtnTimer, modeBtnPomodoro].forEach(btn => {
      if (btn) btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    if (mode === 'clock') {
      modeActionBar.classList.add('hidden');
      stopwatchControls.classList.add('hidden');
      timerControls.classList.add('hidden');
      pomodoroControls.classList.add('hidden');
      timerPresets.classList.add('hidden');
      lapsContainer.classList.add('hidden');
      pomodoroTracker.classList.add('hidden');

      if (state.showSeconds) {
        unitSeconds.classList.remove('hidden');
        body.classList.add('has-seconds');
      } else {
        unitSeconds.classList.add('hidden');
        body.classList.remove('has-seconds');
      }

      dateDisplay.classList.toggle('hidden', !state.showDate);
      isInitialized = false;
      updateClock();
    } else if (mode === 'stopwatch') {
      modeActionBar.classList.remove('hidden');
      stopwatchControls.classList.remove('hidden');
      timerControls.classList.add('hidden');
      pomodoroControls.classList.add('hidden');
      timerPresets.classList.add('hidden');
      lapsContainer.classList.remove('hidden');
      pomodoroTracker.classList.add('hidden');

      unitSeconds.classList.remove('hidden');
      body.classList.add('has-seconds');
      ampmBadge.classList.add('hidden');
      dateDisplay.classList.remove('hidden');

      updateStopwatchDisplay(true);
      renderLaps();
    } else if (mode === 'timer') {
      modeActionBar.classList.remove('hidden');
      stopwatchControls.classList.add('hidden');
      timerControls.classList.remove('hidden');
      pomodoroControls.classList.add('hidden');
      timerPresets.classList.remove('hidden');
      lapsContainer.classList.add('hidden');
      pomodoroTracker.classList.add('hidden');

      unitSeconds.classList.remove('hidden');
      body.classList.add('has-seconds');
      ampmBadge.classList.add('hidden');
      dateDisplay.classList.remove('hidden');

      updateTimerDisplay(true);
    } else if (mode === 'pomodoro') {
      modeActionBar.classList.remove('hidden');
      stopwatchControls.classList.add('hidden');
      timerControls.classList.add('hidden');
      pomodoroControls.classList.remove('hidden');
      timerPresets.classList.add('hidden');
      lapsContainer.classList.add('hidden');
      pomodoroTracker.classList.remove('hidden');

      unitSeconds.classList.remove('hidden');
      body.classList.add('has-seconds');
      ampmBadge.classList.add('hidden');
      dateDisplay.classList.remove('hidden');

      updatePomodoroDisplay(true);
      renderPomodoroTracker();

      // Kullanıcı ilk kez Pomodoro'ya geçtiğinde veya henüz başlatmadıysa süreyi sormak için modalı aç
      if (!pomodoroHasConfiguredOnce && !pomodoroRunning) {
        openPomodoroSetup();
      }
    }
  }

  // --- KRONOMETRE MOTORU ---
  function updateStopwatchDisplay(initial = false) {
    const elapsed = stopwatchRunning ? (performance.now() - stopwatchStartTime) : stopwatchElapsed;
    const totalSec = Math.floor(elapsed / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    if (initial) {
      hoursUnit.setInitialValue(hStr);
      minutesUnit.setInitialValue(mStr);
      secondsUnit.setInitialValue(sStr);
    } else {
      hoursUnit.update(hStr);
      minutesUnit.update(mStr);
      secondsUnit.update(sStr);
    }

    if (currentMode === 'stopwatch') {
      dateDayName.textContent = 'KRONOMETRE';
      if (stopwatchRunning) {
        dateFull.textContent = 'Çalışıyor...';
      } else if (elapsed > 0) {
        dateFull.textContent = 'Duraklatıldı';
      } else {
        dateFull.textContent = 'Hazır (00:00:00)';
      }
    }
  }

  function toggleStopwatch() {
    initAudioContext();
    if (!stopwatchRunning) {
      stopwatchStartTime = performance.now() - stopwatchElapsed;
      stopwatchRunning = true;
      btnStopwatchToggle.querySelector('.icon-play').classList.add('hidden');
      btnStopwatchToggle.querySelector('.icon-pause').classList.remove('hidden');
      stopwatchToggleText.textContent = 'Durdur';
      if (currentMode === 'stopwatch') {
        dateFull.textContent = 'Çalışıyor...';
      }
    } else {
      stopwatchElapsed = performance.now() - stopwatchStartTime;
      stopwatchRunning = false;
      btnStopwatchToggle.querySelector('.icon-play').classList.remove('hidden');
      btnStopwatchToggle.querySelector('.icon-pause').classList.add('hidden');
      stopwatchToggleText.textContent = 'Devam Et';
      if (currentMode === 'stopwatch') {
        dateFull.textContent = 'Duraklatıldı';
      }
    }
  }

  function resetStopwatch() {
    initAudioContext();
    stopwatchRunning = false;
    stopwatchElapsed = 0;
    stopwatchStartTime = 0;
    stopwatchLaps = [];
    btnStopwatchToggle.querySelector('.icon-play').classList.remove('hidden');
    btnStopwatchToggle.querySelector('.icon-pause').classList.add('hidden');
    stopwatchToggleText.textContent = 'Başlat';
    renderLaps();
    if (currentMode === 'stopwatch') {
      updateStopwatchDisplay(true);
    }
  }

  function formatTimeMs(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    const p = (n) => String(n).padStart(2, '0');
    if (h > 0) {
      return `${p(h)}:${p(m)}:${p(s)}.${p(cs)}`;
    }
    return `${p(m)}:${p(s)}.${p(cs)}`;
  }

  function addStopwatchLap() {
    const currentElapsed = stopwatchRunning ? (performance.now() - stopwatchStartTime) : stopwatchElapsed;
    if (currentElapsed === 0) return;
    initAudioContext();
    playMechanicalFlapSound();

    const prevTotal = stopwatchLaps.length > 0 ? stopwatchLaps[0].totalMs : 0;
    const lapDuration = currentElapsed - prevTotal;

    const lapNum = stopwatchLaps.length + 1;
    stopwatchLaps.unshift({
      num: lapNum,
      lapMs: lapDuration,
      totalMs: currentElapsed
    });

    renderLaps();
  }

  function renderLaps() {
    lapCount.textContent = stopwatchLaps.length;
    lapsList.textContent = ''; // Güvenli DOM temizliği
    if (stopwatchLaps.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.cssText = 'text-align:center;color:var(--ui-text-muted);padding:8px 0;font-size:11px;';
      emptyDiv.textContent = 'Henüz tur kaydedilmedi';
      lapsList.appendChild(emptyDiv);
      return;
    }

    const fragment = document.createDocumentFragment();
    stopwatchLaps.forEach(lap => {
      const item = document.createElement('div');
      item.className = 'lap-item';

      const numSpan = document.createElement('span');
      numSpan.className = 'lap-num';
      numSpan.textContent = `Tur ${lap.num}`;

      const splitSpan = document.createElement('span');
      splitSpan.className = 'lap-split';
      splitSpan.textContent = `+${formatTimeMs(lap.lapMs)}`;

      const totalSpan = document.createElement('span');
      totalSpan.className = 'lap-total';
      totalSpan.textContent = formatTimeMs(lap.totalMs);

      item.appendChild(numSpan);
      item.appendChild(splitSpan);
      item.appendChild(totalSpan);
      fragment.appendChild(item);
    });
    lapsList.appendChild(fragment);
  }

  // --- ZAMANLAYICI (COUNTDOWN TIMER) MOTORU ---
  function updateTimerDisplay(initial = false) {
    const remaining = timerRunning ? Math.max(0, Math.ceil((timerEndTime - performance.now()) / 1000)) : timerRemaining;
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    if (initial) {
      hoursUnit.setInitialValue(hStr);
      minutesUnit.setInitialValue(mStr);
      secondsUnit.setInitialValue(sStr);
    } else {
      hoursUnit.update(hStr);
      minutesUnit.update(mStr);
      secondsUnit.update(sStr);
    }

    if (currentMode === 'timer') {
      dateDayName.textContent = 'ZAMANLAYICI';
      if (timerRunning) {
        dateFull.textContent = 'Geri Sayım...';
      } else if (remaining === 0) {
        dateFull.textContent = 'Süre Doldu!';
      } else if (remaining < timerDuration) {
        dateFull.textContent = 'Duraklatıldı';
      } else {
        dateFull.textContent = `Hazır (${hStr}:${mStr}:${sStr})`;
      }
    }
  }

  function setTimerDuration(seconds, autoStart = false) {
    stopAlarm();
    timerRunning = false;
    timerDuration = Math.max(1, seconds);
    timerRemaining = timerDuration;

    btnTimerToggle.querySelector('.icon-play').classList.remove('hidden');
    btnTimerToggle.querySelector('.icon-pause').classList.add('hidden');
    timerToggleText.textContent = 'Başlat';

    // Aktif preset butonunu işaretle
    const presetPills = timerPresets.querySelectorAll('.preset-pill');
    presetPills.forEach(pill => {
      pill.classList.toggle('active', Number(pill.dataset.seconds) === seconds);
    });

    if (currentMode === 'timer') {
      updateTimerDisplay(true);
    }

    if (autoStart) {
      toggleTimer();
    }
  }

  function toggleTimer() {
    initAudioContext();
    stopAlarm();
    if (!timerRunning) {
      if (timerRemaining <= 0) {
        timerRemaining = timerDuration;
      }
      timerEndTime = performance.now() + timerRemaining * 1000;
      timerRunning = true;
      btnTimerToggle.querySelector('.icon-play').classList.add('hidden');
      btnTimerToggle.querySelector('.icon-pause').classList.remove('hidden');
      timerToggleText.textContent = 'Durdur';
      if (currentMode === 'timer') {
        dateFull.textContent = 'Geri Sayım...';
      }
    } else {
      timerRemaining = Math.max(0, Math.ceil((timerEndTime - performance.now()) / 1000));
      timerRunning = false;
      btnTimerToggle.querySelector('.icon-play').classList.remove('hidden');
      btnTimerToggle.querySelector('.icon-pause').classList.add('hidden');
      timerToggleText.textContent = 'Devam Et';
      if (currentMode === 'timer') {
        dateFull.textContent = 'Duraklatıldı';
      }
    }
  }

  function resetTimer() {
    initAudioContext();
    stopAlarm();
    timerRunning = false;
    timerRemaining = timerDuration;
    btnTimerToggle.querySelector('.icon-play').classList.remove('hidden');
    btnTimerToggle.querySelector('.icon-pause').classList.add('hidden');
    timerToggleText.textContent = 'Başlat';
    if (currentMode === 'timer') {
      updateTimerDisplay(true);
    }
  }

  function openTimerSetup() {
    const curH = Math.floor(timerDuration / 3600);
    const curM = Math.floor((timerDuration % 3600) / 60);
    const curS = timerDuration % 60;
    timerInputHours.value = curH;
    timerInputMinutes.value = curM;
    timerInputSeconds.value = curS;
    timerModal.classList.add('active');
    timerModalBackdrop.classList.add('active');
  }

  function closeTimerSetup() {
    timerModal.classList.remove('active');
    timerModalBackdrop.classList.remove('active');
  }

  // --- ALARM YÖNETİMİ ---
  function triggerAlarm() {
    timerRunning = false;
    timerRemaining = 0;
    btnTimerToggle.querySelector('.icon-play').classList.remove('hidden');
    btnTimerToggle.querySelector('.icon-pause').classList.add('hidden');
    timerToggleText.textContent = 'Başlat';

    if (currentMode === 'timer') {
      updateTimerDisplay();
      dateFull.textContent = 'Süre Doldu!';
    }

    alarmDetail.textContent = `${Math.floor(timerDuration / 60)} dakikalık zamanlayıcı tamamlandı.`;
    timerAlarmOverlay.classList.remove('hidden');
    playAlarmChime();

    if (alarmIntervalId) clearInterval(alarmIntervalId);
    alarmIntervalId = setInterval(() => {
      playAlarmChime();
    }, 1500);
  }

  function stopAlarm() {
    if (alarmIntervalId) {
      clearInterval(alarmIntervalId);
      alarmIntervalId = null;
    }
    timerAlarmOverlay.classList.add('hidden');
  }

  function playAlarmChime() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const vol = (state.soundVolume / 100) * 0.45;
      const tones = [
        { freq: 880, start: 0, dur: 0.15 },
        { freq: 1174.66, start: 0.16, dur: 0.18 },
        { freq: 1318.51, start: 0.35, dur: 0.28 }
      ];

      tones.forEach(t => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(t.freq, now + t.start);
        gain.gain.setValueAtTime(vol, now + t.start);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t.start + t.dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + t.start);
        osc.stop(now + t.start + t.dur + 0.05);
      });
    } catch (e) {
      console.warn('Alarm sesi çalınamadı:', e);
    }
  }

  // --- POMODORO MOTORU ---
  function updatePomodoroDisplay(initial = false) {
    const remaining = pomodoroRunning ? Math.max(0, Math.ceil((pomodoroEndTime - performance.now()) / 1000)) : pomodoroRemaining;
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    if (initial) {
      hoursUnit.setInitialValue(hStr);
      minutesUnit.setInitialValue(mStr);
      secondsUnit.setInitialValue(sStr);
    } else {
      hoursUnit.update(hStr);
      minutesUnit.update(mStr);
      secondsUnit.update(sStr);
    }

    if (currentMode === 'pomodoro') {
      const minText = Math.floor(remaining / 60);
      const secText = remaining % 60;
      if (pomodoroPhase === 'work') {
        dateDayName.textContent = '🎯 Odaklanma Zamanı (Ders)';
        dateFull.textContent = pomodoroRunning
          ? `Pomodoro #${pomodoroCompletedCycles + 1} • Kalan: ${minText} dk ${secText} sn`
          : (pomodoroRemaining === pomodoroWorkDuration ? `Hazır: ${Math.round(pomodoroWorkDuration / 60)} Dakika Ders` : 'Duraklatıldı');
      } else {
        dateDayName.textContent = '☕ Mola Zamanı (Dinlenme)';
        dateFull.textContent = pomodoroRunning
          ? `Mola #${pomodoroCompletedCycles} • Kalan: ${minText} dk ${secText} sn`
          : 'Duraklatıldı';
      }
    }
  }

  function renderPomodoroTracker() {
    if (!pomodoroTracker) return;
    if (pomodoroPhase === 'work') {
      pomodoroBadge.className = 'pomodoro-badge badge-work';
      pomodoroBadge.textContent = '🎯 DERS ZAMANI';
      pomodoroSkipText.textContent = 'Molaya Geç';
    } else {
      pomodoroBadge.className = 'pomodoro-badge badge-break';
      pomodoroBadge.textContent = '☕ MOLA ZAMANI';
      pomodoroSkipText.textContent = 'Derse Geç';
    }

    pomodoroCycleText.textContent = `Pomodoro #${pomodoroCompletedCycles + 1}`;

    if (pomodoroDots) {
      const curr = pomodoroCompletedCycles % 4;
      const dots = pomodoroDots.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.className = 'dot';
        if (idx < curr) {
          dot.classList.add('completed');
        } else if (idx === curr) {
          dot.classList.add('current');
        }
      });
    }
  }

  function togglePomodoro() {
    initAudioContext();
    stopPomodoroAlert();
    if (!pomodoroRunning) {
      if (pomodoroRemaining <= 0) {
        pomodoroRemaining = pomodoroPhase === 'work' ? pomodoroWorkDuration : pomodoroBreakDuration;
      }
      pomodoroEndTime = performance.now() + pomodoroRemaining * 1000;
      pomodoroRunning = true;
      btnPomodoroToggle.querySelector('.icon-play').classList.add('hidden');
      btnPomodoroToggle.querySelector('.icon-pause').classList.remove('hidden');
      pomodoroToggleText.textContent = 'Durdur';
      if (currentMode === 'pomodoro') {
        updatePomodoroDisplay();
      }
    } else {
      pomodoroRemaining = Math.max(0, Math.ceil((pomodoroEndTime - performance.now()) / 1000));
      pomodoroRunning = false;
      btnPomodoroToggle.querySelector('.icon-play').classList.remove('hidden');
      btnPomodoroToggle.querySelector('.icon-pause').classList.add('hidden');
      pomodoroToggleText.textContent = 'Devam Et';
      if (currentMode === 'pomodoro') {
        updatePomodoroDisplay();
      }
    }
  }

  function skipPomodoroPhase() {
    initAudioContext();
    stopPomodoroAlert();
    playMechanicalFlapSound();
    if (pomodoroPhase === 'work') {
      pomodoroCompletedCycles++;
      pomodoroPhase = 'break';
      pomodoroRemaining = pomodoroBreakDuration;
    } else {
      pomodoroPhase = 'work';
      pomodoroRemaining = pomodoroWorkDuration;
    }
    pomodoroRunning = false;
    btnPomodoroToggle.querySelector('.icon-play').classList.remove('hidden');
    btnPomodoroToggle.querySelector('.icon-pause').classList.add('hidden');
    pomodoroToggleText.textContent = 'Başlat';
    if (currentMode === 'pomodoro') {
      updatePomodoroDisplay(true);
      renderPomodoroTracker();
    }
  }

  function resetPomodoro() {
    initAudioContext();
    stopPomodoroAlert();
    pomodoroRunning = false;
    pomodoroRemaining = pomodoroPhase === 'work' ? pomodoroWorkDuration : pomodoroBreakDuration;
    btnPomodoroToggle.querySelector('.icon-play').classList.remove('hidden');
    btnPomodoroToggle.querySelector('.icon-pause').classList.add('hidden');
    pomodoroToggleText.textContent = 'Başlat';
    if (currentMode === 'pomodoro') {
      updatePomodoroDisplay(true);
      renderPomodoroTracker();
    }
  }

  function openPomodoroSetup() {
    const curWork = Math.round(pomodoroWorkDuration / 60);
    const curBreak = Math.round(pomodoroBreakDuration / 60);
    pomodoroInputWork.value = curWork;
    pomodoroInputBreak.value = curBreak;

    syncPomodoroModalButtons(curWork, curBreak);

    pomodoroModal.classList.add('active');
    pomodoroModalBackdrop.classList.add('active');
  }

  function closePomodoroSetup() {
    pomodoroModal.classList.remove('active');
    pomodoroModalBackdrop.classList.remove('active');
  }

  function syncPomodoroModalButtons(w, b) {
    document.querySelectorAll('.pomodoro-template-btn').forEach(btn => {
      const match = Number(btn.dataset.work) === w && Number(btn.dataset.break) === b;
      btn.classList.toggle('active', match);
    });

    document.querySelectorAll('.mini-pill[data-target="pomodoroInputWork"]').forEach(pill => {
      pill.classList.toggle('active', Number(pill.dataset.val) === w);
    });
    document.querySelectorAll('.mini-pill[data-target="pomodoroInputBreak"]').forEach(pill => {
      pill.classList.toggle('active', Number(pill.dataset.val) === b);
    });
  }

  function savePomodoroSetupAndStart() {
    const w = Math.max(1, Math.min(180, parseInt(pomodoroInputWork.value, 10) || 25));
    const b = Math.max(1, Math.min(60, parseInt(pomodoroInputBreak.value, 10) || 5));

    state.pomodoroWorkMin = w;
    state.pomodoroBreakMin = b;
    saveSettings();

    pomodoroWorkDuration = w * 60;
    pomodoroBreakDuration = b * 60;
    pomodoroPhase = 'work';
    pomodoroRemaining = pomodoroWorkDuration;
    pomodoroHasConfiguredOnce = true;

    closePomodoroSetup();

    if (currentMode === 'pomodoro') {
      updatePomodoroDisplay(true);
      renderPomodoroTracker();
    }

    if (!pomodoroRunning) {
      togglePomodoro();
    }
  }

  function triggerPomodoroTransition() {
    pomodoroRunning = false;
    pomodoroRemaining = 0;
    btnPomodoroToggle.querySelector('.icon-play').classList.remove('hidden');
    btnPomodoroToggle.querySelector('.icon-pause').classList.add('hidden');
    pomodoroToggleText.textContent = 'Başlat';

    if (pomodoroPhase === 'work') {
      pomodoroCompletedCycles++;
      playPomodoroTransitionSound(true);
      pomodoroPhase = 'break';
      pomodoroRemaining = pomodoroBreakDuration;

      pomodoroAlertIcon.textContent = '🎉';
      pomodoroAlertTitle.textContent = 'Ders Süresi Tamamlandı!';
      pomodoroAlertDesc.textContent = `Harika bir odaklanma seansı oldu! Şimdi ${Math.round(pomodoroBreakDuration / 60)} dakikalık dinlenme vakti. Zihnini toparla ve biraz su iç.`;
      btnPomodoroAlertNext.textContent = '☕ Molayı Başlat';
    } else {
      playPomodoroTransitionSound(false);
      pomodoroPhase = 'work';
      pomodoroRemaining = pomodoroWorkDuration;

      pomodoroAlertIcon.textContent = '⏰';
      pomodoroAlertTitle.textContent = 'Mola Bitti!';
      pomodoroAlertDesc.textContent = `${Math.round(pomodoroBreakDuration / 60)} dakikalık dinlenme sona erdi. Yeni çalışma seansına hazır mısın? (Pomodoro #${pomodoroCompletedCycles + 1})`;
      btnPomodoroAlertNext.textContent = '🚀 Dersi Başlat';
    }

    if (currentMode === 'pomodoro') {
      updatePomodoroDisplay(true);
      renderPomodoroTracker();
    }

    pomodoroAlertOverlay.classList.remove('hidden');
  }

  function stopPomodoroAlert() {
    pomodoroAlertOverlay.classList.add('hidden');
  }

  function playPomodoroTransitionSound(isWorkToBreak) {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const vol = (state.soundVolume / 100) * 0.45;
      
      const freqs = isWorkToBreak
        ? [523.25, 659.25, 783.99, 1046.50] // C5 - E5 - G5 - C6 (Pozitif & Sevinçli)
        : [587.33, 880.00, 1174.66];        // D5 - A5 - D6 (Canlandırıcı Zil)

      freqs.forEach((freq, idx) => {
        const start = now + idx * 0.14;
        const dur = 0.25;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (e) {
      console.warn('Pomodoro geçiş sesi çalınamadı:', e);
    }
  }

  // --- EKRANI AÇIK TUTMA (SCREEN WAKE LOCK) ---
  let wakeLockSentinel = null;

  async function enableWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          wakeLockSentinel = null;
          updateWakeLockUI(false);
        });
        updateWakeLockUI(true);
      } catch (err) {
        console.warn('Wake Lock request error:', err);
        updateWakeLockUI(false);
      }
    }
  }

  async function disableWakeLock() {
    if (wakeLockSentinel) {
      try {
        await wakeLockSentinel.release();
      } catch (e) {}
      wakeLockSentinel = null;
    }
    updateWakeLockUI(false);
  }

  function updateWakeLockUI(active) {
    if (iconWakeLockOn && iconWakeLockOff) {
      iconWakeLockOn.style.display = active ? 'block' : 'none';
      iconWakeLockOff.style.display = active ? 'none' : 'block';
    }
    if (btnToggleWakeLock) {
      btnToggleWakeLock.classList.toggle('active', active);
    }
    if (toggleWakeLock) {
      toggleWakeLock.checked = active;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.wakeLockEnabled) {
      enableWakeLock();
    }
  });

  // --- ARAYÜZ UYGULAMA VE SENKRONİZASYON ---
  function applyState() {
    // 1. Tema ve Font
    body.className = `${state.theme} ${state.font || 'font-inter'}`;

    // 2. Saniye Kartı ve Has-Seconds Duyarlılığı
    const hasSec = currentMode !== 'clock' || state.showSeconds;
    body.classList.toggle('has-seconds', hasSec);

    if (state.showSeconds || currentMode !== 'clock') {
      unitSeconds.classList.remove('hidden');
      if (currentMode === 'clock') {
        const now = new Date();
        secondsUnit.setInitialValue(String(now.getSeconds()).padStart(2, '0'));
      }
    } else {
      unitSeconds.classList.add('hidden');
    }

    // 3. Tarih
    if (state.showDate) {
      dateDisplay.classList.remove('hidden');
    } else {
      dateDisplay.classList.add('hidden');
    }

    // 4. Boyut / Ölçek
    document.documentElement.style.setProperty('--scale', state.scale / 100);

    // 5. Ses Butonu İkonu
    if (state.soundEnabled) {
      iconSoundOn.style.display = 'block';
      iconSoundOff.style.display = 'none';
      btnToggleSound.classList.add('active');
    } else {
      iconSoundOn.style.display = 'none';
      iconSoundOff.style.display = 'block';
      btnToggleSound.classList.remove('active');
    }

    // 6. Wake Lock Yönetimi
    if (state.wakeLockEnabled) {
      enableWakeLock();
    } else {
      disableWakeLock();
    }

    // Modal Kontrollerini Güncelle
    syncModalUI();

    // Zamanı hemen güncelle
    updateClock();
  }

  function syncModalUI() {
    // Format Butonları
    const formatBtns = formatControl.querySelectorAll('.segment-btn');
    formatBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.value === state.format);
    });

    // Switchler
    toggleSeconds.checked = state.showSeconds;
    toggleDate.checked = state.showDate;
    toggleSound.checked = state.soundEnabled;
    if (toggleWakeLock) toggleWakeLock.checked = !!state.wakeLockEnabled;

    // Ses Slider Görünürlüğü
    volumeGroup.style.display = state.soundEnabled ? 'flex' : 'none';
    soundVolume.value = state.soundVolume;
    volumeVal.textContent = `${state.soundVolume}%`;

    // Boyut Slider
    clockScale.value = state.scale;
    scaleVal.textContent = `${state.scale}%`;

    // Tema Grid
    const themeCards = themeGrid.querySelectorAll('.theme-option');
    themeCards.forEach(card => {
      card.classList.toggle('active', card.dataset.theme === state.theme);
    });

    // Font Grid
    if (fontGrid) {
      const fontCards = fontGrid.querySelectorAll('.font-option');
      fontCards.forEach(card => {
        card.classList.toggle('active', card.dataset.font === (state.font || 'font-inter'));
      });
    }
  }

  // --- AYARLAR MODAL ETKİLEŞİMİ ---
  function openSettings() {
    settingsPanel.classList.add('active');
    settingsBackdrop.classList.add('active');
  }

  function closeSettings() {
    settingsPanel.classList.remove('active');
    settingsBackdrop.classList.remove('active');
  }

  function toggleSettingsModal() {
    if (settingsPanel.classList.contains('active')) {
      closeSettings();
    } else {
      openSettings();
    }
  }

  // --- TAM EKRAN (FULLSCREEN) YÖNETİMİ ---
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Tam ekrana geçilemedi:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // --- SCREENSAVER BOŞTA KALMA (IDLE AUTO-HIDE) ---
  let idleTimeout = null;
  const IDLE_DELAY = 3000; // 3 saniye

  function resetIdleTimer() {
    body.classList.remove('idle');
    clearTimeout(idleTimeout);

    // Ayarlar açıkken imleci gizleme
    if (settingsPanel.classList.contains('active')) return;

    idleTimeout = setTimeout(() => {
      body.classList.add('idle');
    }, IDLE_DELAY);
  }

  // --- OLAY DİNLEYİCİLERİ (EVENT LISTENERS) ---
  function setupEventListeners() {
    // Hızlı Butonlar
    btnToggleSound.addEventListener('click', () => {
      initAudioContext();
      state.soundEnabled = !state.soundEnabled;
      saveSettings();
      applyState();
      if (state.soundEnabled) playMechanicalFlapSound();
    });

    if (btnToggleWakeLock) {
      btnToggleWakeLock.addEventListener('click', () => {
        state.wakeLockEnabled = !state.wakeLockEnabled;
        saveSettings();
        applyState();
      });
    }

    btnToggleFullscreen.addEventListener('click', toggleFullscreen);
    btnToggleSettings.addEventListener('click', toggleSettingsModal);

    // Modal Kapatma
    btnCloseSettings.addEventListener('click', closeSettings);
    settingsBackdrop.addEventListener('click', closeSettings);

    // Format Değişimi
    formatControl.addEventListener('click', (e) => {
      const btn = e.target.closest('.segment-btn');
      if (!btn) return;
      state.format = btn.dataset.value;
      saveSettings();
      applyState();
    });

    // Saniye Değişimi
    toggleSeconds.addEventListener('change', (e) => {
      state.showSeconds = e.target.checked;
      saveSettings();
      applyState();
    });

    // Tarih Değişimi
    toggleDate.addEventListener('change', (e) => {
      state.showDate = e.target.checked;
      saveSettings();
      applyState();
    });

    // Ses Aç/Kapa
    toggleSound.addEventListener('change', (e) => {
      initAudioContext();
      state.soundEnabled = e.target.checked;
      saveSettings();
      applyState();
      if (state.soundEnabled) playMechanicalFlapSound();
    });

    // Ekranı Açık Tut (Wake Lock) Switch
    if (toggleWakeLock) {
      toggleWakeLock.addEventListener('change', (e) => {
        state.wakeLockEnabled = e.target.checked;
        saveSettings();
        applyState();
      });
    }

    // Ses Seviyesi Slider
    soundVolume.addEventListener('input', (e) => {
      state.soundVolume = Number(e.target.value);
      volumeVal.textContent = `${state.soundVolume}%`;
      saveSettings();
    });

    soundVolume.addEventListener('change', () => {
      if (state.soundEnabled) playMechanicalFlapSound();
    });

    // Boyut Slider
    clockScale.addEventListener('input', (e) => {
      state.scale = Number(e.target.value);
      scaleVal.textContent = `${state.scale}%`;
      document.documentElement.style.setProperty('--scale', state.scale / 100);
      saveSettings();
    });

    // Tema Seçimi
    themeGrid.addEventListener('click', (e) => {
      const themeBtn = e.target.closest('.theme-option');
      if (!themeBtn) return;
      state.theme = themeBtn.dataset.theme;
      saveSettings();
      applyState();
    });

    // Font Seçimi
    if (fontGrid) {
      fontGrid.addEventListener('click', (e) => {
        const fontBtn = e.target.closest('.font-option');
        if (!fontBtn) return;
        state.font = fontBtn.dataset.font;
        saveSettings();
        applyState();
      });
    }

    // Mod Seçici Butonları
    if (modeNavigation) {
      modeBtnClock.addEventListener('click', () => setMode('clock'));
      modeBtnStopwatch.addEventListener('click', () => setMode('stopwatch'));
      modeBtnTimer.addEventListener('click', () => setMode('timer'));
      if (modeBtnPomodoro) modeBtnPomodoro.addEventListener('click', () => setMode('pomodoro'));
    }

    // Kronometre Butonları
    if (btnStopwatchToggle) btnStopwatchToggle.addEventListener('click', toggleStopwatch);
    if (btnStopwatchLap) btnStopwatchLap.addEventListener('click', addStopwatchLap);
    if (btnStopwatchReset) btnStopwatchReset.addEventListener('click', resetStopwatch);
    if (btnClearLaps) {
      btnClearLaps.addEventListener('click', () => {
        stopwatchLaps = [];
        renderLaps();
      });
    }

    // Zamanlayıcı Butonları
    if (btnTimerToggle) btnTimerToggle.addEventListener('click', toggleTimer);
    if (btnOpenTimerSetup) btnOpenTimerSetup.addEventListener('click', openTimerSetup);
    if (btnTimerReset) btnTimerReset.addEventListener('click', resetTimer);
    if (btnCloseTimerModal) btnCloseTimerModal.addEventListener('click', closeTimerSetup);
    if (timerModalBackdrop) timerModalBackdrop.addEventListener('click', closeTimerSetup);
    if (btnStopAlarm) btnStopAlarm.addEventListener('click', stopAlarm);

    // Pomodoro Butonları
    if (btnPomodoroToggle) btnPomodoroToggle.addEventListener('click', togglePomodoro);
    if (btnPomodoroSkip) btnPomodoroSkip.addEventListener('click', skipPomodoroPhase);
    if (btnOpenPomodoroSetup) btnOpenPomodoroSetup.addEventListener('click', openPomodoroSetup);
    if (btnPomodoroReset) btnPomodoroReset.addEventListener('click', resetPomodoro);
    if (btnClosePomodoroModal) btnClosePomodoroModal.addEventListener('click', closePomodoroSetup);
    if (pomodoroModalBackdrop) pomodoroModalBackdrop.addEventListener('click', closePomodoroSetup);
    if (btnStartPomodoroWithSetup) btnStartPomodoroWithSetup.addEventListener('click', savePomodoroSetupAndStart);
    if (btnPomodoroAlertNext) {
      btnPomodoroAlertNext.addEventListener('click', () => {
        stopPomodoroAlert();
        togglePomodoro();
      });
    }
    if (btnPomodoroAlertDismiss) btnPomodoroAlertDismiss.addEventListener('click', stopPomodoroAlert);

    // Pomodoro Hazır Şablonlar
    document.querySelectorAll('.pomodoro-template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = parseInt(btn.dataset.work, 10) || 25;
        const b = parseInt(btn.dataset.break, 10) || 5;
        pomodoroInputWork.value = w;
        pomodoroInputBreak.value = b;
        syncPomodoroModalButtons(w, b);
      });
    });

    // Pomodoro Mini Pill Butonları
    document.querySelectorAll('.mini-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const targetId = pill.dataset.target;
        const val = parseInt(pill.dataset.val, 10);
        const input = document.getElementById(targetId);
        if (input && !isNaN(val)) {
          input.value = val;
          const curW = parseInt(pomodoroInputWork.value, 10) || 25;
          const curB = parseInt(pomodoroInputBreak.value, 10) || 5;
          syncPomodoroModalButtons(curW, curB);
        }
      });
    });

    // Pomodoro Yatay Spin Butonları (+ / -)
    document.querySelectorAll('.spin-btn-h').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        const isUp = btn.classList.contains('spin-up');
        const min = parseInt(input.min, 10) || 1;
        const max = parseInt(input.max, 10) || 180;
        const step = targetId === 'pomodoroInputWork' ? 5 : 1;
        let val = (parseInt(input.value, 10) || (targetId === 'pomodoroInputWork' ? 25 : 5)) + (isUp ? step : -step);
        if (val < min) val = min;
        if (val > max) val = max;
        input.value = val;
        const curW = parseInt(pomodoroInputWork.value, 10) || 25;
        const curB = parseInt(pomodoroInputBreak.value, 10) || 5;
        syncPomodoroModalButtons(curW, curB);
      });
    });

    if (pomodoroInputWork) {
      pomodoroInputWork.addEventListener('input', () => {
        const curW = parseInt(pomodoroInputWork.value, 10) || 25;
        const curB = parseInt(pomodoroInputBreak.value, 10) || 5;
        syncPomodoroModalButtons(curW, curB);
      });
    }

    if (pomodoroInputBreak) {
      pomodoroInputBreak.addEventListener('input', () => {
        const curW = parseInt(pomodoroInputWork.value, 10) || 25;
        const curB = parseInt(pomodoroInputBreak.value, 10) || 5;
        syncPomodoroModalButtons(curW, curB);
      });
    }

    // Zamanlayıcı Hızlı Preset Butonları
    if (timerPresets) {
      timerPresets.addEventListener('click', (e) => {
        const pill = e.target.closest('.preset-pill');
        if (!pill) return;
        const seconds = parseInt(pill.dataset.seconds, 10);
        if (!isNaN(seconds)) {
          setTimerDuration(seconds, false);
        }
      });
    }

    // Zamanlayıcı Kurma Modalındaki Hızlı Seçimler
    document.querySelectorAll('.modal-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const h = parseInt(btn.dataset.h, 10) || 0;
        const m = parseInt(btn.dataset.m, 10) || 0;
        const s = parseInt(btn.dataset.s, 10) || 0;
        timerInputHours.value = h;
        timerInputMinutes.value = m;
        timerInputSeconds.value = s;
      });
    });

    // Zamanlayıcı Spin (+ / -) Butonları
    document.querySelectorAll('.spin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        const isUp = btn.classList.contains('spin-up');
        const min = parseInt(input.min, 10) || 0;
        const max = parseInt(input.max, 10) || 99;
        let val = (parseInt(input.value, 10) || 0) + (isUp ? 1 : -1);
        if (val < min) val = max;
        if (val > max) val = min;
        input.value = val;
      });
    });

    // Zamanlayıcıyı Kaydet ve Başlat Butonu
    if (btnSaveTimer) {
      btnSaveTimer.addEventListener('click', () => {
        const h = Math.max(0, parseInt(timerInputHours.value, 10) || 0);
        const m = Math.max(0, Math.min(59, parseInt(timerInputMinutes.value, 10) || 0));
        const s = Math.max(0, Math.min(59, parseInt(timerInputSeconds.value, 10) || 0));
        const total = h * 3600 + m * 60 + s;
        if (total > 0) {
          setTimerDuration(total, true);
        }
        closeTimerSetup();
      });
    }

    // Klavye Kısayolları
    window.addEventListener('keydown', (e) => {
      // Gizli Yönlendirme (Easter Egg):
      // 1) Ctrl + Alt + I (veya doğrudan Sağ Alt [AltGr] + I)
      // 2) Ctrl + Shift + X
      const isInstagramCombo =
        (e.ctrlKey && e.altKey && (e.code === 'KeyI' || e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'ı')) ||
        (e.ctrlKey && e.shiftKey && (e.code === 'KeyX' || e.key.toLowerCase() === 'x'));

      if (isInstagramCombo) {
        e.preventDefault();
        window.location.href = 'https://instagram.com/atqb2_';
        return;
      }

      // Input veya modal içindeyse genel kısayolları engelleme (Escape ve Enter hariç)
      if (['INPUT', 'BUTTON'].includes(document.activeElement.tagName) && !['Escape', 'Enter'].includes(e.key)) {
        return;
      }

      const key = e.key.toLowerCase();

      // Mod Değiştirme Kısayolları
      if (key === '1') {
        e.preventDefault();
        setMode('clock');
      } else if (key === '2') {
        e.preventDefault();
        setMode('stopwatch');
      } else if (key === '3') {
        e.preventDefault();
        setMode('timer');
      } else if (key === '4') {
        e.preventDefault();
        setMode('pomodoro');
      } else if (key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!timerAlarmOverlay.classList.contains('hidden')) {
          stopAlarm();
        } else if (!pomodoroAlertOverlay.classList.contains('hidden')) {
          stopPomodoroAlert();
          togglePomodoro();
        } else if (currentMode === 'stopwatch') {
          toggleStopwatch();
        } else if (currentMode === 'timer') {
          toggleTimer();
        } else if (currentMode === 'pomodoro') {
          togglePomodoro();
        } else {
          toggleSettingsModal();
        }
      } else if (key === 'r') {
        if (currentMode === 'stopwatch') {
          e.preventDefault();
          resetStopwatch();
        } else if (currentMode === 'timer') {
          e.preventDefault();
          resetTimer();
        } else if (currentMode === 'pomodoro') {
          e.preventDefault();
          resetPomodoro();
        }
      } else if (key === 'l' && currentMode === 'stopwatch') {
        e.preventDefault();
        addStopwatchLap();
      } else if (key === 'a') {
        if (currentMode === 'timer') {
          e.preventDefault();
          openTimerSetup();
        } else if (currentMode === 'pomodoro') {
          e.preventDefault();
          openPomodoroSetup();
        }
      } else if (key === 'enter') {
        if (!timerAlarmOverlay.classList.contains('hidden')) {
          e.preventDefault();
          stopAlarm();
        } else if (!pomodoroAlertOverlay.classList.contains('hidden')) {
          e.preventDefault();
          stopPomodoroAlert();
          togglePomodoro();
        } else if (pomodoroModal.classList.contains('active')) {
          e.preventDefault();
          savePomodoroSetupAndStart();
        }
      } else if (key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (key === 't') {
        e.preventDefault();
        state.format = state.format === '12' ? '24' : '12';
        saveSettings();
        applyState();
      } else if (key === 's') {
        if (currentMode === 'clock') {
          e.preventDefault();
          state.showSeconds = !state.showSeconds;
          saveSettings();
          applyState();
        } else if (currentMode === 'pomodoro') {
          e.preventDefault();
          skipPomodoroPhase();
        }
      } else if (key === 'd') {
        e.preventDefault();
        const themes = [
          'theme-fliqlo-dark',
          'theme-fliqlo-light',
          'theme-fliqlo-amber',
          'theme-fliqlo-neon',
          'theme-fliqlo-nord'
        ];
        const nextIdx = (themes.indexOf(state.theme) + 1) % themes.length;
        state.theme = themes[nextIdx];
        saveSettings();
        applyState();
      } else if (key === 'o') {
        e.preventDefault();
        const fonts = [
          'font-inter',
          'font-bebas',
          'font-oswald',
          'font-mono',
          'font-orbitron',
          'font-playfair',
          'font-space',
          'font-syne'
        ];
        const nextIdx = (fonts.indexOf(state.font || 'font-inter') + 1) % fonts.length;
        state.font = fonts[nextIdx];
        saveSettings();
        applyState();
      } else if (key === 'm') {
        e.preventDefault();
        initAudioContext();
        state.soundEnabled = !state.soundEnabled;
        saveSettings();
        applyState();
        if (state.soundEnabled) playMechanicalFlapSound();
      } else if (key === 'w') {
        e.preventDefault();
        state.wakeLockEnabled = !state.wakeLockEnabled;
        saveSettings();
        applyState();
      } else if (key === 'h') {
        e.preventDefault();
        toggleSettingsModal();
      } else if (key === 'escape') {
        if (!timerAlarmOverlay.classList.contains('hidden')) {
          stopAlarm();
        } else if (!pomodoroAlertOverlay.classList.contains('hidden')) {
          stopPomodoroAlert();
        } else if (pomodoroModal.classList.contains('active')) {
          closePomodoroSetup();
        } else if (timerModal.classList.contains('active')) {
          closeTimerSetup();
        } else if (settingsPanel.classList.contains('active')) {
          closeSettings();
        }
      }
    });

    // Mobil/Tablet için çift dokunuşla tam ekran (Double-tap fullscreen)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('button, input, .settings-panel, .timer-modal, .pomodoro-modal, .laps-container, .mode-navigation, .floating-controls')) return;
      const nowTime = Date.now();
      if (nowTime - lastTouchEnd < 320) {
        e.preventDefault();
        toggleFullscreen();
      }
      lastTouchEnd = nowTime;
      resetIdleTimer();
    }, { passive: false });

    // Hareket / Etkileşim Takibi (Screensaver Idle)
    ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    // Kullanıcı ilk tıkladığında Web Audio Context başlat
    document.addEventListener('click', () => {
      initAudioContext();
    }, { once: true });
  }

  // --- BAŞLATMA ---
  function init() {
    loadSettings();
    applyState();
    setupEventListeners();
    resetIdleTimer();

    // Hassas zaman döngüsü: Her 200 milisaniyede bir aktif modu işlet
    setInterval(() => {
      if (currentMode === 'clock') {
        updateClock();
      } else if (currentMode === 'stopwatch') {
        if (stopwatchRunning) {
          updateStopwatchDisplay();
        }
      } else if (currentMode === 'timer') {
        if (timerRunning) {
          const remaining = Math.max(0, Math.ceil((timerEndTime - performance.now()) / 1000));
          if (remaining <= 0) {
            triggerAlarm();
          } else {
            updateTimerDisplay();
          }
        }
      } else if (currentMode === 'pomodoro') {
        if (pomodoroRunning) {
          const remaining = Math.max(0, Math.ceil((pomodoroEndTime - performance.now()) / 1000));
          if (remaining <= 0) {
            triggerPomodoroTransition();
          } else {
            updatePomodoroDisplay();
          }
        }
      }

      // Arka planda çalışan zamanlayıcı kontrolü
      if (currentMode !== 'timer' && timerRunning) {
        const remaining = Math.max(0, Math.ceil((timerEndTime - performance.now()) / 1000));
        if (remaining <= 0) {
          triggerAlarm();
        }
      }

      // Arka planda çalışan Pomodoro kontrolü
      if (currentMode !== 'pomodoro' && pomodoroRunning) {
        const remaining = Math.max(0, Math.ceil((pomodoroEndTime - performance.now()) / 1000));
        if (remaining <= 0) {
          triggerPomodoroTransition();
        }
      }
    }, 200);
  }

  // DOM hazır olduğunda başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

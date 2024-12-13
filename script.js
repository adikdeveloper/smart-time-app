// Tab almashtirish logikasi
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// ============ SOAT FUNKSIONALLIGI ============
function updateClock() {
    const now = new Date();
    const clockDisplay = document.querySelector('.clock-display');
    const dateDisplay = document.querySelector('.date-display');
    
    // Vaqt
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Sana
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateDisplay.textContent = now.toLocaleDateString('uz-UZ', options);
}

// Soatni yangilab turish
setInterval(updateClock, 1000);
updateClock();

// ============ SEKUNDOMER FUNKSIONALLIGI ============
let stopwatchInterval;
let stopwatchRunning = false;
let stopwatchTime = 0;
let laps = [];

const stopwatchDisplay = document.querySelector('.stopwatch-display');
const stopwatchStartBtn = document.getElementById('stopwatchStart');
const stopwatchLapBtn = document.getElementById('stopwatchLap');
const stopwatchResetBtn = document.getElementById('stopwatchReset');
const lapTimesContainer = document.querySelector('.lap-times');

// Sekundomer vaqtini formatlash
function formatStopwatchTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

// Sekundomer yangilash
function updateStopwatch() {
    stopwatchTime += 10;
    stopwatchDisplay.textContent = formatStopwatchTime(stopwatchTime);
}

// Sekundomer Start/Stop
stopwatchStartBtn.addEventListener('click', () => {
    if (!stopwatchRunning) {
        stopwatchInterval = setInterval(updateStopwatch, 10);
        stopwatchStartBtn.textContent = 'To\'xtatish';
        stopwatchLapBtn.disabled = false;
        stopwatchResetBtn.disabled = true;
    } else {
        clearInterval(stopwatchInterval);
        stopwatchStartBtn.textContent = 'Boshlash';
        stopwatchLapBtn.disabled = true;
        stopwatchResetBtn.disabled = false;
    }
    stopwatchRunning = !stopwatchRunning;
});

// Davr vaqtini saqlash
stopwatchLapBtn.addEventListener('click', () => {
    const lapTime = stopwatchTime;
    laps.push(lapTime);
    const lapElement = document.createElement('div');
    lapElement.classList.add('lap-time');
    
    // Oldingi davr bilan farqni hisoblash
    let timeDiff = lapTime;
    if (laps.length > 1) {
        timeDiff = lapTime - laps[laps.length - 2];
    }
    
    lapElement.innerHTML = `
        <span>Davr ${laps.length}</span>
        <span>Umumiy: ${formatStopwatchTime(lapTime)}</span>
        <span>Davr vaqti: ${formatStopwatchTime(timeDiff)}</span>
    `;
    lapTimesContainer.insertBefore(lapElement, lapTimesContainer.firstChild);
});

// Sekundomer tozalash
stopwatchResetBtn.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    laps = [];
    stopwatchDisplay.textContent = '00:00:00.00';
    lapTimesContainer.innerHTML = '';
    stopwatchRunning = false;
    stopwatchStartBtn.textContent = 'Boshlash';
    stopwatchLapBtn.disabled = true;
    stopwatchResetBtn.disabled = true;
});

// ============ TAYMER FUNKSIONALLIGI ============
let timerInterval;
let timerRunning = false;
let timeLeft = 0;
let originalTime = 0;

const timerDisplay = document.querySelector('.timer-display');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const timerStartBtn = document.getElementById('timerStart');
const timerStopBtn = document.getElementById('timerStop');
const timerResetBtn = document.getElementById('timerReset');
const timerSound = document.getElementById('timerSound');

// Taymer vaqtini formatlash
function formatTimerTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Input validatsiyasi
function validateTimerInput(input) {
    let value = parseInt(input.value);
    const max = parseInt(input.getAttribute('max'));
    const min = parseInt(input.getAttribute('min'));

    if (isNaN(value)) value = 0;
    if (value > max) value = max;
    if (value < min) value = min;

    input.value = value.toString().padStart(2, '0');
    return value;
}

// Taymer yangilash
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerSound.play();
        alert('Vaqt tugadi!');
        resetTimer();
        return;
    }
    
    timeLeft--;
    const progress = (timeLeft / originalTime) * 100;
    timerDisplay.textContent = formatTimerTime(timeLeft);
    
    // Oxirgi 10 soniyada vizual ogohlantirish
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ff4444';
    }
}

// Taymerni boshlash
timerStartBtn.addEventListener('click', () => {
    if (!timerRunning) {
        const hours = validateTimerInput(hoursInput);
        const minutes = validateTimerInput(minutesInput);
        const seconds = validateTimerInput(secondsInput);
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
            alert('Iltimos, vaqtni kiriting!');
            return;
        }

        timeLeft = hours * 3600 + minutes * 60 + seconds;
        originalTime = timeLeft;
        
        timerInterval = setInterval(updateTimer, 1000);
        timerRunning = true;

        // Tugmalar holatini yangilash
        timerStartBtn.disabled = true;
        timerStopBtn.disabled = false;
        timerResetBtn.disabled = false;
        
        // Input maydonlarini bloklash
        hoursInput.disabled = true;
        minutesInput.disabled = true;
        secondsInput.disabled = true;
    }
});

// Taymerni to'xtatish
timerStopBtn.addEventListener('click', () => {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        
        // Tugmalar holatini yangilash
        timerStartBtn.disabled = false;
        timerStopBtn.disabled = true;
    }
});

// Taymerni tozalash
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timeLeft = 0;
    originalTime = 0;
    
    // Display ni tozalash
    timerDisplay.textContent = '00:00:00';
    timerDisplay.style.color = '#fff';
    
    // Input maydonlarini tozalash
    hoursInput.value = '00';
    minutesInput.value = '00';
    secondsInput.value = '00';
    
    // Input maydonlarini razbloklashtirish
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    
    // Tugmalar holatini yangilash
    timerStartBtn.disabled = false;
    timerStopBtn.disabled = true;
    timerResetBtn.disabled = true;
}

timerResetBtn.addEventListener('click', resetTimer);

// Klaviatura boshqaruvi
document.addEventListener('keydown', (e) => {
    const activeTab = document.querySelector('.tab-content.active');
    
    if (activeTab.id === 'stopwatch') {
        if (e.code === 'Space') {
            e.preventDefault();
            stopwatchStartBtn.click();
        } else if (e.code === 'KeyL') {
            e.preventDefault();
            if (!stopwatchLapBtn.disabled) stopwatchLapBtn.click();
        } else if (e.code === 'KeyR') {
            e.preventDefault();
            if (!stopwatchResetBtn.disabled) stopwatchResetBtn.click();
        }
    } else if (activeTab.id === 'timer') {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!timerStartBtn.disabled) {
                timerStartBtn.click();
            } else if (!timerStopBtn.disabled) {
                timerStopBtn.click();
            }
        } else if (e.code === 'KeyR') {
            e.preventDefault();
            if (!timerResetBtn.disabled) timerResetBtn.click();
        }
    }
});

// LocalStorage bilan ishlash
function saveState() {
    const state = {
        stopwatch: {
            time: stopwatchTime,
            running: stopwatchRunning,
            laps: laps
        },
        timer: {
            timeLeft: timeLeft,
            originalTime: originalTime,
            running: timerRunning
        }
    };
    localStorage.setItem('timeAppState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('timeAppState');
    if (savedState) {
        const state = JSON.parse(savedState);
        
        // Sekundomer holatini tiklash
        if (state.stopwatch.running) {
            stopwatchTime = state.stopwatch.time;
            stopwatchDisplay.textContent = formatStopwatchTime(stopwatchTime);
            stopwatchStartBtn.click();
        }
        
        // Taymer holatini tiklash
        if (state.timer.running) {
            timeLeft = state.timer.timeLeft;
            originalTime = state.timer.originalTime;
            timerDisplay.textContent = formatTimerTime(timeLeft);
            timerStartBtn.click();
        }
    }
}

// Har 30 sekundda holatni saqlash
setInterval(saveState, 30000);

// Sahifa yuklanganda holatni tiklash
window.addEventListener('load', loadState);

// Sahifa yopilganda holatni saqlash
window.addEventListener('beforeunload', saveState);
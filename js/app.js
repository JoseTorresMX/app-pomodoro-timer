const { interval, Subject, fromEvent } = rxjs;
const { takeUntil, tap, map } = rxjs.operators;

// Elementos del DOM
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// Mensajes de trabajo aleatorios
const workMessages = [
  "¡Mantén el enfoque! 💪",
  "Cada minuto cuenta 🎯",
  "¡Tú puedes lograrlo! ⭐",
  "Concentración al máximo 🧠",
  "En modo productivo 🚀",
  "¡Sigue así! 📈",
  "Dale con todo 💫",
  "Un paso a la vez 👣",
  "¡A por ello! 🔥",
  "Trabajo en progreso... ⚡",
];

// Variables de control
let isRunning = false;
let isWorkTime = true;
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
let timeLeft = WORK_TIME;

// Subject para control
const stopSubject = new Subject();

// Funciones auxiliares
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function getRandomWorkMessage() {
  return workMessages[Math.floor(Math.random() * workMessages.length)];
}

function createTimer(duration) {
  return interval(1000).pipe(
    takeUntil(stopSubject),
    map((tick) => duration - tick - 1),
    tap((time) => {
      if (time < 0) {
        stopSubject.next();
        handleTimerComplete();
        return;
      }
      timeLeft = time;
      updateDisplay();
    })
  );
}

function handleTimerComplete() {
  isWorkTime = !isWorkTime;
  timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
  updateMessage();
  startTimer();
}

function updateMessage() {
  messageDisplay.textContent = isWorkTime
    ? getRandomWorkMessage()
    : "Tiempo de descanso 😌";
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  startBtn.textContent = isRunning ? "Pausar" : "Iniciar";
  startBtn.classList.toggle("pause", isRunning);
}

function startTimer() {
  if (!isRunning) {
    createTimer(timeLeft).subscribe();
    isRunning = true;
    updateMessage();
  } else {
    stopSubject.next();
    isRunning = false;
  }
  updateDisplay();
}

function resetTimer() {
  stopSubject.next();
  isRunning = false;
  isWorkTime = true;
  timeLeft = WORK_TIME;
  messageDisplay.textContent = "¡Listo para empezar!";
  startBtn.classList.remove("pause");
  updateDisplay();
}

// Event listeners
fromEvent(startBtn, "click").subscribe(startTimer);
fromEvent(resetBtn, "click").subscribe(resetTimer);

// Inicialización
updateDisplay();

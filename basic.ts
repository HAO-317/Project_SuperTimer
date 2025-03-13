// v1.0

interface Countdown {
  timeLeft: number;
  intervalId: number | null;
  isPaused: boolean; 
}

const timeDisplay = document.getElementById("time");
const minutesInput = document.getElementById("minutes");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");
const clockCanvas = document.getElementById("clock");
const ctx = clockCanvas.getContext("2d");

const tickTock = new Audio('tick-tock.wav');
const clockEnd = new Audio('clock.wav');
const clickSound = new Audio('click.wav');
tickTock.volume = 0.3;
clickSound.volume = 0.5;

const countdown: Countdown = {
  timeLeft: 0,
  intervalId: null,
  isPaused: false 
};


function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function drawClocks(seconds: number){
  if (!ctx) return;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
  const radius = 40;
  const centers = [
    { x: 50, y: 50, value: hours, max: 12, label: "Hour" },
    { x: 150, y: 50, value: minutes, max: 60, label: "Minute" },
    { x: 250, y: 50, value: secs, max: 60, label: "Second" }
  ];
  centers.forEach((center, index) => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.593)";
    ctx.lineWidth = 2;
    ctx.stroke();
    const divisions = index === 0 ? 12 : 60;
    for (let i = 0; i < divisions; i++) {
      const angle = (i * (360/divisions) - 90) * Math.PI / 180;
      const startX = center.x + radius * Math.cos(angle);
      const startY = center.y + radius * Math.sin(angle);
      const endX = center.x + (radius - 2.5) * Math.cos(angle);
      const endY = center.y + (radius - 2.5) * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.593)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    ctx.font = "10px Geneva";
    ctx.fillStyle = "rgba(0, 0, 0, 0.593)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const numbers = index === 0 ? [3, 6, 9, 12] : [15, 30, 45, 60];
    numbers.forEach(num => {
      const angle = (num * (360/divisions) - 90) * Math.PI / 180;
      const x = center.x + (radius - 10) * Math.cos(angle);
      const y = center.y + (radius - 10) * Math.sin(angle);
      ctx.fillText(num.toString(), x, y);
    });
    const angle = (center.value * (360/center.max) - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(
      center.x + (radius * 0.8) * Math.cos(angle),
      center.y + (radius * 0.8) * Math.sin(angle)
    );
    ctx.strokeStyle = "rgb(255, 51, 0)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(center.x, center.y, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 0, 0, 0.593)";
    ctx.fill();
    ctx.fillText(center.label, center.x, center.y + radius + 10);
  });
}

function validateInput(){
  const maxMinutes = (13 * 60);
  const minutes = parseInt(minutesInput.value);
  if (minutes > maxMinutes) {
    alert(`The number of inputs cannot exceed ${maxMinutes}!`);
    minutesInput.value = maxMinutes.toString();
  }
}

function startCountdown(){
  clickSound.play();
  if (countdown.intervalId || countdown.isPaused) return; 
  const minutes = parseInt(minutesInput.value);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid minute!");
    return;
  }

  validateInput();
  countdown.timeLeft = minutes * 60;
  timeDisplay.textContent = formatTime(countdown.timeLeft);
  drawClocks(countdown.timeLeft);

  countdown.intervalId = window.setInterval(() => {
    if (countdown.timeLeft > 0) {
      countdown.timeLeft--;
      timeDisplay.textContent = formatTime(countdown.timeLeft);
      drawClocks(countdown.timeLeft);
      tickTock.play();
    } else {
      clearInterval(countdown.intervalId!);
      countdown.intervalId = null;
      clockEnd.loop = true;
      clockEnd.play();
      setTimeout(() => clockEnd.pause(), 60000);
    }
  }, 1000);
  countdown.isPaused = false; 
  pauseButton.textContent = "Pause"; 
}


function pauseCountdown(){
  clickSound.play();
  if (countdown.intervalId) {
    
    clearInterval(countdown.intervalId);
    countdown.intervalId = null;
    countdown.isPaused = true;
    tickTock.pause();
    clockEnd.pause();
    pauseButton.textContent = "Resume"; 
  } else if (countdown.isPaused && countdown.timeLeft > 0) {
    
    countdown.intervalId = window.setInterval(() => {
      if (countdown.timeLeft > 0) {
        countdown.timeLeft--;
        timeDisplay.textContent = formatTime(countdown.timeLeft);
        drawClocks(countdown.timeLeft);
        tickTock.play();
      } else {
        clearInterval(countdown.intervalId!);
        countdown.intervalId = null;
        countdown.isPaused = false;
        clockEnd.loop = true;
        clockEnd.play();
        setTimeout(() => clockEnd.pause(), 60000);
      }
    }, 1000);
    countdown.isPaused = false;
    pauseButton.textContent = "Pause"; // 
  }
}

function restartCountdown(){
  clickSound.play();
  if (countdown.intervalId) {
    clearInterval(countdown.intervalId);
    countdown.intervalId = null;
  }
  tickTock.pause();
  clockEnd.pause();
  countdown.isPaused = false; 
  minutesInput.value = "";
  countdown.timeLeft = 0;
  timeDisplay.textContent = "00:00:00";
  drawClocks(0);
  pauseButton.textContent = "Pause"; 
}

startButton.addEventListener("click", startCountdown);
pauseButton.addEventListener("click", pauseCountdown);
restartButton.addEventListener("click", restartCountdown);
minutesInput.addEventListener("input", validateInput);

timeDisplay.textContent = "00:00:00";
drawClocks(0);
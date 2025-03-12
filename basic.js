// v1.0
var timeDisplay = document.getElementById("time");
var minutesInput = document.getElementById("minutes");
var startButton = document.getElementById("start-button");
var pauseButton = document.getElementById("pause-button");
var restartButton = document.getElementById("restart-button");
var clockCanvas = document.getElementById("clock");
var ctx = clockCanvas.getContext("2d");
var tickTock = new Audio('tick-tock.wav');
var clockEnd = new Audio('clock.wav');
var clickSound = new Audio('click.wav');
tickTock.volume = 0.3;
clickSound.volume = 0.5;
var countdown = {
    timeLeft: 0,
    intervalId: null,
    isPaused: false
};
function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var mins = Math.floor((seconds % 3600) / 60);
    var secs = seconds % 60;
    return "".concat(hours.toString().padStart(2, "0"), ":").concat(mins.toString().padStart(2, "0"), ":").concat(secs.toString().padStart(2, "0"));
}
function drawClocks(seconds) {
    if (!ctx)
        return;
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var secs = seconds % 60;
    ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
    var radius = 40;
    var centers = [
        { x: 50, y: 50, value: hours, max: 12, label: "Hour" },
        { x: 150, y: 50, value: minutes, max: 60, label: "Minute" },
        { x: 250, y: 50, value: secs, max: 60, label: "Second" }
    ];
    centers.forEach(function (center, index) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.593)";
        ctx.lineWidth = 2;
        ctx.stroke();
        var divisions = index === 0 ? 12 : 60;
        for (var i = 0; i < divisions; i++) {
            var angle_1 = (i * (360 / divisions) - 90) * Math.PI / 180;
            var startX = center.x + radius * Math.cos(angle_1);
            var startY = center.y + radius * Math.sin(angle_1);
            var endX = center.x + (radius - 2.5) * Math.cos(angle_1);
            var endY = center.y + (radius - 2.5) * Math.sin(angle_1);
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
        var numbers = index === 0 ? [3, 6, 9, 12] : [15, 30, 45, 60];
        numbers.forEach(function (num) {
            var angle = (num * (360 / divisions) - 90) * Math.PI / 180;
            var x = center.x + (radius - 10) * Math.cos(angle);
            var y = center.y + (radius - 10) * Math.sin(angle);
            ctx.fillText(num.toString(), x, y);
        });
        var angle = (center.value * (360 / center.max) - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + (radius * 0.8) * Math.cos(angle), center.y + (radius * 0.8) * Math.sin(angle));
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
function validateInput() {
    var maxMinutes = (13 * 60);
    var minutes = parseInt(minutesInput.value);
    if (minutes > maxMinutes) {
        alert("The number of inputs cannot exceed ".concat(maxMinutes, "!"));
        minutesInput.value = maxMinutes.toString();
    }
}
function startCountdown() {
    clickSound.play();
    if (countdown.intervalId || countdown.isPaused)
        return;
    var minutes = parseInt(minutesInput.value);
    if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid minute!");
        return;
    }
    validateInput();
    countdown.timeLeft = minutes * 60;
    timeDisplay.textContent = formatTime(countdown.timeLeft);
    drawClocks(countdown.timeLeft);
    countdown.intervalId = window.setInterval(function () {
        if (countdown.timeLeft > 0) {
            countdown.timeLeft--;
            timeDisplay.textContent = formatTime(countdown.timeLeft);
            drawClocks(countdown.timeLeft);
            tickTock.play();
        }
        else {
            clearInterval(countdown.intervalId);
            countdown.intervalId = null;
            clockEnd.loop = true;
            clockEnd.play();
            setTimeout(function () { return clockEnd.pause(); }, 60000);
        }
    }, 1000);
    countdown.isPaused = false;
    pauseButton.textContent = "Pause";
}
function pauseCountdown() {
    clickSound.play();
    if (countdown.intervalId) {
        clearInterval(countdown.intervalId);
        countdown.intervalId = null;
        countdown.isPaused = true;
        tickTock.pause();
        clockEnd.pause();
        pauseButton.textContent = "Resume";
    }
    else if (countdown.isPaused && countdown.timeLeft > 0) {
        countdown.intervalId = window.setInterval(function () {
            if (countdown.timeLeft > 0) {
                countdown.timeLeft--;
                timeDisplay.textContent = formatTime(countdown.timeLeft);
                drawClocks(countdown.timeLeft);
                tickTock.play();
            }
            else {
                clearInterval(countdown.intervalId);
                countdown.intervalId = null;
                countdown.isPaused = false;
                clockEnd.loop = true;
                clockEnd.play();
                setTimeout(function () { return clockEnd.pause(); }, 60000);
            }
        }, 1000);
        countdown.isPaused = false;
        pauseButton.textContent = "Pause"; // 
    }
}
function restartCountdown() {
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

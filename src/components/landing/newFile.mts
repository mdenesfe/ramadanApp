document.addEventListener("DOMContentLoaded", function () {
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const imsakTimeEl = document.getElementById("imsakTime");
const iftarTimeEl = document.getElementById("iftarTime");
const currentDateEl = document.getElementById("currentDateWithoutYear");
const currentTimeEl = document.getElementById("currentTime");
const imsakContainer = document.getElementById("remainingToImsakContainer");
const iftarContainer = document.getElementById("remainingToIftarContainer");
const remainingToImsakEl = document.getElementById("remainingToImsak");
const remainingToIftarEl = document.getElementById("remainingToIftar");

const times = {
"2024-03-05": { imsak: "05:49", iftar: "19:13" },
"2024-03-06": { imsak: "05:48", iftar: "19:14" },
};

const toggleTheme = () => {
const newTheme = root.classList.toggle("dark") ? "dark" : "light";
localStorage.setItem("theme", newTheme);
themeToggle.textContent = newTheme === "dark" ? "💡" : "🌑";
};

const updateTheme = () => {
const preferredTheme = localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
root.classList.toggle("dark", preferredTheme === "dark");
themeToggle.textContent = preferredTheme === "dark" ? "💡" : "🌑";
};

const updateDateTimeDisplays = () => {
const now = new Date();
const todayFormatted = formatDate(now);
const tomorrowFormatted = formatDate(new Date(now.getTime() + 86400000));

const todayTimes = times[todayFormatted] || { imsak: "N/A", iftar: "N/A" };
const { imsak, iftar } = now.getTime() >= dateFromTimeStr(now, todayTimes.iftar).getTime() ? times[tomorrowFormatted] || todayTimes : todayTimes;

imsakTimeEl.textContent = imsak;
iftarTimeEl.textContent = iftar;
currentDateEl.textContent = now.toLocaleDateString("tr-TR", { weekday: "long", month: "long", day: "numeric" });
currentTimeEl.textContent = now.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' });

updateRemainingTime(now, imsak, iftar, todayTimes, times[tomorrowFormatted] || todayTimes);
};

const updateRemainingTime = (now, imsak, iftar, todayTimes, tomorrowTimes) => {
const iftarDate = dateFromTimeStr(now, iftar);
let imsakDate = dateFromTimeStr(now, imsak);
if (now > iftarDate) imsakDate = dateFromTimeStr(new Date(now.getTime() + 86400000), tomorrowTimes.imsak);

const remaining = now < imsakDate ? formatRemainingTime(imsakDate - now) : formatRemainingTime(iftarDate - now);
const isIftarTime = now >= imsakDate && now < iftarDate;

imsakContainer.classList.toggle("hidden", isIftarTime);
iftarContainer.classList.toggle("hidden", !isIftarTime);

(isIftarTime ? remainingToIftarEl : remainingToImsakEl).textContent = remaining;
};

const formatDate = (date) => date.toISOString().split('T')[0];

const dateFromTimeStr = (now, timeStr) => {
const [hour, minute] = timeStr.split(":").map(Number);
return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
};

const formatRemainingTime = (milliseconds) => {
const hours = Math.floor(milliseconds / (1000 * 60 * 60));
const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

themeToggle.addEventListener("click", toggleTheme);
updateTheme();
updateDateTimeDisplays();
setInterval(updateDateTimeDisplays, 1000);
});

(function () {
  "use strict";

  function esc(str) {
    const el = document.createElement("span");
    el.textContent = String(str);
    return el.innerHTML;
  }

  // --- Storage helpers (browser.storage.local) ---
  const storage = browser.storage.local;

  async function load(key, fallback) {
    try {
      const result = await storage.get(key);
      return result[key] !== undefined ? result[key] : fallback;
    } catch { return fallback; }
  }

  function save(key, value) {
    storage.set({ [key]: value });
  }

  // --- Theme ---
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    save("theme-dark", dark);
  }

  let isDark = true;

  function toggleTheme() {
    isDark = !isDark;
    applyTheme(isDark);
    track("theme_toggle", { dark: isDark });
  }

  themeToggle.addEventListener("click", toggleTheme);
  themeToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  });

  // --- Local Clock ---
  const localTimeEl = document.getElementById("localTime");
  const localDateEl = document.getElementById("localDate");

  function updateLocalClock() {
    const now = new Date();
    localTimeEl.textContent = now.toLocaleTimeString(undefined, {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    localDateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  }
  updateLocalClock();
  setInterval(updateLocalClock, 1000);

  // --- Search (SearchFan/Yahoo feed via searchfan.net) ---
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (!q) return;
    track("search", { queryLength: q.length });
    window.location.href = "https://searchfan.net/s?pub=14&feed=35&q=" + encodeURIComponent(q);
  });

  // --- Weather (wttr.in) ---
  const weatherContent = document.getElementById("weatherContent");
  const weatherLocationBtn = document.getElementById("weatherLocationBtn");
  const weatherLocationForm = document.getElementById("weatherLocationForm");
  const weatherLocationInput = document.getElementById("weatherLocationInput");
  const weatherLocationSubmit = document.getElementById("weatherLocationSubmit");

  let weatherLocation = "";

  function weatherIcon(code) {
    const c = parseInt(code, 10);
    if (c === 113) return "\u2600\uFE0F";
    if (c === 116) return "\u26C5";
    if (c === 119 || c === 122) return "\u2601\uFE0F";
    if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 311, 314, 353, 356, 359].includes(c)) return "\uD83C\uDF27\uFE0F";
    if ([179, 182, 185, 227, 230, 317, 320, 323, 326, 329, 332, 335, 338, 350, 362, 365, 368, 371, 374, 377].includes(c)) return "\uD83C\uDF28\uFE0F";
    if ([200, 386, 389, 392, 395].includes(c)) return "\u26C8\uFE0F";
    if (c === 143 || c === 248 || c === 260) return "\uD83C\uDF2B\uFE0F";
    return "\uD83C\uDF24\uFE0F";
  }

  async function fetchWeather() {
    const loc = weatherLocation || "";
    const url = "https://wttr.in/" + encodeURIComponent(loc) + "?format=j1";
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Weather fetch failed");
      const data = await resp.json();
      renderWeather(data);
      track("weather_load", { success: true });
    } catch {
      weatherContent.innerHTML = '<div class="weather-error">Unable to load weather.<br><small>Click the pin icon to set your city.</small></div>';
      track("weather_load", { success: false });
    }
  }

  function renderWeather(data) {
    const cur = data.current_condition[0];
    const area = data.nearest_area[0];
    const city = esc(area.areaName[0].value);
    const country = esc(area.country[0].value);
    const tempC = esc(cur.temp_C);
    const desc = esc(cur.weatherDesc[0].value);
    const icon = weatherIcon(cur.weatherCode);
    const humidity = esc(cur.humidity);
    const windKmph = esc(cur.windspeedKmph);
    const feelsC = esc(cur.FeelsLikeC);

    const forecast = data.weather.slice(0, 3);

    let forecastHtml = forecast.map((day) => {
      const d = new Date(day.date);
      const dayName = esc(d.toLocaleDateString(undefined, { weekday: "short" }));
      const hi = esc(day.maxtempC);
      const lo = esc(day.mintempC);
      const ic = weatherIcon(day.hourly[4].weatherCode);
      return `<div class="forecast-day">
        <div class="forecast-name">${dayName}</div>
        <div class="forecast-icon">${ic}</div>
        <div class="forecast-temps">${hi}&deg; / ${lo}&deg;</div>
      </div>`;
    }).join("");

    weatherContent.innerHTML = `
      <div class="weather-current">
        <div class="weather-main">
          <span class="weather-icon-large">${icon}</span>
          <span class="weather-temp">${tempC}&deg;C</span>
        </div>
        <div class="weather-details">
          <div class="weather-desc">${desc}</div>
          <div class="weather-city">${city}, ${country}</div>
          <div class="weather-meta">Feels ${feelsC}&deg;C &middot; Humidity ${humidity}% &middot; Wind ${windKmph} km/h</div>
        </div>
      </div>
      <div class="weather-forecast">${forecastHtml}</div>
    `;
  }

  weatherLocationBtn.addEventListener("click", () => {
    const visible = weatherLocationForm.style.display !== "none";
    weatherLocationForm.style.display = visible ? "none" : "flex";
    if (!visible) {
      weatherLocationInput.value = weatherLocation;
      weatherLocationInput.focus();
    }
  });

  weatherLocationSubmit.addEventListener("click", () => {
    weatherLocation = weatherLocationInput.value.trim();
    save("weather-location", weatherLocation);
    weatherLocationForm.style.display = "none";
    weatherContent.innerHTML = '<div class="weather-loading">Loading weather...</div>';
    track("weather_location_set", { hasLocation: weatherLocation.length > 0 });
    fetchWeather();
  });

  weatherLocationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      weatherLocationSubmit.click();
    }
  });

  // --- World Clocks ---
  const worldClockList = document.getElementById("worldClockList");
  const timezoneSelect = document.getElementById("timezoneSelect");
  const addTimezoneBtn = document.getElementById("addTimezoneBtn");

  const defaultZones = ["America/New_York", "Europe/London", "Asia/Tokyo"];
  let selectedZones = defaultZones.slice();

  const commonTimezones = [
    "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "America/Sao_Paulo", "America/Argentina/Buenos_Aires",
    "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
    "Asia/Dubai", "Asia/Kolkata", "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul",
    "Asia/Singapore", "Asia/Hong_Kong",
    "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland",
    "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos",
  ];

  function populateTimezoneSelect() {
    timezoneSelect.innerHTML = "";
    const available = commonTimezones.filter((tz) => !selectedZones.includes(tz));
    available.forEach((tz) => {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz.replace(/_/g, " ").replace(/\//g, " / ");
      timezoneSelect.appendChild(opt);
    });
    addTimezoneBtn.disabled = available.length === 0;
  }

  function formatTzLabel(tz) {
    const parts = tz.split("/");
    return parts[parts.length - 1].replace(/_/g, " ");
  }

  function buildWorldClocks() {
    worldClockList.innerHTML = "";
    selectedZones.forEach((tz) => {
      const row = document.createElement("div");
      row.className = "worldclock-row";
      row.dataset.tz = tz;

      const info = document.createElement("div");
      info.className = "wc-info";

      const citySpan = document.createElement("span");
      citySpan.className = "wc-city";
      citySpan.textContent = formatTzLabel(tz);

      const timeSpan = document.createElement("span");
      timeSpan.className = "wc-time";

      info.appendChild(citySpan);
      info.appendChild(timeSpan);

      const removeBtn = document.createElement("button");
      removeBtn.className = "wc-remove";
      removeBtn.title = "Remove " + formatTzLabel(tz);
      removeBtn.setAttribute("aria-label", "Remove " + formatTzLabel(tz));
      removeBtn.textContent = "\u2715";
      removeBtn.addEventListener("click", () => {
        selectedZones = selectedZones.filter((z) => z !== tz);
        save("world-clocks", selectedZones);
        track("timezone_remove", { timezone_configured: true });
        buildWorldClocks();
        populateTimezoneSelect();
      });

      row.appendChild(info);
      row.appendChild(removeBtn);
      worldClockList.appendChild(row);
    });
    updateWorldClockTimes();
  }

  function updateWorldClockTimes() {
    const now = new Date();
    const rows = worldClockList.querySelectorAll(".worldclock-row");
    rows.forEach((row) => {
      const tz = row.dataset.tz;
      const timeSpan = row.querySelector(".wc-time");
      try {
        timeSpan.textContent = now.toLocaleTimeString(undefined, {
          hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: tz,
        });
      } catch {
        timeSpan.textContent = "\u2014";
      }
    });
  }

  addTimezoneBtn.addEventListener("click", () => {
    const tz = timezoneSelect.value;
    if (tz && !selectedZones.includes(tz)) {
      selectedZones.push(tz);
      save("world-clocks", selectedZones);
      track("timezone_add", { timezone_configured: true });
      buildWorldClocks();
      populateTimezoneSelect();
    }
  });

  // --- Analytics helper ---
  const track = (event, props) => {
    if (window.wcdAnalytics) window.wcdAnalytics.track(event, props);
  };

  // --- Init (async for storage loading) ---
  async function init() {
    if (window.wcdAnalytics) await window.wcdAnalytics.init();

    isDark = await load("theme-dark", true);
    applyTheme(isDark);

    weatherLocation = await load("weather-location", "");
    fetchWeather();

    selectedZones = await load("world-clocks", defaultZones);
    populateTimezoneSelect();
    buildWorldClocks();
    setInterval(updateWorldClockTimes, 1000);

    track("tab_open");
  }

  init();
})();

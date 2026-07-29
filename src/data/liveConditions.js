const BEACH_HAVEN = {
  latitude: 39.5593,
  longitude: -74.2432,
  timezone: "America/New_York",
};

const NOAA_TIDE_STATION = "8534720";
const CACHE_KEY = "tideframe.liveConditions.v14";
const WINDOW_NAME_PREFIX = `${CACHE_KEY}:`;
export const LIVE_CONDITIONS_CACHE_MS = 60 * 60 * 1000;

const formatClock = (value, options = {}) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: BEACH_HAVEN.timezone,
    ...options,
  })
    .format(new Date(value))
    .replace(" ", " ");

const compactHour = (value) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: BEACH_HAVEN.timezone,
  })
    .format(new Date(value))
    .replace(" ", " ");

const formatTideDay = (value, today = new Date()) => {
  const date = new Date(value);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (formatBeachDate(date) === formatBeachDate(today)) return "Today";
  if (formatBeachDate(date) === formatBeachDate(tomorrow)) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: BEACH_HAVEN.timezone,
  }).format(date);
};

const round = (value) => Math.round(Number(value));

const compassFromDegrees = (degrees) => {
  if (!Number.isFinite(Number(degrees))) return "";

  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return directions[Math.round(((Number(degrees) % 360) / 22.5)) % 16];
};

const formatBeachDate = (value) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: BEACH_HAVEN.timezone,
  }).formatToParts(value);

  const date = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${date.year}${date.month}${date.day}`;
};

const parseNoaaTime = (value) => new Date(`${value.replace(" ", "T")}:00`);

const celsiusToFahrenheit = (value) => Math.round((Number(value) * 9) / 5 + 32);

const formatSurfHeight = (value) => {
  const feet = Number(value);
  if (!Number.isFinite(feet)) return null;
  if (feet < 1) return "0-1";

  const low = Math.max(1, Math.floor(feet));
  const high = Math.max(low + 1, Math.ceil(feet));
  return `${low}-${high}`;
};

const conditionFromCode = (code) => {
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return "rain";
  if ([2, 3, 45, 48].includes(code)) return "cloudy";
  if (code === 1) return "partly";
  return "sunny";
};

const conditionFromForecast = (forecast = "") => {
  const value = forecast.toLowerCase();
  if (value.includes("rain") || value.includes("shower") || value.includes("storm")) return "rain";
  if (value.includes("cloud") || value.includes("fog") || value.includes("overcast")) return "cloudy";
  if (value.includes("partly") || value.includes("mostly sunny") || value.includes("mostly clear")) return "partly";
  return "sunny";
};

const windSpeedFromNws = (value = "") => {
  const speeds = value.match(/\d+/g)?.map(Number) ?? [];
  if (!speeds.length) return null;
  return Math.round(speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length);
};

const waveScore = (feet) => {
  if (!Number.isFinite(feet)) return 0;
  if (feet < 1) return -2;
  if (feet < 2) return 1;
  if (feet <= 3) return 2;
  if (feet <= 5) return 1;
  return 0;
};

const windScore = (direction, speed, gusts) => {
  const gustPenalty = Number.isFinite(gusts) && gusts >= 25 ? 2 : Number.isFinite(gusts) && gusts >= 20 ? 1 : 0;
  const windSpeed = Number.isFinite(speed) ? speed : 0;

  if (["W", "WNW", "NW", "WSW"].includes(direction)) {
    if (windSpeed <= 6) return 3 - gustPenalty;
    if (windSpeed <= 10) return 1 - gustPenalty;
    if (windSpeed <= 16) return -1 - gustPenalty;
    return -3 - gustPenalty;
  }

  if (["N", "NNE", "NE"].includes(direction)) {
    if (windSpeed <= 6) return 1 - gustPenalty;
    if (windSpeed <= 10) return -1 - gustPenalty;
    if (windSpeed <= 16) return -2 - gustPenalty;
    return -4 - gustPenalty;
  }

  if (["E", "ENE", "ESE", "SE"].includes(direction)) {
    if (windSpeed <= 6) return 0 - gustPenalty;
    if (windSpeed <= 10) return -2 - gustPenalty;
    if (windSpeed <= 16) return -3 - gustPenalty;
    return -5 - gustPenalty;
  }

  if (["S", "SSE", "SSW"].includes(direction)) {
    if (windSpeed <= 6) return 2 - gustPenalty;
    if (windSpeed <= 10) return 0 - gustPenalty;
    if (windSpeed <= 16) return -2 - gustPenalty;
    return -4 - gustPenalty;
  }

  if (["SW"].includes(direction)) {
    if (windSpeed <= 6) return 3 - gustPenalty;
    if (windSpeed <= 10) return 1 - gustPenalty;
    if (windSpeed <= 16) return -1 - gustPenalty;
    return -3 - gustPenalty;
  }

  return -1 - gustPenalty;
};

const surfQualityFromConditions = ({ waveHeight, windDirection, windSpeed, windGusts }) => {
  const score = waveScore(waveHeight) + windScore(windDirection, windSpeed, windGusts);

  if (Number.isFinite(windSpeed) && windSpeed >= 19) return { label: "Poor", rating: 1 };
  if (Number.isFinite(windGusts) && windGusts >= 25 && score < 3) return { label: "Poor", rating: 1 };
  if (score >= 4) return { label: "Good", rating: 5 };
  if (score >= 2) return { label: "Fair to Good", rating: 4 };
  if (score >= 0) return { label: "Fair", rating: 3 };
  if (score >= -2) return { label: "Poor to Fair", rating: 2 };
  return { label: "Poor", rating: 1 };
};

const withCurrentDisplayTime = (conditions) => ({
  ...conditions,
  currentTime: formatClock(new Date()),
});

const readCache = () => {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage?.getItem(CACHE_KEY) ?? window.sessionStorage?.getItem(CACHE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    // Continue to the window.name fallback below.
  }

  try {
    if (window.name?.startsWith(WINDOW_NAME_PREFIX)) {
      return JSON.parse(window.name.slice(WINDOW_NAME_PREFIX.length));
    }
  } catch {
    // Ignore malformed cache data.
  }

  return null;
};

export const writeConditionsCache = (conditions) => {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    savedAt: Date.now(),
    conditions: {
      ...conditions,
      dataSource: "live",
    },
  });

  try {
    window.localStorage?.setItem(CACHE_KEY, payload);
  } catch {
    // Try session storage below before giving up.
  }

  try {
    window.sessionStorage?.setItem(CACHE_KEY, payload);
  } catch {
    // Try window.name below before giving up.
  }

  try {
    window.name = `${WINDOW_NAME_PREFIX}${payload}`;
    window.__TIDEFRAME_LIVE_CACHE__ = JSON.parse(payload);
  } catch {
    // Ignore storage failures so the dashboard can still render live data.
  }
};

export const getCachedConditions = (fallback) => {
  const cached = readCache();
  return cached?.conditions ? withCurrentDisplayTime({ ...fallback, ...cached.conditions }) : fallback;
};

const getFreshCachedConditions = (fallback) => {
  const cached = readCache();
  if (!cached?.conditions) return null;
  if (Date.now() - cached.savedAt > LIVE_CONDITIONS_CACHE_MS) return null;

  return withCurrentDisplayTime({ ...fallback, ...cached.conditions });
};

const getAnyCachedConditions = (fallback) => {
  const cached = readCache();
  return cached?.conditions ? withCurrentDisplayTime({ ...fallback, ...cached.conditions }) : null;
};

const apiUrl = () => {
  const params = new URLSearchParams({
    latitude: BEACH_HAVEN.latitude,
    longitude: BEACH_HAVEN.longitude,
    timezone: BEACH_HAVEN.timezone,
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    forecast_days: "4",
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    hourly: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index",
  });

  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
};

const sunUrl = () => {
  const params = new URLSearchParams({
    lat: BEACH_HAVEN.latitude,
    lng: BEACH_HAVEN.longitude,
    formatted: "0",
    tzid: BEACH_HAVEN.timezone,
  });

  return `https://api.sunrise-sunset.org/json?${params.toString()}`;
};

const nwsPointsUrl = () => `https://api.weather.gov/points/${BEACH_HAVEN.latitude},${BEACH_HAVEN.longitude}`;

const marineUrl = () => {
  const params = new URLSearchParams({
    latitude: BEACH_HAVEN.latitude,
    longitude: BEACH_HAVEN.longitude,
    timezone: BEACH_HAVEN.timezone,
    length_unit: "imperial",
    forecast_days: "4",
    current: "wave_height,swell_wave_height,wave_direction,wave_period,sea_surface_temperature",
    hourly: "wave_height,swell_wave_height,wave_direction,wave_period,sea_surface_temperature",
  });

  return `https://marine-api.open-meteo.com/v1/marine?${params.toString()}`;
};

const tideUrl = () => {
  const now = new Date();
  const threeDaysOut = new Date(now);
  threeDaysOut.setDate(now.getDate() + 3);

  const params = new URLSearchParams({
    begin_date: formatBeachDate(now),
    end_date: formatBeachDate(threeDaysOut),
    station: NOAA_TIDE_STATION,
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt",
    interval: "hilo",
    units: "english",
    format: "json",
  });

  return `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params.toString()}`;
};

const tideCurveUrl = () => {
  const now = new Date();
  const threeDaysOut = new Date(now);
  threeDaysOut.setDate(now.getDate() + 3);

  const params = new URLSearchParams({
    begin_date: formatBeachDate(now),
    end_date: formatBeachDate(threeDaysOut),
    station: NOAA_TIDE_STATION,
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt",
    units: "english",
    format: "json",
  });

  return `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params.toString()}`;
};

const waterTempUrl = () => {
  const params = new URLSearchParams({
    date: "latest",
    station: NOAA_TIDE_STATION,
    product: "water_temperature",
    time_zone: "lst_ldt",
    units: "english",
    format: "json",
  });

  return `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params.toString()}`;
};

const pickHourlyForecast = (hourly, currentTime) => {
  const currentHour = new Date(currentTime);
  currentHour.setMinutes(0, 0, 0);

  const startIndex = Math.max(
    0,
    hourly.time.findIndex((time) => new Date(time).getTime() >= currentHour.getTime())
  );

  return [0, 2, 4, 6].map((offset) => {
    const index = Math.min(startIndex + offset, hourly.time.length - 1);
    return {
      time: index === startIndex ? compactHour(new Date()) : compactHour(hourly.time[index]),
      speed: round(hourly.wind_speed_10m[index]),
      direction: compassFromDegrees(hourly.wind_direction_10m[index]),
      temp: round(hourly.temperature_2m[index]),
      realFeel: round(hourly.apparent_temperature[index]),
      condition: conditionFromCode(hourly.weather_code[index]),
      uv: Number.isFinite(Number(hourly.uv_index?.[index])) ? Math.round(Number(hourly.uv_index[index])) : null,
    };
  });
};

const pickNwsHourlyForecast = (periods, fallbackHourly, currentTime) => {
  if (!Array.isArray(periods) || periods.length === 0) return pickHourlyForecast(fallbackHourly, currentTime);

  const now = new Date();
  const firstIndex = Math.max(
    0,
    periods.findIndex((period) => new Date(period.endTime).getTime() > now.getTime())
  );
  const fallbackForecast = pickHourlyForecast(fallbackHourly, currentTime);

  return [0, 2, 4, 6].map((offset, outputIndex) => {
    const period = periods[Math.min(firstIndex + offset, periods.length - 1)];
    const fallback = fallbackForecast[outputIndex] ?? fallbackForecast[fallbackForecast.length - 1];
    return {
      time: outputIndex === 0 ? compactHour(new Date()) : compactHour(period.startTime),
      speed: fallback.speed,
      direction: fallback.direction,
      temp: Number.isFinite(Number(period.temperature)) ? round(period.temperature) : fallback.temp,
      realFeel: fallback.realFeel,
      condition: conditionFromForecast(period.shortForecast) || fallback.condition,
      uv: fallback.uv,
    };
  });
};

const fetchNwsHourlyForecast = async () => {
  const points = await fetchOptionalJson(nwsPointsUrl());
  const hourlyUrl = points?.properties?.forecastHourly;
  if (!hourlyUrl) return null;

  const hourly = await fetchOptionalJson(hourlyUrl);
  return hourly?.properties?.periods ?? null;
};

const fetchOptionalJson = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
};

const pickMarineIndex = (marine) => {
  if (!marine?.hourly?.time?.length) return 0;

  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  const index = marine.hourly.time.findIndex((time) => new Date(time).getTime() >= currentHour.getTime());
  return Math.max(0, index);
};

const pickMarineValue = (marine, field) => {
  const currentValue = marine?.current?.[field];
  if (Number.isFinite(Number(currentValue))) return currentValue;

  const hourlyIndex = pickMarineIndex(marine);
  return marine?.hourly?.[field]?.[hourlyIndex];
};

const waterTempFromMarine = (marine) => {
  const value = pickMarineValue(marine, "sea_surface_temperature");
  if (!Number.isFinite(Number(value))) return null;

  const unit = marine?.current_units?.sea_surface_temperature ?? marine?.hourly_units?.sea_surface_temperature ?? "";
  return unit.toLowerCase().includes("f") ? round(value) : celsiusToFahrenheit(value);
};

const conditionFromMarine = (fallback, marine, wind) => {
  if (!marine) return fallback.condition;

  const waveHeight = pickMarineValue(marine, "wave_height");
  const wavePeriod = pickMarineValue(marine, "wave_period");
  const waveDirection = pickMarineValue(marine, "wave_direction");
  const height = formatSurfHeight(waveHeight);
  const quality = surfQualityFromConditions({
    waveHeight: Number(waveHeight),
    windDirection: wind.direction,
    windSpeed: Number(wind.speed),
    windGusts: Number(wind.gusts),
  });

  return {
    ...fallback.condition,
    label: quality.label,
    ...(height ? { height } : {}),
    unit: "ft",
    ...(Number.isFinite(Number(wavePeriod)) ? { period: `${round(wavePeriod)}s` } : {}),
    ...(Number.isFinite(Number(waveDirection)) ? { direction: compassFromDegrees(waveDirection) } : {}),
    rating: quality.rating,
  };
};

const waterTempConditionFromMarine = (fallback, marine) => {
  const value = waterTempFromMarine(marine);
  return {
    ...fallback.waterTemp,
    ...(value ? { value, unit: "F" } : {}),
  };
};

const waterTempConditionFromNoaa = (fallback, waterTempData, marine) => {
  const latestValue = waterTempData?.data?.find((observation) => Number.isFinite(Number(observation.v)))?.v;
  if (Number.isFinite(Number(latestValue))) {
    return {
      ...fallback.waterTemp,
      value: round(latestValue),
      unit: "F",
    };
  }

  return waterTempConditionFromMarine(fallback, marine);
};

const trendGraphsFromMarine = (fallback, marine, windHourly) => {
  if (!marine?.hourly?.time?.length) return fallback.trendGraphs;

  const startIndex = pickMarineIndex(marine);
  const offsets = [0, 3, 6, 9, 12];
  const times = offsets.map((offset) => {
    const index = Math.min(startIndex + offset, marine.hourly.time.length - 1);
    return compactHour(marine.hourly.time[index]);
  });

  const waveHeight = offsets.map((offset) => {
    const index = Math.min(startIndex + offset, marine.hourly.wave_height.length - 1);
    return Number(Number(marine.hourly.wave_height[index]).toFixed(1));
  });

  const windStartIndex = windHourly?.time?.findIndex((time) => new Date(time).getTime() >= new Date(marine.hourly.time[startIndex]).getTime()) ?? -1;
  const windSpeed = offsets.map((offset) => {
    const index = Math.min(Math.max(0, windStartIndex) + offset, windHourly.wind_speed_10m.length - 1);
    return round(windHourly.wind_speed_10m[index]);
  });

  const windDirection = offsets.map((offset) => {
    const index = Math.min(Math.max(0, windStartIndex) + offset, windHourly.wind_direction_10m.length - 1);
    return compassFromDegrees(windHourly.wind_direction_10m[index]);
  });

  return {
    ...fallback.trendGraphs,
    times,
    waveHeight,
    windSpeed,
    windDirection,
  };
};

const outlookDayLabel = (date, index) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: BEACH_HAVEN.timezone,
  }).format(date);
};

const localDateKey = (value) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: BEACH_HAVEN.timezone,
  }).formatToParts(new Date(value));

  const date = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${date.year}-${date.month}-${date.day}`;
};

const localHour = (value) => {
  const hour = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: BEACH_HAVEN.timezone,
  }).format(new Date(value));

  return Number(hour);
};

const findHourlyIndex = (times, dayKey, targetHour) => {
  const indexes = times
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => localDateKey(time) === dayKey);

  if (!indexes.length) return -1;

  return indexes.reduce((closest, candidate) => {
    const currentDistance = Math.abs(localHour(candidate.time) - targetHour);
    const bestDistance = Math.abs(localHour(closest.time) - targetHour);
    return currentDistance < bestDistance ? candidate : closest;
  }).index;
};

const outlookRatingFromQuality = (quality) => {
  if (quality.rating >= 4) return "good";
  if (quality.rating >= 2) return "fair";
  return "poor";
};

const surfOutlookFromLiveData = (fallback, marine, windHourly) => {
  if (!marine?.hourly?.time?.length || !windHourly?.time?.length) return fallback.surfOutlook;

  const days = [...new Set(marine.hourly.time.map(localDateKey))].slice(0, 3);
  if (days.length < 3) return fallback.surfOutlook;

  return days.map((dayKey, dayIndex) => {
    const date = new Date(`${dayKey}T12:00:00`);

    const periodForecast = (period, targetHour) => {
      const marineIndex = findHourlyIndex(marine.hourly.time, dayKey, targetHour);
      const windIndex = findHourlyIndex(windHourly.time, dayKey, targetHour);
      const fallbackPeriod = fallback.surfOutlook?.[dayIndex]?.[period.toLowerCase()] ?? {};

      const waveHeight = Number(marine.hourly.wave_height?.[marineIndex]);
      const windSpeed = Number(windHourly.wind_speed_10m?.[windIndex]);
      const windDirection = compassFromDegrees(windHourly.wind_direction_10m?.[windIndex]);
      const windGusts = Number(windHourly.wind_gusts_10m?.[windIndex]);
      const quality = surfQualityFromConditions({
        waveHeight,
        windDirection,
        windSpeed,
        windGusts,
      });

      return {
        ...fallbackPeriod,
        height: Number.isFinite(waveHeight) ? `${Math.max(1, round(waveHeight))} ft` : fallbackPeriod.height,
        wind: Number.isFinite(windSpeed) ? String(round(windSpeed)) : fallbackPeriod.wind,
        direction: windDirection || fallbackPeriod.direction,
        rating: outlookRatingFromQuality(quality),
      };
    };

    return {
      ...(fallback.surfOutlook?.[dayIndex] ?? {}),
      day: outlookDayLabel(date, dayIndex),
      am: periodForecast("AM", 6),
      pm: periodForecast("PM", 15),
    };
  });
};

const tideFromPredictions = (fallback, tideData, tideCurveData) => {
  const predictions = tideData?.predictions;
  if (!Array.isArray(predictions) || predictions.length === 0) return fallback.tide;

  const now = new Date();
  const upcoming = predictions
    .map((prediction) => ({
      type: prediction.type,
      time: parseNoaaTime(prediction.t),
    }))
    .filter((prediction) => Number.isFinite(prediction.time.getTime()))
    .sort((a, b) => a.time - b.time);

  const future = upcoming.filter((prediction) => prediction.time >= now);
  const highs = future.filter((prediction) => prediction.type === "H").slice(0, 2);
  const lows = future.filter((prediction) => prediction.type === "L").slice(0, 2);
  const fallbackHighs = upcoming.filter((prediction) => prediction.type === "H").slice(0, 2);
  const fallbackLows = upcoming.filter((prediction) => prediction.type === "L").slice(0, 2);
  const highTimes = (highs.length ? highs : fallbackHighs).map((prediction) => formatClock(prediction.time));
  const lowTimes = (lows.length ? lows : fallbackLows).map((prediction) => formatClock(prediction.time));
  const curve = Array.isArray(tideCurveData?.predictions)
    ? tideCurveData.predictions
        .map((prediction) => ({
          time: parseNoaaTime(prediction.t).toISOString(),
          value: Number(prediction.v),
        }))
        .filter((prediction) => Number.isFinite(new Date(prediction.time).getTime()) && Number.isFinite(prediction.value))
    : fallback.tide.curve;
  const nextExtremes = future.length ? future.slice(0, 3) : upcoming.slice(0, 3);
  const extremes = nextExtremes.map((prediction) => ({
    type: prediction.type,
    time: prediction.time.toISOString(),
    label: prediction.type === "H" ? "High" : "Low",
    displayTime: formatClock(prediction.time),
  }));
  const dailyExtremes = upcoming.reduce((days, prediction) => {
    const dateKey = formatBeachDate(prediction.time);
    let day = days.find((item) => item.dateKey === dateKey);
    if (!day) {
      day = {
        dateKey,
        day: formatTideDay(prediction.time, now),
        highs: [],
        lows: [],
      };
      days.push(day);
    }

    if (prediction.type === "H") day.highs.push(formatClock(prediction.time));
    if (prediction.type === "L") day.lows.push(formatClock(prediction.time));

    return days;
  }, []).slice(0, 3).map(({ dateKey, ...day }) => day);

  return {
    ...fallback.tide,
    ...(highTimes.length ? { high: highTimes[0], highTimes } : {}),
    ...(lowTimes.length ? { low: lowTimes[0], lowTimes } : {}),
    ...(curve?.length ? { curve } : {}),
    ...(extremes.length ? { extremes } : {}),
    ...(dailyExtremes.length ? { dailyExtremes } : {}),
  };
};

const fetchLiveConditions = async (fallback) => {
  const [weatherResponse, sunResponse, marine, tideData, tideCurveData, waterTempData, nwsPeriods] = await Promise.all([
    fetch(apiUrl()),
    fetch(sunUrl()),
    fetchOptionalJson(marineUrl()),
    fetchOptionalJson(tideUrl()),
    fetchOptionalJson(tideCurveUrl()),
    fetchOptionalJson(waterTempUrl()),
    fetchNwsHourlyForecast(),
  ]);

  if (!weatherResponse.ok || !sunResponse.ok) {
    throw new Error("Unable to load live weather data");
  }

  const weather = await weatherResponse.json();
  const sun = await sunResponse.json();

  if (sun.status !== "OK") {
    throw new Error("Unable to load sunrise data");
  }

  const now = new Date();
  const current = weather.current;
  const hourlyForecast = pickNwsHourlyForecast(nwsPeriods, weather.hourly, current.time);
  const currentDirection = compassFromDegrees(current.wind_direction_10m);
  const currentWind = {
    ...fallback.wind,
    speed: round(current.wind_speed_10m),
    unit: "mph",
    direction: currentDirection,
    directionDegrees: round(current.wind_direction_10m),
    gusts: round(current.wind_gusts_10m),
    airTemp: round(current.temperature_2m),
    realFeel: round(current.apparent_temperature),
    hourlyForecast,
  };

  return {
    ...fallback,
    updatedAt: formatClock(now),
    currentTime: formatClock(now),
    wind: currentWind,
    condition: conditionFromMarine(fallback, marine, currentWind),
    waterTemp: waterTempConditionFromNoaa(fallback, waterTempData, marine),
    tide: tideFromPredictions(fallback, tideData, tideCurveData),
    trendGraphs: trendGraphsFromMarine(fallback, marine, weather.hourly),
    surfOutlook: surfOutlookFromLiveData(fallback, marine, weather.hourly),
    weather: {
      firstLight: formatClock(sun.results.civil_twilight_begin),
      sunrise: formatClock(sun.results.sunrise),
      lastLight: formatClock(sun.results.civil_twilight_end),
      sunset: formatClock(sun.results.sunset),
    },
  };
};

export const loadLiveConditions = async (fallback, { force = false } = {}) => {
  if (!force) {
    const cached = getFreshCachedConditions(fallback);
    if (cached) return cached;
  }

  try {
    const liveConditions = await fetchLiveConditions(fallback);
    writeConditionsCache(liveConditions);
    return liveConditions;
  } catch (error) {
    const cached = getAnyCachedConditions(fallback);
    if (cached) return cached;
    throw error;
  }
};

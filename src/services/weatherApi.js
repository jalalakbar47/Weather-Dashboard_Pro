const API_BASE = import.meta.env.VITE_WEATHER_API_BASE || 'https://api.weatherapi.com/v1';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

class WeatherApiError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
    this.details = details;
  }
}

const buildEndpoint = (query) => {
  const url = new URL(`${API_BASE}/forecast.json`);
  url.searchParams.set('key', API_KEY || '');
  url.searchParams.set('q', query);
  url.searchParams.set('days', '5');
  url.searchParams.set('aqi', 'yes');
  url.searchParams.set('alerts', 'yes');
  return url;
};

const normalizeAirQuality = (airQuality = {}) => {
  const explicitIndex = airQuality['us-epa-index'] ?? airQuality['gb-defra-index'];
  if (Number.isFinite(explicitIndex)) {
    return Math.max(1, Math.min(5, Math.round(explicitIndex)));
  }

  const pm25 = airQuality.pm2_5;
  if (!Number.isFinite(pm25)) {
    return null;
  }

  if (pm25 <= 12) return 1;
  if (pm25 <= 35.4) return 2;
  if (pm25 <= 55.4) return 3;
  if (pm25 <= 150.4) return 4;
  return 5;
};

const normalizeWeather = (data) => {
  const { location, current, forecast } = data;
  const today = forecast?.forecastday?.[0];

  return {
    location: {
      name: location?.name || 'Unknown city',
      region: location?.region || '',
      country: location?.country || '',
      localtime: location?.localtime || '',
      lat: location?.lat,
      lon: location?.lon,
    },
    current: {
      tempC: current?.temp_c,
      tempF: current?.temp_f,
      feelsLikeC: current?.feelslike_c,
      feelsLikeF: current?.feelslike_f,
      condition: current?.condition?.text || 'Unknown',
      icon: current?.condition?.icon || '',
      isDay: current?.is_day === 1,
      humidity: current?.humidity,
      windKph: current?.wind_kph,
      windMph: current?.wind_mph,
      pressureMb: current?.pressure_mb,
      pressureIn: current?.pressure_in,
      visibilityKm: current?.vis_km,
      visibilityMi: current?.vis_miles,
      uv: current?.uv,
      gustKph: current?.gust_kph,
      aqi: normalizeAirQuality(current?.air_quality),
      lastUpdated: current?.last_updated,
    },
    todayAstro: {
      sunrise: today?.astro?.sunrise || null,
      sunset: today?.astro?.sunset || null,
      moonrise: today?.astro?.moonrise || null,
      moonset: today?.astro?.moonset || null,
    },
    forecastDays: (forecast?.forecastday || []).map((day) => ({
      date: day.date,
      maxC: day.day?.maxtemp_c,
      minC: day.day?.mintemp_c,
      maxF: day.day?.maxtemp_f,
      minF: day.day?.mintemp_f,
      chanceOfRain: day.day?.daily_chance_of_rain,
      chanceOfSnow: day.day?.daily_chance_of_snow,
      condition: day.day?.condition?.text || 'Unknown',
      icon: day.day?.condition?.icon || '',
      totalRainMm: day.day?.totalprecip_mm,
      totalRainIn: day.day?.totalprecip_in,
      sunrise: day.astro?.sunrise || null,
      sunset: day.astro?.sunset || null,
      hours: (day.hour || []).map((hour) => ({
        time: hour.time,
        tempC: hour.temp_c,
        tempF: hour.temp_f,
        condition: hour.condition?.text || 'Unknown',
        icon: hour.condition?.icon || '',
        chanceOfRain: hour.chance_of_rain,
        humidity: hour.humidity,
        windKph: hour.wind_kph,
        windMph: hour.wind_mph,
      })),
    })),
    alerts: data.alerts?.alert || [],
  };
};

const requestWeather = async (query) => {
  if (!API_KEY) {
    throw new WeatherApiError(
      'Weather API key is missing. Add VITE_WEATHER_API_KEY to your .env file.',
      'MISSING_API_KEY',
    );
  }

  const response = await fetch(buildEndpoint(query));

  if (!response.ok) {
    let message = 'Unable to fetch weather data.';
    try {
      const errorBody = await response.json();
      message = errorBody?.error?.message || message;
    } catch {
      message = `${message} (${response.status})`;
    }

    throw new WeatherApiError(message, 'REQUEST_FAILED', { status: response.status });
  }

  const data = await response.json();
  return normalizeWeather(data);
};

export const getWeatherByCity = async (city) => requestWeather(city);
export const getWeatherByCoords = async (latitude, longitude) => requestWeather(`${latitude},${longitude}`);
export { WeatherApiError, normalizeWeather };

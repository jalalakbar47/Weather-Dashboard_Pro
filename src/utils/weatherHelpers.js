export const formatTemperature = (value, unit = 'c') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--';
  }

  return `${Math.round(value)}°${unit === 'f' ? 'F' : 'C'}`;
};

export const formatSpeed = (value, unit = 'metric') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--';
  }

  return unit === 'metric' ? `${Math.round(value)} km/h` : `${Math.round(value)} mph`;
};

export const formatDistance = (value, unit = 'metric') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--';
  }

  return unit === 'metric' ? `${Math.round(value)} km` : `${Math.round(value)} mi`;
};

export const getAqiLabel = (score) => {
  if (!score) return 'Unavailable';
  if (score <= 1) return 'Excellent';
  if (score === 2) return 'Good';
  if (score === 3) return 'Fair';
  if (score === 4) return 'Poor';
  return 'Very Poor';
};

export const getWeatherTone = (condition = '', isDay = true) => {
  const normalized = condition.toLowerCase();

  if (normalized.includes('thunder') || normalized.includes('storm')) {
    return 'storm';
  }

  if (normalized.includes('snow') || normalized.includes('sleet') || normalized.includes('ice')) {
    return 'snow';
  }

  if (normalized.includes('rain') || normalized.includes('drizzle') || normalized.includes('shower')) {
    return 'rain';
  }

  if (normalized.includes('cloud') || normalized.includes('overcast') || normalized.includes('mist') || normalized.includes('fog')) {
    return 'clouds';
  }

  return isDay ? 'sunny' : 'night';
};

export const getWeatherBackgroundClass = (condition = '', isDay = true) => {
  const tone = getWeatherTone(condition, isDay);
  return `theme-${tone}`;
};

export const getWeatherIconFallback = (condition = '') => {
  const normalized = condition.toLowerCase();
  if (normalized.includes('thunder') || normalized.includes('storm')) return 'cloud-lightning';
  if (normalized.includes('snow')) return 'snowflake';
  if (normalized.includes('rain') || normalized.includes('drizzle')) return 'cloud-rain';
  if (normalized.includes('cloud')) return 'cloud';
  if (normalized.includes('mist') || normalized.includes('fog')) return 'cloud-fog';
  return 'sun-medium';
};

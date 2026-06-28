export const formatDateLabel = (value, options = {}) => {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
};

export const formatTimeLabel = (value, options = {}) => {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  }).format(date);
};

export const formatLocalTime = (value) => {
  if (!value) {
    return '';
  }

  return value.replace(' ', ' • ');
};

export const formatShortDay = (value) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(value));
};

export const formatForecastDay = (value) => {
  if (!value) {
    return { day: '', date: '' };
  }

  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
    date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date),
  };
};

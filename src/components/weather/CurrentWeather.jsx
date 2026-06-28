import { Star, MapPin, Clock3 } from 'lucide-react';
import { getWeatherTone, formatTemperature } from '../../utils/weatherHelpers';
import { formatLocalTime } from '../../utils/dateFormatter';

const resolveIcon = (icon) => (icon?.startsWith('//') ? `https:${icon}` : icon);

const CurrentWeather = ({ weather, unit, isFavorite, onFavoriteToggle }) => {
  if (!weather) {
    return null;
  }

  const { location, current, todayAstro } = weather;
  const temp = unit === 'imperial' ? current.tempF : current.tempC;
  const feelsLike = unit === 'imperial' ? current.feelsLikeF : current.feelsLikeC;
  const cityLabel = [location.name, location.country].filter(Boolean).join(', ');
  const toneClass = `weather-summary__hero--${getWeatherTone(current.condition, current.isDay)}`;

  return (
    <section className="panel current-weather-card">
      <div className={`current-weather-layout weather-summary__hero ${toneClass}`}>
        <div className="current-weather-main">
          <div className="current-weather-header">
            <div>
              <h3 className="current-weather-title">Current Weather</h3>
              <p className="current-weather-subtitle">Live conditions and location overview</p>
            </div>
            <button className="icon-button icon-button--ghost" type="button" onClick={onFavoriteToggle} aria-pressed={isFavorite} aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}>
              <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              <span className="temperature-value">{isFavorite ? 'Saved' : 'Favorite'}</span>
            </button>
          </div>

          <div className="current-weather-badges">
            <span className="badge">
              <MapPin size={16} />
              {cityLabel}
            </span>
            <span className="badge">
              <Clock3 size={16} />
              {formatLocalTime(location.localtime)}
            </span>
          </div>

          <div className="current-weather-location">
            <h4 className="current-weather-city">{location.name}</h4>
            <p className="current-weather-region">{location.region ? `${location.region} · ` : ''}{location.country}</p>
          </div>

          <div className="current-weather-content">
            {current.icon ? <img src={resolveIcon(current.icon)} alt={current.condition} className="current-weather-icon" /> : null}
            <div>
              <p className="current-weather-condition">{current.condition}</p>
              <p className="temperature-value current-weather-temp">{formatTemperature(temp, unit === 'imperial' ? 'f' : 'c')}</p>
            </div>
          </div>
        </div>

        <div className="current-weather-details">
          <div className="weather-meta-grid">
            <div className="weather-card-meta__item">
              <span>Feels like</span>
              <strong className="temperature-value">{formatTemperature(feelsLike, unit === 'imperial' ? 'f' : 'c')}</strong>
            </div>
            <div className="weather-card-meta__item">
              <span>Last updated</span>
              <strong>{formatLocalTime(current.lastUpdated)}</strong>
            </div>
            <div className="weather-card-meta__item">
              <span>Sunrise</span>
              <strong>{todayAstro.sunrise || '--'}</strong>
            </div>
            <div className="weather-card-meta__item">
              <span>Sunset</span>
              <strong>{todayAstro.sunset || '--'}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;

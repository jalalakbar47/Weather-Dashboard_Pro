import { CloudRain, Droplets, SunMedium } from 'lucide-react';
import { formatTimeLabel, formatForecastDay } from '../../utils/dateFormatter';
import { formatTemperature } from '../../utils/weatherHelpers';

const resolveIcon = (icon) => (icon?.startsWith('//') ? `https:${icon}` : icon);

const ForecastCard = ({ item, unit, variant = 'daily' }) => {
  const tempKey = unit === 'imperial' ? 'tempF' : 'tempC';
  const minKey = unit === 'imperial' ? 'minF' : 'minC';
  const maxKey = unit === 'imperial' ? 'maxF' : 'maxC';

  const dayParts = variant === 'daily' ? formatForecastDay(item.date) : null;
  const label = variant === 'hourly' ? formatTimeLabel(item.time) : '';
  const chanceOfRain = item.chanceOfRain ?? 0;

  return (
    <article className={variant === 'hourly' ? 'hourly-card forecast-card' : 'forecast-card'}>
      <div className="forecast-card__date">
        {variant === 'daily' ? (
          <>
            <strong>{dayParts?.day}</strong>
            <span>{dayParts?.date}</span>
          </>
        ) : (
          <strong>{label}</strong>
        )}
      </div>
      <div className="forecast-card__icon">
        {item.icon ? <img src={resolveIcon(item.icon)} alt={item.condition} /> : null}
        <div>
          <strong>{item.condition}</strong>
          <div className="muted-text" style={{ marginTop: '4px' }}>{chanceOfRain}% rain</div>
        </div>
      </div>
      <div className="forecast-card__temps">
        {variant === 'hourly' ? (
          <strong>{formatTemperature(item[tempKey], unit === 'imperial' ? 'f' : 'c')}</strong>
        ) : (
          <>
            <strong>{formatTemperature(item[maxKey], unit === 'imperial' ? 'f' : 'c')}</strong>
            <span style={{ color: 'var(--muted)' }}>{formatTemperature(item[minKey], unit === 'imperial' ? 'f' : 'c')}</span>
          </>
        )}
      </div>
      {variant === 'hourly' ? (
        <div className="forecast-card__meta forecast-card__meta--hourly">
          <Droplets size={14} />
          {item.humidity}% humidity
        </div>
      ) : (
        <div className="forecast-card__meta">
          <SunMedium size={14} />
          {item.sunrise || '--'} sunrise
          <CloudRain size={14} style={{ marginLeft: '6px' }} />
          {item.totalRainMm ?? '--'} mm
        </div>
      )}
    </article>
  );
};

export default ForecastCard;

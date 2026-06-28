import { Droplets, Eye, Gauge, SunMedium, Sunrise, Sunset, ThermometerSun, Wind } from 'lucide-react';
import { formatDistance, formatSpeed, formatTemperature, getAqiLabel } from '../../utils/weatherHelpers';

const WeatherHighlights = ({ weather, unit }) => {
  if (!weather) {
    return null;
  }

  const { current, todayAstro } = weather;
  const windValue = unit === 'imperial' ? formatSpeed(current.windMph, 'imperial') : formatSpeed(current.windKph, 'metric');
  const visibilityValue = unit === 'imperial' ? formatDistance(current.visibilityMi, 'imperial') : formatDistance(current.visibilityKm, 'metric');
  const feelsLikeValue = unit === 'imperial' ? formatTemperature(current.feelsLikeF, 'f') : formatTemperature(current.feelsLikeC, 'c');

  const items = [
    { label: 'Feels like', value: feelsLikeValue, icon: ThermometerSun },
    { label: 'Humidity', value: `${current.humidity ?? '--'}%`, icon: Droplets },
    { label: 'Wind speed', value: windValue, icon: Wind },
    { label: 'Pressure', value: `${current.pressureMb ?? '--'} mb`, icon: Gauge },
    { label: 'Visibility', value: visibilityValue, icon: Eye },
    { label: 'Sunrise', value: todayAstro.sunrise || '--', icon: Sunrise },
    { label: 'Sunset', value: todayAstro.sunset || '--', icon: Sunset },
    { label: 'Air Quality', value: getAqiLabel(current.aqi), meta: current.aqi ? `AQI ${current.aqi}` : 'If supported by the API', icon: SunMedium },
  ];

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h3>Weather Highlights</h3>
          <p>At-a-glance conditions, daylight, and atmosphere</p>
        </div>
      </div>
      <div className="panel__body">
        <div className="highlights-grid">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div className="highlight-card" key={item.label}>
                <div className="highlight-card__label">
                  <Icon size={16} />
                  {item.label}
                </div>
                <div className="highlight-card__value">{item.value}</div>
                {item.meta ? <div className="highlight-card__meta">{item.meta}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WeatherHighlights;

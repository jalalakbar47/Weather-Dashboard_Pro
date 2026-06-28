import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ForecastCard from './ForecastCard';

const ForecastList = ({ title, subtitle, items = [], unit, variant = 'daily' }) => {
  const [expanded, setExpanded] = useState(false);
  const trackRef = useRef(null);

  const visibleItems = useMemo(() => {
    if (variant !== 'hourly') {
      return items;
    }

    return expanded ? items : items.slice(0, 12);
  }, [expanded, items, variant]);

  if (!items.length) {
    return (
      <section className="panel dashboard-grid__span-12">
        <div className="panel__header">
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        </div>
        <div className="panel__body">
          <p className="muted-text" style={{ margin: 0 }}>No forecast data is available yet.</p>
        </div>
      </section>
    );
  }

  const scrollTrack = (direction) => {
    if (!trackRef.current) {
      return;
    }

    trackRef.current.scrollBy({ left: direction * 420, behavior: 'smooth' });
  };

  return (
    <section className={`panel dashboard-grid__span-12 ${variant === 'hourly' ? 'hourly-section' : ''}`}>
      <div className={variant === 'hourly' ? 'hourly-header panel__header' : 'panel__header'}>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {variant === 'hourly' ? (
          <div className="hourly-controls">
            <div className="forecast-carousel__nav-group">
              <button className="forecast-carousel__nav" type="button" onClick={() => scrollTrack(-1)} aria-label="Scroll hourly forecast left">
                <ChevronLeft size={16} />
              </button>
              <button className="forecast-carousel__nav" type="button" onClick={() => scrollTrack(1)} aria-label="Scroll hourly forecast right">
                <ChevronRight size={16} />
              </button>
            </div>
            <button className="forecast-carousel__toggle show-more-button" type="button" onClick={() => setExpanded((current) => !current)}>
              {expanded ? 'Show Less' : `Show More (${items.length - 12})`}
            </button>
          </div>
        ) : null}
      </div>
      <div className="panel__body">
        <div ref={trackRef} className={variant === 'hourly' ? 'hourly-scroll hide-scrollbar' : 'forecast-grid'}>
          {visibleItems.map((item) => (
            <ForecastCard key={item.time || item.date} item={item} unit={unit} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForecastList;

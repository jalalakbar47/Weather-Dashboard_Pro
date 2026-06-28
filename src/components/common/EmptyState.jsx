import { Sparkles } from 'lucide-react';

const EmptyState = ({ onUseLocation, hasFavorites, hasRecent, onFavoriteClick, onRecentClick, favorites = [], recents = [] }) => (
  <div className="empty-state panel">
    <div>
      <div className="empty-state__icon">
        <Sparkles size={36} />
      </div>
      <h3>Start with a city or your current location</h3>
      <p>
        Search any city to reveal a polished weather dashboard with current conditions, 5-day forecasts, hourly trends,
        charts, favorites, and local persistence.
      </p>
    </div>
    <div className="section-stack empty-state__actions">
      <button className="search-bar__button" type="button" onClick={onUseLocation} aria-label="Use my location">
        Use My Location
      </button>
      {hasFavorites && (
        <div className="section-stack">
          <strong>Favorites</strong>
          <div className="sidebar-list">
            {favorites.map((city) => (
              <button className="chip-button" key={city} type="button" onClick={() => onFavoriteClick(city)}>
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
      {hasRecent && (
        <div className="section-stack">
          <strong>Recent searches</strong>
          <div className="sidebar-list">
            {recents.map((city) => (
              <button className="chip-button chip-button--ghost" key={city} type="button" onClick={() => onRecentClick(city)}>
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default EmptyState;

import { Star } from 'lucide-react';

const FavoriteCities = ({ favorites = [], onSelect, onClear, onViewAll, showAll = false }) => (
  <section className="panel sidebar-section section-card">
    <div className="panel__header panel__header--compact" style={{ marginBottom: '14px' }}>
      <div>
        <h3>Favorite Cities</h3>
        <p>Saved locations for quick access</p>
      </div>
      {favorites.length ? (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {favorites.length > 5 ? (
            <button className="clear-button" type="button" onClick={onViewAll} aria-label={showAll ? 'Show fewer favorite cities' : 'View all favorite cities'}>
              {showAll ? 'Show Less' : 'View All'}
            </button>
          ) : null}
          <button className="clear-button" type="button" onClick={onClear} aria-label="Clear favorite cities">
            Clear
          </button>
        </div>
      ) : null}
    </div>
    <div className="sidebar-list">
      {favorites.length ? (
        favorites.slice(0, showAll ? favorites.length : 5).map((city) => (
          <button className="pill-button" key={city} type="button" onClick={() => onSelect(city)} title={city}>
            <Star size={14} />
            {city}
          </button>
        ))
      ) : (
        <p className="sidebar-empty" style={{ margin: 0 }}>No saved cities yet. Use the star in the weather card to save one.</p>
      )}
    </div>
  </section>
);

export default FavoriteCities;

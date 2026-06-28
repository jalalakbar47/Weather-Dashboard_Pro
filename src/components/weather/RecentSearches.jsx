import { Clock3 } from 'lucide-react';

const RecentSearches = ({ searches = [], onSelect, onClear, onViewAll, showAll = false }) => (
  <section className="panel sidebar-section section-card">
    <div className="panel__header panel__header--compact" style={{ marginBottom: '14px' }}>
      <div>
        <h3>Recent Searches</h3>
        <p>Quick revisit of past lookups</p>
      </div>
      {searches.length ? (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {searches.length > 5 ? (
            <button className="clear-button" type="button" onClick={onViewAll} aria-label={showAll ? 'Show fewer recent searches' : 'View all recent searches'}>
              {showAll ? 'Show Less' : 'View All'}
            </button>
          ) : null}
          <button className="clear-button" type="button" onClick={onClear} aria-label="Clear recent searches">
            Clear
          </button>
        </div>
      ) : null}
    </div>
    <div className="sidebar-list">
      {searches.length ? (
        searches.slice(0, showAll ? searches.length : 5).map((city) => (
          <button className="chip-button" key={city} type="button" onClick={() => onSelect(city)} title={city}>
            <Clock3 size={14} />
            {city}
          </button>
        ))
      ) : (
        <p className="sidebar-empty" style={{ margin: 0 }}>Your recent lookups will appear here.</p>
      )}
    </div>
  </section>
);

export default RecentSearches;

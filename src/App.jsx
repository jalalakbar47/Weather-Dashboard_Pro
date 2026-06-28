import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Sparkles } from 'lucide-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SearchBar from './components/weather/SearchBar';
import CurrentWeather from './components/weather/CurrentWeather';
import ForecastList from './components/weather/ForecastList';
import WeatherHighlights from './components/weather/WeatherHighlights';
import WeatherChart from './components/weather/WeatherChart';
import FavoriteCities from './components/weather/FavoriteCities';
import RecentSearches from './components/weather/RecentSearches';
import Loader from './components/common/Loader';
import EmptyState from './components/common/EmptyState';
import Toast from './components/common/Toast';
import { getWeatherByCity, getWeatherByCoords, WeatherApiError } from './services/weatherApi';
import { readStorage, writeStorage } from './utils/localStorage';
import { getWeatherBackgroundClass } from './utils/weatherHelpers';

const STORAGE_KEYS = {
  theme: 'wdp-theme',
  unit: 'wdp-unit',
  favorites: 'wdp-favorites',
  recents: 'wdp-recents',
  lastQuery: 'wdp-last-query',
};

const buildHourlyForecast = (forecastDays = []) => {
  const now = Date.now();
  const hours = forecastDays.flatMap((day) => day.hours || []).map((hour) => ({
    ...hour,
    timestamp: new Date(hour.time).getTime(),
  }));

  const upcoming = hours.filter((hour) => Number.isFinite(hour.timestamp) && hour.timestamp >= now - 60 * 60 * 1000);
  const sliced = upcoming.length ? upcoming : hours;
  return sliced.slice(0, 24);
};

const getLocationLabel = (location) => [location?.name, location?.country].filter(Boolean).join(', ');

function App() {
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, 'dark'));
  const [unit, setUnit] = useState(() => readStorage(STORAGE_KEYS.unit, 'metric'));
  const [favorites, setFavorites] = useState(() => readStorage(STORAGE_KEYS.favorites, []));
  const [recentSearches, setRecentSearches] = useState(() => readStorage(STORAGE_KEYS.recents, []));
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [showAllRecents, setShowAllRecents] = useState(false);
  const didInit = useRef(false);
  const toastId = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.unit, unit);
  }, [unit]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.recents, recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    if (didInit.current) {
      return;
    }

    didInit.current = true;
    const savedQuery = readStorage(STORAGE_KEYS.lastQuery, '');
    if (savedQuery) {
      fetchWeather(savedQuery, { silent: true });
    }
  }, []);

  useEffect(() => {
    if (weather?.location?.name) {
      document.title = `${weather.location.name} | Weather Dashboard Pro`;
    } else {
      document.title = 'Weather Dashboard Pro';
    }
  }, [weather]);

  const pushToast = (message, type = 'info') => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const fetchWeather = async (value, options = {}) => {
    const queryValue = `${value}`.trim();

    if (!queryValue) {
      setError('Please enter a city name.');
      pushToast('Please enter a city name.', 'error');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = options.coords
        ? await getWeatherByCoords(options.coords.latitude, options.coords.longitude)
        : await getWeatherByCity(queryValue);

      const hourlyForecast = buildHourlyForecast(data.forecastDays);
      const normalizedWeather = {
        ...data,
        hourlyForecast,
      };

      setWeather(normalizedWeather);
      setQuery(data.location?.name || queryValue);
      writeStorage(STORAGE_KEYS.lastQuery, data.location?.name || queryValue);
      setRecentSearches((current) => {
        const next = [getLocationLabel(data.location), ...current.filter((item) => item !== getLocationLabel(data.location))];
        return next.slice(0, 8);
      });
      if (!options.silent) {
        pushToast(`Loaded weather for ${getLocationLabel(data.location)}`, 'success');
      }
    } catch (requestError) {
      const message = requestError instanceof WeatherApiError ? requestError.message : 'Unable to load weather data.';
      setError(message);
      pushToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchWeather(query);
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      const message = 'Geolocation is not supported by this browser.';
      setError(message);
      pushToast(message, 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeather('current location', {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          silent: true,
        });
        pushToast('Weather loaded from your location.', 'success');
      },
      () => {
        const message = 'Location access was denied. Please enable it to use your current position.';
        setError(message);
        pushToast(message, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleFavoriteToggle = () => {
    if (!weather?.location?.name) {
      return;
    }

    const label = getLocationLabel(weather.location);
    setFavorites((current) => {
      const isFavorite = current.includes(label);
      const next = isFavorite ? current.filter((city) => city !== label) : [label, ...current].slice(0, 10);
      pushToast(isFavorite ? `${label} removed from favorites.` : `${label} added to favorites.`, 'info');
      return next;
    });
  };

  const handleFavoriteSelect = async (city) => {
    setQuery(city);
    await fetchWeather(city);
  };

  const handleRecentSelect = async (city) => {
    setQuery(city);
    await fetchWeather(city);
  };

  const clearFavorites = () => setFavorites([]);
  const clearRecents = () => setRecentSearches([]);

  const currentBackground = weather
    ? getWeatherBackgroundClass(weather.current.condition, weather.current.isDay)
    : theme === 'light'
      ? 'theme-sunny'
      : 'theme-night';

  const shellClassName = `app-shell ${currentBackground}`;

  return (
    <div className={shellClassName}>
      <Toast toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />

      <div className="dashboard-container">
        <Header theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} unit={unit} onUnitChange={setUnit} />

        <section className="dashboard__hero">
          <div className="dashboard__hero-grid">
            <div className="hero-copy">
              <span className="badge" style={{ marginBottom: '14px' }}>
                <Sparkles size={16} />
                Portfolio-ready weather intelligence
              </span>
              <h2>Beautiful weather insights, forecasts, charts, and saved cities in one elegant dashboard.</h2>
              <p>
                Search any city, switch between Celsius and Fahrenheit, inspect the 5-day outlook, and keep your favorite locations and recent searches in sync with LocalStorage.
              </p>
            </div>

            <div className="hero-metrics">
              <div className="hero-metric">
                <strong>5-day forecast</strong>
                <span>Daily planning with hourly support</span>
              </div>
              <div className="hero-metric">
                <strong>Geolocation</strong>
                <span>Use your current position instantly</span>
              </div>
              <div className="hero-metric">
                <strong>Dark mode</strong>
                <span>Premium glassmorphism interface</span>
              </div>
              <div className="hero-metric">
                <strong>Charts & highlights</strong>
                <span>Useful metrics and temperature trends</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <SearchBar query={query} onQueryChange={setQuery} onSearch={handleSearch} onUseLocation={handleUseLocation} loading={loading} />
          </div>
        </section>

        {error ? (
          <section className="panel" style={{ marginTop: '20px' }}>
            <div className="panel__body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: '0 0 8px' }}>Weather lookup failed</h3>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{error}</p>
              </div>
              <button className="icon-button" type="button" onClick={() => (weather?.location?.name ? fetchWeather(weather.location.name) : fetchWeather(query))}>
                <RefreshCcw size={18} />
                Retry
              </button>
            </div>
          </section>
        ) : null}

        <div className="dashboard-grid">
          <main className="dashboard-grid__weather">
            {loading ? (
              <section className="panel">
                <div className="panel__body">
                  <Loader label="Loading the latest weather forecast" />
                </div>
              </section>
            ) : weather ? (
              <>
                <CurrentWeather
                  weather={weather}
                  unit={unit}
                  isFavorite={favorites.includes(getLocationLabel(weather.location))}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </>
            ) : (
              <EmptyState
                onUseLocation={handleUseLocation}
                hasFavorites={favorites.length > 0}
                hasRecent={recentSearches.length > 0}
                onFavoriteClick={handleFavoriteSelect}
                onRecentClick={handleRecentSelect}
                favorites={favorites}
                recents={recentSearches}
              />
            )}
          </main>

          <aside className="dashboard-grid__sidebar">
            <FavoriteCities
              favorites={favorites}
              onSelect={handleFavoriteSelect}
              onClear={clearFavorites}
              onViewAll={() => setShowAllFavorites((current) => !current)}
              showAll={showAllFavorites}
            />
            <RecentSearches
              searches={recentSearches}
              onSelect={handleRecentSelect}
              onClear={clearRecents}
              onViewAll={() => setShowAllRecents((current) => !current)}
              showAll={showAllRecents}
            />
          </aside>

          {weather ? (
            <>
              <div className="dashboard-grid__span-12">
                <WeatherHighlights weather={weather} unit={unit} />
              </div>
              <div className="dashboard-grid__span-12">
                <WeatherChart items={weather.hourlyForecast} unit={unit} />
              </div>
              <div className="dashboard-grid__span-12">
                <ForecastList
                  title="5-Day Forecast"
                  subtitle="Daily highs, lows, and conditions"
                  items={weather.forecastDays}
                  unit={unit}
                  variant="daily"
                />
              </div>
              <div className="dashboard-grid__span-12">
                <ForecastList
                  title="Hourly Forecast"
                  subtitle="The next 24 hours in three-hour slices"
                  items={weather.hourlyForecast}
                  unit={unit}
                  variant="hourly"
                />
              </div>
              {weather.alerts?.length ? (
                <section className="panel dashboard-grid__span-12">
                  <div className="panel__header">
                    <div>
                      <h3>Weather Alerts</h3>
                      <p>Active notices from the provider</p>
                    </div>
                  </div>
                  <div className="panel__body">
                    {weather.alerts.map((alert) => (
                      <article className="card" key={alert.headline || alert.effective} style={{ padding: '16px', marginBottom: '12px' }}>
                        <strong>{alert.headline}</strong>
                        <p style={{ margin: '8px 0 0', color: 'var(--muted)', lineHeight: 1.65 }}>{alert.desc}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;

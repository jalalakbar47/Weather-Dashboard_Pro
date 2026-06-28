const Loader = ({ label = 'Loading weather data' }) => (
  <div className="loader" role="status" aria-live="polite" aria-busy="true">
    <div className="loader__spinner" />
    <span>{label}</span>
    <div className="loader__skeleton">
      <div className="loader__line loader__line--wide" />
      <div className="loader__line" />
      <div className="loader__cards">
        <div className="loader__card" />
        <div className="loader__card" />
        <div className="loader__card" />
      </div>
    </div>
  </div>
);

export default Loader;

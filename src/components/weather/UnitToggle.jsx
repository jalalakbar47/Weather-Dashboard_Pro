const UnitToggle = ({ unit, onChange }) => (
  <div className="segment-toggle" role="group" aria-label="Temperature unit">
    <button
      className={`segment-button ${unit === 'metric' ? 'segment-button--active' : 'segment-button--ghost'}`}
      type="button"
      onClick={() => onChange('metric')}
      aria-pressed={unit === 'metric'}
    >
      °C
    </button>
    <button
      className={`segment-button ${unit === 'imperial' ? 'segment-button--active' : 'segment-button--ghost'}`}
      type="button"
      onClick={() => onChange('imperial')}
      aria-pressed={unit === 'imperial'}
    >
      °F
    </button>
  </div>
);

export default UnitToggle;

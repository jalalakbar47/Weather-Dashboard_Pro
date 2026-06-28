import { CloudSun } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import UnitToggle from '../weather/UnitToggle';

const Header = ({ theme, onToggleTheme, unit, onUnitChange }) => (
  <header className="dashboard__topbar">
    <div className="brand">
      <div className="brand__mark">
        <CloudSun size={26} />
      </div>
      <div className="brand__text">
        <h1>Weather Dashboard Pro</h1>
        <p>Premium weather intelligence for your portfolio</p>
      </div>
    </div>

    <div className="topbar__actions">
      <UnitToggle unit={unit} onChange={onUnitChange} />
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  </header>
);

export default Header;

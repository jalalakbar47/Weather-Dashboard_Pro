import { MoonStar, SunMedium } from 'lucide-react';

const ThemeToggle = ({ theme, onToggle }) => {
  const isLight = theme === 'light';

  return (
    <button className="icon-button icon-button--ghost" type="button" onClick={onToggle} aria-label="Toggle theme">
      {isLight ? <MoonStar size={18} /> : <SunMedium size={18} />}
      <span>{isLight ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default ThemeToggle;

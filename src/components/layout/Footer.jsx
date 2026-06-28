import { Github } from 'lucide-react';

const Footer = () => (
  <footer className="footer">
    <p className="footer__brand">
      <Github size={15} />
      <span>Weather Dashboard Pro • v1.0.0</span>
    </p>
    <p className="footer__meta">
      <Github size={15} />
      <span>Created with ❤️ by Jalal Akbar</span>
      <span>© 2026 Jalal Akbar</span>
    </p>
    <p className="footer__dedication">Dedicated To My ❤️ J/S — My Inspiration.</p>
  </footer>
);

export default Footer;

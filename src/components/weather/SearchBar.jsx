import { LocateFixed, Search } from 'lucide-react';

const SearchBar = ({ query, onQueryChange, onSearch, onUseLocation, loading }) => (
  <form className="search-bar" onSubmit={onSearch}>
    <input
      className="search-bar__input"
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      type="text"
      placeholder="Search a city, e.g. London, Dubai, Karachi"
      aria-label="Search city"
    />
    <button className="search-bar__button" type="submit" disabled={loading}>
      <Search size={18} />
      Search
    </button>
    <button className="icon-button icon-button--ghost" type="button" onClick={onUseLocation} disabled={loading}>
      <LocateFixed size={18} />
      Use My Location
    </button>
  </form>
);

export default SearchBar;

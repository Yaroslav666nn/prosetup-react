import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styles from './Header.module.css';
import playersData from '../../data/players.json';

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return playersData
      .filter((player) => {
        const searchableText = [
          player.nickname,
          player.realName,
          player.team,
          player.game,
        ].join(' ').toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [query]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (results.length > 0) {
      navigate(`/player/${results[0].id}`);
      setQuery('');
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>ProSetup</Link>
      
      <nav className={styles.nav}>
        <Link to="/players" className={styles['nav-link']}>Гравці</Link>
        <Link to="/ranking" className={styles['nav-link']}>Рейтинг девайсів</Link>
      </nav>
      
      <form className={styles.search} onSubmit={handleSubmit}>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Знайти гравця..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Пошук гравця"
        />
        <button className={styles.searchButton} type="submit">
          Пошук
        </button>

        {query && (
          <div className={styles.searchPanel}>
            {results.length > 0 ? (
              results.map((player) => (
                <Link
                  key={player.id}
                  to={`/player/${player.id}`}
                  className={styles.searchResult}
                  onClick={() => setQuery('')}
                >
                  <span className={styles.resultName}>{player.nickname}</span>
                  <span className={styles.resultMeta}>{player.team} · {player.game}</span>
                </Link>
              ))
            ) : (
              <div className={styles.emptyResult}>Нічого не знайдено</div>
            )}
          </div>
        )}
      </form>
    </header>
  );
};

export default Header;

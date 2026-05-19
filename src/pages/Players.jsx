import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PlayerTable from '../components/PlayerTable/PlayerTable';
import playersData from '../data/players.json';
import styles from './Home/Home.module.css';

const Players = () => {
  const location = useLocation();
  const [selectedGame, setSelectedGame] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('game') || 'All';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const g = params.get('game') || 'All';
    setSelectedGame(g);
  }, [location.search]);

  const games = ['All', ...new Set(playersData.map((p) => p.game))];

  const filteredPlayers = useMemo(() => {
    if (selectedGame === 'All') return playersData;
    return playersData.filter((player) => player.game === selectedGame);
  }, [selectedGame]);

  return (
    <div className={styles.page}>
      <section className={styles.toolbar}>
        <div>
          <h2>Гравці</h2>
          <p>{filteredPlayers.length} профілів у поточному фільтрі</p>
        </div>

        <div className={styles.filters}>
          {games.map((game) => (
            <button
              key={game}
              className={game === selectedGame ? styles.activeFilter : styles.filter}
              type="button"
              onClick={() => setSelectedGame(game)}
            >
              {game === 'All' ? 'Усі' : game}
            </button>
          ))}
        </div>
      </section>

      <PlayerTable players={filteredPlayers} />
    </div>
  );
};

export default Players;

import { useMemo, useState } from 'react';
import PlayerTable from '../../components/PlayerTable/PlayerTable';
import playersData from '../../data/players.json';
import styles from './Home.module.css';

const Home = () => {
  const [selectedGame, setSelectedGame] = useState('All');
  const games = ['All', ...new Set(playersData.map((player) => player.game))];

  const filteredPlayers = useMemo(() => {
    if (selectedGame === 'All') {
      return playersData;
    }

    return playersData.filter((player) => player.game === selectedGame);
  }, [selectedGame]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Esports settings database</span>
          <h1>Професійні сетапи гравців</h1>
          <p>
            Швидко знаходь DPI, sensitivity, роздільну здатність, монітори та мишки
            кіберспортсменів з CS2, Valorant і Dota 2.
          </p>
        </div>

        <div className={styles.heroPanel}>
          <span className={styles.panelValue}>{playersData.length}</span>
          <span className={styles.panelLabel}>гравців у базі</span>
          <div className={styles.panelGrid}>
            <span>CS2</span>
            <span>Valorant</span>
            <span>Dota 2</span>
          </div>
        </div>
      </section>

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

export default Home;

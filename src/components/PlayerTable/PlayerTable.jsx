import styles from './PlayerTable.module.css';
import playersData from '../../data/players.json';
import PlayerCard from '../PlayerCard/PlayerCard';

const PlayerTable = () => {
  return (
    <div className={styles['table-container']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Гравець</th>
            <th className={styles.th}>Команда</th>
            <th className={styles.th}>Гра</th>
            <th className={styles.th}>Мишка (DPI)</th>
            <th className={styles.th}>Монітор (Res)</th>
          </tr>
        </thead>
        <tbody>
          {playersData.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
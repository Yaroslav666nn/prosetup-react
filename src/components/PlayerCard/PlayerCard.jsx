import { Link } from 'react-router-dom';
import styles from './PlayerCard.module.css';
import { getPlayerImage } from '../../utils/playerImages';

const PlayerCard = ({ player }) => {
  const playerImage = getPlayerImage(player);

  return (
    <tr className={styles['player-row']}>
      <td className={styles.cell}>
        <Link to={`/player/${player.id}`} className={styles['nick-wrapper']}>
          <span className={styles.avatar}>
            {playerImage ? (
              <img src={playerImage} alt={`${player.nickname} avatar`} />
            ) : (
              player.nickname.slice(0, 2)
            )}
          </span>
          <span>
            <span className={styles.nickname}>{player.nickname}</span>
            <span className={styles['real-name']}>{player.realName}</span>
          </span>
        </Link>
      </td>
      <td className={styles.cell}>{player.team}</td>
      <td className={styles.cell}>{player.game}</td>
      <td className={styles.cell}>
        {player.gear.mouse} ({player.settings.dpi} DPI)
      </td>
      <td className={styles.cell}>
        {player.gear.monitor} ({player.settings.resolution})
      </td>
    </tr>
  );
};

export default PlayerCard;

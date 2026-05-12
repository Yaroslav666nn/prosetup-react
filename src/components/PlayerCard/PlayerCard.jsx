import styles from './PlayerCard.module.css';

const PlayerCard = ({ player }) => {
  return (
    <tr className={styles['player-row']}>
      <td className={styles.cell}>
        <div className={styles['nick-wrapper']}>
          <span className={styles.nickname}>{player.nickname}</span>
          <span className={styles['real-name']}>{player.realName}</span>
        </div>
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
import styles from './PlayerProfile.module.css';
import playersData from '../../data/players.json';

const PlayerProfile = () => {
  const player = playersData[0];

  return (
    <div className={styles['profile-container']}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.nickname}>{player.nickname}</h1>
          <div className={styles['real-name']}>{player.realName} | {player.team}</div>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Блок Девайсів */}
        <section className={styles.card}>
          <h3 className={styles['card-title']}>Периферія (Gear)</h3>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Мишка</span>
            <span className={styles['setting-value']}>{player.gear.mouse}</span>
          </div>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Монітор</span>
            <span className={styles['setting-value']}>{player.gear.monitor}</span>
          </div>
        </section>

        {/* Блок Налаштувань миші */}
        <section className={styles.card}>
          <h3 className={styles['card-title']}>Налаштування миші</h3>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>DPI</span>
            <span className={styles['setting-value']}>{player.settings.dpi}</span>
          </div>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Чутливість</span>
            <span className={styles['setting-value']}>{player.settings.sensitivity}</span>
          </div>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>eDPI</span>
            <span className={styles['setting-value']}>{player.settings.edpi}</span>
          </div>
        </section>

        {/* Блок Відео */}
        <section className={styles.card}>
          <h3 className={styles['card-title']}>Відео налаштування</h3>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Роздільна здатність</span>
            <span className={styles['setting-value']}>{player.settings.resolution}</span>
          </div>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Частота (Hz)</span>
            <span className={styles['setting-value']}>{player.settings.hz}</span>
          </div>
        </section>

        {/* Блок Crosshair (Задача 10) */}
        <section className={styles['crosshair-card']}>
          <h3 className={styles['card-title']}>Код прицілу (Crosshair Code)</h3>
          <div className={styles['crosshair-container']}>
            <div className={styles['code-box']}>
              CSGO-76696-66666-66666-66666-66666
            </div>
            <button className={styles['copy-btn']}>Копіювати</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlayerProfile;
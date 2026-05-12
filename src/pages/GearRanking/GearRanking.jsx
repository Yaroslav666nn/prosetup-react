import styles from './GearRanking.module.css';
import playersData from '../../data/players.json';

const GearRanking = () => {
  const getStats = (category) => {
    const counts = {};
    playersData.forEach(player => {
      const item = player.gear[category];
      counts[item] = (counts[item] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / playersData.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getAverage = (path) => {
    const sum = playersData.reduce((acc, player) => acc + player.settings[path], 0);
    return (sum / playersData.length).toFixed(2);
  };

  const getMostPopular = (path) => {
    const counts = {};
    playersData.forEach(p => {
      const val = p.settings[path];
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const topMice = getStats('mouse');
  const topMonitors = getStats('monitor');
  const avgSens = getAverage('sensitivity');
  const avgEdpi = getAverage('edpi');
  const commonRes = getMostPopular('resolution');
  const commonHz = getMostPopular('hz');

  return (
    <div className={styles['ranking-container']}>
      <h1 className={styles.title}>Рейтинг девайсів</h1>
      <p className={styles.subtitle}>Аналітика вибору професійних гравців</p>

      <div className={styles['stats-grid']}>
        <div className={styles['stat-card']}>
          <span className={styles['stat-value']}>{avgSens}</span>
          <span className={styles['stat-label']}>Сер. Sensitivity</span>
        </div>
        <div className={styles['stat-card']}>
          <span className={styles['stat-value']}>{avgEdpi}</span>
          <span className={styles['stat-label']}>Середній eDPI</span>
        </div>
        <div className={styles['stat-card']}>
          <span className={styles['stat-value']}>{commonRes}</span>
          <span className={styles['stat-label']}>Популярна Резолюція</span>
        </div>
        <div className={styles['stat-card']}>
          <span className={styles['stat-value']}>{commonHz}Hz</span>
          <span className={styles['stat-label']}>Стандарт частоти</span>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>ТОП-5 Ігрових мишок</h2>
        {topMice.map((item) => (
          <div key={item.name} className={styles['rank-item']}>
            <div className={styles['item-info']}>
              <span className={styles['model-name']}>{item.name}</span>
              <span className={styles['usage-count']}>{item.percentage}% гравців</span>
            </div>
            <div className={styles['progress-bar-bg']}>
              <div 
                className={styles['progress-bar-fill']} 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles['section-title']}>ТОП-5 Моніторів</h2>
        {topMonitors.map((item) => (
          <div key={item.name} className={styles['rank-item']}>
            <div className={styles['item-info']}>
              <span className={styles['model-name']}>{item.name}</span>
              <span className={styles['usage-count']}>{item.percentage}% гравців</span>
            </div>
            <div className={styles['progress-bar-bg']}>
              <div 
                className={styles['progress-bar-fill']} 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default GearRanking;
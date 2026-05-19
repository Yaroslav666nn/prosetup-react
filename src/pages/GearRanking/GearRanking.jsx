import { useMemo, useState } from 'react';
import styles from './GearRanking.module.css';
import playersData from '../../data/players.json';

const games = ['CS2', 'Valorant', 'Dota 2'];

// DPI used for sensitivity normalization/display
const STANDARD_DPI = 800;

const GearRanking = () => {
  const [selectedGame, setSelectedGame] = useState('CS2');

  const selectedPlayers = useMemo(
    () => playersData.filter((player) => player.game === selectedGame),
    [selectedGame],
  );

  const getStats = (category, players = selectedPlayers) => {
    const counts = {};
    players.forEach(player => {
      const item = player.gear[category];

      if (!item) {
        return;
      }

      counts[item] = (counts[item] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / players.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getAverage = (path, players = selectedPlayers) => {
    // Special handling for sensitivity: normalize by DPI (use 800 as standard)
    if (path === 'sensitivity') {
      const STANDARD_DPI = 800;
      const normValues = players
        .map((player) => {
          const dpi = player.settings?.dpi;
          const sens = player.settings?.sensitivity;
          const edpi = player.settings?.edpi;

          if (typeof dpi === 'number' && typeof sens === 'number') {
            return (sens * dpi) / STANDARD_DPI; // convert to sensitivity at STANDARD_DPI
          }

          if (typeof edpi === 'number') {
            return edpi / STANDARD_DPI; // convert eDPI to sensitivity at STANDARD_DPI
          }

          return null;
        })
        .filter((v) => typeof v === 'number');

      if (normValues.length === 0) return '—';
      const sum = normValues.reduce((a, b) => a + b, 0);
      return (sum / normValues.length).toFixed(2);
    }

    const values = players
      .map((player) => player.settings[path])
      .filter((value) => typeof value === 'number');

    if (values.length === 0) {
      return '—';
    }

    const sum = values.reduce((acc, value) => acc + value, 0);
    return (sum / values.length).toFixed(2);
  };

  const getMostPopular = (path, players = selectedPlayers) => {
    const counts = {};
    players.forEach(p => {
      const val = p.settings[path];
      if (val === undefined || val === null) {
        return;
      }

      counts[val] = (counts[val] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  };

  const getMostPopularKeybind = (path) => {
    const counts = {};

    selectedPlayers.forEach((player) => {
      const val = player.settings.keybinds?.[path];

      if (val === undefined || val === null) {
        return;
      }

      counts[String(val)] = (counts[String(val)] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  };

  const getQuickcastPercentage = () => {
    const dotaPlayers = selectedPlayers.filter((player) => player.settings.keybinds);

    if (dotaPlayers.length === 0) {
      return '—';
    }

    const quickcastUsers = dotaPlayers.filter((player) => player.settings.keybinds.quickcast).length;
    return `${Math.round((quickcastUsers / dotaPlayers.length) * 100)}%`;
  };

  const topMice = getStats('mouse');
  const topMonitors = getStats('monitor');
  const isDota = selectedGame === 'Dota 2';

  const statCards = isDota
    ? [
        { value: getAverage('dpi'), label: 'Середній DPI' },
        { value: getQuickcastPercentage(), label: 'Quickcast гравців' },
        { value: getMostPopularKeybind('camera'), label: 'Популярна камера' },
        { value: getMostPopular('resolution'), label: 'Популярна резолюція' },
      ]
    : [
        { value: getAverage('sensitivity'), label: `Сер. sensitivity (${STANDARD_DPI} DPI)` },
        { value: getAverage('edpi'), label: 'Середній eDPI' },
        { value: getMostPopular('resolution'), label: 'Популярна резолюція' },
        { value: `${getMostPopular('hz')}Hz`, label: 'Стандарт частоти' },
      ];

  return (
    <div className={styles['ranking-container']}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Gear analytics</span>
        <h1 className={styles.title}>Рейтинг девайсів</h1>
        <p className={styles.subtitle}>Аналітика вибору професійних гравців з локальної бази ProSetup</p>
      </section>

      <div className={styles.gameTabs} aria-label="Фільтр аналітики за грою">
        {games.map((game) => (
          <button
            key={game}
            className={game === selectedGame ? styles.activeTab : styles.tab}
            type="button"
            onClick={() => setSelectedGame(game)}
          >
            {game}
          </button>
        ))}
      </div>

      <p className={styles.scopeNote}>
        Показано {selectedPlayers.length} профілів. Метрики рахуються тільки для {selectedGame}, без змішування різних ігор.
      </p>

      <div className={styles['stats-grid']}>
        {statCards.map((card) => (
          <div key={card.label} className={styles['stat-card']}>
            <span className={styles['stat-value']}>{card.value}</span>
            <span className={styles['stat-label']}>{card.label}</span>
          </div>
        ))}
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

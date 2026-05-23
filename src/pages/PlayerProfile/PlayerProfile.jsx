import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './PlayerProfile.module.css';
import playersData from '../../data/players.json';
import vertigoPreview from '../../assets/players/vertigo.jpg';
import { getPlayerImage } from '../../utils/playerImages';
import {
  getCs2ConfigDownloadUrl,
  getCrosshairCommands,
  getCrosshairSettings,
  getResolvedSettings,
  getVideoProfile,
} from '../../utils/playerProfileData';

const renderValue = (value) => value ?? '—';

const CrosshairPreview = ({ crosshair }) => {
  const opacity = crosshair.useAlpha ? crosshair.alpha / 255 : 1;
  const center = 32;
  const length = Math.max(crosshair.size * 5.2, 3.5);
  const gap = Math.max(4 + crosshair.gap, 0.7);
  const thickness = Math.max(crosshair.thickness * 1.4, 1);

  const lines = [
    { x1: center, y1: center - gap - length, x2: center, y2: center - gap },
    { x1: center + gap, y1: center, x2: center + gap + length, y2: center },
    { x1: center, y1: center + gap, x2: center, y2: center + gap + length },
    { x1: center - gap - length, y1: center, x2: center - gap, y2: center },
  ];

  const sceneStyle = {
    '--preview-image': `url(${vertigoPreview})`,
  };

  return (
    <div className={styles.previewScene} style={sceneStyle}>
      <svg
        className={styles.crosshairSvg}
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        {crosshair.outline && lines.map((line) => (
          <line
            key={`outline-${line.x1}-${line.y1}`}
            {...line}
            stroke="rgb(0 0 0 / 0.75)"
            strokeLinecap="butt"
            strokeWidth={thickness + 2}
          />
        ))}

        {lines.map((line) => (
          <line
            key={`${line.x1}-${line.y1}`}
            {...line}
            stroke={crosshair.color}
            strokeLinecap="butt"
            strokeWidth={thickness}
            opacity={opacity}
          />
        ))}

        {crosshair.dot && (
          <rect
            x={center - thickness / 2}
            y={center - thickness / 2}
            width={thickness}
            height={thickness}
            fill={crosshair.color}
            opacity={opacity}
          />
        )}
      </svg>
    </div>
  );
};

const CrosshairDetails = ({ crosshair }) => {
  const details = [
    ['Style', 'Classic Static'],
    ['Follow Recoil', 'No'],
    ['Dot', crosshair.dot ? 'Yes' : 'No'],
    ['Length', crosshair.size],
    ['Thickness', crosshair.thickness],
    ['Gap', crosshair.gap],
    ['Outline', crosshair.outline ? 'Yes' : 'No'],
    ['Color', crosshair.colorName],
    ['Red', crosshair.red],
    ['Green', crosshair.green],
    ['Blue', crosshair.blue],
    ['Alpha', crosshair.useAlpha ? 'Yes' : 'No'],
  ];

  return (
    <div className={styles.crosshairDetails}>
      {details.map(([label, value]) => (
        <div key={label} className={styles.detailItem}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
};

const PlayerProfile = () => {
  const { id } = useParams();
  const [copyLabel, setCopyLabel] = useState('Копіювати');
  const player = playersData.find((item) => item.id === id);

  if (!player) {
    return (
      <div className={styles['profile-container']}>
        <section className={styles.notFound}>
          <h1>Гравця не знайдено</h1>
          <p>Перевір URL або повернися до списку профілів.</p>
          <Link to="/" className={styles.backLink}>До списку гравців</Link>
        </section>
      </div>
    );
  }

  const hasKeybinds = Boolean(player.settings.keybinds);
  const settings = getResolvedSettings(player);
  const videoProfile = getVideoProfile(player, settings);
  const crosshair = getCrosshairSettings(player);
  const crosshairCommands = getCrosshairCommands(player);
  const configDownloadUrl = getCs2ConfigDownloadUrl(player);
  const playerImage = getPlayerImage(player);

  const handleCopyCrosshair = async () => {
    if (!crosshairCommands) {
      return;
    }

    await navigator.clipboard.writeText(crosshairCommands);
    setCopyLabel('Скопійовано');
    window.setTimeout(() => setCopyLabel('Копіювати'), 1400);
  };

  return (
    <div className={styles['profile-container']}>
      <header className={styles.header}>
        <div className={styles.heroCopy}>
          <Link to="/" className={styles.backLink}>← Усі гравці</Link>
          <span className={styles.gameBadge}>{player.game}</span>
          <h1 className={styles.nickname}>{player.nickname}</h1>
          <div className={styles['real-name']}>{player.realName} · {player.team}</div>
        </div>

        <div className={styles.portraitFrame}>
          {playerImage ? (
            <img
              className={styles.portrait}
              src={playerImage}
              alt={`${player.nickname} portrait`}
            />
          ) : (
            <span className={styles.portraitFallback}>{player.nickname.slice(0, 2)}</span>
          )}
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
            <span className={styles['setting-value']}>{renderValue(settings.dpi)}</span>
          </div>
          {!hasKeybinds && (
            <>
              <div className={styles['setting-row']}>
                <span className={styles['setting-label']}>Чутливість</span>
                <span className={styles['setting-value']}>{renderValue(settings.sensitivity)}</span>
              </div>
              <div className={styles['setting-row']}>
                <span className={styles['setting-label']}>eDPI</span>
                <span className={styles['setting-value']}>{renderValue(settings.edpi)}</span>
              </div>
              <div className={styles['setting-row']}>
                <span className={styles['setting-label']}>Частота (Hz)</span>
                <span className={styles['setting-value']}>{renderValue(videoProfile.hz)}</span>
              </div>
            </>
          )}
        </section>

        {/* Блок Відео */}
        <section className={styles.card}>
          <h3 className={styles['card-title']}>Відео налаштування</h3>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Роздільна здатність</span>
            <span className={styles['setting-value']}>{videoProfile.resolution}</span>
          </div>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Aspect Ratio</span>
            <span className={styles['setting-value']}>{videoProfile.aspectRatio}</span>
          </div>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Scaling Mode</span>
            <span className={styles['setting-value']}>{videoProfile.scalingMode}</span>
          </div>
          <div className={styles['setting-row']}>
            <span className={styles['setting-label']}>Display Mode</span>
            <span className={styles['setting-value']}>{videoProfile.displayMode}</span>
          </div>
        </section>

        {hasKeybinds && (
          <section className={styles.card}>
            <h3 className={styles['card-title']}>Keybinds</h3>
            <div className={styles['setting-row']}>
              <span className={styles['setting-label']}>Abilities</span>
              <span className={styles['setting-value']}>{player.settings.keybinds.abilities}</span>
            </div>
            <div className={styles['setting-row']}>
              <span className={styles['setting-label']}>Quickcast</span>
              <span className={styles['setting-value']}>{player.settings.keybinds.quickcast ? 'Так' : 'Ні'}</span>
            </div>
            <div className={styles['setting-row']}>
              <span className={styles['setting-label']}>Items</span>
              <span className={styles['setting-value']}>{player.settings.keybinds.items}</span>
            </div>
            <div className={styles['setting-row']}>
              <span className={styles['setting-label']}>Camera</span>
              <span className={styles['setting-value']}>{player.settings.keybinds.camera}</span>
            </div>
          </section>
        )}

        {configDownloadUrl && (
          <section className={styles.configCard}>
            <h3 className={styles['card-title']}>Config</h3>
            <a
              className={styles.downloadBtn}
              href={configDownloadUrl}
              download={`${player.id}-config.cfg`}
            >
              Завантажити cfg
            </a>
          </section>
        )}

        {crosshair && (
          <section className={styles['crosshair-card']}>
            <div className={styles.crosshairHeader}>
              <h3 className={styles['card-title']}>Crosshair</h3>
              <button className={styles['copy-btn']} type="button" onClick={handleCopyCrosshair}>
                {copyLabel}
              </button>
            </div>

            <CrosshairPreview crosshair={crosshair} />
            <CrosshairDetails crosshair={crosshair} />

            <div className={styles['code-box']}>{crosshairCommands}</div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;

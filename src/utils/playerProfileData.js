const cs2ConfigModules = import.meta.glob('../data/configs/cs2/*/config.cfg', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const cs2ConfigUrlModules = import.meta.glob('../data/configs/cs2/*/config.cfg', {
  eager: true,
  import: 'default',
  query: '?url',
});

const normalizeKey = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const createConfigMap = (modules) => Object.entries(modules).reduce((configs, [path, value]) => {
  const folderName = path.split('/').at(-2);
  configs[normalizeKey(folderName)] = value;
  return configs;
}, {});

const cs2Configs = createConfigMap(cs2ConfigModules);
const cs2ConfigUrls = createConfigMap(cs2ConfigUrlModules);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const readCfgValue = (cfg, key) => {
  const pattern = new RegExp(`(?:^|\\n)${escapeRegExp(key)}\\s+["']?([^"'\\r\\n]+)["']?`, 'i');
  const match = cfg.match(pattern);
  return match ? match[1].trim() : null;
};

const readCfgNumber = (cfg, key) => {
  const value = readCfgValue(cfg, key);
  return value === null ? null : Number(value);
};

const getCs2Config = (player) => {
  const keys = [player.id, player.nickname].map(normalizeKey);
  const matchedKey = keys.find((key) => cs2Configs[key]);
  return matchedKey ? cs2Configs[matchedKey] : null;
};

export const getCs2ConfigDownloadUrl = (player) => {
  const keys = [player.id, player.nickname].map(normalizeKey);
  const matchedKey = keys.find((key) => cs2ConfigUrls[key]);
  return matchedKey ? cs2ConfigUrls[matchedKey] : null;
};

const getAspectRatio = (resolution) => {
  const [width, height] = resolution.split('x').map(Number);

  if (!width || !height) {
    return '—';
  }

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);

  return `${width / divisor}:${height / divisor}`;
};

const getScalingMode = (player, aspectRatio) => {
  if (player.game === 'CS2' && aspectRatio === '4:3') {
    return 'Stretched';
  }

  return 'Native';
};

export const getResolvedSettings = (player) => {
  const cfg = getCs2Config(player);

  if (!cfg) {
    return player.settings;
  }

  const sensitivity = readCfgNumber(cfg, 'sensitivity');
  const zoomSens =
    readCfgNumber(cfg, 'zoom_sensitivity_ratio') ??
    readCfgNumber(cfg, 'zoom_sensitivity_ratio_mouse');

  return {
    ...player.settings,
    sensitivity: sensitivity ?? player.settings.sensitivity,
    zoomSens: zoomSens ?? player.settings.zoomSens,
    edpi: sensitivity && player.settings.dpi
      ? Math.round(sensitivity * player.settings.dpi)
      : player.settings.edpi,
  };
};

const colorMap = {
  0: '#ff3b3b',
  1: '#00ff87',
  2: '#ffe04d',
  3: '#4da3ff',
  4: '#38f2ff',
};

const colorNameMap = {
  0: 'Red',
  1: 'Green',
  2: 'Yellow',
  3: 'Blue',
  4: 'Cyan',
  5: 'Custom',
};

const crosshairOverrides = {
  monesy: {
    color: '#38f2ff',
    colorName: 'Cyan',
    size: 1,
    gap: -4,
    thickness: 1,
    dot: false,
    outline: false,
    alpha: 255,
    useAlpha: true,
    red: 0,
    green: 255,
    blue: 255,
    style: '4',
    shareCode: null,
  },
  donk: {
    color: '#00ff00',
    colorName: 'Green',
    size: 1,
    gap: -4.5,
    thickness: 1,
    dot: false,
    outline: false,
    alpha: 255,
    useAlpha: false,
    red: 0,
    green: 255,
    blue: 0,
    style: '4',
    shareCode: 'CSGO-036iX-6VGeQ-pnJLm-UWkab-osuWK',
  },
  s1mple: {
    color: '#38f2ff',
    colorName: 'Cyan',
    size: 1,
    gap: -4.5,
    thickness: 1,
    dot: false,
    outline: false,
    alpha: 255,
    useAlpha: true,
    red: 0,
    green: 255,
    blue: 255,
    style: '4',
    shareCode: 'CSGO-ofZGe-jF5oG-AruLr-ymSJJ-VvUrC',
  },
};

export const getCrosshairSettings = (player) => {
  const cfg = getCs2Config(player);

  if (!cfg) {
    return null;
  }

  const colorMode = readCfgNumber(cfg, 'cl_crosshaircolor');
  const customColor = {
    r: readCfgNumber(cfg, 'cl_crosshaircolor_r'),
    g: readCfgNumber(cfg, 'cl_crosshaircolor_g'),
    b: readCfgNumber(cfg, 'cl_crosshaircolor_b'),
  };

  const color = colorMode === 5 && Object.values(customColor).every((value) => value !== null)
    ? `rgb(${customColor.r} ${customColor.g} ${customColor.b})`
    : colorMap[colorMode] ?? '#00ff87';

  const cfgSettings = {
    color,
    colorName: colorNameMap[colorMode] ?? 'Custom',
    size: readCfgNumber(cfg, 'cl_crosshairsize') ?? 1,
    gap: readCfgNumber(cfg, 'cl_crosshairgap') ?? -3,
    thickness: readCfgNumber(cfg, 'cl_crosshairthickness') ?? 1,
    dot: readCfgNumber(cfg, 'cl_crosshairdot') === 1,
    outline: readCfgNumber(cfg, 'cl_crosshair_drawoutline') === 1,
    alpha: readCfgNumber(cfg, 'cl_crosshairalpha') ?? 255,
    useAlpha: readCfgNumber(cfg, 'cl_crosshairusealpha') !== 0,
    red: customColor.r ?? 0,
    green: customColor.g ?? 255,
    blue: customColor.b ?? 0,
    style: readCfgValue(cfg, 'cl_crosshairstyle') ?? '4',
    shareCode: null,
  };

  const override = crosshairOverrides[normalizeKey(player.id)] ?? crosshairOverrides[normalizeKey(player.nickname)];

  return override ? { ...cfgSettings, ...override } : cfgSettings;
};

export const getCrosshairCommands = (player) => {
  const override = crosshairOverrides[normalizeKey(player.id)] ?? crosshairOverrides[normalizeKey(player.nickname)];

  if (override?.shareCode) {
    return override.shareCode;
  }

  const cfg = getCs2Config(player);

  if (!cfg) {
    return null;
  }

  const commandKeys = [
    'cl_crosshairstyle',
    'cl_crosshairsize',
    'cl_crosshairgap',
    'cl_crosshaircolor',
    'cl_crosshaircolor_r',
    'cl_crosshaircolor_g',
    'cl_crosshaircolor_b',
    'cl_crosshairthickness',
    'cl_crosshairdot',
    'cl_crosshair_drawoutline',
    'cl_crosshairalpha',
    'cl_crosshairusealpha',
    'cl_crosshair_t',
    'cl_crosshairgap_useweaponvalue',
  ];

  return commandKeys
    .map((key) => {
      const value = readCfgValue(cfg, key);
      return value === null ? null : `${key} ${value}`;
    })
    .filter(Boolean)
    .join('; ');
};

export const getVideoProfile = (player, settings) => {
  const aspectRatio = getAspectRatio(settings.resolution);

  return {
    resolution: settings.resolution,
    hz: settings.hz ?? '—',
    aspectRatio,
    scalingMode: getScalingMode(player, aspectRatio),
    displayMode: 'Fullscreen',
  };
};

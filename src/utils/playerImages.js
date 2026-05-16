const imageModules = import.meta.glob('../assets/players/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const normalizeKey = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const playerImages = Object.entries(imageModules).reduce((images, [path, src]) => {
  const fileName = path.split('/').pop().replace(/\.[^.]+$/, '');
  images[normalizeKey(fileName)] = src;
  return images;
}, {});

export const getPlayerImage = (player) => {
  if (player.photoUrl) {
    return player.photoUrl;
  }

  const keys = [player.id, player.nickname].map(normalizeKey);
  const matchedKey = keys.find((key) => playerImages[key]);

  return matchedKey ? playerImages[matchedKey] : null;
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIGS_DIR = path.join(__dirname, 'configs');
const OUTPUT_FILE = path.join(__dirname, 'players.json');

console.log('🚀 Запуск агрегатора конфігів...');

function extractFromCfg(cfgText, key) {
  const regex = new RegExp(`${key}\\s+["']?([0-9.]+)["']?`, 'i');
  const match = cfgText.match(regex);
  return match ? parseFloat(match[1]) : null;
}

const playersList = [];

// 1. Спочатку читаємо папки ігор (cs2, valorant, dota2)
const gameFolders = fs.readdirSync(CONFIGS_DIR);

gameFolders.forEach((gameName) => {
  const gamePath = path.join(CONFIGS_DIR, gameName);
  
  if (fs.statSync(gamePath).isDirectory()) {
    console.log(`\n🎮 Скануємо гру: ${gameName.toUpperCase()}`);
    
    // 2. Тепер читаємо папки гравців всередині кожної гри
    const playerFolders = fs.readdirSync(gamePath);
    
    playerFolders.forEach((folderName) => {
      const folderPath = path.join(gamePath, folderName);
      
      if (fs.statSync(folderPath).isDirectory()) {
        const infoPath = path.join(folderPath, 'info.json');
        const cfgPath = path.join(folderPath, 'config.cfg');

        let playerData = {};
        if (fs.existsSync(infoPath)) {
          playerData = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
        } else {
          return; // Пропускаємо, якщо немає info.json
        }

        // Парсимо config.cfg, якщо він існує (актуально для CS2)
        if (fs.existsSync(cfgPath)) {
          const cfgContent = fs.readFileSync(cfgPath, 'utf-8');
          const sensitivity = extractFromCfg(cfgContent, 'sensitivity');
          const zoomSens = extractFromCfg(cfgContent, 'zoom_sensitivity_ratio');

          if (!playerData.settings) playerData.settings = {};
          playerData.settings.sensitivity = sensitivity;
          playerData.settings.zoomSens = zoomSens;
          
          if (playerData.settings.dpi && sensitivity) {
            playerData.settings.edpi = Math.round(playerData.settings.dpi * sensitivity);
          }
        }

        playersList.push(playerData);
        console.log(`  ✅ Додано: ${playerData.nickname}`);
      }
    });
  }
});

// Зберігаємо всіх в один файл
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(playersList, null, 2), 'utf-8');
console.log(`\n🎉 Успіх! Усі дані об'єднано у файл: ${OUTPUT_FILE}`);
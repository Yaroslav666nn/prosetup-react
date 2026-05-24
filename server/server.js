const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { HLTV } = require('hltv');

const app = express();
const PORT = process.env.PORT || 3001;
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');
const hasClientBuild = fs.existsSync(indexPath);
const runtimeCachePath = path.join(__dirname, 'news-cache.json');
const fallbackNewsPath = path.join(__dirname, 'fallback-news.json');
const skipRemoteNewsFetch = process.env.SKIP_REMOTE_NEWS_FETCH === 'true';

const readNewsFromFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`❌ Не вдалося прочитати файл новин ${path.basename(filePath)}:`, error.message);
    return [];
  }
};

const saveNewsToFile = (filePath, news) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
  } catch (error) {
    console.error(`❌ Не вдалося зберегти файл новин ${path.basename(filePath)}:`, error.message);
  }
};

const sendNews = (res, news, source) => {
  res.set('X-News-Source', source);
  return res.json(news);
};

if (process.env.CORS_ORIGIN) {
  const allowedOrigins = process.env.CORS_ORIGIN
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins }));
} else if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173' }));
}

// Змінні для кешування
const bundledFallbackNews = readNewsFromFile(fallbackNewsPath);
let cachedNews = readNewsFromFile(runtimeCachePath);
if (cachedNews.length === 0) {
  cachedNews = bundledFallbackNews;
}
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 хвилин у мілісекундах

app.get('/api/news', async (req, res) => {
  const now = Date.now();

  try {
    // Якщо новини є в пам'яті і минуло менше 15 хвилин — віддаємо кеш
    if (cachedNews.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
      console.log('⚡ Віддаємо новини з кешу сервера (без запиту до HLTV)');
      return sendNews(res, cachedNews, 'cache');
    }

    console.log('📰 Звертаємося до HLTV.org за свіжими новинами...');
    if (skipRemoteNewsFetch) {
      throw new Error('Remote news fetch disabled by SKIP_REMOTE_NEWS_FETCH');
    }

    const news = await HLTV.getNews();

    if (!Array.isArray(news) || news.length === 0) {
      throw new Error('HLTV returned an empty news list');
    }

    // Оновлюємо кеш
    cachedNews = news;
    lastFetchTime = now;
    saveNewsToFile(runtimeCachePath, cachedNews);

    console.log('✅ Отримано та збережено в кеш', news.length, 'справжніх новин');
    return sendNews(res, news, 'live');
  } catch (error) {
    console.error('❌ Помилка:', error.message);

    // Якщо Cloudflare знову заблокував, але в нас є старі новини — віддаємо хоча б їх
    if (cachedNews.length > 0) {
      lastFetchTime = now;
      const fallbackSource = fs.existsSync(runtimeCachePath) ? 'file-cache' : 'bundled-fallback';
      console.log(`⚠️ Використовуємо ${fallbackSource} через помилку доступу`);
      return sendNews(res, cachedNews, fallbackSource);
    }

    res.status(500).json({ error: 'Failed to fetch news from HLTV' });
  }
});

if (hasClientBuild) {
  app.use(express.static(distPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(indexPath);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 News server running on port ${PORT}`);
  if (hasClientBuild) {
    console.log(`📦 Serving frontend build from ${distPath}`);
  }
});

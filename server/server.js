const express = require('express');
const cors = require('cors');
const { HLTV } = require('hltv');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));

// Змінні для кешування
let cachedNews = [];
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 хвилин у мілісекундах

app.get('/api/news', async (req, res) => {
  try {
    const now = Date.now();

    // Якщо новини є в пам'яті і минуло менше 15 хвилин — віддаємо кеш
    if (cachedNews.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
      console.log('⚡ Віддаємо новини з кешу сервера (без запиту до HLTV)');
      return res.json(cachedNews);
    }

    console.log('📰 Звертаємося до HLTV.org за свіжими новинами...');
    const news = await HLTV.getNews();
    
    // Оновлюємо кеш
    cachedNews = news;
    lastFetchTime = now;
    
    console.log('✅ Отримано та збережено в кеш', news.length, 'справжніх новин');
    res.json(news);

  } catch (error) {
    console.error('❌ Помилка:', error.message);
    
    // Якщо Cloudflare знову заблокував, але в нас є старі новини в кеші — віддаємо хоча б їх
    if (cachedNews.length > 0) {
      console.log('⚠️ Використовуємо старий кеш через помилку доступу');
      return res.json(cachedNews);
    }

    res.status(500).json({ error: 'Failed to fetch news from HLTV' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 News server running on http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const { HLTV } = require('hltv');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.get('/api/news', async (req, res) => {
  try {
    const news = await HLTV.getNews();

    res.json(news);
  } catch (error) {
    console.error('Failed to fetch HLTV news:', error);

    res.status(500).json({
      message: 'Failed to fetch HLTV news',
    });
  }
});

app.listen(PORT, () => {
  console.log(`HLTV news server is running on http://localhost:${PORT}`);
});
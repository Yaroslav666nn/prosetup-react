// Test script to check HLTV data structure
const { HLTV } = require('hltv');

async function testHLTV() {
  try {
    const news = await HLTV.getNews();
    console.log('News data structure:');
    console.log(JSON.stringify(news.slice(0, 3), null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testHLTV();

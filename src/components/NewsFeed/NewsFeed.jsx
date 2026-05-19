import { useEffect, useState } from 'react';
import styles from './NewsFeed.module.css';

const NEWS_LIMIT = 5;
const HLTV_BASE_URL = 'https://www.hltv.org';

const formatNewsDate = (timestamp) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'Дата невідома';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getNewsDateTime = (timestamp) => {
  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const getNewsUrl = (link) => {
  if (!link) {
    return HLTV_BASE_URL;
  }

  return link.startsWith('http') ? link : `${HLTV_BASE_URL}${link}`;
};

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadNews = async () => {
      try {
        const response = await fetch('/api/news', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Не вдалося завантажити новини');
        }

        const data = await response.json();
        setNews(Array.isArray(data) ? data.slice(0, NEWS_LIMIT) : []);
        setError('');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className={styles.newsFeed} aria-labelledby="news-feed-title">
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>HLTV</span>
          <h2 id="news-feed-title">Останні новини CS2</h2>
        </div>
        <a
          className={styles.viewAll}
          href="https://www.hltv.org/news"
          target="_blank"
          rel="noreferrer"
        >
          Всі новини
        </a>
      </div>

      {isLoading && <p className={styles.state}>Завантаження новин...</p>}

      {!isLoading && error && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && (
        <ul className={styles.list}>
          {news.map((article) => (
            <li className={styles.item} key={article.link || article.title}>
              <a
                className={styles.link}
                href={getNewsUrl(article.link)}
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.title}>{article.title}</span>
                <time className={styles.date} dateTime={getNewsDateTime(article.date)}>
                  {formatNewsDate(article.date)}
                </time>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default NewsFeed;

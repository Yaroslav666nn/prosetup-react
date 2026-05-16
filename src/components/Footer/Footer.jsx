import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const productLinks = [
  'Профілі гравців',
  'Пошук по базі',
  'Gear ranking',
  'CS2 cfg download',
];

const games = ['CS2', 'Valorant', 'Dota 2'];

const mvpItems = [
  'Роутинг без перезавантаження',
  'JSON база гравців',
  'Фільтри та пошук',
  'Game-specific settings',
];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.brandBlock}>
        <Link to="/" className={styles.logo}>ProSetup</Link>
        <p className={styles.text}>
          Esports settings database для швидкого пошуку професійних сетапів,
          порівняння девайсів і завантаження CS2 конфігів.
        </p>
        <p className={styles.problem}>
          Проєкт вирішує просту проблему: налаштування гравців розкидані по різних
          джерелах, а тут вони зібрані в одному MVP з пошуком, фільтрами та профілями.
        </p>
      </div>

      <div className={styles.footerColumn}>
        <h3>Product</h3>
        {productLinks.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className={styles.footerColumn}>
        <h3>Games</h3>
        {games.map((game) => (
          <span key={game}>{game}</span>
        ))}
      </div>

      <div className={styles.footerColumn}>
        <h3>MVP</h3>
        {mvpItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <nav className={styles.links} aria-label="Нижня навігація">
        <Link to="/">Гравці</Link>
        <Link to="/ranking">Рейтинг девайсів</Link>
      </nav>
    </footer>
  );
};

export default Footer;

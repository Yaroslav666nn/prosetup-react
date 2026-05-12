import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>ProSetup</div>
      
      <nav className={styles.nav}>
        <a href="/" className={styles['nav-link']}>Гравці</a>
        <a href="/ranking" className={styles['nav-link']}>Рейтинг девайсів</a>
      </nav>
      
      {/* Тут Ярослав пізніше додасть SearchBar (Задача 25) */}
      <div className={styles.searchPlaceholder}>Пошук...</div>
    </header>
  );
};

export default Header;
import PlayerTable from '../../components/PlayerTable/PlayerTable';

const Home = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--color-text-main)', marginBottom: '20px' }}>
        Професійні налаштування гравців
      </h2>
      <PlayerTable />
    </div>
  );
};

export default Home;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// заглушки для компонентів
const Header = () => <header style={{ padding: '20px', background: '#222', color: 'white' }}>ProSetup Header</header>;
const Home = () => <div style={{ padding: '20px' }}><h1>Головна сторінка</h1><p>Тут буде таблиця гравців</p></div>;
const PlayerProfile = () => <div style={{ padding: '20px' }}><h1>Профіль гравця</h1><p>Тут будуть девайси</p></div>;

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
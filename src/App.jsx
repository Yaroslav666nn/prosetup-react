import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import './styles/variables.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        {/* Тимчасово показуємо Home, або міняємо на GearRanking/PlayerProfile для перевірки */}
        <Home /> 
      </main>
    </div>
  );
}

export default App;
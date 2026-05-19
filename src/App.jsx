import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home/Home';
import Players from './pages/Players';
import GearRanking from './pages/GearRanking/GearRanking';
import PlayerProfile from './pages/PlayerProfile/PlayerProfile';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-container">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<Players />} />
            <Route path="/ranking" element={<GearRanking />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  const [activePage, setActivePage] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setActivePage(window.location.pathname === '/admin' ? 'admin' : 'home');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (page) => {
    const path = page === 'admin' ? '/admin' : '/';
    window.history.pushState({}, '', path);
    setActivePage(page);
  };

  return (
    <div className="app-container">
      {/* Global Navigation Bar */}
      <Navbar activePage={activePage} setActivePage={navigateTo} />
      
      {/* Main Pages */}
      <main className="main-content">
        {activePage === 'home' ? <Home /> : <Admin setActivePage={navigateTo} />}
      </main>
    </div>
  );
}

export default App;

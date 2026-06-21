import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Header from './layouts/Header';
import Sidebar from './layouts/Sidebar';
import Dashboard from './pages/Dashboard';
import SearchModal from './components/SearchModal';
import './assets/tailwind.css';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex flex-col">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />
        <div id="main-content" className="flex-1 p-4">
          <Header onSearchOpen={handleSearchOpen} />
          <Dashboard />
        </div>
      </div>
      {/* Improvisasi 3: Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

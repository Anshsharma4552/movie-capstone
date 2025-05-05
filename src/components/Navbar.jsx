
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/70 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold text-white"
          >
            <span className="text-movie-primary">Film</span>Fiesta
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-movie-primary' : 'text-white hover:text-movie-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/discover" 
              className={`transition-colors ${isActive('/discover') ? 'text-movie-primary' : 'text-white hover:text-movie-primary'}`}
            >
              Discover
            </Link>
            <Link 
              to="/search" 
              className={`transition-colors ${isActive('/search') ? 'text-movie-primary' : 'text-white hover:text-movie-primary'}`}
            >
              Search
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="px-4 py-2 rounded-full bg-movie-dark text-white focus:outline-none focus:ring-2 focus:ring-movie-primary w-60"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </button>
            </form>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 animate-scale-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className={`p-2 ${isActive('/') ? 'text-movie-primary' : 'text-white hover:text-movie-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/discover" 
              className={`p-2 ${isActive('/discover') ? 'text-movie-primary' : 'text-white hover:text-movie-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            <Link 
              to="/search" 
              className={`p-2 ${isActive('/search') ? 'text-movie-primary' : 'text-white hover:text-movie-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            <form onSubmit={handleSearch} className="flex relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="px-4 py-2 rounded-full bg-movie-dark text-white focus:outline-none focus:ring-2 focus:ring-movie-primary w-full"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
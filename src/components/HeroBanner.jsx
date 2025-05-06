
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbService';
import { Search } from 'lucide-react';

const HeroBanner = ({ movie }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>
      
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Welcome to <span className="text-movie-primary">Film</span>Fiesta
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover amazing movies and get personalized recommendations
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-5 py-3 rounded-full bg-black/50 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-movie-primary"
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-movie-primary text-white flex items-center justify-center hover:bg-purple-600 transition-colors"
            >
              <Search size={20} />
              <span className="ml-2 hidden md:inline">Search</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

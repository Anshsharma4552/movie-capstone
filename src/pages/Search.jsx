
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, fetchPopularMovies } from '../services/tmdbService';
import MovieList from '../components/MovieList';
import Navbar from '../components/Navbar';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      searchMovies(query).then(results => {
        setSearchResults(results);
        setIsLoading(false);
      });
    } else {
      fetchPopularMovies().then(movies => {
        setPopularMovies(movies);
      });
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">
            {query ? `Search Results for "${query}"` : 'Discover Movies'}
          </h1>
          
          <form onSubmit={handleSearch} className="relative max-w-xl mb-6">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-5 py-3 rounded-full bg-movie-dark text-white focus:outline-none focus:ring-2 focus:ring-movie-primary"
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-movie-primary text-white flex items-center justify-center hover:bg-purple-600 transition-colors"
            >
              <SearchIcon size={20} />
              <span className="ml-2 hidden md:inline">Search</span>
            </button>
          </form>
        </div>

        {query ? (
          <MovieList 
            title={`Search Results (${searchResults.length})`}
            movies={searchResults} 
            isLoading={isLoading}
          />
        ) : (
          <MovieList 
            title="Popular Movies"
            movies={popularMovies} 
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
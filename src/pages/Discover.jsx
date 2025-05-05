import React, { useState, useEffect } from 'react';
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchTrendingMovies, 
  fetchGenres, 
  fetchMoviesByGenre,
  searchPersons,
  fetchMoviesByActor
} from '../services/tmdbService';
import Navbar from '../components/Navbar';
import MovieList from '../components/MovieList';
import { toast } from '../components/ui/sonner';
import { Filter, Search, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../components/ui/hover-card';

const Discover = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('popular');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [actorQuery, setActorQuery] = useState('');
  const [actorSearchResults, setActorSearchResults] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [isSearchingActor, setIsSearchingActor] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      const genresList = await fetchGenres();
      setGenres(genresList);
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        let results = [];
        
        // If a genre is selected, fetch by genre
        if (selectedGenre) {
          results = await fetchMoviesByGenre(selectedGenre.id);
        }
        // If an actor is selected, fetch by actor
        else if (selectedActor) {
          results = await fetchMoviesByActor(selectedActor.id);
        }
        // Otherwise use the active filter
        else {
          switch (activeFilter) {
            case 'popular':
              results = await fetchPopularMovies();
              break;
            case 'top_rated':
              results = await fetchTopRatedMovies();
              break;
            case 'trending':
              results = await fetchTrendingMovies();
              break;
            default:
              results = await fetchPopularMovies();
          }
        }
        
        setMovies(results);
      } catch (error) {
        toast.error("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [activeFilter, selectedGenre, selectedActor]);

  useEffect(() => {
    const searchActors = async () => {
      if (actorQuery.length > 2) {
        const results = await searchPersons(actorQuery);
        setActorSearchResults(results);
      } else {
        setActorSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      if (actorQuery) {
        searchActors();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [actorQuery]);

  const filters = [
    { id: 'popular', label: 'Popular' },
    { id: 'top_rated', label: 'Top Rated' },
    { id: 'trending', label: 'Trending' }
  ];

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setSelectedActor(null);
    setActiveFilter(null);
  };

  const handleActorSelect = (actor) => {
    setSelectedActor(actor);
    setSelectedGenre(null);
    setActiveFilter(null);
    setActorQuery('');
    setIsSearchingActor(false);
  };

  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedActor(null);
    setActiveFilter('popular');
  };

  const toggleActorSearch = () => {
    setIsSearchingActor(!isSearchingActor);
    if (!isSearchingActor) {
      setActorQuery('');
      setActorSearchResults([]);
    }
  };

  const getHeadingText = () => {
    if (selectedGenre) return `${selectedGenre.name} Movies`;
    if (selectedActor) return `Movies with ${selectedActor.name}`;
    return activeFilter === 'popular' ? 'Popular Movies' : activeFilter === 'top_rated' ? 'Top Rated Movies' : 'Trending Movies';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Discover Movies</h1>
          
          <div className="flex flex-wrap gap-2 items-center">
            {(selectedGenre || selectedActor) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X size={16} />
                Clear Filters
              </Button>
            )}
            
            <div className="flex items-center gap-2 bg-movie-dark rounded-full p-1">
              <Filter size={18} className="text-movie-primary ml-2" />
              
              <div className="flex">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setActiveFilter(filter.id);
                      setSelectedGenre(null);
                      setSelectedActor(null);
                    }}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      activeFilter === filter.id && !selectedGenre && !selectedActor
                        ? 'bg-movie-primary text-movie-dark font-medium'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleActorSearch}
              className="flex items-center gap-1 ml-2"
            >
              <Search size={16} />
              {isSearchingActor ? 'Hide' : 'Actor Search'}
            </Button>
          </div>
        </div>
        
        {isSearchingActor && (
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Input
                type="text"
                value={actorQuery}
                onChange={(e) => setActorQuery(e.target.value)}
                placeholder="Search for an actor..."
                className="bg-movie-dark text-white focus-visible:ring-movie-primary"
              />
              
              {actorSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-movie-dark border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {actorSearchResults.map((actor) => (
                    <div 
                      key={actor.id}
                      onClick={() => handleActorSelect(actor)}
                      className="px-4 py-2 hover:bg-movie-primary/20 cursor-pointer flex items-center gap-2"
                    >
                      {actor.profile_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`} 
                          alt={actor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-xs">{actor.name[0]}</span>
                        </div>
                      )}
                      <span>{actor.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-xl mb-3">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedGenre?.id === genre.id
                    ? 'bg-movie-primary text-movie-dark font-medium'
                    : 'bg-movie-dark text-gray-300 hover:bg-movie-dark/70'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <MovieList
            title={getHeadingText()}
            movies={movies}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <footer className="bg-movie-dark py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>FilmFiesta © {new Date().getFullYear()} - Powered by TMDB</p>
          <p className="text-sm mt-2">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Discover;

import React, { useState, useEffect } from 'react';
import { fetchTrendingMovies, fetchPopularMovies, fetchTopRatedMovies } from '../services/tmdbService';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import MovieList from '../components/MovieList';
import { toast } from '../components/ui/sonner';

const Index = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState({
    trending: true,
    popular: true,
    topRated: true
  });

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const trending = await fetchTrendingMovies();
        setTrendingMovies(trending);
        setFeaturedMovie(trending[Math.floor(Math.random() * trending.length)]);
        setLoading(prev => ({ ...prev, trending: false }));
        
        const popular = await fetchPopularMovies();
        setPopularMovies(popular);
        setLoading(prev => ({ ...prev, popular: false }));
        
        const topRated = await fetchTopRatedMovies();
        setTopRatedMovies(topRated);
        setLoading(prev => ({ ...prev, topRated: false }));
      } catch (error) {
        toast.error("Failed to load movies. Please try again later.");
        setLoading({
          trending: false,
          popular: false,
          topRated: false
        });
      }
    };
    
    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <HeroBanner movie={featuredMovie} />
      
      <div className="container mx-auto px-4 py-8">
        <MovieList 
          title="Trending Now" 
          movies={trendingMovies} 
          isLoading={loading.trending}
        />
        
        <MovieList 
          title="Recommended For You" 
          movies={popularMovies} 
          isLoading={loading.popular}
        />
        
        <MovieList 
          title="Top Rated" 
          movies={topRatedMovies} 
          isLoading={loading.topRated}
        />
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

export default Index;
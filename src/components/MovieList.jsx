import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ title, movies, isLoading = false }) => {
  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg bg-movie-dark animate-pulse-subtle aspect-[2/3]"></div>
          ))}
        </div>
      ) : movies?.length === 0 ? (
        <p className="text-gray-400">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies?.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieList;
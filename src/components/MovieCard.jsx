
import React from 'react';
import { getImageUrl } from '../services/tmdbService';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../components/ui/hover-card';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : null;

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="movie-card cursor-pointer" onClick={handleClick}>
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={movie.title}
            className="movie-card-image"
            loading="lazy"
          />
          {rating && (
            <div className="movie-rating">
              {rating}
            </div>
          )}
          <div className="movie-card-content">
            <h3 className="text-lg font-semibold line-clamp-1">{movie.title}</h3>
            <p className="text-sm text-gray-300">{releaseYear}</p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-movie-dark border-movie-primary text-white">
        <div className="space-y-2">
          <h4 className="text-lg font-bold">{movie.title}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            {releaseYear && <span>{releaseYear}</span>}
            {rating && <span className="px-1 py-0.5 bg-movie-primary/20 rounded text-movie-primary">{rating} ★</span>}
          </div>
          <p className="text-sm line-clamp-3">{movie.overview || "No description available."}</p>
          <p className="text-xs text-gray-400 mt-2">Click for more details</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default MovieCard;
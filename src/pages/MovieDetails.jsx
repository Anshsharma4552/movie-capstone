
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, getImageUrl } from '../services/tmdbService';
import Navbar from '../components/Navbar';
import MovieList from '../components/MovieList';
import { toast } from '../components/ui/sonner';
import { Star, Clock, Calendar, User } from 'lucide-react';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const loadMovie = async () => {
      setIsLoading(true);
      try {
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);
        
        // Load saved reviews from localStorage
        const savedReviews = localStorage.getItem(`movie_reviews_${id}`);
        if (savedReviews) {
          setUserReviews(JSON.parse(savedReviews));
        }
      } catch (error) {
        toast.error("Failed to load movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMovie();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSubmitReview = () => {
    if (!userRating) {
      toast.error("Please add a rating before submitting your review.");
      return;
    }
    
    const newReview = {
      id: Date.now(),
      rating: userRating,
      comment: userReview.trim(),
      date: new Date().toISOString(),
    };
    
    const updatedReviews = [...userReviews, newReview];
    setUserReviews(updatedReviews);
    localStorage.setItem(`movie_reviews_${id}`, JSON.stringify(updatedReviews));
    
    // Reset form
    setUserRating(0);
    setUserReview('');
    toast.success("Your review has been added!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-pulse w-full max-w-4xl">
            <div className="h-96 bg-movie-dark rounded-lg mb-8"></div>
            <div className="h-10 bg-movie-dark rounded-lg w-3/4 mb-4"></div>
            <div className="h-6 bg-movie-dark rounded-lg w-1/2 mb-6"></div>
            <div className="h-32 bg-movie-dark rounded-lg mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-gray-400">The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const directors = movie.credits?.crew?.filter(person => person.job === 'Director') || [];
  const cast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div 
        className="w-full h-96 bg-cover bg-center relative" 
        style={{ 
          backgroundImage: movie.backdrop_path ? `url(${getImageUrl(movie.backdrop_path, 'original')})` : 'none',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 -mt-32 relative z-10">
          <div className="flex-shrink-0 w-full max-w-xs mx-auto lg:mx-0">
            <img 
              src={getImageUrl(movie.poster_path, 'w500')} 
              alt={movie.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="flex-grow">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-3 mb-6 text-sm">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-movie-dark rounded-full">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="flex gap-6 flex-wrap mb-6 text-gray-300">
              {movie.vote_average && (
                <div className="flex items-center gap-1">
                  <Star size={20} className="text-movie-primary" />
                  <span>{Math.round(movie.vote_average * 10) / 10}</span>
                </div>
              )}
              
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock size={20} className="text-movie-primary" />
                  <span>{movie.runtime} mins</span>
                </div>
              )}
              
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={20} className="text-movie-primary" />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Overview</h2>
              <p className="text-gray-300">{movie.overview || "No overview available."}</p>
            </div>
            
            {directors.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Director{directors.length > 1 ? 's' : ''}</h2>
                <div className="flex gap-2">
                  {directors.map(director => (
                    <span key={director.id} className="text-gray-300">{director.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {cast.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {cast.map(person => (
                    <div key={person.id} className="flex items-center gap-2">
                      {person.profile_path ? (
                        <img 
                          src={getImageUrl(person.profile_path, 'w185')} 
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-movie-dark rounded-full flex items-center justify-center">
                          <User size={16} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{person.name}</p>
                        <p className="text-gray-400 text-xs">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Rate & Review</h2>
          
          <div className="bg-movie-dark rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="text-xl mr-4">Your Rating:</div>
              <div className="flex">
                {[...Array(10)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={`cursor-pointer transition-colors ${
                      (hoverRating || userRating) > i ? 'text-movie-primary' : 'text-gray-600'
                    }`}
                    onClick={() => setUserRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
              {userRating > 0 && <span className="ml-2 text-lg">{userRating}/10</span>}
            </div>
            
            <Textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Write your review here..."
              className="bg-black/30 border-gray-700 min-h-[120px] mb-4"
            />
            
            <Button 
              onClick={handleSubmitReview}
              className="bg-movie-primary hover:bg-movie-primary/90 text-black"
            >
              Submit Review
            </Button>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Reviews ({userReviews.length})</h2>
            
            {userReviews.length > 0 ? (
              <div className="space-y-6">
                {userReviews.map(review => (
                  <div key={review.id} className="bg-movie-dark rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'text-movie-primary' : 'text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="ml-2">{review.rating}/10</span>
                    </div>
                    
                    {review.comment && (
                      <p className="text-gray-300 mb-2">{review.comment}</p>
                    )}
                    
                    <p className="text-gray-500 text-sm">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
            )}
          </div>

          {movie.similar?.results?.length > 0 && (
            <div className="mt-12">
              <MovieList
                title="Similar Movies You Might Like"
                movies={movie.similar.results.slice(0, 10)}
                isLoading={false}
              />
            </div>
          )}
        </div>
      </div>
      
      <footer className="bg-movie-dark py-6 mt-12">
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

export default MovieDetails;

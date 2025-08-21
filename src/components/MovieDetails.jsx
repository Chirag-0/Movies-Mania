import StarRating from "../StarRating";
import { useKey } from "../useKey";
import Loader from "./Loader";
import { useEffect,useRef,useState } from "react";
const KEY = "8a68f1cf";

function MovieDetails({selectedID,onCloseMovie,onAddWatched,watched}){
  const [movie,setMovie] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  const [userRating,setUserRating] = useState('');
  const isWatched = watched.map((movie)=>movie.imdbID).includes(selectedID);

  const countRef = useRef(0);
  useEffect(function(){
    if(userRating ) countRef.current += 1;
  },[userRating])

  const watchedMovieRating = watched.find((movie)=>movie.imdbID === selectedID)?.userRating;
  const {
    Title:title,
    Year:year,
    Poster:poster,
    Runtime:runtime,
    Plot:plot,
    Released:released,
    Actors:actors,
    Director:director,
    Genre:genre,
    imdbRating,
  } = movie;

  useEffect(function(){
    async function getMovieDetails(){
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
      );
      const data = await res.json();
      // console.log(data);
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  },[selectedID])

  useKey('escape',onCloseMovie);
 

  function handleAdd(){
    const newWatchedMovie = {
      imdbID:selectedID,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecision: countRef.current,
    }

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(function(){
    if(!title) return;
    document.title = `Movie | ${title}`
    return function(){
      document.title = 'Movies Mania'
      // console.log(`Cleanup effect for movie ${title}`);
    }
  },[title]);

  return(
    <div className="details">
      {isLoading ? <Loader/> :
      <>
      <header>
        <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
        <img src={poster} alt={`Poster of ${movie}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
         {!isWatched ? 
         <>
          <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
          {userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>}
         </>
          : <p>You rated this movie with {watchedMovieRating}⭐</p>
          }
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
      </>
      }
      </div>
  )
}

export default MovieDetails
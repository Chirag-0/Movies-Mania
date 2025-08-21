import { useState } from "react";
import {useMovies} from './useMovies';
import { useLocalStorageState } from "./useLocalStorageState";

//importing components
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar";
import Box from './components/Box';
import MovieDetails from "./components/MovieDetails";
import Main from './components/Main';
import MovieList from './components/MovieList';
import NumResults from './components/NumResults';
import Search from './components/Search';
import WatchedMovieList from './components/WatchedMovieList';
import WatchedSummary from './components/WatchedSummary';

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function App() {
 
  const [query, setQuery] = useState("");
  const [selectedID,setSelectedID] = useState(null);
  // const tempQuery = "interstellar";
  const [watched,setWatched] = useLocalStorageState([],'watched');

  /*
  useEffect(function(){
    console.log('After initial render');
  },[])
  useEffect(function(){
    console.log('After every render');
  })
  useEffect(function(){
    console.log('D');
  },[query])
  console.log('During render');
  */

  const {movies,isLoading,error} = useMovies(query);

  function handleSelectedID(id){
    setSelectedID((selectedID) =>( id === selectedID ? null : id));
  }
  function handleCloseMovie(){
    setSelectedID(null);
  }
  function handleAddWatched(movie){
    setWatched((watched)=>[...watched,movie]);

    // localStorage.setItem("watched",JSON.stringify([...watched,movie]));
  }
  function handleDeleteWatched(id){
    setWatched((watched)=>watched.filter((movie)=> movie.imdbID !== id))
  }
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies}/>
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader/> : <MovieList movies={movies}/>} */}
          {isLoading && <Loader/>}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectedID} />}
          {error && <ErrorMessage message={error}/>}
        </Box>
        <Box>
         {selectedID ? <MovieDetails selectedID={selectedID} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched}/> :
         <>
          <WatchedSummary watched={watched}/>
          <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched}/>
         </>
         }
        </Box>
      </Main>
    </>
  );
}

export default App

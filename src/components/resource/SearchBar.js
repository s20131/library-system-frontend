import './SearchBar.css';
import Button from '../UI/button/Button';
import { useRef } from 'react';

const SearchBar = (props) => {
  const searchInput = useRef();

  return (
    <form>
      <div className='search_bar'>
        <label htmlFor='search'>Wyszukaj książkę, frazę, autora...</label>
        <input id='search' ref={searchInput} type='text' name='search' />
        <Button onClick={() => props.searchHandler(searchInput.current.value)}>Szukaj</Button>
      </div>
    </form>
  );
};

export default SearchBar;
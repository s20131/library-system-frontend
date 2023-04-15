import './SearchBar.css';
import Button from '../UI/button/Button';

const SearchBar = (props) => {

  const searchHandler = () => {
    // TODO
  };

  return (
    <form>
      <div className='search_bar'>
        <label htmlFor='search'>Wyszukaj książkę, frazę, autora...</label>
        <input id='search' type='text' name='search' />
        <Button type='button' onClick={searchHandler}>Szukaj</Button>
      </div>
    </form>
  );
};

export default SearchBar;
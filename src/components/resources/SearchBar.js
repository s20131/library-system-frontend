import './SearchBar.css';

const SearchBar = (props) => {

  const searchHandler = () => {

  };

  return (
    <form >
      <p className='search_bar'>
        <label htmlFor='search'>Wyszukaj książkę, frazę, autora...</label>
        <input id='search' type='text' name='search' />
        <button type='button' onClick={searchHandler} >
          Szukaj
        </button>
      </p>
    </form>
  );
};

export default SearchBar;
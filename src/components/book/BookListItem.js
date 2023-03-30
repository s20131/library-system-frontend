import Card from '../UI/card/Card';
import ShortDescription from './ShortDescription';
import Cover from './Cover';
import './BookListItem.css';
import { Link } from 'react-router-dom';

const BookListItem = (props) => {
  return (
    <Link style={{ textDecoration: 'none' }} to={`/books/${props.id}`}>
      <Card className='book_list_item'>
        <Cover context='cover_list' />
        <ShortDescription title={props.title} author={props.author} />
      </Card>
    </Link>
  );
};

export default BookListItem;
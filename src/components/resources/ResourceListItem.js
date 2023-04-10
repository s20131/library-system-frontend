import Card from '../UI/card/Card';
import ShortDescription from './ShortDescription';
import Cover from './Cover';
import './ResourceListItem.css';
import { Link } from 'react-router-dom';

const ResourceListItem = (props) => {
  return (
    // TODO link inside card
    <Link style={{ textDecoration: 'none' }} to={`/${props.resource}/${props.id}`}>
      <Card className='resource_list_item'>
        <Cover context='cover_list' />
        <ShortDescription title={props.title} author={props.author} />
      </Card>
    </Link>
  );
};

export default ResourceListItem;
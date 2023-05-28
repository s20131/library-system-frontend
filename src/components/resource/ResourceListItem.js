import Card from '../UI/card/Card';
import ShortDescription from './ShortDescription';
import Cover from './Cover';
import './ResourceListItem.css';
import { Link } from 'react-router-dom';

const ResourceListItem = (props) => {
  return (
    // TODO link inside card
    <Link style={{ textDecoration: 'none' }} to={`/${props.resource.type}/${props.resource.id}`}>
      <Card className={`resource_list_item ${props.resource.type === 'ebooks' ? 'ebook_list_item' : undefined}`}>
        <Cover context='cover_list' resourceId={props.resource.id} />
        <ShortDescription title={props.resource.title} author={props.resource.author} />
      </Card>
    </Link>
  );
};

export default ResourceListItem;
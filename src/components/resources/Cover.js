import './Cover.css';
import Card from '../UI/card/Card';

const Cover = (props) => {
  return <Card className={`cover ${props.context}`} />;
};

export default Cover;
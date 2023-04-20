import './ShortDescription.css';

const ShortDescription = (props) => {
  return (
    <h4 className='short_description'>
      {props.title}
      <span style={{ opacity: '60%' }}> - {props.author}</span>
    </h4>
  );
};

export default ShortDescription;
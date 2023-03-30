import './DescriptionItem.css';

const DescriptionItem = (props) => {
  return (
    <>
      <p className='left'>{props.item}</p>
      <p>{props.description}</p>
    </>
  );
};

export default DescriptionItem;
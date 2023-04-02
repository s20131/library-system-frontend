const ShortDescription = (props) => {
  return (
    <div>
      <h4>
        {props.title}
        <span style={{ opacity: '60%' }}> - {props.author}</span>
      </h4>
    </div>
  );
};

export default ShortDescription;
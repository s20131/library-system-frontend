import './Button.css';

const Button = (props) => {
  const classes = 'button ' + props.className;
  return (
    <button className={classes}
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
            title={props.title ? props.title : ''}
            disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
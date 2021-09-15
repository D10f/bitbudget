import Spinner from './Spinner';

const Button = ({
  className,
  type,
  text,
  loading = false,
  onClick = () => {}
}) => (
  <button
    className={className ? `btn ${className}` : "btn"}
    type={type}
    onClick={onClick}
  >
    {text}
    {loading && <Spinner />}
  </button>
);

export default Button;

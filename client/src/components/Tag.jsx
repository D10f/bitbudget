const Tag = ({ value, onClick = () => {} }) => (
  <li className="tag">
    {value}
    <span className="tag__close" onClick={onClick}>&times;</span>
  </li>
);

export default Tag;

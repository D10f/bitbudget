const TextInput = ({
  label,
  value,
  name,
  placeholder,
  autoFocus,
  onChange,
  onKeyPress = () => {},
  readOnly,
  modifiers
}) => (
  <>
    {label && <label className="form__label" htmlFor={name}>{label}</label>}
    <input
      className={`form__input ${modifiers}`}
      type="text"
      value={value}
      name={name}
      placeholder={placeholder}
      autoFocus={autoFocus}
      readOnly={readOnly}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  </>
);


export default TextInput;

/*
<div className="form__control-group">
  {label && <label className="form__label" htmlFor={name}>{label}</label>}
  <input
    className="form__input"
    type="text"
    value={value}
    name={name}
    placeholder={placeholder}
    autoFocus={autoFocus}
    readOnly={readOnly}
    onChange={onChange}
    onKeyPress={onKeyPress}
  />
</div>
*/

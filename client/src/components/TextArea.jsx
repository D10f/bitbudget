const TextArea = ({
  label,
  value,
  name,
  placeholder,
  onChange,
  maxLength = 250,
  readOnly
}) => (
  <>
    {label && <label className="form__label" htmlFor={name}>{label}</label>}
    <textarea
      className="form__input form__textarea"
      value={value}
      name={name}
      id={name}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={onChange}
      maxLength={maxLength}
    />
  </>
);


export default TextArea;

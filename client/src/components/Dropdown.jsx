const Dropdown = ({ label, name, options, onChange, value }) => {
  return (
    <>
      {label && <label className="form__label" htmlFor={name}>{label}</label>}
      <select
        className="form__dropdown"
        type="select"
        name={name}
        onChange={onChange}
        value={value || options[0]}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <button
        className="form__dropdown-toggle"
        type="button"
        tabIndex="-1"
      >
        &lsaquo;
      </button>
    </>
  );
};

export default Dropdown;

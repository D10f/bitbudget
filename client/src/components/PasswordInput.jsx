import { useState } from 'react';
import EyeIcon from './EyeIcon';
import EyeIconBlock from './EyeIconBlock';

const passwordEnum = {
  0: 'poor',
  1: 'weak',
  2: 'average',
  3: 'okay',
  4: 'strong'
};

const PasswordInput = ({
  label,
  value,
  name,
  placeholder,
  autoFocus,
  onChange,
  showSuggestions,
  hidden,
  readOnly
}) => {

  const [ showPassword, setShowPassword ] = useState(false);
  const [ passwordScore, setPasswordScore ] = useState('');
  let zxcvbn;

  // 830Kb script loaded lazily when component is mounted
  if (showSuggestions) {
    import('zxcvbn').then(m => zxcvbn = m.default);
  }

  const getPasswordScore = (password) => {
    const { score } = zxcvbn(password);
    setPasswordScore(passwordEnum[score]);
  }

  const handleChange = (e) => {
    const { value } = e.target;
    if (showSuggestions) {
      value === ''
        ? setPasswordScore('')
        : getPasswordScore(e.target.value);
    }
    onChange(e);
  };

  // Provide feedback about the password if enabled and not empty
  const inputClassString = showSuggestions && passwordScore
    ? `form__input form__input--${passwordScore}`
    : "form__input";

  const controlClassString = hidden
    ? "form__control-group form__control-group--hidden"
    : "form__control-group";

  return (
    <>
      {label && <label className="form__label" htmlFor={name}>{label}</label>}
      <input
        className={inputClassString}
        type={showPassword ? "text" : "password"}
        value={value}
        name={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        onChange={handleChange}
      />
      <button
        className="form__toggle"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeIconBlock /> : <EyeIcon />}
      </button>
    </>
  );
}

// <div className={controlClassString}>
//   {label && <label className="form__label" htmlFor={name}>{label}</label>}
//   <input
//     className={inputClassString}
//     type={showPassword ? "text" : "password"}
//     value={value}
//     name={name}
//     placeholder={placeholder}
//     autoFocus={autoFocus}
//     readOnly={readOnly}
//     onChange={handleChange}
//   />
//   <button
//     className="form__toggle"
//     type="button"
//     onClick={() => setShowPassword(!showPassword)}
//   >
//     {showPassword ? <EyeIconBlock /> : <EyeIcon />}
//   </button>
// </div>

export default PasswordInput;

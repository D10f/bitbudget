const FormControl = ({ modifiers, children }) => (
  <div className={`form__control-group ${modifiers}`}>
    {children}
  </div>
);

export default FormControl;

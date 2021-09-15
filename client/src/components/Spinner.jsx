// Spinner from https://loading.io/css/

const Spinner = ({ className }) => {

  const classString = className ? `lds-ring ${className}` : 'lds-ring';

  return (
    <div className={classString}>
      <div></div><div></div><div></div><div></div>
    </div>
  );
};

export default Spinner;

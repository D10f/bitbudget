import { useRef } from 'react';
import { connect } from 'react-redux';
import { addError } from '../redux/actions/notifications';
import { startUpdateExpenseImage } from '../redux/actions/expenses';
import { uploadImage } from '../utils/imageHandler';

const FilePicker = ({
  authToken,
  addError,
  startUpdateExpenseImage,
  setImageUrl,
  expenseId,
  disabled
}) => {

  const filepicker = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    // TODO: check file type

    if (file.size > 1024 * 1024 * 1)  {
      return addError('File size cannot be greater than 1MB');
    }

    uploadImage(file, expenseId, authToken)
      .then(res => res.text())
      .then(url => {
        startUpdateExpenseImage(expenseId, url);
        setImageUrl(url);
      })
      .catch(err => addError(err));
  };

  return (
    <>
      <button
        className={disabled ? "btn disabled" : "btn"}
        type="button"
        onClick={() => filepicker.current.click()}
        disabled={disabled}
      >
        Add Image
      </button>
      {!disabled && (
        <input
          className="form__input--file"
          ref={filepicker}
          onChange={handleFileSelect}
          type="file"
          name="imageUrl"
        />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  authToken: state.user.token
});

const mapDispatchToProps = dispatch => ({
  addError: (msg, duration) => dispatch(addError(msg, duration)),
  startUpdateExpenseImage: (id, url) => dispatch(startUpdateExpenseImage(id, url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilePicker);

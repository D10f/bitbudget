import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { addError } from '../redux/actions/notifications';
import { uploadImage } from '../utils/imageHandler';
import {
  startUpdateExpenseImage,
  startRemoveExpenseImage
} from '../redux/actions/expenses';

const FilePicker = ({
  authToken,
  addError,
  startUpdateExpenseImage,
  startRemoveExpenseImage,
  imageUrl,
  setImageUrl,
  expenseId,
  disabled
}) => {

  const filepicker = useRef(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    // TODO: check file type

    if (file.size > 1024 * 1024 * 1)  {
      return addError('File size cannot be greater than 1MB');
    }

    startUpdateExpenseImage(file, expenseId)
      .then(setImageUrl)
      .catch(addError);

    // uploadImage(file, expenseId, authToken)
    //   .then(res => res.text())
    //   .then(url => {
    //     startUpdateExpenseImage(expenseId, url);
    //     setImageUrl(url);
    //   })
    //   .catch(err => addError(err));
  };

  const handleRemoveImage = () => {
    startRemoveExpenseImage(expenseId, imageUrl)
      .then(() => {
        console.log('sdfsfsd');
        setImageUrl('');
      })
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
      {imageUrl && (
        <button
          className="btn"
          type="button"
          onClick={handleRemoveImage}
        >
        Remove Image
        </button>
      )}
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
  startRemoveExpenseImage: (id, url) => dispatch(startRemoveExpenseImage(id, url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilePicker);

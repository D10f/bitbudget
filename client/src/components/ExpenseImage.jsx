import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { addError } from '../redux/actions/notifications';
import { loadImage } from '../utils/imageHandler';
import axios from 'axios';

const ExpenseImage = ({ addError, url, authToken }) => {

  const imgEl = useRef(null);

  useEffect(() => {

    if (!url) return;
    let blobURL;

    loadImage(url, authToken)
      .then(blob => {
        console.log(blob);
        blobURL = URL.createObjectURL(blob);
        imgEl.current.src = blobURL;
      })
      .catch(err => addError(err.message));

    return () => {
      URL.revokeObjectURL(blobURL);
    };

  }, [url]);

  return (
    <img ref={imgEl} className="expense__image" />
  );
};

const mapStateToProps = state => ({
  authToken: state.user.token
});

const mapDispatchToProps = dispatch => ({
  addError: (msg, duration) => dispatch(addError(msg, duration))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseImage);

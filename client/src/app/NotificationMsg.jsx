import { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { removeError, removeMessage } from '../redux/notifications/actions';

const NotificationMsg = ({ msg, id, duration, type, removeError, removeMessage }) => {

  const [progress, setProgress] = useState(100);
  const [progressUpdate, setProgressUpdate] = useState(true);

  // Update progress bar every 16ms for smooth transition, calculate how many
  // updates it will require give the duration of the message.
  const countDown = useCallback(() => {
    const DURATION   = duration; // 5000 ms by default
    const UNITS      = 100;
    const INTERVAL   = UNITS / (DURATION / 16); // 16ms

    let _progress = UNITS;
    return setInterval(() => {
      if (!progressUpdate) return;

      if (_progress <= 0) {
        return type === 'error'
          ? removeError(id)
          : removeMessage(id);
      }

      _progress -= INTERVAL;
      setProgress(_progress);
    }, 16); // 16ms
  }, [progressUpdate]);


  useEffect(() => {
    const counter = countDown();
    return () => {
      clearInterval(counter);
    };
  }, [countDown]);

  return (
    <article
      className={`notification__message notification__message--${type}`}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <p>{msg}</p>
      <progress
        className={`notification__duration notification__duration--${type}`}
        value={progress}
        max="100">
      </progress>
    </article>
  )
};

const mapDispatchToProps = dispatch => ({
  removeError: id => dispatch(removeError(id)),
  removeMessage: id => dispatch(removeMessage(id))
});

export default connect(undefined, mapDispatchToProps)(NotificationMsg);

import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { removeError, removeMessage } from '../redux/actions/notifications';

const NotificationMsg = ({ msg, id, duration, type, removeError, removeMessage }) => {

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const counter = countDown();
    return () => {
      clearInterval(counter);
    };
  }, []);

  // Visual updates should happen at most every 16ms to achieve 60FPS for best UX
  const countDown = () => {
    const DURATION   = duration; // 5000 ms by default
    const UNITS      = 100;
    const INTERVAL   = UNITS / (DURATION / 16); // magic number 16 explained above

    let _progress = UNITS;
    return setInterval(() => {
      if (_progress <= 0) {
        return type === 'error'
          ? removeError(id)
          : removeMessage(id);
      }

      _progress -= INTERVAL;
      setProgress(_progress);
    }, 16); // magic number 16 explained above
  };

  return (
    <article className={`notification__message notification__message--${type}`}>
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

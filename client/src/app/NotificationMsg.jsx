import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import { removeError, removeMessage } from '../redux/notifications/actions';

const enterAnimation = {
  initial: { rotateX: 90 },
  visible: { rotateX: 0 },
  initial: { rotateX: 90 },
  transition: {
    duration: 1
  }
};

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
    <motion.article
      className={`notification__message notification__message--${type}`}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
      variants={enterAnimation}
      initial='initial'
      animate='visible'
      exit='exit'
    >
      <p>{msg}</p>
      <progress
        className={`notification__duration notification__duration--${type}`}
        value={progress}
        max="100">
      </progress>
    </motion.article>
  )
};

const mapDispatchToProps = dispatch => ({
  removeError: id => dispatch(removeError(id)),
  removeMessage: id => dispatch(removeMessage(id))
});

export default connect(undefined, mapDispatchToProps)(NotificationMsg);

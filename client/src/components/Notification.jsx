import { connect } from 'react-redux';
import NotificationMsg from './NotificationMsg';

const Notification = ({ notifications }) => (
  <aside className="notification">
    {
      notifications.map(({ msg, id, duration, type }) => (
        <NotificationMsg
          key={id}
          msg={msg}
          id={id}
          duration={duration}
          type={type}
        />
      ))
    }
  </aside>
);

const mapStateToProps = state => ({
  notifications: [
    ...state.notifications['errors'],
    ...state.notifications['messages'],
  ]
});

export default connect(mapStateToProps)(Notification);

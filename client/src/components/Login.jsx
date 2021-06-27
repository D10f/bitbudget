import { useState } from 'react';
import { connect } from 'react-redux';
import { startLoginUser, startRestoreUserSettings } from '../redux/actions/user';

const Login = ({ startLoginUser, startRestoreUserSettings, history }) => {

  const [userSettings, setUserSettings] = useState(undefined);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    encryptionPassword: ''
  });


  const handleSubmit = async e => {
    e.preventDefault();
    if (!userSettings) {
      // First confirm username/password and receive encrypted user data
      const encryptedSettings = await startLoginUser(credentials);
      if (encryptedSettings) {
        setUserSettings(encryptedSettings);
      }
    } else {
      // Try to decrypt user data using encryptionPassword
      const done = await startRestoreUserSettings(userSettings, credentials.encryptionPassword);
      console.log('are you done?', done);
      if (done) history.push('/');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form
      className="form"
      onSubmit={handleSubmit}
    >
      <div className="form__control-group">
        <label className="form__label" htmlFor="username">Username</label>
        <input
          className={userSettings ? "form__input settings__text-input--readonly" : "form__input"}
          value={credentials.username}
          onChange={handleChange}
          name="username"
          id="username"
          placeholder="username"
          readOnly={Boolean(userSettings)}
        />
      </div>
      <div className="form__control-group">
        <label className="form__label" htmlFor="password">Password</label>
        <input
          className={userSettings ? "form__input settings__text-input--readonly" : "form__input"}
          value={credentials.password}
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
          placeholder="password"
          readOnly={Boolean(userSettings)}
        />
      </div>
      <div className="form__control-group">
        <label className="form__label" htmlFor="Encryption Password">Encryption Password</label>
        <input
          className={userSettings ? "form__input" : "form__input settings__text-input--readonly"}
          value={credentials.encryptionPassword}
          onChange={handleChange}
          type="password"
          name="encryptionPassword"
          id="Encryption Password"
          placeholder="Encryption Password"
          readOnly={!Boolean(userSettings)}
        />
      </div>
      <button className="btn">{userSettings ? 'Decrypt' : 'Login'}</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startLoginUser: (userCredentials) => dispatch(startLoginUser(userCredentials)),
  startRestoreUserSettings: (data, password) => dispatch(startRestoreUserSettings(data, password))
});

export default connect(undefined, mapDispatchToProps)(Login);

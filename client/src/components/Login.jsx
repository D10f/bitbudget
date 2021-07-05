import { useState } from 'react';
import { connect } from 'react-redux';
import { startLoginUser, startRestoreUserData } from '../redux/actions/user';

const Login = ({ startLoginUser, startRestoreUserData, history }) => {

  const [encryptionPrompt, setEncryptionPrompt] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    encryptionPassword: ''
  });


  const handleSubmit = async e => {
    e.preventDefault();

    if (encryptionPrompt) {
      const ok = await startRestoreUserData(credentials.encryptionPassword);
      if (ok) history.push('/');
    } else {
      const loggedIn = await startLoginUser(credentials);
      setEncryptionPrompt(loggedIn);
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
          className={encryptionPrompt ? "form__input settings__text-input--readonly" : "form__input"}
          value={credentials.username}
          onChange={handleChange}
          name="username"
          id="username"
          placeholder="username"
          readOnly={Boolean(encryptionPrompt)}
        />
      </div>
      <div className="form__control-group">
        <label className="form__label" htmlFor="password">Password</label>
        <input
          className={encryptionPrompt ? "form__input settings__text-input--readonly" : "form__input"}
          value={credentials.password}
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
          placeholder="password"
          readOnly={Boolean(encryptionPrompt)}
        />
      </div>
      <div className="form__control-group">
        <label className="form__label" htmlFor="Encryption Password">Encryption Password</label>
        <input
          className={encryptionPrompt ? "form__input" : "form__input settings__text-input--readonly"}
          value={credentials.encryptionPassword}
          onChange={handleChange}
          type="password"
          name="encryptionPassword"
          id="Encryption Password"
          placeholder="Encryption Password"
          readOnly={!Boolean(encryptionPrompt)}
        />
      </div>
      <button className="btn">{encryptionPrompt ? 'Decrypt' : 'Login'}</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startLoginUser: (userCredentials) => dispatch(startLoginUser(userCredentials)),
  startRestoreUserData: (data, password) => dispatch(startRestoreUserData(data, password))
});

export default connect(undefined, mapDispatchToProps)(Login);

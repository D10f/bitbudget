import { useState } from 'react';
import { connect } from 'react-redux';
import { startSignupUser } from '../redux/actions/user';
import { addError } from '../redux/actions/notifications';

const SignUp = ({ startSignupUser, addError, history }) => {

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    password2: '',
    confirmPass: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, password, password2, confirmPass } = credentials;

    // spam bot detected
    if (password2) {
      return;
    }

    if (password !== confirmPass) {
      return addError(`Passwords don't match`);
    }

    startSignupUser({ username, password })
      .then(done => {
        if (done) history.push('/');
      })
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
        <label className="form__label">
          Username
        </label>
        <input
        value={credentials.username}
        onChange={handleChange}
        className="form__input"
        name="username"
        placeholder="username"
        />
      </div>
      <div className="form__control-group">
        <label className="form__label">
          Password
        </label>
        <input
          value={credentials.password}
          onChange={handleChange}
          className="form__input"
          name="password"
          placeholder="password"
          type="password"
        />
      </div>
        <input
          value={credentials.password2}
          onChange={handleChange}
          name="password2"
          className="form__input form__input--hidden"
          tabIndex="-1"
          autoComplete="niet"
          type="hidden"
        />
      <div className="form__control-group">
        <label
          className="form__label"
          htmlFor="confirmPass"
        >Confirm Password
        </label>
        <input
          value={credentials.confirmPass}
          onChange={handleChange}
          className="form__input"
          name="confirmPass"
          id="confirmPass"
          type="password"
          placeholder="confirm password"
        />
      </div>
      <button className="btn">Sign Up</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startSignupUser: (user) => dispatch(startSignupUser(user)),
  addError: (error) => dispatch(addError(error))
});

export default connect(undefined, mapDispatchToProps)(SignUp);

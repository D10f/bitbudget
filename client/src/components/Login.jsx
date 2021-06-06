import { useState } from 'react';
import { connect } from 'react-redux';
import { startLoginUser } from '../redux/actions/user';

const Login = ({ startLoginUser, history }) => {

  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    startLoginUser(credentials)
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
      onSubmit={handleSubmit}>
      <div className="form__control-group">
        <label className="form__label" htmlFor="username">Username</label>
        <input
          className="form__input"
          value={credentials.username}
          onChange={handleChange}
          name="username"
          id="username"
          placeholder="username"
        />
      </div>
      <div className="form__control-group">
        <label className="form__label" htmlFor="password">Password</label>
        <input
          className="form__input"
          value={credentials.password}
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
      </div>
      <button className="btn">Login</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startLoginUser: (userCredentials) => dispatch(startLoginUser(userCredentials)),
});

export default connect(undefined, mapDispatchToProps)(Login);

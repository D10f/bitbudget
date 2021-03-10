import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setTheme, setPrimaryColor } from '../redux/actions/theme';
import { startUpdateUser, logoutUser } from '../redux/actions/user';
import useSnapshot from '../hooks/useSnapshot';
import useTheme from '../hooks/useTheme';
// import shader from '../utils/colorShader';

const Profile = ({ user, theme, primaryColor, startUpdateUser, logoutUser, setTheme, setPrimaryColor }) => {

  const createSnapshot = useSnapshot();
  const updateTheme = useTheme();

  const [passwords, setPasswords] = useState({
    password: '',
    confirm: ''
  });

  useEffect(() => {
    updateTheme(theme, primaryColor);
  }, [theme, primaryColor]);

  const handleThemeChange = (e) => {
    setTheme(e.target.id);
  };

  const handleColorChange = (e) => {
    setPrimaryColor(e.target.id);
  };

  const handlePasswords = (e) => {
    const { value, name } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSave = () => {
    const {password, confirm} = passwords;

    if (password && password !== confirm) {
      return console.log('Passwords do not match');
    }

    if (password) {
      startUpdateUser({ password }, user.token)
        .then(() => createSnapshot())
        .catch(console.error);
    }

    createSnapshot();
  };

  return (
    <section className="profile">
      <header className="profile__header">
        <h2>User Settings</h2>
      </header>

      <ul className="settings__list">
        <li className="settings__setting">
          <label htmlFor="">Username</label>
          <input
            className="settings__text-input settings__text-input--readonly"
            placeholder="Username"
            value={user.username}
            readOnly
          />
        </li>
        <li className="settings__setting">
          <label htmlFor="">Change Password</label>
          <input
            className="settings__text-input"
            type="password"
            placeholder="Password"
            name="password"
            value={passwords.password}
            onChange={handlePasswords}
          />
        </li>
        <li className="settings__setting">
          <label htmlFor="">Confirm Password</label>
          <input
            className="settings__text-input"
            type="password"
            placeholder="Confirm Password"
            name="confirm"
            value={passwords.confirm}
            onChange={handlePasswords}
          />
        </li>

        <li className="settings__setting">
          <label>Theme</label>
          <div>
            <input
              type="radio"
              className="settings__checkbox"
              id="light"
              checked={theme === 'light' ? true : false}
              onChange={handleThemeChange}
            />
            <label
              className="settings__theme settings__theme--light"
              htmlFor="light"
              tabIndex="0">
            </label>
            <input
              type="radio"
              className="settings__checkbox"
              id="dark"
              checked={theme === 'dark' ? true : false}
              onChange={handleThemeChange}
            />
            <label
              className="settings__theme settings__theme--dark"
              htmlFor="dark"
              tabIndex="0">
            </label>
          </div>
        </li>

        <li className="settings__setting">
          <label>Accent Color</label>
          <div>
            <input
              type="radio"
              className="settings__checkbox"
              id="primary"
              checked={primaryColor === 'primary' ? true : false}
              onChange={handleColorChange}
            />
            <label
              className="settings__theme settings__theme--orange"
              htmlFor="primary"
              tabIndex="0">
            </label>
            <input
              type="radio"
              className="settings__checkbox"
              id="secondary"
              checked={primaryColor === 'secondary' ? true : false}
              onChange={handleColorChange}
            />
            <label
              className="settings__theme settings__theme--blue"
              htmlFor="secondary"
              tabIndex="0">
            </label>
            <input
              type="radio"
              className="settings__checkbox"
              id="tertiary"
              checked={primaryColor === 'tertiary' ? true : false}
              onChange={handleColorChange}
            />
            <label
            className="settings__theme settings__theme--green"
            htmlFor="tertiary"
            tabIndex="0">
            </label>
          </div>
        </li>
      </ul>

      <div className="settings__actions">
        <button onClick={handleSave} className="btn btn--action">Save Changes</button>
        <button onClick={() => logoutUser(user.token)} className="btn btn--action">Logout</button>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  theme: state.theme.theme,
  primaryColor: state.theme.primary
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => dispatch(setTheme(theme)),
  setPrimaryColor: (color) => dispatch(setPrimaryColor(color)),
  startUpdateUser: (updates, authToken) => dispatch(startUpdateUser(updates, authToken)),
  logoutUser: (authToken) => dispatch(logoutUser(authToken))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

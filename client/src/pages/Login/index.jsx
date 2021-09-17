import { useState } from 'react';
import { connect } from 'react-redux';
import { startLoginUser, startRestoreUserData } from '../../redux/user/actions';
import { Link } from 'react-router-dom';

import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import Form from '../../components/Form';
import FormControl from '../../components/FormControl';
import Button from '../../components/Button';

const Login = ({ isLoading, startLoginUser, startRestoreUserData, history }) => {

  const [ encryptionKeyExists, setEncryptionKeyExists ] = useState(false);
  const [ credentials, setCredentials ] = useState({
    username: '',
    password: '',
    encryptionPassword: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!encryptionKeyExists) {
      // First time the login form is submitted it authenticates the user
      const wasLoginSuccessful = await startLoginUser(credentials);
      setEncryptionKeyExists(wasLoginSuccessful);

    } else {
      // Attempt to decrypt user data
      const wasDecryptionSuccessful = await startRestoreUserData(
        credentials.encryptionPassword
      );

      if (wasDecryptionSuccessful) {
        history.push('/');
      }
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section>
      <h2 className="has-text-center py-2">Login</h2>
      <Form onSubmit={handleSubmit}>

        <FormControl>
          <TextInput
            label="Username"
            value={credentials.username}
            name="username"
            placeholder="Userame"
            autoFocus={true}
            onChange={handleChange}
            readOnly={encryptionKeyExists}
          />
        </FormControl>

        <FormControl>
          <PasswordInput
            label="Password"
            name="password"
            placeholder="password"
            value={credentials.password}
            showSuggestions={false}
            onChange={handleChange}
            readOnly={encryptionKeyExists}
          />
        </FormControl>

        {
          encryptionKeyExists &&
          <FormControl>
            <PasswordInput
              label="Encryption Password"
              name="encryptionPassword"
              placeholder="Your decryption password"
              value={credentials.encryptionPassword}
              autoFocus={true}
              showSuggestions={false}
              onChange={handleChange}
            />
          </FormControl>
        }

        <FormControl
          modifiers="form__control-group--center mt-2"
        >
          <Button
            text={encryptionKeyExists ? "Decrypt" : "Login"}
            type="submit"
            loading={isLoading}
          />
          {encryptionKeyExists ? (
            <Button
              text="Back"
              type="button"
              loading={isLoading}
              onClick={() => setEncryptionKeyExists(false)}
            />
          ) : (
            <Link className="is-small" to="/signup">I don't have an account</Link>
          )}
        </FormControl>

      </Form>
    </section>
  );
};

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

const mapDispatchToProps = (dispatch) => ({
  startLoginUser: userCredentials => dispatch(startLoginUser(userCredentials)),
  startRestoreUserData: password => dispatch(startRestoreUserData(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

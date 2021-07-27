import { useState } from 'react';
import { connect } from 'react-redux';
import { startSignupUser } from '../../redux/user/actions';
import { userSignupSchema } from '../../utils/schemas';
import useFormValidation from '../../hooks/useFormValidation';
import { Link } from 'react-router-dom';

import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import Form from '../../components/Form';
import FormControl from '../../components/FormControl';
import Button from '../../components/Button';

const Signup = ({ history, signupUser, isLoading }) => {

  // Validates that the user input conforms to a pre-defined schema
  const validateSchema = useFormValidation(userSignupSchema);

  // The "confirm" field is used as a honeypot for spam bots
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    password2: '',
    confirm: ''
  });

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async ({ username, password }) => {
    const done = await signupUser({ username, password });
    if (done)
      history.push('/profile');
  };

  return (
    <Form onSubmit={validateSchema(credentials, handleSubmit)} >

      <FormControl>
        <TextInput
          label="Username"
          value={credentials.username}
          name="username"
          placeholder="Userame"
          autoFocus={true}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <PasswordInput
          label="Password"
          value={credentials.password}
          name="password"
          placeholder="Choose a strong password"
          onChange={handleChange}
          showSuggestions={true}
          hidden={false}
        />
      </FormControl>

      <FormControl>
        <PasswordInput
          label="Confirm Password"
          value={credentials.password2}
          name="password2"
          placeholder="Confirm Password"
          onChange={handleChange}
          showSuggestions={false}
          hidden={false}
        />
      </FormControl>

      <FormControl modifiers="form__control-group--hidden">
        <PasswordInput
          label="Confirm"
          value={credentials.confirm}
          name="confirm"
          placeholder="Confirm"
          onChange={handleChange}
          showSuggestions={false}
          hidden={true}
        />
      </FormControl>

      <FormControl modifiers="form__control-group--center mt-2">
        <Button
          text="Sign Up"
          type="submit"
          loading={isLoading}
        />

        <Link className="is-small" to="/login">Already have an account</Link>
      </FormControl>
    </Form>
  );
};

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

const mapDispatchToProps = dispatch => ({
  signupUser: credentials => dispatch(startSignupUser(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

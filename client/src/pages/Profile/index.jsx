import { useState } from 'react';
import { connect } from 'react-redux';
import { startUpdateUser, startLogoutUser } from '../../redux/user/actions';
import { setCategories } from '../../redux/categories/actions';
import { userProfileSchema } from '../../utils/schemas';
import useFormValidation from '../../hooks/useFormValidation';

import Button from '../../components/Button';
import Form from '../../components/Form';
import FormControl from '../../components/FormControl';
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import Dropdown from '../../components/Dropdown';
import CategoryList from './CategoryList';

const Profile = ({
  history,
  categories,
  user,
  updateUser,
  logoutUser,
  updateCategories,
  isLoading
}) => {

  // Validates that the user input conforms to a pre-defined schema
  const validateSchema = useFormValidation(userProfileSchema);

  const [ theme, setTheme ] = useState('');
  const [ categoryInput, setCategoryInput ] = useState('');
  const [ currentCategories, setCurrentCategories ] = useState([...categories]);
  const [ credentials, setCredentials ] = useState({
    email: user.email,
    accountPassword: '',
    accountPasswordConfirm: '',
    encryptionPassword: '',
    encryptionPasswordConfirm: ''
  });

  const handleInputChange = e => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // This function contains a bunch of e.preventDefault in order to prevent the
  // form from being submitted, while retaining expected functionality
  const handleAddCategory = e => {
    if (e.key === 'Enter') {
      if (categoryInput === '')
        return e.preventDefault();

      // Prevent duplicates
      const match = currentCategories.find(c => {
        return c.toLowerCase() === categoryInput.toLowerCase();
      });

      // If it's a duplicate do nothing, but empty text input field.
      if (match) {
        setCategoryInput('');
        return e.preventDefault();
      }

      setCurrentCategories([...currentCategories, categoryInput]);
      setCategoryInput('');

      // Prevents submitting the form
      return e.preventDefault();
    }
  };

  const handleRemoveCategory = category => {
    setCurrentCategories(currentCategories.filter(c => c !== category));
  };

  const handleSaveProfile = ({ accountPassword, email }) => {
    updateCategories(currentCategories);
    updateUser({ password: accountPassword, email });
  };

  const handleLogout = async () => {
    await logoutUser();
    history.push('/login');
  };

  return (
    <section className="profile">

      <h2 className="has-text-center py-2">Your Profile</h2>

      <Form onSubmit={validateSchema(credentials, handleSaveProfile)} >
        <FormControl>
          <TextInput
            label="Username"
            placeholder="Username"
            value={user.username}
            name="username"
            readOnly={true}
          />
        </FormControl>

        <FormControl>
          <TextInput
            label="Email"
            placeholder="Email"
            value={credentials.email}
            name="email"
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl>
          <PasswordInput
            label="New Password"
            value={credentials.password}
            name="accountPassword"
            placeholder="New Password"
            onChange={handleInputChange}
            showSuggestions={true}
            hidden={false}
          />
        </FormControl>

        <FormControl>
          <PasswordInput
            label="Confirm New Password"
            value={credentials.confirm}
            name="accountPasswordConfirm"
            placeholder="Confirm New Password"
            onChange={handleInputChange}
            showSuggestions={false}
          />
        </FormControl>

        <FormControl>
          <PasswordInput
            label="New Encryption Password"
            value={credentials.encryptionPassword}
            name="encryptionPassword"
            placeholder="New Encryption Password"
            onChange={handleInputChange}
            showSuggestions={true}
            readOnly={true}
          />
        </FormControl>

        <FormControl>
          <PasswordInput
            label="Confirm Encryption Password"
            value={credentials.encryptionPasswordConfirm}
            name="encryptionPasswordConfirm"
            placeholder="Confirm New Encryption Password"
            onChange={handleInputChange}
            showSuggestions={false}
            readOnly={true}
          />
        </FormControl>

        <FormControl>
          <Dropdown
            label="Theme"
            name="theme"
            onChange={e => setTheme(e.target.value)}
            options={["Light", "Dark"]}
          />
        </FormControl>

        <FormControl>
          <TextInput
            label="Categories"
            placeholder="Start typing and press enter"
            value={categoryInput}
            name="category"
            onChange={e => setCategoryInput(e.target.value)}
            onKeyPress={handleAddCategory}
          />
        </FormControl>

        <CategoryList
          categories={currentCategories}
          handleRemoveCategory={handleRemoveCategory}
        />

        <FormControl modifiers="form__control-group--center mt-2">
          <Button
            text="Save Changes"
            type="submit"
            loading={isLoading}
          />
          <Button
            text="Logout"
            type="button"
            onClick={handleLogout}
          />
        </FormControl>

      </Form>
    </section>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  isLoading: state.user.isLoading,
  categories: state.categories
});

const mapDispatchToProps = dispatch => ({
  updateUser: updates => dispatch(startUpdateUser(updates)),
  logoutUser: () => dispatch(startLogoutUser()),
  updateCategories: categories => dispatch(setCategories(categories))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

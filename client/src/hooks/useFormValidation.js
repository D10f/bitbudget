import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addError } from '../redux/notifications/actions';
import ajv from '../utils/schemas';

/**
 * @param  {object}   schema A schema that will be used to validate the submitted form
 * @return {function}        The function to be called onSubmit, providing the fields and a callback
 */
const useFormValidation = schema => {

  const dispatch = useDispatch();

  return (credentials, callback) => {
    return event => {
      event.preventDefault();

      const validate = ajv.compile(schema);
      const isValid = validate(credentials);

      if (!isValid) {
        for (const error of validate.errors) {
          const message = `${error.dataPath} ${error.message}`;
          dispatch(addError(message));
        }
        return;
      }

      callback(credentials);
    }
  };
};

export default useFormValidation;

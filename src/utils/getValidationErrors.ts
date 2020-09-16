import { ValidationError } from '../pages/ResetPassword/node_modules/yup';
interface Errors {
  [key: string]: string;
}
export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });
  return validationErrors;
}

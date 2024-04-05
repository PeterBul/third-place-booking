// withFormik.js

import { FormikValues, WithFormikConfig, withFormik } from 'formik';
import set from 'lodash/set';

export default <
  OuterProps extends object,
  Values extends FormikValues,
  Payload = Values
>({
  validationSchema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate: _,
  ...options
}: WithFormikConfig<OuterProps, Values, Payload>) =>
  withFormik({
    ...options,
    validate: (values, props) => {
      try {
        validationSchema.validateSync(values, {
          abortEarly: false,
          context: props,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error;
        }

        if (error.name !== 'ValidationError') {
          throw error;
        }

        // @ts-expect-error We know that error has inner property
        return error.inner.reduce((errors, currentError) => {
          errors = set(errors, currentError.path, currentError.message);
          return errors;
        }, {});
      }

      return {};
    },
  });

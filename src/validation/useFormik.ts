import {
  type FormikValues,
  useFormik as useFormikFormik,
  FormikConfig,
} from 'formik';
import type { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import set from 'lodash/set';

export const useFormik = <Values extends FormikValues = FormikValues>({
  zodSchema,
  ...config
}: FormikConfig<Values> & {
  zodSchema?: ZodObject<ZodRawShape> | ZodEffects<ZodTypeAny>;
}) => {
  return useFormikFormik({
    ...config,
    validate: (values) => {
      if (!zodSchema) {
        return config.validate ? config.validate(values) : {};
      }
      const result = zodSchema.safeParse(values);
      return result.success
        ? {}
        : result.error.errors.reduce((errors, error) => {
            errors = set(errors, error.path.join('.'), error.message);
            return errors;
          }, {});
    },
  });
};

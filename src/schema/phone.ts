import parsePhoneNumberFromString from 'libphonenumber-js/max';
import { z } from 'zod';
import * as yup from 'yup';

export const zPhone = z.string().transform((arg, ctx) => {
  const phone = parsePhoneNumberFromString(arg, {
    // set this to use a default country when the phone number omits country code
    defaultCountry: 'NO',

    // set to false to require that the whole string is exactly a phone number,
    // otherwise, it will search for a phone number anywhere within the string
    extract: false,
  });

  // when it's good
  if (phone && phone.isValid()) {
    return phone.number;
  }

  // when it's not
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'Invalid phone number',
  });
  return phone?.number;
});

export const yupPhone = yup.string().transform((v) => {
  const phone = parsePhoneNumberFromString(v, {
    // set this to use a default country when the phone number omits country code
    defaultCountry: 'NO',

    // set to false to require that the whole string is exactly a phone number,
    // otherwise, it will search for a phone number anywhere within the string
    extract: false,
  });

  // when it's good
  if (phone && phone.isValid()) {
    return phone.number;
  }

  throw new yup.ValidationError('Invalid phone number', v, 'phone');
});

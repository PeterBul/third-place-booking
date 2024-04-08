import {
  Stack,
  Checkbox,
  FormControl,
  FormLabel,
  Link as ChakraLink,
  Input,
  FormErrorMessage,
  FormHelperText,
  Button,
  Text,
} from '@chakra-ui/react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneNumberInput } from './PhoneNumberInput';
import { useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { z } from 'zod';
import { zPhone } from '../schema';
import axios, { AxiosError } from 'axios';
import set from 'lodash/set';

// const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,42}$/;
const REGISTER_URL = '/api/auth/signup';

const ZodSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: zPhone,
    pwd: z
      .string()
      .regex(
        PWD_REGEX,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    matchPwd: z.string(),
    isMemberThirdPlace: z.boolean(),
  })
  .refine((schema) => schema.pwd === schema.matchPwd, {
    path: ['matchPwd'],
    message: 'Passwords must match',
  });

export const RegisterForm = () => {
  const memberThirdPlaceRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [pwdFocus, setPwdFocus] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleSubmit = async (values: {
    email: string;
    phone: string;
    pwd: string;
    matchPwd: string;
    name: string;
    isMemberThirdPlace: boolean;
  }) => {
    const { email, phone, pwd, name, isMemberThirdPlace } = values;
    try {
      const response = await axios.post(
        REGISTER_URL,
        {
          email,
          phone,
          password: pwd,
          name,
          isMemberThirdPlace,
        },
        { withCredentials: true }
      );

      const accessToken = response.data.accessToken;
      const roles = response.data.roles;
      // Can add roles here if we have added to the backend
      setAuth({ email, password: pwd, accessToken, roles });
      navigate('/verification', { replace: true });
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        throw error;
      }
      if (!error.response) {
        setErrMsg('No Server Response');
      } else if (error.response.status === 409) {
        setErrMsg('Email already exists');
      } else {
        setErrMsg('Registration failed');
      }
      errRef.current?.focus();
    }
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      pwd: '',
      matchPwd: '',
      isMemberThirdPlace: false,
    },
    onSubmit: handleSubmit,
    validate: (values) => {
      const result = ZodSchema.safeParse(values);
      return result.success
        ? {}
        : result.error.errors.reduce((errors, error) => {
            errors = set(errors, error.path.join('.'), error.message);
            return errors;
          }, {});
    },
  });

  const isValidName = !formik.errors.name && formik.values.name;
  const isValidEmail = !formik.errors.email && formik.values.email;
  const isValidPwd = !formik.errors.pwd && formik.values.pwd;
  const isValidMatch = !formik.errors.matchPwd && formik.values.matchPwd;
  const isValidPhone = !formik.errors.phone && formik.values.phone;

  useEffect(() => {
    memberThirdPlaceRef.current?.focus();
  }, []);

  return (
    <>
      <Stack
        w={'100%'}
        maxW={'420px'}
        padding={'1rem'}
        borderRadius={'20px'}
        bg={'gray.700'}
      >
        <p
          ref={errRef}
          className={errMsg ? 'errMsg' : 'offscreeen'}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Register</h1>

        <form
          onSubmit={formik.handleSubmit}
          onChange={() => {
            if (errMsg) {
              setErrMsg('');
            }
          }}
        >
          <Stack gap={4}>
            <Text as="b">Do you already have a membership?</Text>
            <div>
              <Checkbox
                isChecked={formik.values.isMemberThirdPlace}
                onChange={async (e) => {
                  await formik.setFieldValue(
                    'isMemberThirdPlace',
                    e.target.checked
                  );
                  formik.setFieldTouched('isMemberThirdPlace', true);
                }}
                ref={memberThirdPlaceRef}
              >
                I'm a member of Third Place
              </Checkbox>
            </div>
            <FormControl
              isInvalid={!!formik.errors.name && formik.touched.name}
            >
              <FormLabel htmlFor="name">Name:</FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={isValidName ? 'false' : 'true'}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!!formik.errors.email && formik.touched.email}
            >
              <FormLabel htmlFor="email">Email:</FormLabel>
              <Input
                as={Input}
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={isValidEmail ? 'false' : 'true'}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!formik.errors.phone && formik.touched.phone}
            >
              <FormLabel htmlFor="phone">Phone:</FormLabel>
              <PhoneNumberInput
                value={formik.values.phone}
                aria-invalid={isValidPhone ? 'false' : 'true'}
                onChange={async (v: string) => {
                  await formik.setFieldValue('phone', v);
                  formik.setFieldTouched('phone', true);
                }}
              />
              <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
            </FormControl>
            {/* Username */}
            {/* <label htmlFor="username">
              Username:
              <span className={validName ? 'valid' : 'hide'}>
              <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !user ? 'hide' : 'invalid'}>
              <FontAwesomeIcon icon={faTimes} />
              </span>
              </label>
              <input
              type="text"
              id="username"
              ref={userNameRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
              aria-invalid={validName ? 'false' : 'true'}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              />
              <p
              id="uidnote"
              className={
                userFocus && user && !validName ? 'instructions' : 'offscreen'
              }
              >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p> */}
            <FormControl isInvalid={!!formik.errors.pwd && formik.touched.pwd}>
              <FormLabel htmlFor="pwd">Password:</FormLabel>
              <Input
                type="password"
                id="pwd"
                name="pwd"
                required
                aria-invalid={isValidPwd ? 'false' : 'true'}
                aria-describedby="pwdnote"
                value={formik.values.pwd}
                onChange={formik.handleChange}
                onFocus={() => setPwdFocus(true)}
                onBlur={(e) => {
                  setPwdFocus(false);
                  formik.handleBlur(e);
                }}
              />
              {/* <FormErrorMessage>{formik.errors.pwd}</FormErrorMessage> */}
              <FormHelperText
                id="pwdnote"
                className={
                  pwdFocus && !isValidPwd && formik.values.pwd
                    ? 'instructions'
                    : 'offscreen'
                }
                bg={'gray.800'}
                p={2}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 42 characters.
                <br />
                Must include uppercase and lowercase letters, a number, and a
                special character.
                <br />
                Allowed special characters:{' '}
                <span aria-label="exclamation mark">!</span>
                <span aria-label="at sign">@</span>
                <span aria-label="hash">#</span>
                <span aria-label="dollar sign">$</span>
                <span aria-label="percent sign">%</span>
              </FormHelperText>
            </FormControl>
            <FormControl
              isInvalid={!!formik.errors.matchPwd && formik.touched.matchPwd}
            >
              <FormLabel htmlFor="confirm_pwd">Confirm Password:</FormLabel>
              <Input
                type="password"
                id="matchPwd"
                name="matchPwd"
                required
                aria-invalid={isValidMatch ? 'false' : 'true'}
                aria-describedby="confirmnote"
                value={formik.values.matchPwd}
                onChange={formik.handleChange}
                onFocus={() => setMatchFocus(true)}
                onBlur={(e) => {
                  setMatchFocus(false);
                  formik.handleBlur(e);
                }}
              />
              <Text
                id="confirmnote"
                className={
                  matchFocus && !isValidMatch ? 'instructions' : 'offscreen'
                }
                bg={'gray.800'}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the password above.
              </Text>
            </FormControl>
            <Button type="submit" isDisabled={!formik.isValid || !formik.dirty}>
              Sign Up
            </Button>
            <p>
              Already registered?
              <br />
              <span className="line">
                <ChakraLink as={Link} color="blue.100" to="/login">
                  Sign In
                </ChakraLink>
              </span>
            </p>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

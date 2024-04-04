import './Register.css';
import { useRef, useState, useEffect } from 'react';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../api/axios';
import { AxiosError } from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Stack, Text } from '@chakra-ui/layout';
import { Checkbox } from '@chakra-ui/checkbox';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { FullPageCentered } from './FullPageCentered';

// const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,42}$/;
const REGISTER_URL = '/api/auth/signup';

const Schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  pwd: yup
    .string()
    .matches(
      PWD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  matchPwd: yup
    .string()
    .oneOf([yup.ref('pwd'), ''], 'Passwords must match')
    .required('Password confirmation is required'),
});

function Register() {
  const memberThirdPlaceRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [pwdFocus, setPwdFocus] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    memberThirdPlaceRef.current?.focus();
  }, []);

  const handleSubmit = async (values: {
    email: string;
    pwd: string;
    matchPwd: string;
    name: string;
    isMemberThirdPlace: boolean;
    isMemberBloom: boolean;
  }) => {
    const { email, pwd, name, isMemberBloom, isMemberThirdPlace } = values;
    try {
      const response = await axios.post(
        REGISTER_URL,
        {
          email,
          password: pwd,
          name,
          isMemberThirdPlace,
          isMemberBloom,
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

  const { auth } = useAuth();

  if (auth.accessToken) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <FullPageCentered>
      <Formik
        initialValues={{
          name: '',
          email: '',
          pwd: '',
          matchPwd: '',
          isMemberBloom: false,
          isMemberThirdPlace: false,
        }}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        {(formik) => {
          const isValidName = !formik.errors.name && formik.values.name;
          const isValidEmail = !formik.errors.email && formik.values.email;
          const isValidPwd = !formik.errors.pwd && formik.values.pwd;
          const isValidMatch =
            !formik.errors.matchPwd && formik.values.matchPwd;
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

                <Form
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
                        onChange={(e) =>
                          formik.setFieldValue(
                            'isMemberThirdPlace',
                            e.target.checked
                          )
                        }
                        ref={memberThirdPlaceRef}
                      >
                        I'm a member of Third Place
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        isChecked={formik.values.isMemberBloom}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'isMemberBloom',
                            e.target.checked
                          )
                        }
                      >
                        I'm a member of Bloom
                      </Checkbox>
                    </div>
                    <FormControl>
                      <FormLabel htmlFor="name">
                        Name:
                        <span className={isValidName ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="text"
                        id="name"
                        name="name"
                        required
                      />
                    </FormControl>

                    {/* TODO: Change to email */}
                    <FormControl>
                      <FormLabel htmlFor="email">
                        Email:
                        <span className={isValidEmail ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className={
                            isValidEmail || !formik.values.email
                              ? 'hide'
                              : 'invalid'
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="off"
                        required
                        aria-invalid={isValidEmail ? 'false' : 'true'}
                      />
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
                    <FormControl>
                      <FormLabel htmlFor="pwd">
                        Password:
                        <span className={isValidPwd ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className={
                            isValidPwd || !formik.values.pwd
                              ? 'hide'
                              : 'invalid'
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="password"
                        id="pwd"
                        name="pwd"
                        required
                        aria-invalid={isValidPwd ? 'false' : 'true'}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                      />
                      <Text
                        id="pwdnote"
                        className={
                          pwdFocus && !isValidPwd && formik.values.pwd
                            ? 'instructions'
                            : 'offscreen'
                        }
                        bg={'gray.800'}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 42 characters.
                        <br />
                        Must include uppercase and lowercase letters, a number,
                        and a special character.
                        <br />
                        Allowed special characters:{' '}
                        <span aria-label="exclamation mark">!</span>
                        <span aria-label="at sign">@</span>
                        <span aria-label="hash">#</span>
                        <span aria-label="dollar sign">$</span>
                        <span aria-label="percent sign">%</span>
                      </Text>
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="confirm_pwd">
                        Confirm Password:
                        <span className={isValidMatch ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className={
                            isValidMatch || !formik.values.matchPwd
                              ? 'hide'
                              : 'invalid'
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </FormLabel>
                      <Field
                        as={Input}
                        type="password"
                        id="matchPwd"
                        name="matchPwd"
                        required
                        aria-invalid={isValidMatch ? 'false' : 'true'}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                      />
                      <Text
                        id="confirmnote"
                        className={
                          matchFocus && !isValidMatch
                            ? 'instructions'
                            : 'offscreen'
                        }
                        bg={'gray.800'}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the password above.
                      </Text>
                    </FormControl>
                    <Button
                      type="submit"
                      isDisabled={!formik.isValid || !formik.dirty}
                    >
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
                </Form>
              </Stack>
            </>
          );
        }}
      </Formik>
    </FullPageCentered>
  );
}

export default Register;

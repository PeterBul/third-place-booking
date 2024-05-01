import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Text,
} from '@chakra-ui/react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import set from 'lodash/set';

// const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,42}$/;
const UPDATE_PASSWORD_URL = '/api/auth/reset-password';

const ZodSchema = z
  .object({
    pwd: z
      .string()
      .regex(
        PWD_REGEX,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    matchPwd: z.string(),
  })
  .refine((schema) => schema.pwd === schema.matchPwd, {
    path: ['matchPwd'],
    message: 'Passwords must match',
  });

export const UpdatePasswordForm = () => {
  const errRef = useRef<HTMLParagraphElement>(null);

  const [pwdFocus, setPwdFocus] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const firstElementRef = useRef<HTMLInputElement>(null);

  const { token } = useParams();

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleSubmit = async (values: { pwd: string; matchPwd: string }) => {
    const { pwd } = values;
    try {
      const response = await axios.post(
        UPDATE_PASSWORD_URL,
        {
          password: pwd,
          token,
        },
        { withCredentials: true }
      );

      const accessToken = response.data.accessToken;
      const roles = response.data.roles;
      const email = response.data.email;
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
      pwd: '',
      matchPwd: '',
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

  const isValidPwd = !formik.errors.pwd && formik.values.pwd;
  const isValidMatch = !formik.errors.matchPwd && formik.values.matchPwd;

  useEffect(() => {
    firstElementRef.current?.focus();
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
        <h1>New Password</h1>

        <form
          onSubmit={formik.handleSubmit}
          onChange={() => {
            if (errMsg) {
              setErrMsg('');
            }
          }}
        >
          <Stack gap={4}>
            <FormControl isInvalid={!!formik.errors.pwd && formik.touched.pwd}>
              <FormLabel htmlFor="pwd">Password:</FormLabel>
              <Input
                ref={firstElementRef}
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
              Update
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

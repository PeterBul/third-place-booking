import {
  Stack,
  FormControl,
  FormLabel,
  Link as ChakraLink,
  Input,
  FormErrorMessage,
  Button,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import set from 'lodash/set';

const FORGOT_PASSWORD_URL = '/api/auth/forgot-password';

const ZodSchema = z.object({
  email: z.string().email('Invalid email'),
});

export const ForgotPassword = () => {
  const firstElementRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string }) => {
    const { email } = values;
    try {
      await axios.post(
        FORGOT_PASSWORD_URL,
        {
          email,
        },
        { withCredentials: true }
      );

      navigate('/login', { replace: true });
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        throw error;
      }
      if (!error.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Reset of password failed');
      }
      errRef.current?.focus();
    }
  };
  const formik = useFormik({
    initialValues: {
      email: '',
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

  const isValidEmail = !formik.errors.email && formik.values.email;

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
        <Heading>Forgot password?</Heading>

        <Text mt={2} mb={4}>
          Enter your email address and the machine elves will send you a link to
          reset your password.
        </Text>

        <form
          onSubmit={formik.handleSubmit}
          onChange={() => {
            if (errMsg) {
              setErrMsg('');
            }
          }}
        >
          <Stack gap={4}>
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
            <Button type="submit" isDisabled={!formik.isValid || !formik.dirty}>
              Send Reset Instructions
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

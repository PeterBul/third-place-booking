import { useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import { AxiosError } from 'axios';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './Login.css';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { Checkbox } from '@chakra-ui/checkbox';
import { Link as ChakraLink, Flex, Text } from '@chakra-ui/react';
import { FullPageCentered } from '../FullPageCentered';

const LOGIN_URL = '/api/auth/signin';

function Login() {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from: string = location.state?.from?.pathname || '/';

  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [email, password]);

  const getSetOrUseAxiosErrorMessage =
    (error: AxiosError<{ message?: string }>) => (message: string) => {
      if (error.response?.data?.message) {
        setErrorMessage(error.response?.data?.message);
      } else {
        setErrorMessage(message);
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );
      const accessToken = response.data.accessToken;
      const roles = response.data.roles;
      // Can add roles here if we have added to the backend
      setAuth({ email, password, accessToken, roles });
      setEmail('');
      setPassword('');
      navigate(from, { replace: true });
    } catch (error) {
      // setErrorMessage(error.message);
      if (!(error instanceof AxiosError)) {
        throw error;
      }
      const setOrUseAxiosErrorMessage = getSetOrUseAxiosErrorMessage(error);
      if (!error.response) {
        setErrorMessage('No Server Response');
      } else if (error.response.status === 400) {
        setErrorMessage('Missing Username or Password');
      } else if (error.response.status === 403) {
        setOrUseAxiosErrorMessage('Invalid Username or Password');
      } else {
        setErrorMessage('Login Failed');
      }
      errRef.current?.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist));
  }, [persist]);

  const { auth } = useAuth();

  if (auth.accessToken) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <FullPageCentered>
      <Stack
        width={'100%'}
        maxW={'420px'}
        p={'1rem'}
        borderRadius={'20px'}
        backgroundColor={'gray.700'}
        gap={4}
      >
        <p
          ref={errRef}
          className={errorMessage ? 'errMsg' : 'offscreen'}
          aria-live="assertive"
        >
          {errorMessage}
        </p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <Stack>
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <Flex justifyContent="space-between" alignItems={'baseline'}>
              <label htmlFor="password">Password:</label>
              <ChakraLink
                as={Link}
                fontStyle={'italic'}
                to="/forgot-password"
                color="blue.100"
                fontSize={'0.8rem'}
              >
                Forgot Password?
              </ChakraLink>
            </Flex>
            <Input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <Button type="submit" colorScheme="blue">
              Sign In
            </Button>

            <Checkbox onChange={togglePersist} isChecked={persist}>
              Trust This Device
            </Checkbox>
          </Stack>
        </form>
        <Text>
          Need an account?
          <br />
          <span className="line">
            <ChakraLink as={Link} color="blue.100" to="/register">
              Sign Up
            </ChakraLink>
          </span>
        </Text>
      </Stack>
    </FullPageCentered>
  );
}

export default Login;

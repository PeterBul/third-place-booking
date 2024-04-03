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
import { Container, Stack, Text } from '@chakra-ui/layout';
import { Checkbox } from '@chakra-ui/checkbox';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';

// const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/;
const REGISTER_URL = '/api/auth/signup';

function Register() {
  const memberThirdPlaceRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [isMemberThirdPlace, setMemberThirdPlace] = useState(false);
  const [isMemberBloom, setMemberBloom] = useState(false);

  const [name, setName] = useState('');

  // const [user, setUser] = useState('');
  // const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');

  const [pwd, setPwd] = useState('');
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    memberThirdPlaceRef.current?.focus();
  }, []);

  // const validName = USER_REGEX.test(user);
  const isValidPwd = PWD_REGEX.test(pwd);
  const isValidMatch = pwd === matchPwd;
  const isValidEmail = EMAIL_REGEX.test(email);
  const isValidName = name.length > 0;

  const isValidEntries =
    isValidPwd && isValidMatch && isValidEmail && isValidName;

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd, matchPwd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email) || !PWD_REGEX.test(pwd) || pwd !== matchPwd) {
      setErrMsg('Invalid Entry');
      return;
    }
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
    <>
      <Container
        h={'100%'}
        pt={'100px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent="center"
        minH={'100vh'}
      >
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

          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Text as="b">Do you already have a membership?</Text>
              <div>
                <Checkbox
                  isChecked={isMemberThirdPlace}
                  onChange={(e) => setMemberThirdPlace(e.target.checked)}
                  ref={memberThirdPlaceRef}
                >
                  I'm a member of Third Place
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  isChecked={isMemberBloom}
                  onChange={(e) => setMemberBloom(e.target.checked)}
                >
                  I'm a member of Bloom
                </Checkbox>
              </div>
              <FormControl>
                <FormLabel htmlFor="name">
                  Name:
                  <span className={name ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </FormLabel>
                <Input
                  type="text"
                  id="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              {/* TODO: Change to email */}
              <FormControl>
                <FormLabel htmlFor="email">
                  Email:
                  <span className={isValidEmail ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={isValidEmail || !email ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
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
                <FormLabel htmlFor="password">
                  Password:
                  <span className={isValidPwd ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={isValidPwd || !pwd ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </FormLabel>
                <Input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={isValidPwd ? 'false' : 'true'}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <Text
                  id="pwdnote"
                  className={
                    pwdFocus && !isValidPwd && pwd
                      ? 'instructions'
                      : 'offscreen'
                  }
                  bg={'gray.800'}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
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
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="confirm_pwd">
                  Confirm Password:
                  <span className={isValidMatch && matchPwd ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span
                    className={isValidMatch || !matchPwd ? 'hide' : 'invalid'}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </FormLabel>
                <Input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  aria-invalid={isValidMatch ? 'false' : 'true'}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
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
              <Button type="submit" disabled={!isValidEntries}>
                Sign Up
              </Button>
              <p>
                Already registered?
                <br />
                <span className="line">
                  <Link to="/login">Sign In</Link>
                </span>
              </p>
            </Stack>
          </form>
        </Stack>
      </Container>
    </>
  );
}

export default Register;

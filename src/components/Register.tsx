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

// const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/;
const REGISTER_URL = '/auth/signup';

function Register() {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [isMemberThirdPlace, setMemberThirdPlace] = useState(false);
  const [isMemberBloom, setMemberBloom] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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
    firstNameRef.current?.focus();
  }, []);

  // const validName = USER_REGEX.test(user);
  const isValidPwd = PWD_REGEX.test(pwd);
  const isValidMatch = pwd === matchPwd;
  const isValidEmail = EMAIL_REGEX.test(email);
  const isValidFirstName = firstName.length > 0;
  const isValidLastName = lastName.length > 0;

  const isValidEntries =
    isValidPwd &&
    isValidMatch &&
    isValidEmail &&
    isValidFirstName &&
    isValidLastName;

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
          firstName,
          lastName,
          isMemberThirdPlace,
          isMemberBloom,
        },
        { withCredentials: true }
      );

      const accessToken = response.data.accessToken;
      const roles = response.data.roles;
      // Can add roles here if we have added to the backend
      setAuth({ email, password: pwd, accessToken, roles });
      navigate('/', { replace: true });
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
      <section className="full-page-center">
        <div className="register-form">
          <p
            ref={errRef}
            className={errMsg ? 'errMsg' : 'offscreeen'}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
            <p className="strong">Do you already have a membership?</p>
            <div>
              <input
                className="register-checkbox"
                type="checkbox"
                id="membership_thirdplace"
                name="membership_thirdplace"
                onChange={(e) => setMemberThirdPlace(e.target.checked)}
              />
              <label htmlFor="membership_thirdplace">
                I'm a member of Third Place
              </label>
            </div>
            <div>
              <input
                className="register-checkbox"
                type="checkbox"
                id="membership_bloom"
                name="membership_bloom"
                onChange={(e) => setMemberBloom(e.target.checked)}
              />
              <label htmlFor="membership_bloom">I'm a member of Bloom</label>
            </div>
            {/* TODO: Add name input */}
            <label htmlFor="first_name">
              First Name:
              <span className={firstName ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
            </label>
            <input
              type="text"
              id="first_name"
              ref={firstNameRef}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="last_name">
              Last Name:
              <span className={lastName ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
            </label>
            <input
              type="text"
              id="last_name"
              required
              onChange={(e) => setLastName(e.target.value)}
            />

            {/* TODO: Change to email */}
            <label htmlFor="email">
              Email:
              <span className={isValidEmail ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={isValidEmail || !email ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={isValidEmail ? 'false' : 'true'}
            />
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
            <label htmlFor="password">
              Password:
              <span className={isValidPwd ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={isValidPwd || !pwd ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={isValidPwd ? 'false' : 'true'}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={
                pwdFocus && !isValidPwd && pwd ? 'instructions' : 'offscreen'
              }
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
            </p>
            <label htmlFor="confirm_pwd">
              Confirm Password:
              <span className={isValidMatch && matchPwd ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={isValidMatch || !matchPwd ? 'hide' : 'invalid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={isValidMatch ? 'false' : 'true'}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !isValidMatch ? 'instructions' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the password above.
            </p>
            <button disabled={!isValidEntries}>Sign Up</button>
            <p>
              Already registered?
              <br />
              <span className="line">
                <Link to="/login">Sign In</Link>
              </span>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export default Register;

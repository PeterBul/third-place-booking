import { Dispatch, SetStateAction, createContext, useState } from 'react';

interface IAuthContext {
  auth: IAuth;
  setAuth: Dispatch<SetStateAction<IAuth>>;
}

const AuthContext = createContext<IAuthContext>({
  auth: {},
  setAuth: () => {},
});

interface IProps {
  children: React.ReactNode;
}

export interface IAuth {
  email?: string;
  password?: string;
  accessToken?: string;
  roles?: number[];
}

export const AuthProvider = ({ children }: IProps) => {
  const [auth, setAuth] = useState<IAuth>({});
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

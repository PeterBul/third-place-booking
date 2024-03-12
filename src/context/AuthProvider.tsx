import { Dispatch, SetStateAction, createContext, useState } from 'react';

interface IAuthContext {
  auth: IAuth;
  setAuth: Dispatch<SetStateAction<IAuth>>;
  persist: boolean;
  setPersist: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<IAuthContext>({
  auth: {},
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
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
  const [persist, setPersist] = useState<boolean>(() => {
    const localStoragePersist = localStorage.getItem('persist');
    if (localStoragePersist) {
      const val = JSON.parse(localStoragePersist);
      if (typeof val === 'boolean') {
        return val;
      }
    }
    return false;
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

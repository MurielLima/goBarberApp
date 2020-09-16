import React, { createContext, useCallback, useState, useContext } from '../pages/ResetPassword/node_modules/react';
import api from '../services/api';
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): void;
  signOut(): void;
}
interface AuthState {
  token: string;
  user: object;
}

const AuthContext = createContext({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');
    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });
  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('/sessions', { email, password });
    console.log(response.data);

    localStorage.setItem('@GoBarber:token', response.data.token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(response.data.user));
  }, []);
  const signOut = useCallback(async () => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);
  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContext');
  }
  return authContext;
}
export { AuthContext, AuthProvider, useAuth };

import React, { createContext, useCallback, useState, useContext, useMemo } from 'react';
import {isToday, format} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
interface User{
  id:string;
  name:string;
  email:string;
  avatar_url:string;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): void;
  signOut(): void;
  updateUser(user:User):void;
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
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });
  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('/sessions', { email, password });

    const { user, token} = response.data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    api.defaults.headers.authorization = `Bearer ${token}`;
  }, []);
  const signOut = useCallback(async () => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);

	  const updateUser = useCallback((user:User)=>{
	    setData({
	      token:data.token,
	      user
	    })
	    localStorage.setItem('@GoBarber:user', JSON.stringify(user));
	  },[setData, data.token]);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const authContext = useContext(AuthContext);
  return authContext;
}
export { AuthContext, AuthProvider, useAuth };

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Routes } from '../utils/routesPath';

const AuthContext = createContext<any>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('');
  const [intialize, setIntialize] = useState(false);

  const getProfile = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios
        .get('/api/profile')
        .then((res) => {
          Router.push(Routes.Todo);
          setIntialize(true);
          setUserName(res.data.data.username);
        })
        .catch(() => {
          setIntialize(true);
          Router.push(Routes.Login);
        });
    } else {
      setIntialize(true);
      Router.push('/login');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        getProfile();
      } else {
        setIntialize(true);
        Router.push('/login');
      }
    }
  }, [typeof window]);

  const logout = async () => {
    setUserName('');
    sessionStorage.clear();
    Router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        userName,
        intialize,
        logout,
        getProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

export function useAuth() {
  return useContext(AuthContext);
}

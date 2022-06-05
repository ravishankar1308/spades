import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';

import Axios from 'axios';
import { SWRConfig } from 'swr';

import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Loader } from '../components/Loader';
import { LoadingButton } from '@mui/lab';
import { Routes } from '../utils/routesPath';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
if (typeof window !== 'undefined') {
  const token = window.sessionStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common.Authorization = token;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    const data = await response.data;
    return data.data;
  } catch (err: any) {
    throw err.response.data;
  }
};

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: '#e5e5e5'
}));

function MyApp({ Component, pageProps }: AppProps) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [intialize, setIntialize] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        axios
          .get('/api/profile')
          .then((res) => {
            Router.push(Routes.Todo);
            setIntialize(true);
            setUserName(res.data.data.username);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            setIntialize(true);
            Router.push(Routes.Login);
          });
      } else {
        setIntialize(true);
        Router.push('/login');
        setLoading(false);
      }
    }
    // }
  }, [typeof window]);

  if (loading) {
    return <Loader />;
  }
  console.log({ userName });
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000
      }}
    >
      <ContentStyle>
        <ThemeProvider theme={theme}>
          <AppBar sx={{ position: 'absolute', top: 0 }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Spades Todo
              </Typography>
              {userName && (
                <div>
                  <Button disabled variant={'text'} color="inherit">
                    Hi {userName}
                  </Button>
                  <LoadingButton
                    color="inherit"
                    variant={'text'}
                    onClick={() => {
                      setUserName('');
                      sessionStorage.clear();
                      Router.push('/login');
                    }}
                  >
                    Logout
                  </LoadingButton>
                </div>
              )}
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">
            <CssBaseline />
            <ToastContainer />
            {intialize ? <Component {...pageProps} /> : <Loader />}
          </Container>
        </ThemeProvider>
      </ContentStyle>
    </SWRConfig>
  );
}

export default MyApp;

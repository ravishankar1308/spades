import '../styles/globals.css';
import type { AppProps } from 'next/app';
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
import { AuthProvider, useAuth } from '../context/AuthContext';

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

const NavBar = () => {
  const { userName, intialize, logout } = useAuth();
  if (!intialize) {
    return <Loader />;
  }
  return (
    <AppBar sx={{ position: 'absolute', top: 0 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Spades Todo
        </Typography>
        {userName && (
          <div>
            <Button disabled variant={'text'} color="inherit">
              {`Hi ${userName}`}
            </Button>
            <LoadingButton color="inherit" variant={'text'} onClick={logout}>
              Logout
            </LoadingButton>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SWRConfig
        value={{
          fetcher
        }}
      >
        <ContentStyle>
          <ThemeProvider theme={theme}>
            <NavBar />
            <Container maxWidth="lg">
              <CssBaseline />
              <ToastContainer />
              <Component {...pageProps} />
            </Container>
          </ThemeProvider>
        </ContentStyle>
      </SWRConfig>
    </AuthProvider>
  );
}

export default MyApp;

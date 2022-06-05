import type { NextPage } from 'next';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, TextField, Stack, Typography, Button } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { Routes } from '../utils/routesPath';
import { useAuth } from '../context/AuthContext';

const Login: NextPage = () => {
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm<any>();

  const [loader, setLoader] = useState(false);
  const { getProfile } = useAuth();

  const onSubmit = (data: { username: string; password: string }) => {
    setLoader(true);
    axios
      .post('/api/login', data)
      .then(async (res) => {
        axios.defaults.headers.common.Authorization = res.data.data.token;
        sessionStorage.setItem('token', res.data.data.token);
        toast.success(res.data.message);
        getProfile();
        Router.push(Routes.Todo);
      })
      .catch((e) => {
        reset({ username: '', password: '' });
        toast.error(e.response?.data?.message);
        setLoader(false);
      });
  };
  return (
    <Grid item container justifyContent={'center'}>
      <Card sx={{ p: 3, width: '50%' }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" gutterBottom>
              Sign in
            </Typography>
          </Box>
        </Stack>

        <Grid item container flexDirection={'column'} spacing={3}>
          <Grid item>
            <Controller
              name={'username'}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="User Name *"
                  error={errors.username}
                  helperText={errors.username && 'Please enter user name'}
                />
              )}
            />
          </Grid>

          <Grid item>
            <Controller
              name={'password'}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={'password'}
                  fullWidth
                  label="Password *"
                  error={errors.password}
                  helperText={errors.password && 'Please enter password'}
                />
              )}
            />
          </Grid>
          <Grid item>
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loader}
            >
              Login
            </LoadingButton>
          </Grid>
          <Grid item>
            <Button
              onClick={() => Router.push(Routes.Register)}
              fullWidth
              size="large"
              type="submit"
              variant="text"
            >
              I don't have account
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default Login;

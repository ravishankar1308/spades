import type { NextPage } from 'next';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, TextField, Stack, Typography, Button } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { validateMessage } from '../utils/validateMessage';
import { Routes } from '../utils/routesPath';
import { useAuth } from '../context/AuthContext';

const Register: NextPage = () => {
  const {
    control,
    formState: { errors },
    reset,
    watch,
    handleSubmit
  } = useForm<any>();

  const { getProfile } = useAuth();
  const [loader, setLoader] = useState(false);

  const onSubmit = (data: { username: string; password: string; confirmPassword: string }) => {
    const { username, password } = data;
    setLoader(true);
    axios
      .post('/api/register', { username, password })
      .then(async (res) => {
        axios.defaults.headers.common.Authorization = res.data.data.token;
        sessionStorage.setItem('token', res.data.data.token);
        toast.success(res.data.message);
        getProfile();
      })
      .catch((e) => {
        reset({ username: '', password: '', confirmPassword: '' });
        toast.error(e.response.data?.message);
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
              rules={{ required: true, minLength: 6 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={'password'}
                  fullWidth
                  label="Password *"
                  error={errors.password}
                  helperText={validateMessage(errors.password?.type, [
                    'required:Please enter password',
                    'minLength:Password should minimum 6 character'
                  ])}
                />
              )}
            />
          </Grid>

          <Grid item>
            <Controller
              name={'confirmPassword'}
              control={control}
              rules={{
                required: true,
                validate: (i) => i === watch()?.password
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={'password'}
                  fullWidth
                  label="Confirm Password *"
                  error={errors.confirmPassword}
                  helperText={validateMessage(errors.confirmPassword?.type, [
                    'required:field required',
                    'validate:Password not match'
                  ])}
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
              Register
            </LoadingButton>
          </Grid>
          <Grid item>
            <Button
              onClick={() => Router.push(Routes.Login)}
              fullWidth
              size="large"
              type="submit"
              variant="text"
            >
              Already have an account
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default Register;

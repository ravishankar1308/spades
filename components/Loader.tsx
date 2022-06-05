import { CircularProgress, Grid } from '@mui/material';

export const Loader = () => {
  return (
    <Grid item container justifyContent={'center'}>
      <CircularProgress />
    </Grid>
  );
};

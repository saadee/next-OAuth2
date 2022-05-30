import React from 'react';
import { checkCookies, getCookie } from 'cookies-next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { GoogleIcon } from '../assests/GoogleIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(30, 8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  google: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0.8, 5),
    width: '100%',
    fontSize: '16px',
    color: 'black',
  },
}));

export default function Home() {
  const classes = useStyles();
  const router = useRouter();

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="#">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Csv Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate>
              <br />

              <Button
                onClick={() => router.push('/api/google')}
                variant="contained"
                type="button"
                color="default"
                startIcon={<GoogleIcon />}
                className={classes.google}
              >
                &nbsp; &nbsp; &nbsp; &nbsp; Sign In with Google
              </Button>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const cookieExists = getCookie('token', { req, res });
    console.log(cookieExists);
    if (cookieExists) return { redirect: { destination: '/dashboard' } };
    return { props: {} };
  } catch (err) {
    return { props: {} };
  }
}

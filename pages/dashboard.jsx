import React from 'react';
import Head from 'next/head';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { getCookie, removeCookies } from 'cookies-next';
import {
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Paper,
  Link,
  Avatar,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { UserContext } from '../Context/AuthContext';

import AdminPannel from '../components/AdminPannel';
import Documents from '../components/Documents';
import Professional from '../components/Professional';

import User from '../models/User';
import connect from '../lib/database';

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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const getStepContent = (step) => {
  switch (step) {
    case 0:
      return <AdminPannel />;
    case 1:
      return <Documents />;
    case 2:
      return <Professional />;
    default:
      return 'Finish';
  }
};

const Dashboard = ({ name, email, image, userObject }) => {
  const router = useRouter();
  const classes = useStyles();
  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [csvData, setCsvData] = React.useState('');
  const [open, setOpen] = React.useState(true);
  const [openProfile, setOpenProfile] = React.useState(false);
  const {
    setUser,
    user,
    logout,
    activeTab,
    setActiveTab,
    selectedTab,
    handleListItemClick,
  } = React.useContext(UserContext);

  React.useEffect(() => {
    setUser(JSON.parse(userObject));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userObject]);

  React.useEffect(() => {
    if (user && user?.isAdmin === true) setActiveTab(0);
    if (user && user?.isAdmin === false) setActiveTab(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpenProfile((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenProfile(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenProfile(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(openProfile);
  React.useEffect(() => {
    if (prevOpen.current === true && openProfile === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = openProfile;
  }, [openProfile]);

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <script
          src="https://apis.google.com/js/platform.js?onload=init"
          async
          defer
        ></script>
      </Head>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {name}
            </Typography>
            <Avatar
              ref={anchorRef}
              aria-controls={openProfile ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              src={image}
            />
            <Popper
              open={openProfile}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={openProfile}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleClose}>{name}</MenuItem>
                        <MenuItem onClick={handleClose}>{email}</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <Typography style={{ margin: 'auto' }} variant="h4" align="center">
              Menu
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {user?.isAdmin === true && (
              <ListItem
                button
                selected={selectedTab === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItem>
            )}
            {user?.isAdmin === true && (
              <ListItem
                button
                selected={selectedTab === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemIcon>
                  <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Documents" />
              </ListItem>
            )}
            <ListItem
              button
              selected={selectedTab === 2}
              onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="User" />
            </ListItem>
          </List>
          {/* <Divider />
          <List>{secondaryListItems}</List> */}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Box pt={4}>
              <div>{getStepContent(activeTab)}</div>

              <br />
              <br />
              <br />
              <br />
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </div>
  );
};

// ------------------------------------------
// server side function
// ------------------------------------------
export async function getServerSideProps({ req, res }) {
  try {
    // connect db
    await connect();
    // check cookie
    const token = getCookie('token', { req, res });
    if (!token)
      return {
        redirect: {
          destination: '/',
        },
      };

    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    const obj = await User.findOne({ _id: verified.id });
    if (!obj)
      return {
        redirect: {
          destination: '/',
        },
      };
    return {
      props: {
        email: obj?.email,
        name: obj?.name,
        image: obj?.image,
        userObject: JSON.stringify(obj),
      },
    };
  } catch (err) {
    removeCookies('token', { req, res });
    removeCookies('tokens', { req, res });
    return {
      redirect: {
        destination: '/',
      },
    };
  }
}

export default Dashboard;

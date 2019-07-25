import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { Container, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemText, Breadcrumbs } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { NavigationLinkModel } from '../models/NavigationLinks';
import {  Link } from 'react-router-dom'
import { ScaledObjectModel } from '../models/ScaledObjectModel';

export default class SideBarNav extends React.Component<{content: any, breadcrumbs:NavigationLinkModel[]}, {scaledObjects: ScaledObjectModel[]}> {
  constructor(props: {content: any, breadcrumbs:NavigationLinkModel[]}) {
    super(props);

    this.state = {
      scaledObjects: []
    }
  }

  componentDidMount() {
    fetch('/api/scaledobjects')
        .then(res => res.json())
        .then(({ items }) => this.setState({ scaledObjects: items }));
  }

  getScaledObjectSublinks() {
    let sublinks: NavigationLinkModel[] = [];

    for (let i = 0; i < this.state.scaledObjects.length; i++) {
      if (this.state.scaledObjects[i].metadata) {
        let sublink = '/scaled-objects/namespace/' + this.state.scaledObjects[i].metadata.namespace + '/scaled-object/' + this.state.scaledObjects[i].metadata.name;
        sublinks.push(new NavigationLinkModel(this.state.scaledObjects[i].metadata.namespace + '/' + this.state.scaledObjects[i].metadata.name, sublink));
      }
    }

    return sublinks;
  }

  getNavLinks() {
    return [
      new NavigationLinkModel("Overview", "/"), 
      new NavigationLinkModel("Scaled Objects", "/scaled-objects", this.getScaledObjectSublinks())
    ];
  }

  render() {
    return (
      <SideNav content={this.props.content} navLinks={this.getNavLinks()} breadcrumbs={this.props.breadcrumbs}></SideNav>
    );
  }
}

const DrawerListItem: React.FunctionComponent<{navLink: NavigationLinkModel, id: number}> = (props) => {
  const classes = useStyles();

  if (props.navLink.sublinks) {
    return (
      <div>
        <ListItem button component={Link} to={props.navLink.link} key={props.id}> 
          <ListItemText primary={props.navLink.text} />
        </ListItem>
        { props.navLink.sublinks.map( 
          (link: NavigationLinkModel, index:number) =>
          <ListItem button component={Link} to={link.link} className={classes.nested} key={`${props.id}${index}`}> 
            <ListItemText primary={link.text} />
          </ListItem>
        )}
      </div>
  );}

  return (
    <ListItem button component={Link} to={props.navLink.link} key={props.id}> 
      <ListItemText primary={props.navLink.text} />
    </ListItem>
  );
};

const SideNav: React.FunctionComponent<{ content: any, navLinks: NavigationLinkModel[], breadcrumbs:NavigationLinkModel[]}> = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    function handleDrawerOpen() {
      setOpen(true);
    }

    function handleDrawerClose() {
      setOpen(false);
    }

    function getBreadCrumbs() {
      let breadcrumbLinks = [];

      // Create links for each breadcrumb
      for (let i = 0; i < props.breadcrumbs.length; i++) {
        breadcrumbLinks.push(
          <Link
            key={i}
            color="white"
            to={props.breadcrumbs[i].link} 
            aria-current="page"
            className={classes.noLinkStyle}
          >
            <Typography>{ props.breadcrumbs[i].text }</Typography>
          </Link>);
      }

      return (
        <Breadcrumbs aria-label="Breadcrumb">
         { breadcrumbLinks }
        </Breadcrumbs>
      )

    }

    return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
              })}
          >
              <Toolbar>
              <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, open && classes.hide)}
              >
                  <MenuIcon />
              </IconButton>

              {getBreadCrumbs()}

              </Toolbar>
          </AppBar>

          <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={open}
              classes={{
              paper: classes.drawerPaper,
              }}
          >
              <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
              </div>
              <Divider />

              <List>
                { props.navLinks.map((link: NavigationLinkModel, index:number) => <DrawerListItem key={index} id={index} navLink={link}></DrawerListItem>) }
              </List>
          </Drawer>

          <main
              className={clsx(classes.content, {
              [classes.contentShift]: open,
              })}
          >
              <div className={classes.drawerHeader} />
              <Container maxWidth="lg">
                  { props.content }
              </Container>
          </main>;
        </div>
    );
};

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      background: '#2b78e4',
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    noLinkStyle: {
      textDecoration: 'none',
      color: 'white',
    }
  }),
);
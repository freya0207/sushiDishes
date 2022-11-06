import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow : 1,
  },
  menuButton: {
    marginRight: 'auto'
  }
}

function AppShell(props) {

  const [toggle, setToggle] = useState(false)
  const { classes } = props;

  function handleDrawerToggle() {
    setToggle(!toggle)
  }
  
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <IconButton className={classes.menuButton} color="inherit" onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </AppBar>
      <Drawer open={toggle}>
        <MenuItem onClick={handleDrawerToggle}>Home</MenuItem>
      </Drawer>

    </div>
  )
}

export default withStyles(styles)(AppShell);


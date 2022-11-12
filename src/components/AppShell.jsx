import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
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
    <>
      <div className={classes.root}>
        <AppBar position='static'>
          <IconButton className={classes.menuButton} color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </AppBar>
        <Drawer open={toggle}>
          <MenuItem onClick={handleDrawerToggle}>
            <Link component={RouterLink} to='/'>메인화면</Link>
          </MenuItem>
          <MenuItem onClick={handleDrawerToggle}>
            <Link component={RouterLink} to='/texts'>텍스트 관리</Link>
          </MenuItem>
          <MenuItem onClick={handleDrawerToggle}>
            <Link component={RouterLink} to='/words'>단어 관리</Link>
          </MenuItem>
        </Drawer>
      </div>
      <div id="content" style={{margin: 'auto', marginTop : '20px'}}>
        {React.cloneElement(props.children)}
      </div>
    </>

  )
}

export default withStyles(styles)(AppShell);


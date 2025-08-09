import PageLayout from 'examples/LayoutContainers/PageLayout';
import React, { useState } from 'react';

// react-router-dom components
// import FormBuilder from './components/FormBuilder';

import { Paper, ThemeProvider,Container, Icon, Box, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemText } from '@mui/material';
import theme from 'assets/theme';
import "./demo.css";
import Test1 from './layout/builder';
import TestingTabs from './Tabs';
import RCTabs from './RCTabs';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import DefaultNavbarLink from 'examples/Navbars/DefaultNavbar/DefaultNavbarLink';
import SoftButton from 'components/SoftButton';

import MenuIcon from '@mui/icons-material/Menu'; // Hamburger Menu
import HomeIcon from '@mui/icons-material/Home'; // Home Icon
import InfoIcon from '@mui/icons-material/Info'; // About Icon
import ContactMailIcon from '@mui/icons-material/ContactMail'; // Contact Icon
import SettingsIcon from '@mui/icons-material/Settings'; // Settings Icon


// @mui material components


// Authentication layout components


function OptiView() {
  const {state} = useLocation();
  const { layoutId } = state;
  console.log("layoutId", layoutId);


  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        
      {/* <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box>
            <SoftTypography
              variant="h6"
              fontWeight="bold"
              color="black"
              sx={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '1px' }}
            >
              Soft UI Dashboard
            </SoftTypography>
          </Box>

          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={navLinkStyles}>
              <HomeIcon sx={{ marginRight: 1 }} />
              Home
            </Link>
            <Link to="/about" style={navLinkStyles}>
              <InfoIcon sx={{ marginRight: 1 }} />
              About
            </Link>
            <Link to="/services" style={navLinkStyles}>
              <SettingsIcon sx={{ marginRight: 1 }} />
              Services
            </Link>
            <Link to="/contact" style={navLinkStyles}>
              <ContactMailIcon sx={{ marginRight: 1 }} />
              Contact
            </Link>

            <IconButton
              onClick={handleMenuClick}
              color="primary"
              sx={{ padding: '8px', marginLeft: 2 }}
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Log out</MenuItem>
            </Menu>

            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ display: { xs: 'block', sm: 'none' }, padding: '8px' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>

        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={toggleDrawer}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: '250px',
              paddingTop: '20px',
              paddingBottom: '20px',
            },
          }}
        >
          <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer}>
              <HomeIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/about" onClick={toggleDrawer}>
              <InfoIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={Link} to="/services" onClick={toggleDrawer}>
              <SettingsIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem button component={Link} to="/contact" onClick={toggleDrawer}>
              <ContactMailIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Drawer>
      </Container> */}
    {/* <Container maxWidth="lg">
      <TestingTabs layoutId={layoutId}/>
    </Container> */}



        {/* <Paper fullWidth sx={{border:"0px solid red",p:4}}> */}
          {/* <SoftUIControllerProvider> */}
              {/* <Builder1 /> */}
              {/* <Test/> */}
              {/* <GridstackDemo/> */}
          {/* <FormBuilder toolboxItems={toolboxItems} getDefaultProperties={getDefaultProperties} accordion={1} allowOverlap={true}/> */}
          {/* </SoftUIControllerProvider> */}
        {/* </Paper> */}
        {/* <Test1/> */}
        <TestingTabs layoutId={layoutId}/>
        {/* <RCTabs/> */}
      </PageLayout>
    </ThemeProvider>
  )
}

const navLinkStyles = {
  textDecoration: 'none',
  fontWeight: 'bold',
  color: '#333',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.3s ease-in-out',
  padding: '8px',
  '&:hover': {
    color: '#1976d2',
  },
};

export default OptiView;
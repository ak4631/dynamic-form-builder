import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import 'gridstack/dist/gridstack.css'
import Sidebar from './components/Sidebar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import { handleNestedGridDrop,handleRegularElementDrop } from './utils';
import HorizontalTab from './layout/HorizontalTab';
import VerticalTab from './layout/VerticalTab';
import { API_BASE_URL } from '../../../config';
import axios from 'axios';
import Test1 from './layout/builder';
import { Paper, ThemeProvider,Container, Icon, Box, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemText,Divider,ListItemIcon,Collapse,Typography } from '@mui/material';


import { Home, Settings, ExpandMore, ExpandLess, Person, ExitToApp,ChevronRight,Folder  } from '@mui/icons-material';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger Menu
import HomeIcon from '@mui/icons-material/Home'; // Home Icon
import InfoIcon from '@mui/icons-material/Info'; // About Icon
import ContactMailIcon from '@mui/icons-material/ContactMail'; // Contact Icon
import SettingsIcon from '@mui/icons-material/Settings'; // Settings Icon

// import { GridStack } from 'gridstack'
// let grid = GridStack;
const TestingTabs = (data) => {
    const token = localStorage.getItem('jwt');
    const [layoutName, setLayoutName] = useState('');
    // console.log("11.layoutId",data.layoutId)
    const [layoutType, setlayoutType] = useState({});
    useEffect(() => {
        console.log("11.layoutId",data.layoutId)
        if (data.layoutId) getLayoutData(data.layoutId);
    }, [data.layoutId]);

    const getLayoutData = async (id) => {
        try {
            console.log("12.layoutId",id)
          const { data } = await axios.get(`${API_BASE_URL}/getLayoutData`, {
            params: { id },
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(data.details.mlName);
          setLayoutName(data.details.mlName);
        //   setlayoutType(data.details.mlType);
        setlayoutType(1);

        } catch (error) {
          const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
          console.error(errMsg, error);
        }
      };

      const ShowLayout = () => {
          console.log("14.layoutType",layoutType)
        if (layoutType == '1') {
          return <Test1 layoutId={data.layoutId} />;
        } else if (layoutType == '2') {
          return <HorizontalTab />;
        } else if (layoutType == '3') {
          return <VerticalTab />;
        } else {
          return <div>Loading ...</div>;
        }
      };





      const [openDropdown, setOpenDropdown] = useState(null);

        const handleDropdownToggle = (index) => {
            setOpenDropdown(openDropdown === index ? null : index);
        };

        const sidebarItems = [
            { label: 'Home', icon: <Home />, link: '/' },
            { label: 'Projects', icon: <Folder />, link: '/projects', dropdown: [
                { label: 'Project 1', link: '/projects/1' },
                { label: 'Project 2', link: '/projects/2' },
            ]},
            { label: 'Settings', icon: <Settings />, link: '/settings' },
        ];





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



        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
            setOpenDropdown(!openDropdown);
        };

        const handleClose = () => {
            setAnchorEl(null);
            setOpenDropdown(false);
        };




    return (
        <Paper sx={{ p: 1 }}>
            <div maxWidth="lg">
                {/* Main Navbar */}
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
                    {/* Left Side: Logo / Title and Additional Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SoftTypography
                        variant="h6"
                        fontWeight="bold"
                        color="black"
                        sx={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '1px' }}
                        >
                        {layoutName} / {layoutType === 1 ? "Simple" : layoutType === 2 ? "Tab Based" : layoutType === 3 ? "Menu Based" : ""} Layout
                        </SoftTypography>
                    </Box>

                    {/* Right Side: Navigation Links and More Options */}
                    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <Link to="javascript:void(0)" style={navLinkStyles}>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Properties Editor
                        </Link>
                        <Link to="javascript:void(0)" style={navLinkStyles}>
                            <SaveIcon sx={{ marginRight: 1 }} />
                            Save
                        </Link>
                        <Link to="javascript:void(0)" style={navLinkStyles}>
                            <HourglassBottomIcon sx={{ marginRight: 1 }} />
                            Load
                        </Link>
                    </Box>
                </Box>
                {/* Drawer (Mobile Side Menu) */}
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
            </div>




            <SoftBox sx={{ display: "flex", height:"85vh", gap: 2 }}>
                {/* Left Side: Sidebar and Items */}
                <SoftBox sx={{
                    p: 1,
                    my: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    flex: 0.7,
                    bgcolor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        sx={{ color: "#4d6b5c",fontSize:"1rem" }}

                    >
                        Items
                    </SoftTypography>
                    <div className="sidebar">
                        <Sidebar />
                    </div>
                </SoftBox>
                
                {/* Right Side: Tabs */}
                <SoftBox sx={{ flex: "3", height:"100%",overflowY:"scroll" }}>
                    <ShowLayout />
                </SoftBox>
            </SoftBox>
        </Paper>
    )
};


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

export default TestingTabs;
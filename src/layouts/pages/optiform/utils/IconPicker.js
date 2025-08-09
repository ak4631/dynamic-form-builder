import React, { useState } from 'react';
import { Box, TextField, Popover, Grid, IconButton } from '@mui/material';
import * as Icons from '@mui/icons-material';
import SoftBox from 'components/SoftBox';

// const iconList = Object.keys(Icons).filter(key => key !== 'default'); ---> all icons

const mainIconNames = [
    'Home',
    'Person',
    'Settings',
    'Email',
    'Phone',
    'Lock',
    'Search',
    'Add',
    'Edit',
    'Delete',
    'Check',
    'Close',
    'Menu',
    'ArrowBack',
    'ArrowForward',
    'Star',
    'Favorite',
    'ThumbUp',
    'ThumbDown',
    'Notifications',
    'Info',
    'Warning',
    'Error',
    'Help',
    'Calendar',
    'AttachFile',
    'Link',
    'Cloud',
    'Download',
    'Upload',
    // Add more main icons as needed
  ];
  
const iconList = mainIconNames.filter(name => Icons[name]);

function IconPicker({ value, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIconSelect = (iconName) => {
    onChange(iconName);
    handleClose();
  };

  const filteredIcons = iconList.filter(icon => 
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const open = Boolean(anchorEl);
  const id = open ? 'icon-popover' : undefined;

  const SelectedIcon = value ? Icons[value] : null;

  return (
    <SoftBox>
      <Box onClick={handleClick} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        {SelectedIcon ? <SelectedIcon /> : 'Select an icon'}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <SoftBox sx={{ p: 2, width: 300, maxHeight: 400, overflow: 'auto',backgroundColor:"floralwhite"}}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search icons"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={1}>
            {filteredIcons.map((iconName) => {
              const Icon = Icons[iconName];
              return (
                <Grid item key={iconName}>
                  <IconButton onClick={() => handleIconSelect(iconName)}>
                    <Icon />
                  </IconButton>
                </Grid>
              );
            })}
          </Grid>
        </SoftBox>
      </Popover>
    </SoftBox>
  );
}

export default IconPicker;
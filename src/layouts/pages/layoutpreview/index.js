import PageLayout from 'examples/LayoutContainers/PageLayout';
import React from 'react'

// react-router-dom components
// import FormBuilder from './components/FormBuilder';

import { Paper } from '@mui/material';
import App from './components/App';

// @mui material components


// Authentication layout components


function LayoutPreview() {
  return (
    <PageLayout sx={{ backgroundColor: "#b5959521" }}>
      <Paper fullWidth sx={{ border: "0px solid red", m: 2 }}>
        <App />
        {/* <FormBuilder toolboxItems={toolboxItems} getDefaultProperties={getDefaultProperties} accordion={1}/> */}
      </Paper>
    </PageLayout>
  )
}

export default LayoutPreview;
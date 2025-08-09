import PageLayout from 'examples/LayoutContainers/PageLayout';
import React from 'react'

// react-router-dom components
// import FormBuilder from './components/FormBuilder';

import { Paper, ThemeProvider } from '@mui/material';
import theme from 'assets/theme';
import "./demo.css";
import Test1 from './layout/builder';
import TestingTabs from './Tabs';
import RCTabs from './RCTabs';

// @mui material components


// Authentication layout components


function OptiView() {
  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        {/* <Paper fullWidth sx={{border:"0px solid red",p:4}}> */}
          {/* <SoftUIControllerProvider> */}
              {/* <Builder1 /> */}
              {/* <Test/> */}
              {/* <GridstackDemo/> */}
          {/* <FormBuilder toolboxItems={toolboxItems} getDefaultProperties={getDefaultProperties} accordion={1} allowOverlap={true}/> */}
          {/* </SoftUIControllerProvider> */}
        {/* </Paper> */}
        {/* <Test1/> */}
        <TestingTabs/>
        {/* <RCTabs/> */}
      </PageLayout>
    </ThemeProvider>
  )
}

export default OptiView;
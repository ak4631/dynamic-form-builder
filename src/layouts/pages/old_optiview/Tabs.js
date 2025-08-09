import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import React, { useEffect, useState } from 'react'
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import 'gridstack/dist/gridstack.css'
import Sidebar from './components/Sidebar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import { Paper } from '@mui/material';
import { handleNestedGridDrop,handleRegularElementDrop } from './utils';
import HorizontalTab from './layout/HorizontalTab';
import VerticalTab from './layout/VerticalTab';
import Test1 from './layout/builder';

// import { GridStack } from 'gridstack'
// let grid = GridStack;
const TestingTabs = () => {

    return (
        <Paper sx={{ p: 1 }}>
            <SoftBox sx={{ display: "flex", gap: 2 }}>
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
                <SoftBox sx={{ flex: "8", height:"96vh",overflowY:"scroll" }}>
                    <HorizontalTab/>
                    {/* <VerticalTab/> */}
                    {/* <Test1/> */}
                    {/* <Tabs onSelect={(index) => setTabIndex(index)}>
                        <TabList>
                            <Tab>Title 1</Tab>
                            <Tab>Title 2</Tab>
                        </TabList>

                        <TabPanel>
                            <div className="grid-stack-container">
                                <h1>Hello</h1>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="grid-stack-container">
                                <h1>World</h1>
                            </div>
                        </TabPanel>
                    </Tabs>
                </SoftBox> */}
                </SoftBox>
            </SoftBox>
        </Paper>
    )
};

export default TestingTabs;